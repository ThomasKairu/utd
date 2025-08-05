/**
 * Alternative News APIs Integration - Updated with GNews
 * 
 * Provides fallback content sources when RSS feeds fail
 * Supports GNews API for reliable Kenya news coverage
 */

import { Article } from './enhanced-rss';

export interface NewsAPIConfig {
  name: string;
  baseUrl: string;
  apiKey: string;
  rateLimit: number; // requests per minute
  coverage: string[];
}

export interface APIResult {
  source: string;
  articles: Article[];
  success: boolean;
  error?: string;
  rateLimitRemaining?: number;
}

/**
 * Fetch articles from alternative news APIs as RSS fallback
 */
export async function fetchFromAlternativeAPIs(
  configs: NewsAPIConfig[],
  lastTimestamp: number,
  maxArticles: number = 50
): Promise<APIResult[]> {
  const results: APIResult[] = [];

  console.log(`🔄 Fetching from ${configs.length} alternative news APIs...`);

  for (const config of configs) {
    try {
      const result = await fetchFromSingleAPI(config, lastTimestamp, maxArticles);
      results.push(result);
      
      if (result.success) {
        console.log(`✅ ${config.name}: ${result.articles.length} articles`);
      } else {
        console.log(`❌ ${config.name}: ${result.error}`);
      }

      // Respect rate limits
      await sleep(60000 / config.rateLimit);
    } catch (error) {
      results.push({
        source: config.name,
        articles: [],
        success: false,
        error: (error as Error).message,
      });
    }
  }

  return results;
}

/**
 * Fetch from a single news API
 */
async function fetchFromSingleAPI(
  config: NewsAPIConfig,
  lastTimestamp: number,
  maxArticles: number
): Promise<APIResult> {
  switch (config.name) {
    case 'GNews':
      return await fetchFromGNewsAPI(config, lastTimestamp, maxArticles);
    case 'NewsAPI':
      return await fetchFromNewsAPI(config, lastTimestamp, maxArticles);
    case 'Guardian':
      return await fetchFromGuardianAPI(config, lastTimestamp, maxArticles);
    case 'Reuters':
      return await fetchFromReutersAPI(config, lastTimestamp, maxArticles);
    case 'BBC':
      return await fetchFromBBCAPI(config, lastTimestamp, maxArticles);
    default:
      return {
        source: config.name,
        articles: [],
        success: false,
        error: 'Unsupported API',
      };
  }
}

/**
 * GNews API integration - Primary alternative source
 */
async function fetchFromGNewsAPI(
  config: NewsAPIConfig,
  lastTimestamp: number,
  maxArticles: number
): Promise<APIResult> {
  try {
    const articles: Article[] = [];

    // Fetch Kenya-specific news
    const kenyaUrl = new URL(`${config.baseUrl}/search`);
    kenyaUrl.searchParams.set('q', 'Kenya OR Nairobi OR "East Africa"');
    kenyaUrl.searchParams.set('lang', 'en');
    kenyaUrl.searchParams.set('country', 'ke');
    kenyaUrl.searchParams.set('max', Math.min(maxArticles, 100).toString());
    kenyaUrl.searchParams.set('apikey', config.apiKey);

    const response = await fetch(kenyaUrl.toString(), {
      headers: {
        'User-Agent': 'PulseUTDNews/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`GNews API: HTTP ${response.status}`);
    }

    const data = await response.json();
    
    // Process articles
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

    // If we need more articles, try broader search
    if (articles.length < maxArticles / 2) {
      const generalUrl = new URL(`${config.baseUrl}/top-headlines`);
      generalUrl.searchParams.set('country', 'ke');
      generalUrl.searchParams.set('lang', 'en');
      generalUrl.searchParams.set('max', '50');
      generalUrl.searchParams.set('apikey', config.apiKey);

      const generalResponse = await fetch(generalUrl.toString());
      
      if (generalResponse.ok) {
        const generalData = await generalResponse.json();
        
        for (const article of generalData.articles || []) {
          if (article.title && article.url && article.publishedAt) {
            const publishedTime = new Date(article.publishedAt).getTime();
            
            if (publishedTime > lastTimestamp && articles.length < maxArticles) {
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
      }
    }

    return {
      source: 'GNews',
      articles: articles.slice(0, maxArticles),
      success: true,
    };

  } catch (error) {
    return {
      source: 'GNews',
      articles: [],
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * NewsAPI.org integration (fallback)
 */
async function fetchFromNewsAPI(
  config: NewsAPIConfig,
  lastTimestamp: number,
  maxArticles: number
): Promise<APIResult> {
  try {
    const articles: Article[] = [];

    const kenyaUrl = new URL(`${config.baseUrl}/top-headlines`);
    kenyaUrl.searchParams.set('country', 'ke');
    kenyaUrl.searchParams.set('pageSize', Math.min(maxArticles, 100).toString());
    kenyaUrl.searchParams.set('apiKey', config.apiKey);

    const response = await fetch(kenyaUrl.toString(), {
      headers: {
        'User-Agent': 'PulseUTDNews/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`NewsAPI: HTTP ${response.status}`);
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
            imageUrl: article.urlToImage,
            source: article.source?.name || 'NewsAPI',
            guid: article.url,
            category: categorizeByKeywords(article.title + ' ' + (article.description || '')),
          });
        }
      }
    }

    return {
      source: 'NewsAPI',
      articles: articles.slice(0, maxArticles),
      success: true,
      rateLimitRemaining: parseInt(response.headers.get('X-RateLimit-Remaining') || '0'),
    };

  } catch (error) {
    return {
      source: 'NewsAPI',
      articles: [],
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Guardian API integration
 */
async function fetchFromGuardianAPI(
  config: NewsAPIConfig,
  lastTimestamp: number,
  maxArticles: number
): Promise<APIResult> {
  try {
    const articles: Article[] = [];
    const fromDate = new Date(lastTimestamp).toISOString().split('T')[0];

    const url = new URL(`${config.baseUrl}/search`);
    url.searchParams.set('q', 'Kenya OR "East Africa" OR Nairobi');
    url.searchParams.set('from-date', fromDate);
    url.searchParams.set('order-by', 'newest');
    url.searchParams.set('page-size', Math.min(maxArticles, 50).toString());
    url.searchParams.set('show-fields', 'headline,body,thumbnail,short-url');
    url.searchParams.set('api-key', config.apiKey);

    const response = await fetch(url.toString(), {
      headers: {
        'User-Agent': 'PulseUTDNews/1.0',
      },
    });

    if (!response.ok) {
      throw new Error(`Guardian API: HTTP ${response.status}`);
    }

    const data = await response.json();
    
    for (const item of data.response?.results || []) {
      if (item.webTitle && item.webUrl && item.webPublicationDate) {
        const publishedTime = new Date(item.webPublicationDate).getTime();
        
        if (publishedTime > lastTimestamp) {
          articles.push({
            title: item.webTitle,
            link: item.fields?.shortUrl || item.webUrl,
            pubDate: item.webPublicationDate,
            description: item.fields?.body ? 
              item.fields.body.replace(/<[^>]*>/g, '').substring(0, 300) + '...' : '',
            imageUrl: item.fields?.thumbnail,
            source: 'The Guardian',
            guid: item.id,
            category: categorizeBySection(item.sectionName),
          });
        }
      }
    }

    return {
      source: 'Guardian',
      articles,
      success: true,
    };

  } catch (error) {
    return {
      source: 'Guardian',
      articles: [],
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Reuters RSS integration
 */
async function fetchFromReutersAPI(
  config: NewsAPIConfig,
  lastTimestamp: number,
  maxArticles: number
): Promise<APIResult> {
  try {
    const reutersFeeds = [
      'https://www.reuters.com/rssFeed/worldNews',
      'https://www.reuters.com/rssFeed/businessNews',
    ];

    const articles: Article[] = [];

    for (const feedUrl of reutersFeeds) {
      try {
        const response = await fetch(feedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; PulseNewsBot/1.0)',
          },
        });

        if (response.ok) {
          const xmlText = await response.text();
          const feedArticles = parseReutersRSS(xmlText, lastTimestamp);
          articles.push(...feedArticles);
        }
      } catch (error) {
        console.warn(`Failed to fetch Reuters feed ${feedUrl}:`, error);
      }
    }

    return {
      source: 'Reuters',
      articles: articles.slice(0, maxArticles),
      success: articles.length > 0,
      error: articles.length === 0 ? 'No articles found' : undefined,
    };

  } catch (error) {
    return {
      source: 'Reuters',
      articles: [],
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * BBC RSS integration
 */
async function fetchFromBBCAPI(
  config: NewsAPIConfig,
  lastTimestamp: number,
  maxArticles: number
): Promise<APIResult> {
  try {
    const bbcFeeds = [
      'http://feeds.bbci.co.uk/news/world/africa/rss.xml',
      'http://feeds.bbci.co.uk/news/business/rss.xml',
      'http://feeds.bbci.co.uk/news/technology/rss.xml',
    ];

    const articles: Article[] = [];

    for (const feedUrl of bbcFeeds) {
      try {
        const response = await fetch(feedUrl, {
          headers: {
            'User-Agent': 'Mozilla/5.0 (compatible; PulseNewsBot/1.0)',
          },
        });

        if (response.ok) {
          const xmlText = await response.text();
          const feedArticles = parseBBCRSS(xmlText, lastTimestamp);
          articles.push(...feedArticles);
        }
      } catch (error) {
        console.warn(`Failed to fetch BBC feed ${feedUrl}:`, error);
      }
    }

    return {
      source: 'BBC',
      articles: articles.slice(0, maxArticles),
      success: articles.length > 0,
      error: articles.length === 0 ? 'No articles found' : undefined,
    };

  } catch (error) {
    return {
      source: 'BBC',
      articles: [],
      success: false,
      error: (error as Error).message,
    };
  }
}

/**
 * Create default API configurations with GNews as primary
 */
export function createDefaultAPIConfigs(apiKeys: Record<string, string>): NewsAPIConfig[] {
  const configs: NewsAPIConfig[] = [];

  // GNews as primary alternative source
  if (apiKeys.gnews) {
    configs.push({
      name: 'GNews',
      baseUrl: 'https://gnews.io/api/v4',
      apiKey: apiKeys.gnews,
      rateLimit: 100, // 100 requests per day for free tier
      coverage: ['Kenya', 'Global'],
    });
  }

  if (apiKeys.newsapi) {
    configs.push({
      name: 'NewsAPI',
      baseUrl: 'https://newsapi.org/v2',
      apiKey: apiKeys.newsapi,
      rateLimit: 1000,
      coverage: ['Kenya', 'Global'],
    });
  }

  if (apiKeys.guardian) {
    configs.push({
      name: 'Guardian',
      baseUrl: 'https://content.guardianapis.com',
      apiKey: apiKeys.guardian,
      rateLimit: 12,
      coverage: ['Global', 'Africa'],
    });
  }

  // RSS-based APIs (no keys required)
  configs.push({
    name: 'Reuters',
    baseUrl: 'https://www.reuters.com',
    apiKey: '',
    rateLimit: 6,
    coverage: ['Global', 'Africa'],
  });

  configs.push({
    name: 'BBC',
    baseUrl: 'http://feeds.bbci.co.uk',
    apiKey: '',
    rateLimit: 6,
    coverage: ['Global', 'Africa'],
  });

  return configs;
}

// Utility functions
function parseReutersRSS(xmlText: string, lastTimestamp: number): Article[] {
  const articles: Article[] = [];
  
  try {
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];

      const title = extractXMLContent(itemContent, 'title');
      const link = extractXMLContent(itemContent, 'link');
      const pubDate = extractXMLContent(itemContent, 'pubDate');
      const description = extractXMLContent(itemContent, 'description');

      if (title && link && pubDate) {
        const publishedTime = new Date(pubDate).getTime();
        
        if (publishedTime > lastTimestamp) {
          if (isAfricaRelated(title + ' ' + description)) {
            articles.push({
              title: cleanText(title),
              link: link.trim(),
              pubDate: new Date(pubDate).toISOString(),
              description: cleanText(description),
              source: 'Reuters',
              guid: link,
              category: categorizeByKeywords(title + ' ' + description),
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('Reuters RSS parsing error:', error);
  }

  return articles;
}

function parseBBCRSS(xmlText: string, lastTimestamp: number): Article[] {
  const articles: Article[] = [];
  
  try {
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(xmlText)) !== null) {
      const itemContent = match[1];

      const title = extractXMLContent(itemContent, 'title');
      const link = extractXMLContent(itemContent, 'link');
      const pubDate = extractXMLContent(itemContent, 'pubDate');
      const description = extractXMLContent(itemContent, 'description');

      if (title && link && pubDate) {
        const publishedTime = new Date(pubDate).getTime();
        
        if (publishedTime > lastTimestamp) {
          if (isAfricaRelated(title + ' ' + description)) {
            articles.push({
              title: cleanText(title),
              link: link.trim(),
              pubDate: new Date(pubDate).toISOString(),
              description: cleanText(description),
              source: 'BBC',
              guid: link,
              category: categorizeByKeywords(title + ' ' + description),
            });
          }
        }
      }
    }
  } catch (error) {
    console.error('BBC RSS parsing error:', error);
  }

  return articles;
}

function isAfricaRelated(content: string): boolean {
  const africaKeywords = [
    'kenya', 'nairobi', 'mombasa', 'kisumu',
    'east africa', 'africa', 'african',
    'uganda', 'tanzania', 'rwanda',
    'ethiopia', 'somalia', 'sudan',
    'kenyatta', 'ruto', 'odinga',
  ];

  const lowerContent = content.toLowerCase();
  return africaKeywords.some(keyword => lowerContent.includes(keyword));
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

function categorizeBySection(sectionName: string): string {
  const sectionMap: Record<string, string> = {
    'politics': 'Politics',
    'business': 'Business',
    'technology': 'Technology',
    'sport': 'Sports',
    'culture': 'Entertainment',
    'world': 'Latest News',
    'news': 'Latest News',
  };

  return sectionMap[sectionName?.toLowerCase()] || 'Latest News';
}

function extractXMLContent(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  if (match) {
    let content = match[1] || '';
    content = content.replace(/^\s*<!\[CDATA\[(.*?)\]\]>\s*$/s, '$1');
    return content.trim();
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

function sleep(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}