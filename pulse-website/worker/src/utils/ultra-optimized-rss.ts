/**
 * Ultra-Optimized RSS Fetching with GNews Integration
 * 
 * Maximum efficiency within API constraints:
 * - RSS-first approach (5 reliable feeds)
 * - Ultra-smart GNews fallback (15-20 requests/day max)
 * - Advanced KV caching with query-level optimization
 * - Strategic request batching and deduplication
 * - Comprehensive usage tracking and limits
 */

import { RSS_FEEDS } from '../config/sites';
import { createOptimizedGNewsClient, convertGNewsArticle } from './gnews-optimized';

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

export interface UltraOptimizedFetchResult {
  success: boolean;
  articles: Article[];
  errors: FeedError[];
  stats: UltraOptimizedStats;
  cacheStats: CacheStats;
  gnewsStats: GNewsStats;
}

export interface FeedError {
  feedUrl: string;
  error: string;
  statusCode?: number;
  timestamp: string;
  retryAttempt: number;
}

export interface UltraOptimizedStats {
  totalFeeds: number;
  successfulFeeds: number;
  failedFeeds: number;
  totalArticles: number;
  processingTime: number;
  gnewsUsed: boolean;
  duplicatesFiltered: number;
  rssSuccessRate: number;
}

export interface CacheStats {
  cacheHits: number;
  cacheMisses: number;
  newEntriesCached: number;
  queryCache: {
    hits: number;
    misses: number;
  };
}

export interface GNewsStats {
  requestsUsed: number;
  requestsRemaining: number;
  cacheHits: number;
  articlesFromCache: number;
  articlesFromAPI: number;
}

// Optimized user agents for reliable feeds
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
];

// Optimized site configurations for working feeds only
const SITE_CONFIGS: Record<string, {
  delay: number;
  maxRetries: number;
  headers: Record<string, string>;
}> = {
  'ntvkenya.co.ke': {
    delay: 1000,
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
  'pulselive.co.ke': {
    delay: 1000,
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
 * Ultra-optimized RSS fetching with smart GNews integration
 */
export async function fetchAndFilterArticlesUltraOptimized(
  lastTimestamp: number,
  kvNamespace?: any,
  gnewsApiKey?: string
): Promise<UltraOptimizedFetchResult> {
  const startTime = Date.now();
  const allArticles: Article[] = [];
  const errors: FeedError[] = [];
  let successfulFeeds = 0;
  let duplicatesFiltered = 0;

  const cacheStats: CacheStats = {
    cacheHits: 0,
    cacheMisses: 0,
    newEntriesCached: 0,
    queryCache: { hits: 0, misses: 0 },
  };

  const gnewsStats: GNewsStats = {
    requestsUsed: 0,
    requestsRemaining: 0,
    cacheHits: 0,
    articlesFromCache: 0,
    articlesFromAPI: 0,
  };

  console.log(`🚀 Starting ultra-optimized RSS fetching for ${RSS_FEEDS.length} reliable feeds...`);

  // Phase 1: RSS-first approach with optimized feeds
  const rssResults = await fetchRSSFeedsOptimized(RSS_FEEDS, errors);
  
  for (const result of rssResults) {
    if (result.success && result.articles.length > 0) {
      allArticles.push(...result.articles);
      successfulFeeds++;
      console.log(`✅ RSS: ${result.articles.length} articles from reliable feed`);
    }
  }

  const rssSuccessRate = successfulFeeds / RSS_FEEDS.length;
  console.log(`📊 RSS Results: ${successfulFeeds}/${RSS_FEEDS.length} feeds successful (${(rssSuccessRate * 100).toFixed(1)}%)`);

  // Phase 2: Ultra-smart GNews fallback - only when RSS gives very few articles
  let gnewsUsed = false;
  
  if (allArticles.length < 5 && gnewsApiKey && kvNamespace) {
    console.log(`⚠️ RSS returned only ${allArticles.length} articles, activating ultra-optimized GNews fallback...`);
    
    try {
      const gnewsClient = createOptimizedGNewsClient(gnewsApiKey, kvNamespace);
      const gnewsResult = await gnewsClient.fetchArticlesOptimized(lastTimestamp, 25);
      
      if (gnewsResult.success && gnewsResult.articles.length > 0) {
        const convertedArticles = gnewsResult.articles.map(convertGNewsArticle);
        allArticles.push(...convertedArticles);
        gnewsUsed = true;
        
        // Update GNews stats
        gnewsStats.requestsUsed = gnewsResult.requestsUsed;
        gnewsStats.requestsRemaining = gnewsResult.requestsRemaining;
        gnewsStats.cacheHits = gnewsResult.cacheHits || 0;
        gnewsStats.articlesFromAPI = gnewsResult.articles.length - (gnewsResult.cacheHits || 0);
        gnewsStats.articlesFromCache = gnewsResult.cacheHits || 0;
        
        console.log(`✅ GNews Ultra-Optimized: ${convertedArticles.length} articles (${gnewsResult.requestsUsed} requests, ${gnewsResult.cacheHits} cache hits)`);
      } else {
        console.log(`❌ GNews failed: ${gnewsResult.error}`);
        errors.push({
          feedUrl: 'GNews API',
          error: gnewsResult.error || 'Unknown GNews error',
          timestamp: new Date().toISOString(),
          retryAttempt: 0,
        });
      }
    } catch (error) {
      console.error('❌ GNews ultra-optimization failed:', error);
      errors.push({
        feedUrl: 'GNews API',
        error: `GNews optimization failed: ${(error as Error).message}`,
        timestamp: new Date().toISOString(),
        retryAttempt: 0,
      });
    }
  } else if (allArticles.length >= 5) {
    console.log(`✅ RSS provided sufficient articles (${allArticles.length}), GNews not needed`);
  } else {
    console.log(`⚠️ GNews not available (API key: ${!!gnewsApiKey}, KV: ${!!kvNamespace})`);
  }

  // Phase 3: Filter articles by timestamp
  const filteredArticles = allArticles
    .filter((article) => {
      const articleTime = new Date(article.pubDate).getTime();
      return articleTime > lastTimestamp && isValidArticle(article);
    })
    .sort((a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime());

  // Phase 4: Ultra-advanced duplicate detection with multi-level caching
  let uniqueArticles: Article[] = [];
  if (kvNamespace) {
    const deduplicationResult = await removeDuplicatesUltraOptimized(filteredArticles, kvNamespace);
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

  const stats: UltraOptimizedStats = {
    totalFeeds: RSS_FEEDS.length,
    successfulFeeds,
    failedFeeds: RSS_FEEDS.length - successfulFeeds,
    totalArticles: uniqueArticles.length,
    processingTime,
    gnewsUsed,
    duplicatesFiltered,
    rssSuccessRate,
  };

  console.log(`📊 Ultra-optimized fetch completed:`);
  console.log(`   - RSS success rate: ${(rssSuccessRate * 100).toFixed(1)}%`);
  console.log(`   - Total articles: ${uniqueArticles.length}`);
  console.log(`   - Duplicates filtered: ${duplicatesFiltered}`);
  console.log(`   - GNews used: ${gnewsUsed ? 'Yes' : 'No'}`);
  if (gnewsUsed) {
    console.log(`   - GNews requests: ${gnewsStats.requestsUsed}/${gnewsStats.requestsUsed + gnewsStats.requestsRemaining}`);
    console.log(`   - GNews cache hits: ${gnewsStats.cacheHits}`);
  }
  console.log(`   - Processing time: ${processingTime}ms`);
  console.log(`   - Cache performance: ${cacheStats.cacheHits} hits, ${cacheStats.cacheMisses} misses`);

  return {
    success: uniqueArticles.length > 0,
    articles: uniqueArticles,
    errors,
    stats,
    cacheStats,
    gnewsStats,
  };
}

/**
 * Fetch RSS feeds with optimized retry logic
 */
async function fetchRSSFeedsOptimized(
  feedUrls: string[],
  errors: FeedError[]
): Promise<Array<{ success: boolean; articles: Article[] }>> {
  const results: Array<{ success: boolean; articles: Article[] }> = [];

  for (let i = 0; i < feedUrls.length; i++) {
    const feedUrl = feedUrls[i];
    const hostname = new URL(feedUrl).hostname.replace('www.', '');
    const config = SITE_CONFIGS[hostname] || SITE_CONFIGS.default;

    // Minimal delays for reliable feeds
    if (i > 0) {
      await sleep(config.delay);
    }

    const result = await fetchSingleRSSFeedOptimized(feedUrl, config, errors);
    results.push(result);
  }

  return results;
}

/**
 * Fetch single RSS feed with optimized retry logic
 */
async function fetchSingleRSSFeedOptimized(
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
          ...config.headers,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlText = await response.text();
      
      if (xmlText.includes('<!DOCTYPE html') || xmlText.includes('<html')) {
        throw new Error('Received HTML instead of RSS XML - likely blocked');
      }

      const articles = parseRSSFeedOptimized(xmlText, feedUrl);
      console.log(`✅ Successfully parsed ${articles.length} articles from ${feedUrl}`);
      
      return { success: true, articles };

    } catch (error) {
      lastError = error as Error;
      console.error(`❌ Attempt ${attempt} failed for ${feedUrl}:`, error);

      if (attempt < config.maxRetries) {
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 3000);
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
 * Ultra-advanced duplicate detection with multi-level caching
 */
async function removeDuplicatesUltraOptimized(
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

  // Multi-level cache keys
  const titleCacheKey = 'ultra_article_titles_cache';
  const urlCacheKey = 'ultra_article_urls_cache';
  
  let cachedTitles: Set<string> = new Set();
  let cachedUrls: Set<string> = new Set();
  
  try {
    // Load title cache
    const titleCache = await kvNamespace.get(titleCacheKey);
    if (titleCache) {
      cachedTitles = new Set(JSON.parse(titleCache));
    }
    
    // Load URL cache
    const urlCache = await kvNamespace.get(urlCacheKey);
    if (urlCache) {
      cachedUrls = new Set(JSON.parse(urlCache));
    }
    
    console.log(`📋 Loaded cache: ${cachedTitles.size} titles, ${cachedUrls.size} URLs`);
  } catch (error) {
    console.warn('Failed to load ultra cache:', error);
  }

  for (const article of articles) {
    const normalizedTitle = normalizeTitle(article.title);
    const normalizedUrl = article.link.toLowerCase();
    
    // Multi-level duplicate detection
    if (cachedTitles.has(normalizedTitle) || cachedUrls.has(normalizedUrl)) {
      cacheHits++;
      continue; // Skip cached duplicate
    }
    
    cacheMisses++;
    
    // Check against current batch
    if (seenTitles.has(normalizedTitle)) {
      continue; // Skip duplicate in current batch
    }

    // Advanced similarity check
    let isDuplicate = false;
    for (const seenTitle of seenTitles) {
      if (calculateAdvancedSimilarity(normalizedTitle, seenTitle) > 0.85) {
        isDuplicate = true;
        break;
      }
    }

    if (!isDuplicate) {
      seenTitles.add(normalizedTitle);
      cachedTitles.add(normalizedTitle);
      cachedUrls.add(normalizedUrl);
      unique.push(article);
      newEntriesCached++;
    }
  }

  // Update multi-level cache with size limits
  try {
    const maxCacheSize = 2000;
    
    // Update title cache
    const titlesToCache = Array.from(cachedTitles).slice(-maxCacheSize);
    await kvNamespace.put(titleCacheKey, JSON.stringify(titlesToCache), {
      expirationTtl: 7 * 24 * 60 * 60, // 7 days
    });
    
    // Update URL cache
    const urlsToCache = Array.from(cachedUrls).slice(-maxCacheSize);
    await kvNamespace.put(urlCacheKey, JSON.stringify(urlsToCache), {
      expirationTtl: 7 * 24 * 60 * 60, // 7 days
    });
    
    console.log(`💾 Updated ultra cache: ${titlesToCache.length} titles, ${urlsToCache.length} URLs`);
  } catch (error) {
    console.warn('Failed to update ultra cache:', error);
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
 * Basic duplicate removal (fallback)
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
      if (calculateAdvancedSimilarity(normalizedTitle, seenTitle) > 0.85) {
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

// Utility functions
function normalizeTitle(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, '')
    .replace(/\s+/g, ' ')
    .trim();
}

function calculateAdvancedSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/).filter(w => w.length > 2);
  const words2 = str2.split(/\s+/).filter(w => w.length > 2);
  
  if (words1.length === 0 || words2.length === 0) return 0;
  
  const commonWords = words1.filter(word => 
    word.length > 3 && words2.includes(word)
  ).length;
  
  const totalWords = Math.max(words1.length, words2.length);
  const similarity = totalWords > 0 ? commonWords / totalWords : 0;
  
  // Boost similarity for very similar titles
  if (similarity > 0.6) {
    const lengthDiff = Math.abs(str1.length - str2.length) / Math.max(str1.length, str2.length);
    return similarity * (1 - lengthDiff * 0.3);
  }
  
  return similarity;
}

function parseRSSFeedOptimized(xmlText: string, feedUrl: string): Article[] {
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

// Additional utility functions (same as optimized-rss.ts)
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