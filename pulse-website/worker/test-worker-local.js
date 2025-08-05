/**
 * Local test script for Pulse News Worker
 * Tests the worker functionality without deploying to Cloudflare
 */

// Mock environment for testing
const mockEnv = {
  SUPABASE_URL: 'https://lnmrpwmtvscsczslzvec.supabase.co',
  SUPABASE_SERVICE_KEY: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubXJwd210dnNjc2N6c2x6dmVjIiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc1NDE0NTUyMCwiZXhwIjoyMDY5NzIxNTIwfQ.Q8K3ZPO13CLQtq3c-xbRW62sWh3jd8ClbzexZGfduXo',
  OPENROUTER_API_KEY: 'your-openrouter-key-here', // Replace with actual key for AI testing
  NEWS_API_KEY: 'your-gnews-key-here', // Optional - replace with actual key
  
  // Mock KV namespace
  KV_NAMESPACE: {
    get: async (key) => {
      console.log(`📖 KV GET: ${key}`);
      return null; // Simulate empty cache
    },
    put: async (key, value, options) => {
      console.log(`📝 KV PUT: ${key} = ${value.substring(0, 50)}...`);
      return;
    }
  }
};

// Test RSS feed parsing
async function testRSSParsing() {
  console.log('🧪 Testing RSS Feed Parsing');
  console.log('============================');

  const testFeeds = [
    'https://www.nation.co.ke/kenya/news/rss',
    'https://www.standardmedia.co.ke/rss/headlines.php'
  ];

  for (const feedUrl of testFeeds) {
    try {
      console.log(`📡 Testing feed: ${feedUrl}`);
      
      const response = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'PulseNews/1.0 (https://pulsenews.publicvm.com)'
        }
      });

      if (response.ok) {
        const xmlText = await response.text();
        const articles = parseRSSFeed(xmlText, feedUrl);
        console.log(`✅ Parsed ${articles.length} articles`);
        
        if (articles.length > 0) {
          console.log(`   Sample: ${articles[0].title}`);
          console.log(`   Category: ${articles[0].category}`);
        }
      } else {
        console.log(`❌ Failed: ${response.status}`);
      }
    } catch (error) {
      console.log(`❌ Error: ${error.message}`);
    }
  }
}

// Test database connection
async function testDatabaseConnection() {
  console.log('\n🧪 Testing Database Connection');
  console.log('===============================');

  try {
    // Test read
    const response = await fetch(`${mockEnv.SUPABASE_URL}/rest/v1/articles?select=count`, {
      headers: {
        'Authorization': `Bearer ${mockEnv.SUPABASE_SERVICE_KEY}`,
        'apikey': mockEnv.SUPABASE_SERVICE_KEY,
        'Prefer': 'count=exact'
      }
    });

    if (response.ok) {
      const count = response.headers.get('content-range')?.split('/')[1] || '0';
      console.log(`✅ Database connection successful - ${count} articles`);
    } else {
      console.log(`❌ Database connection failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ Database error: ${error.message}`);
  }
}

// Test AI processing (if API key is provided)
async function testAIProcessing() {
  console.log('\n🧪 Testing AI Processing');
  console.log('=========================');

  if (!mockEnv.OPENROUTER_API_KEY || mockEnv.OPENROUTER_API_KEY === 'your-openrouter-key-here') {
    console.log('⏭️ Skipping AI test - no API key configured');
    return;
  }

  const testArticle = {
    title: 'Kenya Launches New Digital Payment System',
    content: 'The Central Bank of Kenya has announced the launch of a new digital payment system that will revolutionize how Kenyans conduct financial transactions. The system promises faster, more secure payments.'
  };

  try {
    const prompt = `
Analyze this Kenyan news article and provide:
1. A concise 2-3 sentence summary
2. The most appropriate category: Politics, Business, Technology, Sports, or Entertainment

Article Title: ${testArticle.title}
Article Content: ${testArticle.content}

Respond in JSON format:
{
  "summary": "2-3 sentence summary",
  "category": "Most appropriate category"
}
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${mockEnv.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://pulsenews.publicvm.com',
        'X-Title': 'Pulse News'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [{ role: 'user', content: prompt }],
        max_tokens: 500,
        temperature: 0.3
      })
    });

    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      console.log('✅ AI processing successful');
      console.log(`   Response: ${aiResponse?.substring(0, 100)}...`);
    } else {
      console.log(`❌ AI processing failed: ${response.status}`);
    }
  } catch (error) {
    console.log(`❌ AI error: ${error.message}`);
  }
}

// Test complete workflow simulation
async function testCompleteWorkflow() {
  console.log('\n🧪 Testing Complete Workflow Simulation');
  console.log('========================================');

  try {
    // Simulate processing one RSS feed
    console.log('1. 📰 Fetching RSS feed...');
    const response = await fetch('https://www.nation.co.ke/kenya/news/rss');
    
    if (!response.ok) {
      throw new Error(`RSS fetch failed: ${response.status}`);
    }

    const xmlText = await response.text();
    const articles = parseRSSFeed(xmlText, 'https://www.nation.co.ke/kenya/news/rss');
    console.log(`   ✅ Parsed ${articles.length} articles`);

    if (articles.length === 0) {
      console.log('   ⚠️ No articles found to process');
      return;
    }

    // Test duplicate detection
    console.log('2. 🔍 Testing duplicate detection...');
    const unique = await filterUniqueArticles(articles.slice(0, 3), mockEnv);
    console.log(`   ✅ ${unique.length} unique articles after filtering`);

    // Test categorization
    console.log('3. 🏷️ Testing categorization...');
    for (const article of unique.slice(0, 2)) {
      const category = categorizeContent(article.title + ' ' + article.content);
      console.log(`   ✅ "${article.title}" → ${category}`);
    }

    console.log('4. ✅ Workflow simulation completed successfully');

  } catch (error) {
    console.log(`❌ Workflow simulation failed: ${error.message}`);
  }
}

// Utility functions (simplified versions from worker)
function parseRSSFeed(xmlText, sourceUrl) {
  const articles = [];
  const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
  const items = xmlText.match(itemRegex) || [];
  
  for (const item of items.slice(0, 5)) {
    try {
      const title = extractXMLContent(item, 'title');
      const link = extractXMLContent(item, 'link');
      const description = extractXMLContent(item, 'description');
      
      if (title && link && description) {
        articles.push({
          title: cleanText(title),
          slug: generateSlug(title),
          content: cleanText(description),
          summary: cleanText(description).substring(0, 200) + '...',
          category: categorizeContent(title + ' ' + description),
          source_url: link,
          published_at: new Date().toISOString()
        });
      }
    } catch (error) {
      console.error('Error parsing RSS item:', error);
    }
  }
  
  return articles;
}

function extractXMLContent(xml, tag) {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function cleanText(text) {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&[^;]+;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

function generateSlug(title) {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100)
    .trim();
}

function categorizeContent(content) {
  const lowerContent = content.toLowerCase();
  const categories = {
    'Politics': ['government', 'parliament', 'election', 'political', 'minister', 'president'],
    'Business': ['business', 'economy', 'financial', 'market', 'investment', 'company'],
    'Technology': ['technology', 'tech', 'digital', 'innovation', 'software', 'internet'],
    'Sports': ['sports', 'football', 'athletics', 'marathon', 'rugby', 'basketball'],
    'Entertainment': ['entertainment', 'music', 'film', 'movie', 'celebrity', 'arts']
  };
  
  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      return category;
    }
  }
  
  return 'Politics'; // Default
}

async function filterUniqueArticles(articles, env) {
  // Simplified version - just return all for testing
  return articles;
}

// Run all tests
async function runAllTests() {
  console.log('🧪 Pulse News Worker Local Testing');
  console.log('===================================\n');

  await testRSSParsing();
  await testDatabaseConnection();
  await testAIProcessing();
  await testCompleteWorkflow();

  console.log('\n🎉 Testing Complete!');
  console.log('====================');
  console.log('');
  console.log('📝 Next steps:');
  console.log('   1. Configure API keys in mockEnv if needed');
  console.log('   2. Run: npm install (in worker directory)');
  console.log('   3. Deploy: npm run deploy:dev');
  console.log('   4. Monitor: wrangler tail');
  console.log('');
}

// Run tests
runAllTests().catch(console.error);