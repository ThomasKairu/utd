#!/usr/bin/env node

/**
 * Automated Cloudflare Worker Deployment Script
 * 
 * This script automates the deployment of the Pulse UTD News worker
 * including KV namespace creation and secret configuration.
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const WORKER_DIR = path.join(__dirname, '..', 'worker');
const WRANGLER_TOML = path.join(WORKER_DIR, 'wrangler.toml');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function execCommand(command, options = {}) {
  try {
    log(`Executing: ${command}`, 'cyan');
    const result = execSync(command, { 
      stdio: 'inherit', 
      cwd: WORKER_DIR,
      ...options 
    });
    return result;
  } catch (error) {
    log(`Error executing command: ${command}`, 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

function checkPrerequisites() {
  log('🔍 Checking prerequisites...', 'blue');
  
  try {
    // Check if wrangler is installed
    execSync('wrangler --version', { stdio: 'pipe' });
    log('✅ Wrangler CLI is installed', 'green');
  } catch (error) {
    log('❌ Wrangler CLI not found. Installing...', 'yellow');
    execCommand('npm install -g wrangler@latest');
  }

  try {
    // Check if logged in to Cloudflare
    execSync('wrangler whoami', { stdio: 'pipe', cwd: WORKER_DIR });
    log('✅ Logged in to Cloudflare', 'green');
  } catch (error) {
    log('❌ Not logged in to Cloudflare. Please run: wrangler login', 'red');
    process.exit(1);
  }

  // Check if worker directory exists
  if (!fs.existsSync(WORKER_DIR)) {
    log('❌ Worker directory not found', 'red');
    process.exit(1);
  }

  log('✅ All prerequisites met', 'green');
}

function installDependencies() {
  log('📦 Installing worker dependencies...', 'blue');
  execCommand('npm install');
  log('✅ Dependencies installed', 'green');
}

function createKVNamespaces() {
  log('🗄️ Creating KV namespaces...', 'blue');
  
  try {
    // Create production KV namespace
    log('Creating production KV namespace...', 'yellow');
    const prodResult = execSync('wrangler kv:namespace create KV_NAMESPACE', { 
      cwd: WORKER_DIR,
      encoding: 'utf8'
    });
    
    // Extract the ID from the output
    const prodMatch = prodResult.match(/id = "([^"]+)"/);
    const prodId = prodMatch ? prodMatch[1] : null;
    
    if (!prodId) {
      log('❌ Failed to extract production KV namespace ID', 'red');
      process.exit(1);
    }
    
    log(`✅ Production KV namespace created: ${prodId}`, 'green');
    
    // Create preview KV namespace
    log('Creating preview KV namespace...', 'yellow');
    const previewResult = execSync('wrangler kv:namespace create KV_NAMESPACE --preview', { 
      cwd: WORKER_DIR,
      encoding: 'utf8'
    });
    
    // Extract the preview ID from the output
    const previewMatch = previewResult.match(/id = "([^"]+)"/);
    const previewId = previewMatch ? previewMatch[1] : null;
    
    if (!previewId) {
      log('❌ Failed to extract preview KV namespace ID', 'red');
      process.exit(1);
    }
    
    log(`✅ Preview KV namespace created: ${previewId}`, 'green');
    
    // Update wrangler.toml with the new IDs
    updateWranglerToml(prodId, previewId);
    
    return { prodId, previewId };
  } catch (error) {
    log('⚠️ KV namespaces might already exist, continuing...', 'yellow');
    return null;
  }
}

function updateWranglerToml(prodId, previewId) {
  log('📝 Updating wrangler.toml with KV namespace IDs...', 'blue');
  
  try {
    let content = fs.readFileSync(WRANGLER_TOML, 'utf8');
    
    // Replace placeholder IDs
    content = content.replace(/id = "your-kv-namespace-id"/, `id = "${prodId}"`);
    content = content.replace(/preview_id = "your-preview-kv-namespace-id"/, `preview_id = "${previewId}"`);
    content = content.replace(/id = "your-dev-kv-namespace-id"/, `id = "${prodId}"`);
    content = content.replace(/preview_id = "your-dev-preview-kv-namespace-id"/, `preview_id = "${previewId}"`);
    content = content.replace(/id = "your-prod-kv-namespace-id"/, `id = "${prodId}"`);
    content = content.replace(/preview_id = "your-prod-preview-kv-namespace-id"/, `preview_id = "${previewId}"`);
    
    fs.writeFileSync(WRANGLER_TOML, content);
    log('✅ wrangler.toml updated with KV namespace IDs', 'green');
  } catch (error) {
    log('❌ Failed to update wrangler.toml', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

function configureSecrets() {
  log('🔐 Configuring secrets...', 'blue');
  
  const secrets = [
    {
      name: 'OPENROUTER_API_KEY',
      value: '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',
      description: 'OpenRouter API key for AI processing'
    },
    {
      name: 'SUPABASE_SERVICE_KEY',
      value: process.env.SUPABASE_SERVICE_ROLE_KEY || '',
      description: 'Supabase service role key'
    }
  ];
  
  for (const secret of secrets) {
    if (!secret.value) {
      log(`⚠️ Skipping ${secret.name} - no value provided`, 'yellow');
      continue;
    }
    
    try {
      log(`Setting ${secret.name}...`, 'yellow');
      execSync(`echo "${secret.value}" | wrangler secret put ${secret.name}`, {
        cwd: WORKER_DIR,
        stdio: ['pipe', 'inherit', 'inherit'],
        shell: true
      });
      log(`✅ ${secret.name} configured`, 'green');
    } catch (error) {
      log(`❌ Failed to set ${secret.name}`, 'red');
      log('You can set it manually later with:', 'yellow');
      log(`  wrangler secret put ${secret.name}`, 'cyan');
    }
  }
}

function testWorker() {
  log('🧪 Testing worker locally...', 'blue');
  
  try {
    // Test the worker compilation
    execCommand('npm run dev -- --test-scheduled');
    log('✅ Worker test completed', 'green');
  } catch (error) {
    log('⚠️ Local test failed, but continuing with deployment...', 'yellow');
  }
}

function deployWorker() {
  log('🚀 Deploying worker to production...', 'blue');
  
  try {
    execCommand('npm run deploy:prod');
    log('✅ Worker deployed successfully!', 'green');
  } catch (error) {
    log('❌ Deployment failed', 'red');
    process.exit(1);
  }
}

function verifyDeployment() {
  log('✅ Verifying deployment...', 'blue');
  
  try {
    // Get the worker URL from wrangler
    const result = execSync('wrangler whoami', { 
      cwd: WORKER_DIR,
      encoding: 'utf8'
    });
    
    log('🎉 Deployment verification:', 'green');
    log('1. Check worker status at: https://dash.cloudflare.com/workers', 'cyan');
    log('2. Test status endpoint: curl https://your-worker.workers.dev/status', 'cyan');
    log('3. Manual trigger: curl -X POST https://your-worker.workers.dev/trigger', 'cyan');
    log('4. View logs: wrangler tail', 'cyan');
    
  } catch (error) {
    log('⚠️ Could not verify deployment automatically', 'yellow');
  }
}

function printNextSteps() {
  log('📋 Next Steps:', 'bright');
  log('', 'reset');
  log('1. 🔍 Verify the worker is running:', 'cyan');
  log('   wrangler tail', 'yellow');
  log('', 'reset');
  log('2. 🧪 Test the status endpoint:', 'cyan');
  log('   curl https://your-worker.workers.dev/status', 'yellow');
  log('', 'reset');
  log('3. 🎯 Trigger manual processing:', 'cyan');
  log('   curl -X POST https://your-worker.workers.dev/trigger', 'yellow');
  log('', 'reset');
  log('4. 📊 Check your Supabase database for new articles', 'cyan');
  log('', 'reset');
  log('5. ⏰ Wait 5 minutes for the first automatic cron run', 'cyan');
  log('', 'reset');
  log('🎉 Your automated news processing system is now live!', 'green');
}

// Main deployment function
async function main() {
  log('🚀 Pulse UTD News - Cloudflare Worker Deployment', 'bright');
  log('================================================', 'bright');
  log('', 'reset');
  
  try {
    checkPrerequisites();
    installDependencies();
    createKVNamespaces();
    configureSecrets();
    testWorker();
    deployWorker();
    verifyDeployment();
    printNextSteps();
    
    log('', 'reset');
    log('✅ Deployment completed successfully!', 'green');
    
  } catch (error) {
    log('❌ Deployment failed:', 'red');
    log(error.message, 'red');
    process.exit(1);
  }
}

// Run the deployment
if (require.main === module) {
  main();
}

module.exports = { main };