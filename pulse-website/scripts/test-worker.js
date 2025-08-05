#!/usr/bin/env node

/**
 * Worker Testing Script
 * 
 * Tests the Cloudflare Worker functionality locally before deployment
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const WORKER_DIR = path.join(__dirname, '..', 'worker');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function testFileExists(filePath, description) {
  if (fs.existsSync(filePath)) {
    log(`✅ ${description} exists`, 'green');
    return true;
  } else {
    log(`❌ ${description} not found: ${filePath}`, 'red');
    return false;
  }
}

function testWorkerStructure() {
  log('📁 Testing worker file structure...', 'blue');
  
  const requiredFiles = [
    { path: path.join(WORKER_DIR, 'src', 'index.ts'), desc: 'Main worker file' },
    { path: path.join(WORKER_DIR, 'src', 'utils', 'rss.ts'), desc: 'RSS parser' },
    { path: path.join(WORKER_DIR, 'src', 'utils', 'ai.ts'), desc: 'AI processor' },
    { path: path.join(WORKER_DIR, 'src', 'utils', 'database.ts'), desc: 'Database utility' },
    { path: path.join(WORKER_DIR, 'src', 'utils', 'kv.ts'), desc: 'KV utility' },
    { path: path.join(WORKER_DIR, 'src', 'utils', 'scraper.ts'), desc: 'Scraper utility' },
    { path: path.join(WORKER_DIR, 'src', 'config', 'sites.ts'), desc: 'Site configuration' },
    { path: path.join(WORKER_DIR, 'wrangler.toml'), desc: 'Wrangler config' },
    { path: path.join(WORKER_DIR, 'package.json'), desc: 'Package config' },
  ];
  
  let allExist = true;
  for (const file of requiredFiles) {
    if (!testFileExists(file.path, file.desc)) {
      allExist = false;
    }
  }
  
  return allExist;
}

function testWranglerConfig() {
  log('⚙️ Testing Wrangler configuration...', 'blue');
  
  try {
    const configPath = path.join(WORKER_DIR, 'wrangler.toml');
    const config = fs.readFileSync(configPath, 'utf8');
    
    // Check for required sections
    const requiredSections = [
      'name = "pulse-news-worker"',
      'main = "src/index.ts"',
      '[triggers]',
      'crons = ["*/5 * * * *"]',
      '[[kv_namespaces]]',
      'binding = "KV_NAMESPACE"'
    ];
    
    let allPresent = true;
    for (const section of requiredSections) {
      if (!config.includes(section)) {
        log(`❌ Missing config section: ${section}`, 'red');
        allPresent = false;
      }
    }
    
    if (allPresent) {
      log('✅ Wrangler configuration is valid', 'green');
      return true;
    } else {
      log('❌ Wrangler configuration has issues', 'red');
      return false;
    }
  } catch (error) {
    log('❌ Failed to read Wrangler configuration', 'red');
    return false;
  }
}

function testPackageJson() {
  log('📦 Testing package.json...', 'blue');
  
  try {
    const packagePath = path.join(WORKER_DIR, 'package.json');
    const packageJson = JSON.parse(fs.readFileSync(packagePath, 'utf8'));
    
    const requiredScripts = ['dev', 'deploy', 'deploy:prod'];
    let allPresent = true;
    
    for (const script of requiredScripts) {
      if (!packageJson.scripts || !packageJson.scripts[script]) {
        log(`❌ Missing script: ${script}`, 'red');
        allPresent = false;
      }
    }
    
    if (allPresent) {
      log('✅ Package.json configuration is valid', 'green');
      return true;
    } else {
      log('❌ Package.json has missing scripts', 'red');
      return false;
    }
  } catch (error) {
    log('❌ Failed to read package.json', 'red');
    return false;
  }
}

function testEnvironmentVariables() {
  log('🔐 Testing environment configuration...', 'blue');
  
  // Check if we have the required environment variables in the main project
  const envPath = path.join(__dirname, '..', '.env.local');
  
  try {
    const envContent = fs.readFileSync(envPath, 'utf8');
    
    const requiredVars = [
      'NEXT_PUBLIC_SUPABASE_URL',
      'NEXT_PUBLIC_SUPABASE_ANON_KEY',
      'OPENROUTER_API_KEY'
    ];
    
    let allPresent = true;
    for (const varName of requiredVars) {
      if (!envContent.includes(varName)) {
        log(`❌ Missing environment variable: ${varName}`, 'red');
        allPresent = false;
      }
    }
    
    if (allPresent) {
      log('✅ Environment variables are configured', 'green');
      return true;
    } else {
      log('❌ Some environment variables are missing', 'red');
      return false;
    }
  } catch (error) {
    log('❌ Failed to read .env.local file', 'red');
    return false;
  }
}

function testTypeScriptCompilation() {
  log('🔨 Testing TypeScript compilation...', 'blue');
  
  try {
    execSync('npx tsc --noEmit', { 
      cwd: WORKER_DIR,
      stdio: 'pipe'
    });
    log('✅ TypeScript compilation successful', 'green');
    return true;
  } catch (error) {
    log('❌ TypeScript compilation failed', 'red');
    log('Run "npx tsc --noEmit" in the worker directory for details', 'yellow');
    return false;
  }
}

function runAllTests() {
  log('🧪 Running Worker Tests', 'bright');
  log('=====================', 'bright');
  log('', 'reset');
  
  const tests = [
    { name: 'Worker File Structure', fn: testWorkerStructure },
    { name: 'Wrangler Configuration', fn: testWranglerConfig },
    { name: 'Package.json', fn: testPackageJson },
    { name: 'Environment Variables', fn: testEnvironmentVariables },
    { name: 'TypeScript Compilation', fn: testTypeScriptCompilation },
  ];
  
  let passed = 0;
  let failed = 0;
  
  for (const test of tests) {
    log(`\n🔍 ${test.name}...`, 'yellow');
    if (test.fn()) {
      passed++;
    } else {
      failed++;
    }
  }
  
  log('\n📊 Test Results:', 'bright');
  log(`✅ Passed: ${passed}`, 'green');
  log(`❌ Failed: ${failed}`, failed > 0 ? 'red' : 'reset');
  
  if (failed === 0) {
    log('\n🎉 All tests passed! Worker is ready for deployment.', 'green');
    log('\nNext steps:', 'cyan');
    log('1. Run: npm run deploy:worker', 'yellow');
    log('2. Monitor deployment logs', 'yellow');
    log('3. Test the deployed worker endpoints', 'yellow');
    return true;
  } else {
    log('\n⚠️ Some tests failed. Please fix issues before deployment.', 'yellow');
    return false;
  }
}

// Main function
function main() {
  const success = runAllTests();
  process.exit(success ? 0 : 1);
}

// Run tests if called directly
if (require.main === module) {
  main();
}

module.exports = { runAllTests };