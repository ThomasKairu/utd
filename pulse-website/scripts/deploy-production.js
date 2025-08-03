#!/usr/bin/env node

/**
 * Production Deployment Script for Pulse UTD News
 * 
 * This script automates the deployment process:
 * 1. Validates environment setup
 * 2. Builds the application
 * 3. Deploys to GitHub Pages
 * 4. Provides next steps for Cloudflare Worker
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

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

function logStep(step, message) {
  log(`\n🔄 Step ${step}: ${message}`, 'cyan');
}

function logSuccess(message) {
  log(`✅ ${message}`, 'green');
}

function logWarning(message) {
  log(`⚠️  ${message}`, 'yellow');
}

function logError(message) {
  log(`❌ ${message}`, 'red');
}

function logInfo(message) {
  log(`ℹ��  ${message}`, 'blue');
}

async function main() {
  log('\n🚀 Pulse UTD News - Production Deployment Script', 'bright');
  log('================================================', 'bright');

  try {
    // Step 1: Validate environment
    logStep(1, 'Validating Environment');
    
    // Check if we're in the right directory
    if (!fs.existsSync('package.json')) {
      throw new Error('package.json not found. Please run this script from the project root.');
    }

    // Check if .env.local exists
    if (!fs.existsSync('.env.local')) {
      throw new Error('.env.local file not found. Please create it with your API keys.');
    }

    // Read environment variables
    const envContent = fs.readFileSync('.env.local', 'utf8');
    const hasSupabase = envContent.includes('NEXT_PUBLIC_SUPABASE_URL=https://');
    const hasOpenRouter = envContent.includes('OPENROUTER_API_KEY=') && !envContent.includes('your_openrouter_api_key');
    
    if (!hasSupabase) {
      throw new Error('Supabase configuration missing in .env.local');
    }

    logSuccess('Environment validation passed');
    
    if (!hasOpenRouter) {
      logWarning('OpenRouter API key not configured - worker automation will not work');
      logInfo('Add your OpenRouter API key to .env.local to enable automation');
    }

    // Step 2: Run tests
    logStep(2, 'Running Tests');
    
    try {
      execSync('npm run type-check', { stdio: 'inherit' });
      logSuccess('TypeScript compilation passed');
    } catch (error) {
      throw new Error('TypeScript compilation failed');
    }

    try {
      execSync('npm run lint', { stdio: 'inherit' });
      logSuccess('Linting passed');
    } catch (error) {
      logWarning('Linting issues found - continuing with deployment');
    }

    // Step 3: Build application
    logStep(3, 'Building Application');
    
    try {
      execSync('npm run build', { stdio: 'inherit' });
      logSuccess('Build completed successfully');
    } catch (error) {
      throw new Error('Build failed');
    }

    // Step 4: Deploy to GitHub Pages
    logStep(4, 'Deploying to GitHub Pages');
    
    try {
      execSync('npm run deploy', { stdio: 'inherit' });
      logSuccess('Deployed to GitHub Pages successfully');
    } catch (error) {
      throw new Error('GitHub Pages deployment failed');
    }

    // Step 5: Provide next steps
    logStep(5, 'Next Steps');
    
    log('\n🎉 Frontend deployment completed successfully!', 'green');
    log('\n📋 Next Steps to Complete Production Setup:', 'bright');
    log('\n1. 🔑 Configure API Keys (if not done):');
    log('   - Get OpenRouter API key: https://openrouter.ai/');
    log('   - Get ScraperAPI key: https://www.scraperapi.com/ (optional)');
    log('   - Update .env.local with real keys');
    
    log('\n2. 🚀 Deploy Cloudflare Worker:');
    log('   cd worker');
    log('   npm install -g wrangler');
    log('   wrangler login');
    log('   wrangler kv:namespace create "KV_NAMESPACE"');
    log('   wrangler secret put OPENROUTER_API_KEY');
    log('   wrangler secret put SUPABASE_SERVICE_KEY');
    log('   npm run deploy');
    
    log('\n3. 🌐 Configure Custom Domain:');
    log('   - Set up DNS: pulse.utdnews.com → GitHub Pages');
    log('   - Enable HTTPS in GitHub Pages settings');
    
    log('\n4. 📊 Monitor Deployment:');
    log('   - Check worker logs in Cloudflare dashboard');
    log('   - Verify articles are being processed every 5 minutes');
    log('   - Monitor site performance and errors');

    // Get deployment URL
    const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
    const repoName = 'utd'; // Based on GitHub repository
    
    log('\n🔗 Your site is now live at:', 'bright');
    log(`   https://thomaskairu.github.io/${repoName}/`, 'cyan');
    
    log('\n📖 For detailed setup instructions, see:');
    log('   PRODUCTION_SETUP_GUIDE.md', 'cyan');

  } catch (error) {
    logError(`Deployment failed: ${error.message}`);
    process.exit(1);
  }
}

// Run the deployment script
main().catch(error => {
  logError(`Unexpected error: ${error.message}`);
  process.exit(1);
});