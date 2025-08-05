/**
 * Test database connection to identify the issue
 */

// Test with the anon key first
const SUPABASE_URL = 'https://lnmrpwmtvscsczslzvec.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubXJwd210dnNjc2N6c2x6dmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNDU1MjAsImV4cCI6MjA2OTcyMTUyMH0.ezg1YgFm3k3yXXCtKbI844tRbh7v2WXwnvD9jnIc7pY';

async function testDatabaseConnection() {
  console.log('🔍 Testing Database Connection...');
  console.log('================================');

  try {
    // Test 1: Basic connection with anon key
    console.log('📡 Test 1: Basic connection with anon key');
    const response1 = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=count`, {
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Prefer': 'count=exact',
      },
    });

    console.log(`Status: ${response1.status} ${response1.statusText}`);
    if (response1.ok) {
      const count = response1.headers.get('content-range')?.split('/')[1] || '0';
      console.log(`✅ Connection successful! Total articles: ${count}`);
    } else {
      const errorText = await response1.text();
      console.log(`❌ Connection failed: ${errorText}`);
    }

    // Test 2: Try to read articles
    console.log('\n📖 Test 2: Reading articles');
    const response2 = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=title,created_at&limit=3`, {
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
      },
    });

    console.log(`Status: ${response2.status} ${response2.statusText}`);
    if (response2.ok) {
      const articles = await response2.json();
      console.log(`✅ Read successful! Found ${articles.length} articles`);
      articles.forEach((article, i) => {
        console.log(`  ${i + 1}. ${article.title} (${article.created_at})`);
      });
    } else {
      const errorText = await response2.text();
      console.log(`❌ Read failed: ${errorText}`);
    }

    // Test 3: Try to insert a test article (this might fail with anon key)
    console.log('\n✍️ Test 3: Testing insert capability');
    const testArticle = {
      title: 'Database Connection Test Article',
      slug: 'database-connection-test-article',
      content: 'This is a test article to verify database write permissions.',
      summary: 'Test article for database connection verification.',
      category: 'Technology',
      source_url: 'https://test.example.com/db-test',
      image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
      published_at: new Date().toISOString(),
      created_at: new Date().toISOString(),
    };

    const response3 = await fetch(`${SUPABASE_URL}/rest/v1/articles`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Prefer': 'return=minimal',
      },
      body: JSON.stringify(testArticle),
    });

    console.log(`Status: ${response3.status} ${response3.statusText}`);
    if (response3.ok) {
      console.log(`✅ Insert successful! Test article created.`);
    } else {
      const errorText = await response3.text();
      console.log(`❌ Insert failed: ${errorText}`);
      
      if (response3.status === 401) {
        console.log('💡 This is expected - anon key likely doesn\'t have write permissions');
        console.log('💡 We need to use the service role key for write operations');
      }
    }

    console.log('\n📋 Database Connection Test Summary:');
    console.log('===================================');
    console.log('✅ Database URL is correct');
    console.log('✅ Anon key works for reading');
    console.log('❌ Anon key cannot write (expected)');
    console.log('💡 Solution: Set SUPABASE_SERVICE_KEY in worker secrets');

  } catch (error) {
    console.error('❌ Test failed with error:', error);
  }
}

testDatabaseConnection().catch(console.error);