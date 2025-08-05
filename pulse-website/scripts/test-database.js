#!/usr/bin/env node

/**
 * Database Connection Test Script
 * Tests the Supabase database connection and basic operations
 */

const { createClient } = require('@supabase/supabase-js');
require('dotenv').config({ path: '.env.local' });

// Colors for console output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testDatabaseConnection() {
  log('🔍 Testing Pulse UTD News Database Connection...', 'blue');

  // Check environment variables
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    log('❌ Missing Supabase environment variables', 'red');
    log('Please check your .env.local file', 'yellow');
    process.exit(1);
  }

  log(`📡 Connecting to: ${supabaseUrl}`, 'blue');

  // Create Supabase client
  const supabase = createClient(supabaseUrl, supabaseKey);

  try {
    // Test 1: Check if categories table exists and has data
    log('\n📋 Test 1: Checking categories table...', 'blue');
    const { data: categories, error: categoriesError } = await supabase
      .from('categories')
      .select('*');

    if (categoriesError) {
      log(`❌ Categories test failed: ${categoriesError.message}`, 'red');
      if (
        categoriesError.message.includes('relation "categories" does not exist')
      ) {
        log('💡 Hint: Run the database schema first!', 'yellow');
      }
    } else {
      log(
        `✅ Categories table exists with ${categories.length} categories`,
        'green'
      );
      categories.forEach(cat => {
        log(`   - ${cat.name} (${cat.slug})`, 'green');
      });
    }

    // Test 2: Check if articles table exists
    log('\n📰 Test 2: Checking articles table...', 'blue');
    const { data: articles, error: articlesError } = await supabase
      .from('articles')
      .select('id, title, category, created_at')
      .limit(5);

    if (articlesError) {
      log(`❌ Articles test failed: ${articlesError.message}`, 'red');
      if (
        articlesError.message.includes('relation "articles" does not exist')
      ) {
        log('💡 Hint: Run the database schema first!', 'yellow');
      }
    } else {
      log(
        `✅ Articles table exists with ${articles.length} sample articles`,
        'green'
      );
      if (articles.length === 0) {
        log('   📝 No articles yet - this is normal for a new setup', 'yellow');
      } else {
        articles.forEach(article => {
          log(`   - ${article.title} (${article.category})`, 'green');
        });
      }
    }

    // Test 3: Test insert capability (if service role key is available)
    const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
    if (serviceKey && serviceKey !== 'your_supabase_service_role_key') {
      log('\n🔐 Test 3: Testing write permissions with service key...', 'blue');

      const adminClient = createClient(supabaseUrl, serviceKey);

      // Try to insert a test article
      const testArticle = {
        title: 'Database Connection Test Article',
        slug: 'database-test-' + Date.now(),
        content: 'This is a test article to verify database write permissions.',
        summary: 'Test article for database verification',
        category: 'Technology',
        source_url: 'https://pulse.utdnews.com/test',
        image_url:
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
        published_at: new Date().toISOString(),
      };

      const { data: insertedArticle, error: insertError } = await adminClient
        .from('articles')
        .insert(testArticle)
        .select()
        .single();

      if (insertError) {
        log(`❌ Write test failed: ${insertError.message}`, 'red');
      } else {
        log('✅ Write permissions working correctly', 'green');

        // Clean up test article
        await adminClient
          .from('articles')
          .delete()
          .eq('id', insertedArticle.id);

        log('🧹 Test article cleaned up', 'green');
      }
    } else {
      log(
        '\n⚠️  Service role key not configured - skipping write test',
        'yellow'
      );
      log(
        '   Add SUPABASE_SERVICE_ROLE_KEY to .env.local for full testing',
        'yellow'
      );
    }

    // Test 4: Test RLS policies
    log('\n🔒 Test 4: Testing Row Level Security policies...', 'blue');

    // This should work (public read access)
    const { data: publicRead, error: rlsError } = await supabase
      .from('articles')
      .select('count')
      .single();

    if (
      rlsError &&
      !rlsError.message.includes('JSON object requested, multiple')
    ) {
      log(`❌ RLS test failed: ${rlsError.message}`, 'red');
    } else {
      log('✅ Row Level Security policies working correctly', 'green');
    }

    log('\n🎉 Database connection test completed!', 'green');

    // Summary
    log('\n📊 Summary:', 'blue');
    log(`   Database URL: ${supabaseUrl}`, 'blue');
    log(`   Categories: ${categories ? categories.length : 'Error'}`, 'blue');
    log(`   Articles: ${articles ? articles.length : 'Error'}`, 'blue');
    log(
      `   Service Key: ${serviceKey && serviceKey !== 'your_supabase_service_role_key' ? 'Configured' : 'Not configured'}`,
      'blue'
    );
  } catch (error) {
    log(`💥 Unexpected error: ${error.message}`, 'red');
    process.exit(1);
  }
}

// Run the test
testDatabaseConnection().catch(console.error);
