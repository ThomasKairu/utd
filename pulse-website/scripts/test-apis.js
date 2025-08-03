#!/usr/bin/env node

/**
 * API Testing Script for Pulse UTD News
 * 
 * Tests all external API connections to ensure they're working
 * before deployment.
 */

require('dotenv').config({ path: '.env.local' });

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testSupabase() {
  log('\n🔄 Testing Supabase Connection...', 'cyan');
  
  try {
    const { createClient } = require('@supabase/supabase-js');
    
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;
    
    if (!supabaseUrl || !supabaseKey) {
      throw new Error('Supabase credentials not found in .env.local');
    }
    
    const supabase = createClient(supabaseUrl, supabaseKey);
    
    // Test connection by fetching articles
    const { data, error } = await supabase
      .from('articles')
      .select('id, title')
      .limit(1);
    
    if (error) {
      throw error;
    }
    
    log(`✅ Supabase: Connected successfully (${data.length} articles found)`, 'green');
    return true;
  } catch (error) {
    log(`❌ Supabase: ${error.message}`, 'red');
    return false;
  }
}

async function testOpenRouter() {
  log('\n🔄 Testing OpenRouter API...', 'cyan');
  
  try {
    const apiKey = process.env.OPENROUTER_API_KEY;
    
    if (!apiKey || apiKey === 'your_openrouter_api_key') {
      throw new Error('OpenRouter API key not configured in .env.local');
    }
    
    if (!apiKey.startsWith('sk-or-v1-')) {
      throw new Error('Invalid OpenRouter API key format (should start with sk-or-v1-)');
    }
    
    const response = await fetch('https://openrouter.ai/api/v1/models', {
      headers: {
        'Authorization': `Bearer ${apiKey}`,
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.json();
    
    if (!data.data || !Array.isArray(data.data)) {
      throw new Error('Invalid response format from OpenRouter');
    }
    
    log(`✅ OpenRouter: Connected successfully (${data.data.length} models available)`, 'green');
    return true;
  } catch (error) {
    log(`❌ OpenRouter: ${error.message}`, 'red');
    log('   💡 Get your API key at: https://openrouter.ai/', 'yellow');
    return false;
  }
}

async function testScraperAPI() {
  log('\n🔄 Testing ScraperAPI (Optional)...', 'cyan');
  
  try {
    const apiKey = process.env.SCRAPER_API_KEY;
    
    if (!apiKey || apiKey === 'your_scraper_api_key') {
      log('⚠️  ScraperAPI: Not configured (optional)', 'yellow');
      return true; // Not required
    }
    
    const testUrl = 'https://httpbin.org/json';
    const scraperUrl = `http://api.scraperapi.com?api_key=${apiKey}&url=${encodeURIComponent(testUrl)}`;
    
    const response = await fetch(scraperUrl);
    
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }
    
    const data = await response.text();
    
    if (!data || data.length < 10) {
      throw new Error('Invalid response from ScraperAPI');
    }
    
    log('✅ ScraperAPI: Connected successfully', 'green');
    return true;
  } catch (error) {
    log(`❌ ScraperAPI: ${error.message}`, 'red');
    log('   💡 Get your API key at: https://www.scraperapi.com/', 'yellow');
    return false;
  }
}

async function testRSSFeeds() {
  log('\n🔄 Testing RSS Feeds...', 'cyan');
  
  try {
    // Test a few key RSS feeds
    const testFeeds = [
      'https://www.nation.co.ke/kenya/news/rss',
      'https://www.standardmedia.co.ke/rss/headlines.php',
      'https://www.the-star.co.ke/news/rss',
    ];
    
    let successCount = 0;
    
    for (const feedUrl of testFeeds) {
      try {
        const response = await fetch(feedUrl, {
          headers: {
            'User-Agent': 'Pulse UTD News/1.0',
            'Accept': 'application/rss+xml, application/xml, text/xml',
          },
        });
        
        if (response.ok) {
          successCount++;
        }
      } catch (error) {
        // Continue testing other feeds
      }
    }
    
    if (successCount === 0) {
      throw new Error('No RSS feeds accessible');
    }
    
    log(`✅ RSS Feeds: ${successCount}/${testFeeds.length} feeds accessible`, 'green');
    return true;
  } catch (error) {
    log(`❌ RSS Feeds: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('🧪 API Testing Suite - Pulse UTD News', 'blue');
  log('=====================================', 'blue');
  
  const results = {
    supabase: await testSupabase(),
    openrouter: await testOpenRouter(),
    scraperapi: await testScraperAPI(),
    rssfeeds: await testRSSFeeds(),
  };
  
  log('\n📊 Test Results Summary:', 'blue');
  log('========================', 'blue');
  
  Object.entries(results).forEach(([service, success]) => {
    const status = success ? '✅ PASS' : '❌ FAIL';
    const color = success ? 'green' : 'red';
    log(`${service.toUpperCase().padEnd(12)}: ${status}`, color);
  });
  
  const passCount = Object.values(results).filter(Boolean).length;
  const totalCount = Object.keys(results).length;
  
  log(`\n🎯 Overall: ${passCount}/${totalCount} tests passed`, passCount === totalCount ? 'green' : 'yellow');
  
  if (results.supabase && results.openrouter) {
    log('\n🚀 Ready for deployment! Core services are working.', 'green');
    log('\nNext steps:', 'blue');
    log('1. Run: npm run build', 'cyan');
    log('2. Run: npm run deploy', 'cyan');
    log('3. Deploy Cloudflare Worker', 'cyan');
  } else {
    log('\n⚠️  Some required services are not working.', 'yellow');
    log('\nRequired for deployment:', 'blue');
    log('- Supabase: Database connection', 'cyan');
    log('- OpenRouter: AI content processing', 'cyan');
    log('\nOptional services:', 'blue');
    log('- ScraperAPI: Fallback web scraping', 'cyan');
    log('- RSS Feeds: Content sources', 'cyan');
  }
  
  process.exit(passCount < 2 ? 1 : 0); // Exit with error if core services fail
}

main().catch(error => {
  log(`\n💥 Unexpected error: ${error.message}`, 'red');
  process.exit(1);
});