/**
 * Pulse UTD News - Ultra-Optimized Worker (Final Version)
 * 
 * Maximum efficiency within API constraints:
 * - RSS-first approach (5 reliable feeds, 60% success rate)
 * - Ultra-smart GNews fallback (max 15-20 requests/day)
 * - Advanced KV caching with multi-level deduplication
 * - Runs every 15 minutes (96 runs/day)
 * - Comprehensive monitoring and usage tracking
 * 
 * GNews Free Plan Constraints:
 * - 100 requests/day limit
 * - 1 request/second maximum
 * - 10 articles per request
 * - Our strategy: Use only 15-20 requests/day (safe zone)
 */

import { fetchAndFilterArticlesUltraOptimized, UltraOptimizedFetchResult } from './utils/ultra-optimized-rss';
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

interface Env {
  KV_NAMESPACE: any;
  OPENROUTER_API_KEY: string;
  SCRAPER_API_KEY?: string;
  NEWS_API_KEY?: string; // GNews API key
  GUARDIAN_API_KEY?: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}

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
   * Ultra-optimized scheduled event handler - runs every 15 minutes
   */
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    const runId = `run_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
    const startTime = Date.now();
    
    console.log(`🚀 Starting ultra-optimized news processing workflow - Run ID: ${runId}`);
    console.log(`⏰ Scheduled time: ${new Date(controller.scheduledTime).toISOString()}`);

    let articlesProcessed = 0;
    let successCount = 0;
    let errorCount = 0;
    const processingErrors: ProcessingError[] = [];

    try {
      // Phase 1: Get last processed timestamp from KV
      const lastProcessedTimestamp = await getLastProcessedTimestamp(env.KV_NAMESPACE);

      // Phase 2: Ultra-optimized RSS fetching with smart GNews fallback
      console.log(`📡 Starting ultra-optimized RSS fetching (RSS-first + smart GNews)...`);
      const fetchResult: UltraOptimizedFetchResult = await fetchAndFilterArticlesUltraOptimized(
        lastProcessedTimestamp,
        env.KV_NAMESPACE,
        env.NEWS_API_KEY // GNews API key for ultra-smart fallback
      );

      console.log(`📊 Ultra-optimized fetch results:`);
      console.log(`   - RSS success: ${fetchResult.stats.successfulFeeds}/${fetchResult.stats.totalFeeds} feeds (${(fetchResult.stats.rssSuccessRate * 100).toFixed(1)}%)`);
      console.log(`   - Total articles: ${fetchResult.articles.length}`);
      console.log(`   - GNews used: ${fetchResult.stats.gnewsUsed ? 'Yes' : 'No'}`);
      if (fetchResult.stats.gnewsUsed) {
        console.log(`   - GNews requests: ${fetchResult.gnewsStats.requestsUsed}/${fetchResult.gnewsStats.requestsUsed + fetchResult.gnewsStats.requestsRemaining}`);
        console.log(`   - GNews cache hits: ${fetchResult.gnewsStats.cacheHits}`);
        console.log(`   - GNews articles: ${fetchResult.gnewsStats.articlesFromAPI} API + ${fetchResult.gnewsStats.articlesFromCache} cache`);
      }
      console.log(`   - Duplicates filtered: ${fetchResult.stats.duplicatesFiltered}`);
      console.log(`   - Cache performance: ${fetchResult.cacheStats.cacheHits} hits, ${fetchResult.cacheStats.cacheMisses} misses`);
      console.log(`   - Processing time: ${fetchResult.stats.processingTime}ms`);

      if (fetchResult.articles.length === 0) {
        console.log('⚠️ No new articles found from any source');
        
        // Store run data even if no articles
        await storeProcessingRun(env.KV_NAMESPACE, {
          timestamp: new Date().toISOString(),
          duration: Date.now() - startTime,
          articlesProcessed: 0,
          successCount: 0,
          errorCount: fetchResult.errors.length,
          rssSuccessRate: fetchResult.stats.rssSuccessRate,
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

          // Check if article already exists (additional duplicate check)
          const exists = await articleExists(
            article.link,
            env.SUPABASE_URL,
            env.SUPABASE_SERVICE_KEY
          );

          if (exists) {
            console.log(`⚠️ Article already exists in database, skipping: ${article.title}`);
            continue;
          }

          // Step 1: Scrape full content
          console.log(`📄 Scraping content from: ${article.link}`);
          const scrapedContent = await scrapeArticleContent(
            article.link,
            env.SCRAPER_API_KEY
          );

          if (!scrapedContent.content || scrapedContent.content.length < 200) {
            throw new Error('Scraped content too short or empty');
          }

          // Step 2: Process with AI
          console.log(`🤖 Processing with AI...`);
          const processedArticle = await processWithAI(
            article,
            scrapedContent,
            env.OPENROUTER_API_KEY
          );

          // Step 3: Save to database
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
        rssSuccessRate: fetchResult.stats.rssSuccessRate,
        errors: allErrors,
      });

      // Get updated database stats
      const dbStats = await getProcessingStats(env.SUPABASE_URL, env.SUPABASE_SERVICE_KEY);

      console.log(`🎉 Ultra-optimized processing completed!`);
      console.log(`📊 Final Statistics:`);
      console.log(`   - Articles processed: ${articlesProcessed}`);
      console.log(`   - Successful: ${successCount}`);
      console.log(`   - Processing errors: ${errorCount}`);
      console.log(`   - RSS errors: ${fetchResult.errors.length}`);
      console.log(`   - Total errors: ${errorCount + fetchResult.errors.length}`);
      console.log(`   - Duration: ${(duration / 1000).toFixed(2)}s`);
      console.log(`   - Success rate: ${articlesProcessed > 0 ? ((successCount / articlesProcessed) * 100).toFixed(1) : 0}%`);
      console.log(`   - RSS success rate: ${(fetchResult.stats.rssSuccessRate * 100).toFixed(1)}%`);
      if (fetchResult.stats.gnewsUsed) {
        console.log(`   - GNews efficiency: ${fetchResult.gnewsStats.requestsUsed} requests, ${fetchResult.gnewsStats.cacheHits} cache hits`);
      }
      console.log(`📈 Database Statistics:`);
      console.log(`   - Total articles: ${dbStats.totalArticles}`);
      console.log(`   - Today's articles: ${dbStats.todayArticles}`);
      console.log(`   - Last processed: ${dbStats.lastProcessed}`);

    } catch (error) {
      console.error('💥 Critical error in ultra-optimized workflow:', error);
      
      // Store critical error
      await storeError(env.KV_NAMESPACE, error as Error, 'Critical workflow error');
      
      // Store failed run with comprehensive error data
      await storeProcessingRun(env.KV_NAMESPACE, {
        timestamp: new Date().toISOString(),
        duration: Date.now() - startTime,
        articlesProcessed,
        successCount,
        errorCount: errorCount + 1,
        rssSuccessRate: 0,
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
   * Enhanced HTTP request handler with ultra-optimization monitoring
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

    // Enhanced status endpoint
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

    // Ultra-optimized GNews usage stats endpoint
    if (url.pathname === '/gnews-stats') {
      try {
        if (!env.NEWS_API_KEY) {
          return new Response(JSON.stringify({
            error: 'GNews API key not configured',
            status: 'unavailable',
          }), {
            status: 400,
            headers: {
              'Content-Type': 'application/json',
              'Access-Control-Allow-Origin': '*',
            },
          });
        }

        const { createOptimizedGNewsClient } = await import('./utils/gnews-optimized');
        const gnewsClient = createOptimizedGNewsClient(env.NEWS_API_KEY, env.KV_NAMESPACE);
        const usageStats = await (gnewsClient as any).getUsageStats();
        
        return new Response(JSON.stringify({
          date: usageStats.date,
          requestsUsed: usageStats.requestsUsed,
          dailyLimit: 20, // Our conservative limit
          actualLimit: 100, // GNews free plan limit
          remaining: usageStats.remaining,
          status: usageStats.requestsUsed < 20 ? 'available' : 'limit_reached',
          efficiency: {
            cacheHits: usageStats.cacheHits,
            cacheMisses: usageStats.cacheMisses,
            cacheHitRate: usageStats.cacheHits + usageStats.cacheMisses > 0 ? 
              (usageStats.cacheHits / (usageStats.cacheHits + usageStats.cacheMisses) * 100).toFixed(1) + '%' : '0%',
          },
          optimization: {
            strategy: 'RSS-first with smart fallback',
            maxRequestsPerDay: 20,
            articlesPerRequest: 10,
            cachingEnabled: true,
          },
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: 'Failed to get GNews stats',
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

    // Test ultra-optimized RSS feeds endpoint
    if (url.pathname === '/test-rss') {
      try {
        const lastTimestamp = Date.now() - (24 * 60 * 60 * 1000); // 24 hours ago
        const fetchResult = await fetchAndFilterArticlesUltraOptimized(
          lastTimestamp,
          env.KV_NAMESPACE,
          env.NEWS_API_KEY
        );
        
        return new Response(JSON.stringify({
          success: fetchResult.success,
          stats: fetchResult.stats,
          cacheStats: fetchResult.cacheStats,
          gnewsStats: fetchResult.gnewsStats,
          articlesFound: fetchResult.articles.length,
          errors: fetchResult.errors.slice(0, 10),
          sampleArticles: fetchResult.articles.slice(0, 5).map(a => ({
            title: a.title,
            source: a.source,
            pubDate: a.pubDate,
          })),
          optimization: {
            rssFirst: true,
            gnewsSmartFallback: fetchResult.stats.gnewsUsed,
            cacheEfficiency: fetchResult.cacheStats.cacheHits + fetchResult.cacheStats.cacheMisses > 0 ? 
              (fetchResult.cacheStats.cacheHits / (fetchResult.cacheStats.cacheHits + fetchResult.cacheStats.cacheMisses) * 100).toFixed(1) + '%' : '0%',
          },
        }), {
          headers: {
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*',
          },
        });
      } catch (error) {
        return new Response(JSON.stringify({
          error: 'Ultra-optimized RSS test failed',
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
          message: 'Ultra-optimized processing triggered manually',
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

    // Default response with ultra-optimization info
    return new Response(JSON.stringify({
      service: 'Pulse UTD News Ultra-Optimized Worker',
      version: '4.0.0',
      features: [
        'RSS-first approach (5 reliable feeds)',
        'Ultra-smart GNews fallback (15-20 requests/day)',
        'Advanced KV caching with multi-level deduplication',
        'Optimized 15-minute intervals (96 runs/day)',
        'Comprehensive usage tracking and limits',
      ],
      endpoints: {
        status: '/status - Basic status check',
        health: '/health - Comprehensive health report',
        dashboard: '/dashboard - Monitoring dashboard data',
        trigger: '/trigger (POST) - Manual processing trigger',
        testRss: '/test-rss - Test ultra-optimized RSS fetching',
        gnewsStats: '/gnews-stats - Detailed GNews API usage statistics',
      },
      optimization: {
        cronFrequency: 'Every 15 minutes (96 runs/day)',
        gnewsStrategy: 'Smart fallback only when RSS gives <5 articles',
        gnewsLimit: '15-20 calls/day (safe zone under 100 limit)',
        rssFeeds: '5 reliable sources (60% success rate)',
        caching: 'Multi-level KV caching with query optimization',
        efficiency: 'Maximum articles with minimum API usage',
      },
      gnewsConstraints: {
        freePlanLimit: '100 requests/day',
        ourSafeLimit: '20 requests/day',
        requestsPerSecond: 1,
        articlesPerRequest: 10,
        strategy: 'RSS-first, GNews only when needed',
      },
    }), {
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': '*',
      },
    });
  },
};