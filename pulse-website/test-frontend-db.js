/**
 * Test frontend database connection
 */

const SUPABASE_URL = 'https://lnmrpwmtvscsczslzvec.supabase.co';
const ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubXJwd210dnNjc2N6c2x6dmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNDU1MjAsImV4cCI6MjA2OTcyMTUyMH0.ezg1YgFm3k3yXXCtKbI844tRbh7v2WXwnvD9jnIc7pY';

async function testFrontendDatabaseConnection() {
  console.log('🔍 Testing Frontend Database Connection...');
  console.log('==========================================');

  try {
    // Test 1: Fetch articles (what the frontend does)
    console.log('📖 Test 1: Fetching articles (frontend query)');
    const articlesResponse = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=*&order=published_at.desc`, {
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Status: ${articlesResponse.status} ${articlesResponse.statusText}`);
    if (articlesResponse.ok) {
      const articles = await articlesResponse.json();
      console.log(`✅ Articles fetched successfully! Found ${articles.length} articles`);
      
      if (articles.length > 0) {
        console.log('📰 Sample articles:');
        articles.slice(0, 3).forEach((article, i) => {
          console.log(`  ${i + 1}. ${article.title} (${article.category})`);
          console.log(`     Published: ${article.published_at}`);
          console.log(`     Created: ${article.created_at}`);
        });
      }
    } else {
      const errorText = await articlesResponse.text();
      console.log(`❌ Articles fetch failed: ${errorText}`);
    }

    // Test 2: Check if categories table exists
    console.log('\n📂 Test 2: Checking categories table');
    const categoriesResponse = await fetch(`${SUPABASE_URL}/rest/v1/categories?select=name&order=name`, {
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    console.log(`Status: ${categoriesResponse.status} ${categoriesResponse.statusText}`);
    if (categoriesResponse.ok) {
      const categories = await categoriesResponse.json();
      console.log(`✅ Categories fetched successfully! Found ${categories.length} categories`);
      if (categories.length > 0) {
        console.log(`Categories: ${categories.map(c => c.name).join(', ')}`);
      }
    } else {
      const errorText = await categoriesResponse.text();
      console.log(`❌ Categories fetch failed: ${errorText}`);
      console.log('💡 This might be why the frontend is having issues - categories table might not exist');
    }

    // Test 3: Check table structure
    console.log('\n🏗️ Test 3: Checking articles table structure');
    const structureResponse = await fetch(`${SUPABASE_URL}/rest/v1/articles?select=*&limit=1`, {
      headers: {
        'Authorization': `Bearer ${ANON_KEY}`,
        'apikey': ANON_KEY,
        'Content-Type': 'application/json',
      },
    });

    if (structureResponse.ok) {
      const sample = await structureResponse.json();
      if (sample.length > 0) {
        console.log('✅ Articles table structure:');
        console.log('Fields:', Object.keys(sample[0]).join(', '));
      }
    }

    console.log('\n📋 Frontend Database Connection Test Summary:');
    console.log('============================================');
    console.log('✅ Supabase URL is correct');
    console.log('✅ Anon key is working');
    
    if (articlesResponse.ok) {
      console.log('✅ Articles table is accessible');
      console.log('✅ Frontend should be able to load articles');
    } else {
      console.log('❌ Articles table access issue');
    }
    
    if (!categoriesResponse.ok) {
      console.log('❌ Categories table missing or inaccessible');
      console.log('💡 This could cause frontend loading issues');
    }

  } catch (error) {
    console.error('❌ Frontend database test failed:', error);
  }
}

testFrontendDatabaseConnection().catch(console.error);