/**
 * Simple test script to verify enhanced RSS functionality
 */

// Mock the RSS_FEEDS import
const RSS_FEEDS = [
  'https://www.standardmedia.co.ke/rss/',
  'https://nation.africa/kenya/rss',
  'https://ntvkenya.co.ke/feed',
];

// Simple test function
async function testRSSFetching() {
  console.log('🧪 Testing enhanced RSS fetching...');
  
  const USER_AGENTS = [
    'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  ];

  const results = [];
  
  for (const feedUrl of RSS_FEEDS.slice(0, 2)) { // Test only 2 feeds
    try {
      console.log(`📡 Testing feed: ${feedUrl}`);
      
      const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
      
      const response = await fetch(feedUrl, {
        method: 'GET',
        headers: {
          'User-Agent': userAgent,
          'Accept': 'application/rss+xml, application/xml, text/xml',
          'Accept-Language': 'en-US,en;q=0.9',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlText = await response.text();
      
      // Check if we got HTML instead of XML
      if (xmlText.includes('<!DOCTYPE html') || xmlText.includes('<html')) {
        throw new Error('Received HTML instead of RSS XML - likely blocked');
      }

      // Simple article count
      const itemMatches = xmlText.match(/<item[^>]*>/gi);
      const articleCount = itemMatches ? itemMatches.length : 0;
      
      results.push({
        feedUrl,
        success: true,
        articleCount,
        responseSize: xmlText.length,
      });
      
      console.log(`✅ Success: ${articleCount} articles, ${xmlText.length} bytes`);
      
    } catch (error) {
      results.push({
        feedUrl,
        success: false,
        error: error.message,
      });
      
      console.log(`❌ Failed: ${error.message}`);
    }
    
    // Add delay between requests
    await new Promise(resolve => setTimeout(resolve, 2000));
  }
  
  console.log('\n📊 Test Results:');
  console.log(JSON.stringify(results, null, 2));
  
  const successCount = results.filter(r => r.success).length;
  const successRate = successCount / results.length;
  
  console.log(`\n🎯 Success Rate: ${successCount}/${results.length} (${(successRate * 100).toFixed(1)}%)`);
  
  if (successRate > 0.5) {
    console.log('✅ Enhanced RSS fetching appears to be working!');
  } else {
    console.log('⚠️ RSS feeds are still being blocked. Alternative APIs will be needed.');
  }
}

// Run the test
testRSSFetching().catch(console.error);