/**
 * Enhanced RSS Fetching with Bot-Resistant Strategies (Fixed TypeScript Issues)
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

export interface FetchResult {
  success: boolean;
  articles: Article[];
  errors: FeedError[];
  stats: FetchStats;
}

export interface FeedError {
  feedUrl: string;
  error: string;
  statusCode?: number;
  timestamp: string;
  retryAttempt: number;
}

export interface FetchStats {
  totalFeeds: number;
  successfulFeeds: number;
  failedFeeds: number;
  totalArticles: number;
  processingTime: number;
  alternativeSourcesUsed: number;
}

// Bot-resistant user agents
const USER_AGENTS = [
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
  'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:121.0) Gecko/20100101 Firefox/121.0',
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/17.2 Safari/605.1.15',
  'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
];

// Site configurations
const SITE_CONFIGS: Record<string, {
  delay: number;
  maxRetries: number;
  headers: Record<string, string>;
}> = {
  'tuko.co.ke': {
    delay: 2000,
    maxRetries: 3,
    headers: {
      'Accept': 'application/rss+xml, application/xml, text/xml, */*',
      'Accept-Language': 'en-US,en;q=0.9',
      'Accept-Encoding': 'gzip, deflate, br',
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
    }
  },
  'standardmedia.co.ke': {
    delay: 1500,
    maxRetries: 2,
    headers: {
      'Accept': 'application/rss+xml, application/xml, text/xml',
      'Accept-Language': 'en-US,en;q=0.8',
    }
  },
  'nation.africa': {
    delay: 3000,
    maxRetries: 4,
    headers: {
      'Accept': 'application/rss+xml, application/xml, text/xml',
      'Accept-Language': 'en-US,en;q=0.9',
      'Sec-Fetch-Dest': 'document',
      'Sec-Fetch-Mode': 'navigate',
      'Sec-Fetch-Site': 'none',
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
 * Enhanced RSS fetching with bot-resistant strategies
 */
export async function fetchAndFilterArticlesEnhanced(
  lastTimestamp: number,
  kvNamespace?: any,
  newsApiKey?: string
): Promise<FetchResult> {
  const startTime = Date.now();
  const allArticles: Article[] = [];
  const errors: FeedError[] = [];
  let successfulFeeds = 0;
  let alternativeSourcesUsed = 0;

  console.log(`🚀 Starting enhanced RSS fetching for ${RSS_FEEDS.length} feeds...`);

  // Phase 1: Try RSS feeds with bot-resistant strategies
  const rssResults = await fetchRSSFeedsWithRetries(RSS_FEEDS, errors);
  
  for (const result of rssResults) {
    if (result.success && result.articles.length > 0) {
      allArticles.push(...result.articles);
      successfulFeeds++;
      console.log(`✅ Successfully fetched ${result.articles.length} articles from RSS`);
    }
  }

  // Phase 2: Use alternative news APIs if RSS feeds fail significantly
  if (successfulFeeds < RSS_FEEDS.length * 0.3 && newsApiKey) {
    console.log(`⚠️ RSS success rate low (${successfulFeeds}/${RSS_FEEDS.length}), trying alternative APIs...`);
    
    try {
      const apiArticles = await fetchFromNewsAPIs(newsApiKey, lastTimestamp);
      if (apiArticles.length > 0) {
        allArticles.push(...apiArticles);
        alternativeSourcesUsed++;
        console.log(`✅ Fetched ${apiArticles.length} articles from alternative APIs`);
      }
    } catch (error) {
      errors.push({
        feedUrl: 'NewsAPI',
        error: `Alternative API failed: ${(error as Error).message}`,
        timestamp: new Date().toISOString(),
        retryAttempt: 0,
      });
    }
  }

  // Phase 3: Filter and process articles
  const filteredArticles = allArticles
    .filter((article) => {
      const articleTime = new Date(article.pubDate).getTime();
      return articleTime > lastTimestamp && isValidArticle(article);
    })
    .sort((a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime());

  const uniqueArticles = removeDuplicates(filteredArticles);

  // Phase 4: Store error reports for monitoring
  if (kvNamespace && errors.length > 0) {
    await storeErrorReport(kvNamespace, errors);
  }

  const processingTime = Date.now() - startTime;

  const stats: FetchStats = {
    totalFeeds: RSS_FEEDS.length,
    successfulFeeds,
    failedFeeds: RSS_FEEDS.length - successfulFeeds,
    totalArticles: uniqueArticles.length,
    processingTime,
    alternativeSourcesUsed,
  };

  console.log(`📊 Enhanced RSS fetch completed:`);
  console.log(`   - Successful feeds: ${successfulFeeds}/${RSS_FEEDS.length}`);
  console.log(`   - Total articles: ${uniqueArticles.length}`);
  console.log(`   - Processing time: ${processingTime}ms`);
  console.log(`   - Errors: ${errors.length}`);
  console.log(`   - Alternative sources used: ${alternativeSourcesUsed}`);

  return {
    success: uniqueArticles.length > 0,
    articles: uniqueArticles,
    errors,
    stats,
  };
}

/**
 * Fetch RSS feeds with retry logic and bot-resistant strategies
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
        const backoffDelay = Math.min(1000 * Math.pow(2, attempt), 10000);
        await sleep(backoffDelay);
      }
    }
  }

  // All retries failed, log the error
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
 * Fetch articles from alternative news APIs
 */
async function fetchFromNewsAPIs(
  newsApiKey: string,
  lastTimestamp: number
): Promise<Article[]> {
  const articles: Article[] = [];

  try {
    const newsApiUrl = new URL('https://newsapi.org/v2/top-headlines');
    newsApiUrl.searchParams.set('country', 'ke');
    newsApiUrl.searchParams.set('pageSize', '50');
    newsApiUrl.searchParams.set('apiKey', newsApiKey);

    const response = await fetch(newsApiUrl.toString(), {
      headers: {
        'User-Agent': 'PulseUTDNews/1.0',
      },
    });

    if (response.ok) {
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
              imageUrl: article.urlToImage,
              source: article.source?.name || 'NewsAPI',
              guid: article.url,
            });
          }
        }
      }
      
      console.log(`✅ NewsAPI returned ${articles.length} articles`);
    }
  } catch (error) {
    console.error('❌ NewsAPI failed:', error);
  }

  return articles;
}

/**
 * Enhanced RSS feed parsing
 */
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

/**
 * Store error report in KV for monitoring
 */
async function storeErrorReport(kvNamespace: any, errors: FeedError[]): Promise<void> {
  try {
    const timestamp = new Date().toISOString();
    const reportKey = `error_report_${Date.now()}`;
    
    const report = {
      timestamp,
      totalErrors: errors.length,
      errors: errors.slice(0, 50),
      summary: generateErrorSummary(errors),
    };

    await kvNamespace.put(reportKey, JSON.stringify(report), {
      expirationTtl: 7 * 24 * 60 * 60,
    });

    await kvNamespace.put('latest_error_summary', JSON.stringify(report.summary), {
      expirationTtl: 24 * 60 * 60,
    });

    console.log(`📊 Stored error report with ${errors.length} errors`);
  } catch (error) {
    console.error('Failed to store error report:', error);
  }
}

/**
 * Generate error summary for monitoring
 */
function generateErrorSummary(errors: FeedError[]): any {
  const summary = {
    totalErrors: errors.length,
    errorsByType: {} as Record<string, number>,
    errorsByFeed: {} as Record<string, number>,
    commonErrors: [] as string[],
  };

  for (const error of errors) {
    const errorType = error.error.includes('HTTP') ? 'HTTP_ERROR' :
                     error.error.includes('blocked') ? 'BLOCKED' :
                     error.error.includes('timeout') ? 'TIMEOUT' :
                     'OTHER';
    
    summary.errorsByType[errorType] = (summary.errorsByType[errorType] || 0) + 1;
    summary.errorsByFeed[error.feedUrl] = (summary.errorsByFeed[error.feedUrl] || 0) + 1;
  }

  const errorCounts = {} as Record<string, number>;
  for (const error of errors) {
    errorCounts[error.error] = (errorCounts[error.error] || 0) + 1;
  }

  summary.commonErrors = Object.entries(errorCounts)
    .sort(([,a], [,b]) => b - a)
    .slice(0, 5)
    .map(([error]) => error);

  return summary;
}

// Utility functions
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

function removeDuplicates(articles: Article[]): Article[] {
  const unique: Article[] = [];
  const seenTitles = new Set<string>();

  for (const article of articles) {
    const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    
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

function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  const commonWords = words1.filter(word => 
    word.length > 3 && words2.includes(word)
  ).length;
  
  const totalWords = Math.max(words1.length, words2.length);
  
  return totalWords > 0 ? commonWords / totalWords : 0;
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

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}