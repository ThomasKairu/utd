/**
 * Pulse UTD News - Enhanced Automated Content Processing Worker
 * 
 * This Cloudflare Worker automatically processes news articles from Kenyan sources:
 * 1. Fetches RSS feeds with bot-resistant strategies
 * 2. Uses alternative news APIs as fallback
 * 3. Scrapes full article content using hybrid approach
 * 4. Processes content with AI for categorization and rewriting
 * 5. Saves to Supabase database with comprehensive monitoring
 * 
 * Enhanced Features:
 * - Bot-resistant RSS fetching with multiple user agents
 * - Alternative news APIs (NewsAPI, Guardian, Reuters, BBC)
 * - Comprehensive error reporting and monitoring
 * - Performance metrics tracking
 * - Health status monitoring
 * - Resilient error handling with detailed categorization
 */

import { fetchAndFilterArticlesEnhanced, FetchResult } from './utils/enhanced-rss';
import { scrapeArticleContent } from './utils/scraper';
import { processWithAI } from './utils/ai';
import { saveToSupabase, articleExists, getProcessingStats } from './utils/database';
import {
  getLastProcessedTimestamp,
  updateLastProcessedTimestamp,
  logProcessingRun,
  storeError,
} from './utils/kv';
import { 
  generateHealthReport, 
  storeProcessingRun, 
  createMonitoringDashboard,
  ProcessingError 
} from './utils/monitoring';
import { fetchFromAlternativeAPIs, createDefaultAPIConfigs } from './utils/news-apis';

interface Env {
  KV_NAMESPACE: any; // KVNamespace type from @cloudflare/workers-types
  OPENROUTER_API_KEY: string;
  SCRAPER_API_KEY?: string; // Optional - only for fallback
  NEWS_API_KEY?: string; // Optional - for alternative news sources
  GUARDIAN_API_KEY?: string; // Optional - for Guardian API
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
   * Enhanced scheduled event handler - runs every 5 minutes
   */
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    console.log(`🚀 Starting enhanced automated news processing workflow - Run ID: ${runId}`);
    console.log(`⏰ Scheduled time: ${new Date(controller.scheduledTime).toISOString()}`);

    let articlesProcessed = 0;
    let successCount = 0;
    let errorCount = 0;
    const processingErrors: ProcessingError[] = [];
    let rssSuccessRate = 0;

    try {
      // Phase 1: Get last processed timestamp from KV
      const lastProcessedTimestamp = await getLastProcessedTimestamp(env.KV_NAMESPACE);

      // Phase 2: Enhanced RSS fetching with bot-resistant strategies
      console.log(`📡 Starting enhanced RSS fetching with bot-resistant strategies...`);
      const fetchResult: FetchResult = await fetchAndFilterArticlesEnhanced(
        lastProcessedTimestamp,
        env.KV_NAMESPACE,
        env.NEWS_API_KEY // Optional alternative API key
      );

      rssSuccessRate = fetchResult.stats.successfulFeeds / fetchResult.stats.totalFeeds;
      
      console.log(`📊 Enhanced RSS fetch results:`);
      console.log(`   - Successful feeds: ${fetchResult.stats.successfulFeeds}/${fetchResult.stats.totalFeeds}`);
      console.log(`   - RSS success rate: ${(rssSuccessRate * 100).toFixed(1)}%`);
      console.log(`   - Total articles found: ${fetchResult.articles.length}`);
      console.log(`   - Alternative sources used: ${fetchResult.stats.alternativeSourcesUsed}`);
      console.log(`   - Fetch errors: ${fetchResult.errors.length}`);

      if (fetchResult.articles.length === 0) {
        console.log('⚠️ No new articles found from any source');
        
        // Store run data even if no articles
        await storeProcessingRun(env.KV_NAMESPACE, {
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime,
          articlesProcessed: 0,
          successCount: 0,
          errorCount: fetchResult.errors.length,
          rssSuccessRate,
          errors: fetchResult.errors.map(e => ({
            type: 'RSS_FETCH' as const,
            message: e.error,
            url: e.feedUrl,
            timestamp: e.timestamp,
            retryCount: e.retryAttempt,
            resolved: false,
          })),
        });
        
        return;
      }

      console.log(`📰 Processing ${fetchResult.articles.length} new articles...`);

      // Phase 3: Process each article with enhanced error tracking
      let latestTimestamp = lastProcessedTimestamp;

      for (const article of fetchResult.articles) {
        articlesProcessed++;
        
        try {
          console.log(`🔄 Processing [${articlesProcessed}/${fetchResult.articles.length}]: ${article.title}`);

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

          // Categorize error type
          let errorType: ProcessingError['type'] = 'VALIDATION';
          if (errorMessage.includes('scrape') || errorMessage.includes('content')) {
            errorType = 'SCRAPING';
          } else if (errorMessage.includes('AI') || errorMessage.includes('process')) {
            errorType = 'AI_PROCESSING';
          } else if (errorMessage.includes('database') || errorMessage.includes('save')) {
            errorType = 'DATABASE';
          }

          processingErrors.push({
            type: errorType,
            message: errorMessage,
            url: article.link,
            timestamp: new Date().toISOString(),
            retryCount: 0,
            resolved: false,
          });

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

      // Phase 5: Store comprehensive processing run data
      const duration = Date.now() - startTime;
      
      // Combine RSS errors and processing errors
      const allErrors = [
        ...fetchResult.errors.map(e => ({
          type: 'RSS_FETCH' as const,
          message: e.error,
          url: e.feedUrl,
          timestamp: e.timestamp,
          retryCount: e.retryAttempt,
          resolved: false,
        })),
        ...processingErrors,
      ];

      await storeProcessingRun(env.KV_NAMESPACE, {
        timestamp: new Date().toISOString(),
        duration,
        articlesProcessed,
        successCount,
        errorCount: errorCount + fetchResult.errors.length,
        rssSuccessRate,
        errors: allErrors,
      });

      // Get updated database stats
      const dbStats = await getProcessingStats(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

      console.log(`🎉 Enhanced processing completed!`);
      console.log(`📊 Final Statistics:`);
      console.log(`   - Articles processed: ${articlesProcessed}`);
      console.log(`   - Successful: ${successCount}`);
      console.log(`   - Processing errors: ${errorCount}`);
      console.log(`   - RSS errors: ${fetchResult.errors.length}`);
      console.log(`   - Total errors: ${errorCount + fetchResult.errors.length}`);
      console.log(`   - Duration: ${(duration / 1000).toFixed(2)}s`);
      console.log(`   - Success rate: ${articlesProcessed > 0 ? ((successCount / articlesProcessed) * 100).toFixed(1) : 0}%`);
      console.log(`   - RSS success rate: ${(rssSuccessRate * 100).toFixed(1)}%`);
      console.log(`📈 Database Statistics:`);
      console.log(`   - Total articles: ${dbStats.totalArticles}`);
      console.log(`   - Today's articles: ${dbStats.todayArticles}`);
      console.log(`   - Last processed: ${dbStats.lastProcessed}`);

    } catch (error) {
      console.error('💥 Critical error in enhanced workflow:', error);
      
      // Store critical error
      await storeError(env.KV_NAMESPACE, error as Error, 'Critical workflow error');
      
      // Store failed run with comprehensive error data
      await storeProcessingRun(env.KV_NAMESPACE, {
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        articlesProcessed,
        successCount,
        errorCount: errorCount + 1,
        rssSuccessRate,
        errors: [
          ...processingErrors,
          {
            type: 'VALIDATION',
            message: `Critical error: ${(error as Error).message}`,
            timestamp: new Date().toISOString(),
            retryCount: 0,
            resolved: false,
          },
        ],
      });

      throw error;
    }
  },

  /**
   * Enhanced HTTP request handler with monitoring endpoints
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

    // Enhanced status endpoint with health monitoring
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

    // Health monitoring endpoint
    if (url.pathname === '/health') {
      try {
        const healthReport = await generateHealthReport(
          env.KV_NAMESPACE,
          env.SUPABASE_URL,
          env.SUPABASE_SERVICE_KEY
        );
        
        return new Response(JSON.stringify(healthReport), {
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

    // Monitoring dashboard endpoint
    if (url.pathname === '/dashboard') {
      try {
        const dashboard = await createMonitoringDashboard(
          env.KV_NAMESPACE,
          env.SUPABASE_URL,
          env.SUPABASE_SERVICE_KEY
        );
        
        return new Response(JSON.stringify(dashboard), {
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
          message: 'Enhanced processing triggered manually',
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

    // Test RSS feeds endpoint
    if (url.pathname === '/test-rss') {
      try {
        const lastTimestamp = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
        const fetchResult = await fetchAndFilterArticlesEnhanced(
          lastTimestamp,
          env.KV_NAMESPACE,
          env.NEWS_API_KEY
        );
        
        return new Response(JSON.stringify({
          success: fetchResult.success,
          stats: fetchResult.stats,
          articlesFound: fetchResult.articles.length,
          errors: fetchResult.errors.slice(0, 10), // Limit errors for response size
          sampleArticles: fetchResult.articles.slice(0, 5).map(a => ({
            title: a.title,
            source: a.source,
            pubDate: a.pubDate,
          })),
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: 'RSS test failed',
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

    // Default response with enhanced endpoints
    return new Response(JSON.stringify({
      service: 'Pulse UTD News Enhanced Worker',
      version: '2.0.0',
      features: [
        'Bot-resistant RSS fetching',
        'Alternative news APIs',
        'Comprehensive monitoring',
        'Error analysis',
        'Performance metrics',
      ],
      endpoints: {
        status: '/status - Basic status check',
        health: '/health - Comprehensive health report',
        dashboard: '/dashboard - Monitoring dashboard data',
        trigger: '/trigger (POST) - Manual processing trigger',
        testRss: '/test-rss - Test RSS feed fetching',
      },
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};