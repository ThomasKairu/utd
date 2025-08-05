/**
 * Pulse UTD News - Automated Content Processing Worker
 * 
 * This Cloudflare Worker automatically processes news articles from Kenyan sources:
 * 1. Fetches RSS feeds every 5 minutes
 * 2. Scrapes full article content using hybrid approach (direct + ScraperAPI fallback)
 * 3. Processes content with AI for categorization and rewriting
 * 4. Saves to Supabase database
 * 
 * Features:
 * - 12 custom site extractors for free scraping
 * - OpenRouter AI with multiple model fallbacks
 * - Resilient error handling
 * - State management with Cloudflare KV
 * - Comprehensive logging
 */

import { fetchAndFilterArticles } from './utils/rss';
import { scrapeArticleContent } from './utils/scraper';
import { processWithAI } from './utils/ai';
import { saveToSupabase, articleExists, getProcessingStats } from './utils/database';
import {
  getLastProcessedTimestamp,
  updateLastProcessedTimestamp,
  logProcessingRun,
  storeError,
} from './utils/kv';

interface Env {
  KV_NAMESPACE: any; // KVNamespace type from @cloudflare/workers-types
  OPENROUTER_API_KEY: string;
  SCRAPER_API_KEY?: string; // Optional - only for fallback
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}

// Cloudflare Worker types
interface ScheduledController {
  scheduledTime: number;
  cron: string;
}

interface ExecutionContext {
  waitUntil(promise: Promise<any>): void;
  passThroughOnException(): void;
}

export default {
  /**
   * Scheduled event handler - runs every 5 minutes
   */
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    console.log(`🚀 Starting automated news processing workflow - Run ID: ${runId}`);
    console.log(`⏰ Scheduled time: ${new Date(controller.scheduledTime).toISOString()}`);

    let articlesProcessed = 0;
    let successCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    try {
      // Phase 1: Get last processed timestamp from KV
      const lastProcessedTimestamp = await getLastProcessedTimestamp(env.KV_NAMESPACE);

      // Phase 2: Fetch and filter new articles from 12 RSS feeds
      const newArticles = await fetchAndFilterArticles(lastProcessedTimestamp);
      
      if (newArticles.length === 0) {
        console.log('✅ No new articles to process from 12 RSS feeds');
        await logProcessingRun(env.KV_NAMESPACE, runId, {
          articlesProcessed: 0,
          successCount: 0,
          errorCount: 0,
          duration: Date.now() - startTime,
          errors: [],
        });
        return;
      }

      console.log(`📰 Found ${newArticles.length} new articles to process from 12 RSS feeds`);

      // Phase 3: Process each article with resilient error handling
      let latestTimestamp = lastProcessedTimestamp;

      for (const article of newArticles) {
        articlesProcessed++;
        
        try {
          console.log(`🔄 Processing [${articlesProcessed}/${newArticles.length}]: ${article.title}`);

          // Check if article already exists (duplicate prevention)
          const exists = await articleExists(
            article.link,
            env.SUPABASE_URL,
            env.SUPABASE_SERVICE_KEY
          );

          if (exists) {
            console.log(`⚠️ Article already exists, skipping: ${article.title}`);
            continue;
          }

          // Step 1: Scrape full content using hybrid approach
          console.log(`📄 Scraping content from: ${article.link}`);
          const scrapedContent = await scrapeArticleContent(
            article.link,
            env.SCRAPER_API_KEY
          );

          if (!scrapedContent.content || scrapedContent.content.length < 200) {
            throw new Error('Scraped content too short or empty');
          }

          // Step 2: Process with AI for categorization and rewriting
          console.log(`🤖 Processing with AI...`);
          const processedArticle = await processWithAI(
            article,
            scrapedContent,
            env.OPENROUTER_API_KEY
          );

          // Step 3: Save to Supabase database
          console.log(`💾 Saving to database...`);
          await saveToSupabase(
            processedArticle,
            env.SUPABASE_URL,
            env.SUPABASE_SERVICE_KEY
          );

          successCount++;
          latestTimestamp = Math.max(
            latestTimestamp,
            new Date(article.pubDate).getTime()
          );

          console.log(`✅ Successfully processed: ${article.title}`);
          console.log(`📊 Progress: ${successCount}/${articlesProcessed} successful`);

        } catch (error) {
          errorCount++;
          const errorMessage = `Failed to process "${article.title}": ${(error as Error).message}`;
          console.error(`❌ ${errorMessage}`);
          errors.push(errorMessage);

          // Store detailed error for debugging
          await storeError(env.KV_NAMESPACE, error as Error, `Processing article: ${article.link}`);

          // Continue to next article (resilient processing)
          continue;
        }
      }

      // Phase 4: Update state and finalize
      if (successCount > 0) {
        await updateLastProcessedTimestamp(env.KV_NAMESPACE, latestTimestamp);
        console.log(`📅 Updated watermark to: ${new Date(latestTimestamp).toISOString()}`);
      }

      // Log processing run statistics
      const duration = Date.now() - startTime;
      await logProcessingRun(env.KV_NAMESPACE, runId, {
        articlesProcessed,
        successCount,
        errorCount,
        duration,
        errors,
      });

      // Get updated database stats
      const dbStats = await getProcessingStats(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

      console.log(`🎉 Processing completed successfully!`);
      console.log(`📊 Run Statistics:`);
      console.log(`   - Articles processed: ${articlesProcessed}`);
      console.log(`   - Successful: ${successCount}`);
      console.log(`   - Errors: ${errorCount}`);
      console.log(`   - Duration: ${(duration / 1000).toFixed(2)}s`);
      console.log(`   - Success rate: ${articlesProcessed > 0 ? ((successCount / articlesProcessed) * 100).toFixed(1) : 0}%`);
      console.log(`📈 Database Statistics:`);
      console.log(`   - Total articles: ${dbStats.totalArticles}`);
      console.log(`   - Today's articles: ${dbStats.todayArticles}`);
      console.log(`   - Last processed: ${dbStats.lastProcessed}`);

    } catch (error) {
      console.error('💥 Critical error in workflow:', error);
      
      // Store critical error
      await storeError(env.KV_NAMESPACE, error as Error, 'Critical workflow error');
      
      // Log failed run
      await logProcessingRun(env.KV_NAMESPACE, runId, {
        articlesProcessed,
        successCount,
        errorCount: errorCount + 1,
        duration: Date.now() - startTime,
        errors: [...errors, `Critical error: ${(error as Error).message}`],
      });

      throw error;
    }
  },

  /**
   * HTTP request handler for manual triggers and status checks
   */
  async fetch(request: Request, env: Env, ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    
    // Handle CORS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, POST, OPTIONS',
          'Access-Control-Allow-Headers': 'Content-Type',
        },
      });
    }

    // Status endpoint
    if (url.pathname === '/status') {
      try {
        const stats = await getProcessingStats(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);
        const lastTimestamp = await getLastProcessedTimestamp(env.KV_NAMESPACE);
        
        return new Response(JSON.stringify({
          status: 'healthy',
          timestamp: new Date().toISOString(),
          database: stats,
          lastProcessed: new Date(lastTimestamp).toISOString(),
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({
          status: 'error',
          error: (error as Error).message,
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // Manual trigger endpoint
    if (url.pathname === '/trigger' && request.method === 'POST') {
      try {
        // Trigger the scheduled handler manually
        ctx.waitUntil(
          this.scheduled(
            { scheduledTime: Date.now(), cron: 'manual' } as ScheduledController,
            env,
            ctx
          )
        );

        return new Response(JSON.stringify({
          message: 'Processing triggered manually',
          timestamp: new Date().toISOString(),
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: 'Failed to trigger processing',
          message: (error as Error).message,
        }), {
          status: 500,
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      }
    }

    // Default response
    return new Response(JSON.stringify({
      service: 'Pulse UTD News Worker',
      version: '1.0.0',
      endpoints: {
        status: '/status',
        trigger: '/trigger (POST)',
      },
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};