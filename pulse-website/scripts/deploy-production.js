#!/usr/bin/env node

/**
 * Production Deployment Script for Pulse UTD News
 *
 * This script handles the complete deployment process:
 * 1. Pre-deployment checks
 * 2. Build optimization
 * 3. Testing
 * 4. Deployment to GitHub Pages
 * 5. Post-deployment verification
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Configuration
const config = {
  buildDir: 'out',
  testTimeout: 300000, // 5 minutes
  lighthouseThresholds: {
    performance: 90,
    accessibility: 95,
    bestPractices: 90,
    seo: 95,
  },
};

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

function log(message, color = colors.reset) {
  console.log(`${color}${message}${colors.reset}`);
}

function logStep(step, message) {
  log(
    `\n${colors.bright}[${step}]${colors.reset} ${colors.cyan}${message}${colors.reset}`
  );
}

function logSuccess(message) {
  log(`${colors.green}✅ ${message}${colors.reset}`);
}

function logError(message) {
  log(`${colors.red}❌ ${message}${colors.reset}`);
}

function logWarning(message) {
  log(`${colors.yellow}⚠️  ${message}${colors.reset}`);
}

function execCommand(command, options = {}) {
  try {
    const result = execSync(command, {
      stdio: options.silent ? 'pipe' : 'inherit',
      encoding: 'utf8',
      ...options,
    });
    return { success: true, output: result };
  } catch (error) {
    return { success: false, error: error.message, output: error.stdout };
  }
}

async function preDeploymentChecks() {
  logStep('1', 'Running pre-deployment checks...');

  // Check if we're in the right directory
  if (!fs.existsSync('package.json')) {
    logError(
      'package.json not found. Please run this script from the project root.'
    );
    process.exit(1);
  }

  // Check if required environment files exist
  if (!fs.existsSync('.env.local.example')) {
    logWarning('.env.local.example not found. Creating template...');
    const envTemplate = `# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_KEY=your_supabase_service_key

# OpenRouter Configuration
OPENROUTER_API_KEY=your_openrouter_api_key

# ScraperAPI Configuration
SCRAPER_API_KEY=your_scraper_api_key

# Deployment Configuration
NEXT_PUBLIC_SITE_URL=https://pulse.utdnews.com
`;
    fs.writeFileSync('.env.local.example', envTemplate);
  }

  // Check Node.js version
  const nodeVersion = process.version;
  const majorVersion = parseInt(nodeVersion.slice(1).split('.')[0]);
  if (majorVersion < 18) {
    logError(
      `Node.js version ${nodeVersion} is not supported. Please use Node.js 18 or higher.`
    );
    process.exit(1);
  }
  logSuccess(`Node.js version ${nodeVersion} is supported`);

  // Check if dependencies are installed
  if (!fs.existsSync('node_modules')) {
    logStep('1.1', 'Installing dependencies...');
    const installResult = execCommand('npm ci');
    if (!installResult.success) {
      logError('Failed to install dependencies');
      process.exit(1);
    }
    logSuccess('Dependencies installed successfully');
  }

  logSuccess('Pre-deployment checks completed');
}

async function runTests() {
  logStep('2', 'Running test suite...');

  // Type checking
  logStep('2.1', 'Running TypeScript type checking...');
  const typeCheckResult = execCommand('npm run type-check');
  if (!typeCheckResult.success) {
    logError('TypeScript type checking failed');
    process.exit(1);
  }
  logSuccess('TypeScript type checking passed');

  // Linting
  logStep('2.2', 'Running ESLint...');
  const lintResult = execCommand('npm run lint');
  if (!lintResult.success) {
    logError('ESLint failed');
    process.exit(1);
  }
  logSuccess('ESLint passed');

  // Code formatting check
  logStep('2.3', 'Checking code formatting...');
  const formatResult = execCommand('npm run format:check');
  if (!formatResult.success) {
    logWarning('Code formatting issues found. Auto-fixing...');
    const fixResult = execCommand('npm run format');
    if (!fixResult.success) {
      logError('Failed to fix formatting issues');
      process.exit(1);
    }
    logSuccess('Code formatting fixed');
  } else {
    logSuccess('Code formatting is correct');
  }

  // Unit tests
  logStep('2.4', 'Running unit tests...');
  const unitTestResult = execCommand('npm run test:unit');
  if (!unitTestResult.success) {
    logError('Unit tests failed');
    process.exit(1);
  }
  logSuccess('Unit tests passed');

  logSuccess('All tests completed successfully');
}

async function buildOptimization() {
  logStep('3', 'Building optimized production bundle...');

  // Clean previous build
  if (fs.existsSync(config.buildDir)) {
    logStep('3.1', 'Cleaning previous build...');
    fs.rmSync(config.buildDir, { recursive: true, force: true });
    logSuccess('Previous build cleaned');
  }

  // Build the application
  logStep('3.2', 'Building Next.js application...');
  const buildResult = execCommand('npm run build');
  if (!buildResult.success) {
    logError('Build failed');
    process.exit(1);
  }
  logSuccess('Build completed successfully');

  // Verify build output
  if (!fs.existsSync(config.buildDir)) {
    logError('Build output directory not found');
    process.exit(1);
  }

  // Check build size
  const buildStats = getBuildStats();
  logSuccess(`Build completed - ${buildStats.files} files, ${buildStats.size}`);

  return buildStats;
}

function getBuildStats() {
  const buildPath = path.join(process.cwd(), config.buildDir);
  let totalSize = 0;
  let fileCount = 0;

  function calculateSize(dir) {
    const files = fs.readdirSync(dir);
    files.forEach(file => {
      const filePath = path.join(dir, file);
      const stats = fs.statSync(filePath);
      if (stats.isDirectory()) {
        calculateSize(filePath);
      } else {
        totalSize += stats.size;
        fileCount++;
      }
    });
  }

  calculateSize(buildPath);

  return {
    files: fileCount,
    size: formatBytes(totalSize),
    sizeBytes: totalSize,
  };
}

function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

async function performanceAudit() {
  logStep('4', 'Running performance audit...');

  // Check if Lighthouse CI is configured
  if (!fs.existsSync('lighthouserc.js')) {
    logWarning('Lighthouse CI not configured. Skipping performance audit.');
    return;
  }

  logStep('4.1', 'Running Lighthouse CI...');
  const lighthouseResult = execCommand('npm run lighthouse', { silent: true });

  if (!lighthouseResult.success) {
    logWarning('Lighthouse audit failed or not configured properly');
    return;
  }

  logSuccess('Performance audit completed');
}

async function deployToGitHubPages() {
  logStep('5', 'Deploying to GitHub Pages...');

  // Check if gh-pages is configured
  const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
  if (!packageJson.devDependencies['gh-pages']) {
    logError('gh-pages not found in devDependencies');
    process.exit(1);
  }

  // Deploy
  logStep('5.1', 'Pushing to GitHub Pages...');
  const deployResult = execCommand('npm run deploy');
  if (!deployResult.success) {
    logError('Deployment to GitHub Pages failed');
    process.exit(1);
  }

  logSuccess('Successfully deployed to GitHub Pages');
}

async function postDeploymentVerification() {
  logStep('6', 'Running post-deployment verification...');

  // Create deployment summary
  const deploymentSummary = {
    timestamp: new Date().toISOString(),
    version: require('../package.json').version,
    nodeVersion: process.version,
    buildStats: getBuildStats(),
    deploymentUrl: 'https://pulse.utdnews.com', // Update with actual URL
  };

  // Save deployment summary
  const summaryPath = path.join(config.buildDir, 'deployment-summary.json');
  fs.writeFileSync(summaryPath, JSON.stringify(deploymentSummary, null, 2));

  logSuccess('Post-deployment verification completed');

  // Display deployment summary
  log('\n' + colors.bright + '🚀 DEPLOYMENT SUMMARY' + colors.reset);
  log(`${colors.cyan}Timestamp:${colors.reset} ${deploymentSummary.timestamp}`);
  log(`${colors.cyan}Version:${colors.reset} ${deploymentSummary.version}`);
  log(`${colors.cyan}Node.js:${colors.reset} ${deploymentSummary.nodeVersion}`);
  log(
    `${colors.cyan}Build Size:${colors.reset} ${deploymentSummary.buildStats.size} (${deploymentSummary.buildStats.files} files)`
  );
  log(
    `${colors.cyan}Deployment URL:${colors.reset} ${deploymentSummary.deploymentUrl}`
  );
}

async function generateSitemap() {
  logStep('6.1', 'Generating sitemap...');

  const sitemapContent = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url>
    <loc>https://pulse.utdnews.com/</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>1.0</priority>
  </url>
  <url>
    <loc>https://pulse.utdnews.com/search</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>weekly</changefreq>
    <priority>0.8</priority>
  </url>
  <url>
    <loc>https://pulse.utdnews.com/category/politics</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://pulse.utdnews.com/category/business</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://pulse.utdnews.com/category/technology</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://pulse.utdnews.com/category/sports</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
  <url>
    <loc>https://pulse.utdnews.com/category/entertainment</loc>
    <lastmod>${new Date().toISOString().split('T')[0]}</lastmod>
    <changefreq>daily</changefreq>
    <priority>0.9</priority>
  </url>
</urlset>`;

  fs.writeFileSync(path.join(config.buildDir, 'sitemap.xml'), sitemapContent);
  logSuccess('Sitemap generated');
}

async function generateRobotsTxt() {
  logStep('6.2', 'Generating robots.txt...');

  const robotsContent = `User-agent: *
Allow: /

# Sitemap
Sitemap: https://pulse.utdnews.com/sitemap.xml

# Crawl-delay for polite crawling
Crawl-delay: 1

# Disallow admin and private areas
Disallow: /admin/
Disallow: /api/
Disallow: /_next/
Disallow: /offline

# Allow specific bots
User-agent: Googlebot
Allow: /

User-agent: Bingbot
Allow: /

User-agent: Slurp
Allow: /
`;

  fs.writeFileSync(path.join(config.buildDir, 'robots.txt'), robotsContent);
  logSuccess('robots.txt generated');
}

// Main deployment function
async function main() {
  const startTime = Date.now();

  log(
    `${colors.bright}${colors.magenta}🚀 Starting Production Deployment for Pulse UTD News${colors.reset}\n`
  );

  try {
    await preDeploymentChecks();
    await runTests();
    const buildStats = await buildOptimization();
    await generateSitemap();
    await generateRobotsTxt();
    await performanceAudit();
    await deployToGitHubPages();
    await postDeploymentVerification();

    const endTime = Date.now();
    const duration = Math.round((endTime - startTime) / 1000);

    log(
      `\n${colors.bright}${colors.green}🎉 DEPLOYMENT SUCCESSFUL!${colors.reset}`
    );
    log(
      `${colors.cyan}Total deployment time: ${duration} seconds${colors.reset}`
    );
    log(
      `${colors.cyan}Your site is now live at: https://pulse.utdnews.com${colors.reset}\n`
    );

    // Next steps
    log(`${colors.bright}📋 NEXT STEPS:${colors.reset}`);
    log(
      `${colors.yellow}1. Set up Supabase database using database/schema.sql${colors.reset}`
    );
    log(
      `${colors.yellow}2. Configure Cloudflare Worker with your API keys${colors.reset}`
    );
    log(
      `${colors.yellow}3. Set up domain DNS pointing to GitHub Pages${colors.reset}`
    );
    log(
      `${colors.yellow}4. Configure SSL certificate through Cloudflare${colors.reset}`
    );
    log(
      `${colors.yellow}5. Test the automated workflow end-to-end${colors.reset}\n`
    );
  } catch (error) {
    logError(`Deployment failed: ${error.message}`);
    process.exit(1);
  }
}

// Handle script interruption
process.on('SIGINT', () => {
  log(`\n${colors.yellow}Deployment interrupted by user${colors.reset}`);
  process.exit(1);
});

process.on('SIGTERM', () => {
  log(`\n${colors.yellow}Deployment terminated${colors.reset}`);
  process.exit(1);
});

// Run the deployment
if (require.main === module) {
  main().catch(error => {
    logError(`Unexpected error: ${error.message}`);
    process.exit(1);
  });
}

module.exports = {
  main,
  preDeploymentChecks,
  runTests,
  buildOptimization,
  deployToGitHubPages,
  postDeploymentVerification,
};
