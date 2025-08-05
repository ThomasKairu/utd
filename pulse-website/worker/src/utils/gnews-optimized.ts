/**
 * Ultra-Optimized GNews API Implementation
 * 
 * Designed to maximize efficiency within GNews Free Plan constraints:
 * - 100 requests per day (strict limit)
 * - 1 request per second maximum
 * - 10 articles per request maximum
 * - Smart caching and deduplication
 * - Strategic query optimization
 * 
 * Strategy:
 * - Use only 15-20 requests per day (safe zone)
 * - Combine multiple search strategies in single requests
 * - Aggressive caching to prevent duplicate requests
 * - Smart fallback only when RSS completely fails
 */

export interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string;
  publishedAt: string;
  source: {
    name: string;
    url: string;
  };
}

export interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

export interface OptimizedGNewsResult {
  success: boolean;
  articles: GNewsArticle[];
  requestsUsed: number;
  requestsRemaining: number;
  cacheHits: number;
  error?: string;
}

export interface GNewsUsageStats {
  date: string;
  requestsUsed: number;
  dailyLimit: number;
  remaining: number;
  lastRequestTime: number;
  cacheHits: number;
  cacheMisses: number;
}

/**
 * Ultra-optimized GNews client with aggressive caching and rate limiting
 */
export class OptimizedGNewsClient {
  private apiKey: string;
  private kvNamespace: any;
  private baseUrl = 'https://gnews.io/api/v4';
  private dailyLimit = 20; // Conservative limit (20% of 100)
  private requestsPerSecond = 1;
  private articlesPerRequest = 10;

  constructor(apiKey: string, kvNamespace?: any) {
    this.apiKey = apiKey;
    this.kvNamespace = kvNamespace;
  }

  /**
   * Smart article fetching with multiple optimization strategies
   */
  async fetchArticlesOptimized(
    lastTimestamp: number,
    maxArticles: number = 25
  ): Promise<OptimizedGNewsResult> {
    try {
      // Check daily usage first
      const usageStats = await this.getUsageStats();
      
      if (usageStats.requestsUsed >= this.dailyLimit) {
        return {
          success: false,
          articles: [],
          requestsUsed: usageStats.requestsUsed,
          requestsRemaining: this.dailyLimit - usageStats.requestsUsed,
          cacheHits: 0,
          error: `Daily limit reached (${usageStats.requestsUsed}/${this.dailyLimit})`,
        };
      }

      console.log(`📊 GNews Usage: ${usageStats.requestsUsed}/${this.dailyLimit} requests used today`);

      // Strategy 1: Try cache first
      const cachedArticles = await this.getCachedArticles(lastTimestamp);
      if (cachedArticles.length >= maxArticles) {
        console.log(`💾 Cache hit: ${cachedArticles.length} articles from cache`);
        return {
          success: true,
          articles: cachedArticles.slice(0, maxArticles),
          requestsUsed: usageStats.requestsUsed,
          requestsRemaining: this.dailyLimit - usageStats.requestsUsed,
          cacheHits: cachedArticles.length,
        };
      }

      // Strategy 2: Smart API requests with optimized queries
      const allArticles: GNewsArticle[] = [...cachedArticles];
      let requestsUsed = 0;
      let cacheHits = cachedArticles.length;

      // Optimized search queries (most effective for Kenya)
      const searchQueries = [
        'Kenya OR Nairobi OR "East Africa"',
        'Kenya politics OR government OR election',
        'Kenya business OR economy OR investment',
      ];

      // Use only 1-2 requests maximum per run
      const maxRequests = Math.min(2, this.dailyLimit - usageStats.requestsUsed);
      
      for (let i = 0; i < Math.min(searchQueries.length, maxRequests); i++) {
        const query = searchQueries[i];
        
        // Check if we already have this query cached
        const cacheKey = `gnews_query_${this.hashQuery(query)}_${this.getDateKey()}`;
        const cached = await this.getFromCache(cacheKey);
        
        if (cached) {
          console.log(`💾 Query cache hit for: ${query}`);
          allArticles.push(...cached);
          cacheHits += cached.length;
          continue;
        }

        // Make API request with rate limiting
        await this.enforceRateLimit(usageStats.lastRequestTime);
        
        try {
          const response = await this.makeGNewsRequest('search', {
            q: query,
            lang: 'en',
            country: 'ke',
            max: this.articlesPerRequest,
            from: this.formatDate(new Date(lastTimestamp)),
          });

          if (response.articles) {
            const newArticles = response.articles.filter(article => 
              new Date(article.publishedAt).getTime() > lastTimestamp
            );
            
            allArticles.push(...newArticles);
            requestsUsed++;
            
            // Cache the results
            await this.cacheQueryResult(cacheKey, newArticles);
            await this.incrementUsageStats();
            
            console.log(`✅ GNews API: ${newArticles.length} articles from query "${query}"`);
          }
        } catch (error) {
          console.error(`❌ GNews API error for query "${query}":`, error);
          // Continue with other queries even if one fails
        }

        // Stop if we have enough articles
        if (allArticles.length >= maxArticles) {
          break;
        }
      }

      // Remove duplicates and sort
      const uniqueArticles = this.removeDuplicates(allArticles);
      const sortedArticles = uniqueArticles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, maxArticles);

      // Cache the final result
      await this.cacheArticles(sortedArticles);

      const finalUsage = await this.getUsageStats();
      
      return {
        success: true,
        articles: sortedArticles,
        requestsUsed: finalUsage.requestsUsed,
        requestsRemaining: this.dailyLimit - finalUsage.requestsUsed,
        cacheHits,
      };

    } catch (error) {
      console.error('❌ GNews optimization error:', error);
      return {
        success: false,
        articles: [],
        requestsUsed: 0,
        requestsRemaining: this.dailyLimit,
        cacheHits: 0,
        error: (error as Error).message,
      };
    }
  }

  /**
   * Make optimized GNews API request
   */
  private async makeGNewsRequest(
    endpoint: 'search' | 'top-headlines',
    params: Record<string, any>
  ): Promise<GNewsResponse> {
    const url = new URL(`${this.baseUrl}/${endpoint}`);
    
    // Add API key and optimize parameters
    url.searchParams.set('apikey', this.apiKey);
    
    // Add all parameters
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        url.searchParams.set(key, value.toString());
      }
    });

    console.log(`🔗 GNews API Request: ${endpoint} with ${Object.keys(params).length} params`);

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'PulseUTDNews/1.0',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`GNews API error: ${response.status} - ${errorText}`);
    }

    return await response.json();
  }

  /**
   * Enforce rate limiting (1 request per second)
   */
  private async enforceRateLimit(lastRequestTime: number): Promise<void> {
    const now = Date.now();
    const timeSinceLastRequest = now - lastRequestTime;
    const minInterval = 1000; // 1 second

    if (timeSinceLastRequest < minInterval) {
      const waitTime = minInterval - timeSinceLastRequest;
      console.log(`⏳ Rate limiting: waiting ${waitTime}ms`);
      await new Promise(resolve => setTimeout(resolve, waitTime));
    }
  }

  /**
   * Get usage statistics for today
   */
  private async getUsageStats(): Promise<GNewsUsageStats> {
    if (!this.kvNamespace) {
      return {
        date: this.getDateKey(),
        requestsUsed: 0,
        dailyLimit: this.dailyLimit,
        remaining: this.dailyLimit,
        lastRequestTime: 0,
        cacheHits: 0,
        cacheMisses: 0,
      };
    }

    try {
      const key = `gnews_usage_${this.getDateKey()}`;
      const stored = await this.kvNamespace.get(key);
      
      if (stored) {
        const stats = JSON.parse(stored);
        return {
          ...stats,
          remaining: this.dailyLimit - stats.requestsUsed,
        };
      }
    } catch (error) {
      console.warn('Failed to get usage stats:', error);
    }

    return {
      date: this.getDateKey(),
      requestsUsed: 0,
      dailyLimit: this.dailyLimit,
      remaining: this.dailyLimit,
      lastRequestTime: 0,
      cacheHits: 0,
      cacheMisses: 0,
    };
  }

  /**
   * Increment usage statistics
   */
  private async incrementUsageStats(): Promise<void> {
    if (!this.kvNamespace) return;

    try {
      const stats = await this.getUsageStats();
      const updated: GNewsUsageStats = {
        ...stats,
        requestsUsed: stats.requestsUsed + 1,
        lastRequestTime: Date.now(),
        remaining: this.dailyLimit - (stats.requestsUsed + 1),
      };

      const key = `gnews_usage_${this.getDateKey()}`;
      await this.kvNamespace.put(key, JSON.stringify(updated), {
        expirationTtl: 25 * 60 * 60, // 25 hours
      });
    } catch (error) {
      console.warn('Failed to increment usage stats:', error);
    }
  }

  /**
   * Get cached articles newer than timestamp
   */
  private async getCachedArticles(lastTimestamp: number): Promise<GNewsArticle[]> {
    if (!this.kvNamespace) return [];

    try {
      const key = `gnews_articles_${this.getDateKey()}`;
      const cached = await this.kvNamespace.get(key);
      
      if (cached) {
        const articles: GNewsArticle[] = JSON.parse(cached);
        return articles.filter(article => 
          new Date(article.publishedAt).getTime() > lastTimestamp
        );
      }
    } catch (error) {
      console.warn('Failed to get cached articles:', error);
    }

    return [];
  }

  /**
   * Cache articles for today
   */
  private async cacheArticles(articles: GNewsArticle[]): Promise<void> {
    if (!this.kvNamespace || articles.length === 0) return;

    try {
      const key = `gnews_articles_${this.getDateKey()}`;
      
      // Get existing cached articles
      const existing = await this.getCachedArticles(0); // Get all cached articles
      
      // Merge and deduplicate
      const allArticles = [...existing, ...articles];
      const uniqueArticles = this.removeDuplicates(allArticles);
      
      // Keep only last 100 articles to prevent unlimited growth
      const articlesToCache = uniqueArticles
        .sort((a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime())
        .slice(0, 100);

      await this.kvNamespace.put(key, JSON.stringify(articlesToCache), {
        expirationTtl: 24 * 60 * 60, // 24 hours
      });

      console.log(`💾 Cached ${articlesToCache.length} articles for today`);
    } catch (error) {
      console.warn('Failed to cache articles:', error);
    }
  }

  /**
   * Cache query result
   */
  private async cacheQueryResult(cacheKey: string, articles: GNewsArticle[]): Promise<void> {
    if (!this.kvNamespace) return;

    try {
      await this.kvNamespace.put(cacheKey, JSON.stringify(articles), {
        expirationTtl: 6 * 60 * 60, // 6 hours
      });
    } catch (error) {
      console.warn('Failed to cache query result:', error);
    }
  }

  /**
   * Get from cache
   */
  private async getFromCache(key: string): Promise<GNewsArticle[] | null> {
    if (!this.kvNamespace) return null;

    try {
      const cached = await this.kvNamespace.get(key);
      return cached ? JSON.parse(cached) : null;
    } catch (error) {
      console.warn('Failed to get from cache:', error);
      return null;
    }
  }

  /**
   * Remove duplicate articles
   */
  private removeDuplicates(articles: GNewsArticle[]): GNewsArticle[] {
    const seen = new Set<string>();
    const unique: GNewsArticle[] = [];

    for (const article of articles) {
      const key = this.normalizeTitle(article.title);
      if (!seen.has(key)) {
        seen.add(key);
        unique.push(article);
      }
    }

    return unique;
  }

  /**
   * Normalize title for duplicate detection
   */
  private normalizeTitle(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\s]/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  /**
   * Hash query for caching
   */
  private hashQuery(query: string): string {
    let hash = 0;
    for (let i = 0; i < query.length; i++) {
      const char = query.charCodeAt(i);
      hash = ((hash << 5) - hash) + char;
      hash = hash & hash; // Convert to 32-bit integer
    }
    return Math.abs(hash).toString(36);
  }

  /**
   * Get date key for caching (YYYY-MM-DD)
   */
  private getDateKey(): string {
    return new Date().toISOString().split('T')[0];
  }

  /**
   * Format date for GNews API
   */
  private formatDate(date: Date): string {
    return date.toISOString().split('T')[0];
  }
}

/**
 * Convert GNews article to our standard Article format
 */
export function convertGNewsArticle(gnewsArticle: GNewsArticle): any {
  return {
    title: gnewsArticle.title,
    link: gnewsArticle.url,
    pubDate: gnewsArticle.publishedAt,
    description: gnewsArticle.description,
    imageUrl: gnewsArticle.image,
    source: gnewsArticle.source.name,
    guid: gnewsArticle.url,
    category: categorizeByKeywords(gnewsArticle.title + ' ' + gnewsArticle.description),
  };
}

/**
 * Categorize article by keywords
 */
function categorizeByKeywords(content: string): string {
  const lowerContent = content.toLowerCase();

  const categories = {
    'Politics': ['government', 'president', 'parliament', 'election', 'political', 'minister', 'policy', 'law', 'court', 'ruto', 'odinga'],
    'Business': ['business', 'economy', 'economic', 'market', 'trade', 'investment', 'company', 'financial', 'bank', 'money', 'shilling'],
    'Technology': ['technology', 'tech', 'digital', 'internet', 'mobile', 'app', 'software', 'innovation', 'startup', 'safaricom'],
    'Sports': ['sports', 'football', 'soccer', 'rugby', 'athletics', 'olympics', 'match', 'team', 'player', 'harambee'],
    'Entertainment': ['entertainment', 'music', 'movie', 'film', 'celebrity', 'artist', 'culture', 'festival'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      return category;
    }
  }

  return 'Latest News';
}

/**
 * Factory function to create optimized GNews client
 */
export function createOptimizedGNewsClient(apiKey: string, kvNamespace?: any): OptimizedGNewsClient {
  return new OptimizedGNewsClient(apiKey, kvNamespace);
}