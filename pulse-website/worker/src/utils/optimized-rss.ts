/**
 * Optimized RSS Fetching with Smart GNews Fallback
 * 
 * Features:
 * - RSS-first approach with reliable feeds
 * - Smart GNews fallback only when needed
 * - KV caching to prevent duplicates
 * - Rate limiting to stay within API limits
 * - Comprehensive duplicate detection
 */

import { RSS_FEEDS } from '../config/sites';

export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  guid?: string;
  imageUrl?: string;
  source?: string;
  category?: string;
}

export interface OptimizedFetchResult {
  success: boolean;
  articles: Article[];
  errors: FeedError[];
  stats: OptimizedFetchStats;
  cacheStats: CacheStats;
}

export interface FeedError {
  feedUrl: string;
  error: string;
  statusCode?: number;
  timestamp: string;
  retryAttempt: number;
}

export interface OptimizedFetchStats {
  totalFeeds: number;
  successfulFeeds: number;
  failedFeeds: number;
  totalArticles: number;
  processingTime: number;
  gnewsUsed: boolean;
  gnewsCallsToday: number;
  duplicatesFiltered: number;
}

export interface CacheStats {
  cacheHits: number;
  cacheMisses: number;
  newEntriesCached: number;
}

// Bot-resistant user agents
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
];

// Site configurations for reliable feeds only
const SITE_CONFIGS: Record<string, {
  delay: number;
  maxRetries: number;
  headers: Record<string, string>;
}> = {
  'ntvkenya.co.ke': {
    delay: 1500,
    maxRetries: 2,
    headers: {
      'Accept': 'application/rss+xml, application/xml, text/xml',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  },
  'capitalfm.co.ke': {
    delay: 1000,
    maxRetries: 2,
    headers: {
      'Accept': 'application/rss+xml, application/xml, text/xml',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  },
  'citizen.digital': {
    delay: 2000,
    maxRetries: 3,
    headers: {
      'Accept': 'application/rss+xml, application/xml, text/xml',
      'Accept-Language': 'en-US,en;q=0.9',
      'Cache-Control': 'no-cache',
    }
  },
  'pulselive.co.ke': {
    delay: 1500,
    maxRetries: 2,
    headers: {
      'Accept': 'application/rss+xml, application/xml, text/xml',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  },
  'ghafla.com': {
    delay: 1000,
    maxRetries: 2,
    headers: {
      'Accept': 'application/rss+xml, application/xml, text/xml',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  },
  default: {
    delay: 1000,
    maxRetries: 2,
    headers: {
      'Accept': 'application/rss+xml, application/xml, text/xml',
      'Accept-Language': 'en-US,en;q=0.9',
    }
  }
};

/**
 * Optimized RSS fetching with smart GNews fallback
 */
export async function fetchAndFilterArticlesOptimized(
  lastTimestamp: number,
  kvNamespace?: any,
  gnewsApiKey?: string
): Promise<OptimizedFetchResult> {
  const startTime = Date.now();
  const allArticles: Article[] = [];
  const errors: FeedError[] = [];
  let successfulFeeds = 0;
  let gnewsUsed = false;
  let duplicatesFiltered = 0;

  const cacheStats: CacheStats = {
    cacheHits: 0,
    cacheMisses: 0,
    newEntriesCached: 0,
  };

  console.log(`🚀 Starting optimized RSS fetching for ${RSS_FEEDS.length} reliable feeds...`);

  // Phase 1: Try RSS feeds first (RSS-first approach)
  const rssResults = await fetchRSSFeedsWithRetries(RSS_FEEDS, errors);
  
  for (const result of rssResults) {
    if (result.success && result.articles.length > 0) {
      allArticles.push(...result.articles);
      successfulFeeds++;
      console.log(`✅ Successfully fetched ${result.articles.length} articles from RSS`);
    }
  }

  const rssSuccessRate = successfulFeeds / RSS_FEEDS.length;
  console.log(`📊 RSS Results: ${successfulFeeds}/${RSS_FEEDS.length} feeds successful (${(rssSuccessRate * 100).toFixed(1)}%)`);

  // Phase 2: Smart GNews fallback - only if RSS gives very few articles
  let gnewsCallsToday = 0;
  if (kvNamespace) {
    gnewsCallsToday = await getGNewsCallsToday(kvNamespace);
  }

  const shouldUseGNews = (
    allArticles.length < 5 && // Very few articles from RSS
    gnewsApiKey && // API key available
    gnewsCallsToday < 20 && // Under daily limit (safe zone)
    kvNamespace // KV available for tracking
  );

  if (shouldUseGNews) {
    console.log(`⚠️ RSS returned only ${allArticles.length} articles, using GNews fallback (${gnewsCallsToday}/20 calls today)`);
    
    try {
      const gnewsArticles = await fetchFromGNewsAPI(gnewsApiKey!, lastTimestamp);
      if (gnewsArticles.length > 0) {
        allArticles.push(...gnewsArticles);
        gnewsUsed = true;
        await incrementGNewsCallsToday(kvNamespace);
        console.log(`✅ GNews provided ${gnewsArticles.length} additional articles`);
      }
    } catch (error) {
      errors.push({
        feedUrl: 'GNews API',
        error: `GNews fallback failed: ${(error as Error).message}`,
        timestamp: new Date().toISOString(),
        retryAttempt: 0,
      });
    }
  } else if (allArticles.length < 5) {
    console.log(`⚠️ RSS returned only ${allArticles.length} articles, but GNews not used (calls today: ${gnewsCallsToday}/20)`);
  }

  // Phase 3: Filter articles by timestamp
  const filteredArticles = allArticles
    .filter((article) => {
      const articleTime = new Date(article.pubDate).getTime();
      return articleTime > lastTimestamp && isValidArticle(article);
    })
    .sort((a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime());

  // Phase 4: Advanced duplicate detection with KV caching
  let uniqueArticles: Article[] = [];
  if (kvNamespace) {
    const deduplicationResult = await removeDuplicatesWithCache(filteredArticles, kvNamespace);
    uniqueArticles = deduplicationResult.uniqueArticles;
    duplicatesFiltered = deduplicationResult.duplicatesFiltered;
    cacheStats.cacheHits = deduplicationResult.cacheHits;
    cacheStats.cacheMisses = deduplicationResult.cacheMisses;
    cacheStats.newEntriesCached = deduplicationResult.newEntriesCached;
  } else {
    uniqueArticles = removeDuplicatesBasic(filteredArticles);
    duplicatesFiltered = filteredArticles.length - uniqueArticles.length;
  }

  const processingTime = Date.now() - startTime;

  const stats: OptimizedFetchStats = {
    totalFeeds: RSS_FEEDS.length,
    successfulFeeds,
    failedFeeds: RSS_FEEDS.length - successfulFeeds,
    totalArticles: uniqueArticles.length,
    processingTime,
    gnewsUsed,
    gnewsCallsToday: gnewsCallsToday + (gnewsUsed ? 1 : 0),
    duplicatesFiltered,
  };

  console.log(`📊 Optimized fetch completed:`);
  console.log(`   - RSS success rate: ${(rssSuccessRate * 100).toFixed(1)}%`);
  console.log(`   - Total articles: ${uniqueArticles.length}`);
  console.log(`   - Duplicates filtered: ${duplicatesFiltered}`);
  console.log(`   - GNews used: ${gnewsUsed ? 'Yes' : 'No'}`);
  console.log(`   - GNews calls today: ${stats.gnewsCallsToday}/20`);
  console.log(`   - Processing time: ${processingTime}ms`);
  console.log(`   - Cache hits: ${cacheStats.cacheHits}, misses: ${cacheStats.cacheMisses}`);

  return {
    success: uniqueArticles.length > 0,
    articles: uniqueArticles,
    errors,
    stats,
    cacheStats,
  };
}

/**
 * Fetch RSS feeds with optimized retry logic
 */
async function fetchRSSFeedsWithRetries(
  feedUrls: string[],
  errors: FeedError[]
): Promise<Array<{ success: boolean; articles: Article[] }>> {
  const results: Array<{ success: boolean; articles: Article[] }> = [];

  for (let i = 0; i < feedUrls.length; i++) {
    const feedUrl = feedUrls[i];
    const hostname = new URL(feedUrl).hostname.replace('www.', '');
    const config = SITE_CONFIGS[hostname] || SITE_CONFIGS.default;

    // Staggered delays between requests
    if (i > 0) {
      await sleep(config.delay);
    }

    const result = await fetchSingleRSSFeedWithRetries(feedUrl, config, errors);
    results.push(result);
  }

  return results;
}

/**
 * Fetch single RSS feed with retry logic
 */
async function fetchSingleRSSFeedWithRetries(
  feedUrl: string,
  config: typeof SITE_CONFIGS.default,
  errors: FeedError[]
): Promise<{ success: boolean; articles: Article[] }> {
  let lastError: Error | null = null;

  for (let attempt = 1; attempt <= config.maxRetries; attempt++) {
    try {
      console.log(`📡 Fetching RSS feed (attempt ${attempt}/${config.maxRetries}): ${feedUrl}`);

      const userAgent = USER_AGENTS[Math.floor(Math.random() * USER_AGENTS.length)];
      
      const response = await fetch(feedUrl, {
        method: 'GET',
        headers: {
          'User-Agent': userAgent,
          'Referer': new URL(feedUrl).origin,
          'DNT': '1',
          'Connection': 'keep-alive',
          'Upgrade-Insecure-Requests': '1',
          ...config.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlText = await response.text();
      
      if (xmlText.includes('<!DOCTYPE html') || xmlText.includes('<html')) {
        throw new Error('Received HTML instead of RSS XML - likely blocked by anti-bot protection');
      }

      const articles = parseRSSFeed(xmlText, feedUrl);
      console.log(`✅ Successfully parsed ${articles.length} articles from ${feedUrl}`);
      
      return { success: true, articles };

    } catch (error) {
      lastError = error as Error;
      console.error(`❌ Attempt ${attempt} failed for ${feedUrl}:`, error);

      if (attempt < config.maxRetries) {
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 5000);
        await sleep(backoffDelay);
      }
    }
  }

  // All retries failed
  const statusCode = lastError?.message.includes('HTTP') ? 
    parseInt(lastError.message.match(/HTTP (\d+)/)?.[1] || '0') || undefined : undefined;
  
  const errorEntry: FeedError = {
    feedUrl,
    error: lastError?.message || 'Unknown error',
    timestamp: new Date().toISOString(),
    retryAttempt: config.maxRetries,
  };

  if (statusCode) {
    errorEntry.statusCode = statusCode;
  }

  errors.push(errorEntry);
  return { success: false, articles: [] };
}

/**
 * Fetch from GNews API (smart fallback)
 */
async function fetchFromGNewsAPI(
  apiKey: string,
  lastTimestamp: number
): Promise<Article[]> {
  const articles: Article[] = [];

  try {
    // Use search endpoint for Kenya-specific news
    const searchUrl = new URL('https://gnews.io/api/v4/search');
    searchUrl.searchParams.set('q', 'Kenya OR Nairobi OR "East Africa"');
    searchUrl.searchParams.set('lang', 'en');
    searchUrl.searchParams.set('country', 'ke');
    searchUrl.searchParams.set('max', '25'); // Moderate limit
    searchUrl.searchParams.set('apikey', apiKey);

    const response = await fetch(searchUrl.toString(), {
      headers: {
        'User-Agent': 'PulseUTDNews/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`GNews API: HTTP ${response.status}`);
    }

    const data = await response.json();
    
    for (const article of data.articles || []) {
      if (article.title && article.url && article.publishedAt) {
        const publishedTime = new Date(article.publishedAt).getTime();
        
        if (publishedTime > lastTimestamp) {
          articles.push({
            title: article.title,
            link: article.url,
            pubDate: article.publishedAt,
            description: article.description || '',
            imageUrl: article.image,
            source: article.source?.name || 'GNews',
            guid: article.url,
            category: categorizeByKeywords(article.title + ' ' + (article.description || '')),
          });
        }
      }
    }

    console.log(`✅ GNews returned ${articles.length} articles`);
    return articles;

  } catch (error) {
    console.error('❌ GNews API failed:', error);
    throw error;
  }
}

/**
 * Advanced duplicate detection with KV caching
 */
async function removeDuplicatesWithCache(
  articles: Article[],
  kvNamespace: any
): Promise<{
  uniqueArticles: Article[];
  duplicatesFiltered: number;
  cacheHits: number;
  cacheMisses: number;
  newEntriesCached: number;
}> {
  const unique: Article[] = [];
  const seenTitles = new Set<string>();
  let cacheHits = 0;
  let cacheMisses = 0;
  let newEntriesCached = 0;

  // Get existing article cache
  const cacheKey = 'article_titles_cache';
  let cachedTitles: Set<string> = new Set();
  
  try {
    const cached = await kvNamespace.get(cacheKey);
    if (cached) {
      cachedTitles = new Set(JSON.parse(cached));
      console.log(`📋 Loaded ${cachedTitles.size} cached article titles`);
    }
  } catch (error) {
    console.warn('Failed to load article cache:', error);
  }

  for (const article of articles) {
    const normalizedTitle = normalizeTitle(article.title);
    
    // Check cache first
    if (cachedTitles.has(normalizedTitle)) {
      cacheHits++;
      continue; // Skip cached (duplicate) article
    }
    
    cacheMisses++;
    
    // Check against current batch
    if (seenTitles.has(normalizedTitle)) {
      continue; // Skip duplicate in current batch
    }

    // Check similarity with existing articles
    let isDuplicate = false;
    for (const seenTitle of seenTitles) {
      if (calculateSimilarity(normalizedTitle, seenTitle) > 0.8) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seenTitles.add(normalizedTitle);
      cachedTitles.add(normalizedTitle);
      unique.push(article);
      newEntriesCached++;
    }
  }

  // Update cache (keep last 1000 titles to prevent unlimited growth)
  try {
    const titlesToCache = Array.from(cachedTitles).slice(-1000);
    await kvNamespace.put(cacheKey, JSON.stringify(titlesToCache), {
      expirationTtl: 7 * 24 * 60 * 60, // 7 days
    });
    console.log(`💾 Updated cache with ${titlesToCache.length} titles`);
  } catch (error) {
    console.warn('Failed to update article cache:', error);
  }

  return {
    uniqueArticles: unique,
    duplicatesFiltered: articles.length - unique.length,
    cacheHits,
    cacheMisses,
    newEntriesCached,
  };
}

/**
 * Basic duplicate removal (fallback when KV not available)
 */
function removeDuplicatesBasic(articles: Article[]): Article[] {
  const unique: Article[] = [];
  const seenTitles = new Set<string>();

  for (const article of articles) {
    const normalizedTitle = normalizeTitle(article.title);
    
    if (seenTitles.has(normalizedTitle)) {
      continue;
    }

    let isDuplicate = false;
    for (const seenTitle of seenTitles) {
      if (calculateSimilarity(normalizedTitle, seenTitle) > 0.8) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seenTitles.add(normalizedTitle);
      unique.push(article);
    }
  }

  return unique;
}

/**
 * Get GNews API calls made today
 */
async function getGNewsCallsToday(kvNamespace: any): Promise<number> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const key = `gnews_calls_${today}`;
    const calls = await kvNamespace.get(key);
    return calls ? parseInt(calls) : 0;
  } catch (error) {
    console.warn('Failed to get GNews calls count:', error);
    return 0;
  }
}

/**
 * Increment GNews API calls for today
 */
async function incrementGNewsCallsToday(kvNamespace: any): Promise<void> {
  try {
    const today = new Date().toISOString().split('T')[0];
    const key = `gnews_calls_${today}`;
    const currentCalls = await getGNewsCallsToday(kvNamespace);
    await kvNamespace.put(key, (currentCalls + 1).toString(), {
      expirationTtl: 25 * 60 * 60, // 25 hours (expires next day)
    });
  } catch (error) {
    console.warn('Failed to increment GNews calls count:', error);
  }
}

// Utility functions
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  const commonWords = words1.filter(word => 
    word.length > 3 && words2.includes(word)
  ).length;
  
  const totalWords = Math.max(words1.length, words2.length);
  
  return totalWords > 0 ? commonWords / totalWords : 0;
}

function categorizeByKeywords(content: string): string {
  const lowerContent = content.toLowerCase();

  const categories = {
    'Politics': ['government', 'president', 'parliament', 'election', 'political', 'minister', 'policy', 'law', 'court'],
    'Business': ['business', 'economy', 'economic', 'market', 'trade', 'investment', 'company', 'financial', 'bank', 'money'],
    'Technology': ['technology', 'tech', 'digital', 'internet', 'mobile', 'app', 'software', 'innovation', 'startup'],
    'Sports': ['sports', 'football', 'soccer', 'rugby', 'athletics', 'olympics', 'match', 'team', 'player'],
    'Entertainment': ['entertainment', 'music', 'movie', 'film', 'celebrity', 'artist', 'culture', 'festival'],
  };

  for (const [category, keywords] of Object.entries(categories)) {
    if (keywords.some(keyword => lowerContent.includes(keyword))) {
      return category;
    }
  }

  return 'Latest News';
}

function parseRSSFeed(xmlText: string, feedUrl: string): Article[] {
  const articles: Article[] = [];
  
  try {
    const cleanXml = xmlText
      .replace(/<\?xml[^>]*\?>/gi, '')
      .replace(/<!DOCTYPE[^>]*>/gi, '')
      .replace(/xmlns[^=]*="[^"]*"/gi, '');

    const itemPatterns = [
      /<item[^>]*>([\s\S]*?)<\/item>/gi,
      /<entry[^>]*>([\s\S]*?)<\/entry>/gi,
    ];

    for (const itemRegex of itemPatterns) {
      let match;
      while ((match = itemRegex.exec(cleanXml)) !== null) {
        const itemContent = match[1];

        const title = extractXMLContent(itemContent, 'title') ||
                     extractXMLContent(itemContent, 'dc:title');

        const link = extractXMLContent(itemContent, 'link') ||
                    extractXMLContent(itemContent, 'guid') ||
                    extractLinkFromAtom(itemContent);

        const pubDate = extractXMLContent(itemContent, 'pubDate') ||
                       extractXMLContent(itemContent, 'dc:date') ||
                       extractXMLContent(itemContent, 'published') ||
                       extractXMLContent(itemContent, 'updated');

        const description = extractXMLContent(itemContent, 'description') ||
                           extractXMLContent(itemContent, 'content:encoded') ||
                           extractXMLContent(itemContent, 'summary') ||
                           extractXMLContent(itemContent, 'content');

        const guid = extractXMLContent(itemContent, 'guid') ||
                    extractXMLContent(itemContent, 'id') ||
                    link;

        const imageUrl = extractImageFromRSSItem(itemContent);

        if (title && link && pubDate) {
          const article: Article = {
            title: cleanText(title),
            link: link.trim(),
            pubDate: normalizeDate(pubDate),
            guid: guid || link,
            source: new URL(feedUrl).hostname.replace('www.', ''),
          };
          
          if (description) {
            article.description = cleanText(description);
          }
          
          if (imageUrl) {
            article.imageUrl = imageUrl;
          }
          
          articles.push(article);
        }
      }
    }
  } catch (error) {
    console.error(`RSS parsing error for ${feedUrl}:`, error);
  }

  return articles;
}

function isValidArticle(article: Article): boolean {
  return !!(
    article.title &&
    article.link &&
    article.pubDate &&
    article.title.length > 10 &&
    article.link.startsWith('http') &&
    !isExcludedContent(article.title)
  );
}

function isExcludedContent(title: string): boolean {
  const excludePatterns = [
    /test\s*post/i,
    /lorem\s*ipsum/i,
    /sample\s*article/i,
    /^ad[\s:]/i,
    /advertisement/i,
    /sponsored\s*content/i,
  ];

  return excludePatterns.some(pattern => pattern.test(title));
}

// Additional utility functions (same as enhanced-rss.ts)
function extractXMLContent(xml: string, tag: string): string {
  const patterns = [
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'),
    new RegExp(`<${tag}[^>]*\\/>`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = xml.match(pattern);
    if (match) {
      let content = match[1] || '';
      content = content.replace(/^\s*<!\[CDATA\[(.*?)\]\]>\s*$/s, '$1');
      return content.trim();
    }
  }

  return '';
}

function extractLinkFromAtom(itemContent: string): string {
  const linkMatch = itemContent.match(/<link[^>]+href="([^"]+)"/i);
  return linkMatch ? linkMatch[1] : '';
}

function extractImageFromRSSItem(itemContent: string): string {
  const imagePatterns = [
    /<media:content[^>]+url="([^"]+)"[^>]*type="image/i,
    /<media:thumbnail[^>]+url="([^"]+)"/i,
    /<media:content[^>]+url="([^"]+)"/i,
    /<enclosure[^>]+type="image[^"]*"[^>]+url="([^"]+)"/i,
    /<enclosure[^>]+url="([^"]+)"[^>]+type="image[^"]*"/i,
    /<itunes:image[^>]+href="([^"]+)"/i,
    /<img[^>]+src="([^"]+)"/i,
    /<wp:featuredImage>([^<]+)<\/wp:featuredImage>/i,
    /<image[^>]*>([^<]+)<\/image>/i,
    /<image[^>]+url="([^"]+)"/i,
    /<link[^>]+rel="enclosure"[^>]+href="([^"]+)"/i,
  ];

  for (const pattern of imagePatterns) {
    const match = itemContent.match(pattern);
    if (match && match[1]) {
      const imageUrl = match[1].trim();
      if (isValidImageUrl(imageUrl)) {
        return imageUrl;
      }
    }
  }

  return '';
}

function isValidImageUrl(url: string): boolean {
  if (!url || !url.startsWith('http')) {
    return false;
  }
  
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)(\?|$)/i;
  if (imageExtensions.test(url)) {
    return true;
  }
  
  const imageHosts = [
    'images.unsplash.com',
    'cdn.pixabay.com',
    'images.pexels.com',
    'i.imgur.com',
    'media.gettyimages.com',
    'cloudinary.com',
    'amazonaws.com',
    'googleusercontent.com',
  ];
  
  try {
    const hostname = new URL(url).hostname;
    return imageHosts.some(host => hostname.includes(host)) || 
           hostname.includes('image') || 
           hostname.includes('photo') ||
           hostname.includes('media');
  } catch {
    return false;
  }
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '')
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
}

function normalizeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      const cleanDate = dateString
        .replace(/\s*\([^)]*\)/, '')
        .replace(/\s+/, ' ')
        .trim();
      
      const parsedDate = new Date(cleanDate);
      if (isNaN(parsedDate.getTime())) {
        console.warn(`Could not parse date: ${dateString}`);
        return new Date().toISOString();
      }
      return parsedDate.toISOString();
    }
    return date.toISOString();
  } catch (error) {
    console.warn(`Date parsing error for "${dateString}":`, error);
    return new Date().toISOString();
  }
}

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}