import { WORKING_RSS_FEEDS as RSS_FEEDS } from '../config/working-feeds';

export interface Article {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  guid?: string;
  imageUrl?: string;
}

/**
 * Fetch and filter articles from all RSS feeds
 */
export async function fetchAndFilterArticles(lastTimestamp: number): Promise<Article[]> {
  const allArticles: Article[] = [];

  // Fetch working RSS feeds with better headers
  console.log(`📡 Fetching ${RSS_FEEDS.length} RSS feeds from international and African news sources...`);
  
  const feedPromises = RSS_FEEDS.map(async (feedUrl) => {
    try {
      console.log(`📡 Fetching RSS feed: ${feedUrl}`);
      const response = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Accept': 'application/rss+xml, application/xml, text/xml, text/html, */*',
          'Accept-Language': 'en-US,en;q=0.9',
          'Accept-Encoding': 'gzip, deflate, br',
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Sec-Fetch-Dest': 'document',
          'Sec-Fetch-Mode': 'navigate',
          'Sec-Fetch-Site': 'cross-site',
          'Upgrade-Insecure-Requests': '1',
          'Referer': 'https://www.google.com/',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const xmlText = await response.text();
      const articles = parseRSSFeed(xmlText);
      console.log(`✅ Parsed ${articles.length} articles from ${feedUrl}`);
      return articles;
    } catch (error) {
      console.error(`❌ Failed to fetch RSS feed: ${feedUrl}`, error);
      return [];
    }
  });

  const feedResults = await Promise.all(feedPromises);

  // Flatten all articles
  for (const articles of feedResults) {
    allArticles.push(...articles);
  }

  // Filter articles newer than last processed timestamp
  const filteredArticles = allArticles
    .filter((article) => {
      const articleTime = new Date(article.pubDate).getTime();
      return articleTime > lastTimestamp && isValidArticle(article);
    })
    .sort((a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime());

  // Remove duplicates based on title similarity
  const uniqueArticles = removeDuplicates(filteredArticles);

  console.log(`📊 Total articles found: ${allArticles.length}`);
  console.log(`🔍 Filtered articles (newer than timestamp): ${filteredArticles.length}`);
  console.log(`🎯 Unique articles after deduplication: ${uniqueArticles.length}`);

  return uniqueArticles;
}

/**
 * Parse RSS feed XML
 */
function parseRSSFeed(xmlText: string): Article[] {
  const articles: Article[] = [];
  
  try {
    // Remove any XML processing instructions and DOCTYPE declarations
    const cleanXml = xmlText.replace(/<\?xml[^>]*\?>/gi, '').replace(/<!DOCTYPE[^>]*>/gi, '');
    
    // Extract items using regex (more reliable than DOM parsing in Workers)
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    let match;

    while ((match = itemRegex.exec(cleanXml)) !== null) {
      const itemContent = match[1];

      const title = extractXMLContent(itemContent, 'title');
      const link = extractXMLContent(itemContent, 'link');
      const pubDate = extractXMLContent(itemContent, 'pubDate') || 
                     extractXMLContent(itemContent, 'dc:date') ||
                     extractXMLContent(itemContent, 'published');
      const description = extractXMLContent(itemContent, 'description') ||
                         extractXMLContent(itemContent, 'content:encoded') ||
                         extractXMLContent(itemContent, 'summary');
      const guid = extractXMLContent(itemContent, 'guid') || link;

      // Extract image from RSS feed
      const imageUrl = extractImageFromRSSItem(itemContent);

      if (title && link && pubDate) {
        const article: Article = {
          title: cleanText(title),
          link: link.trim(),
          pubDate: normalizeDate(pubDate),
          guid: guid || link,
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
  } catch (error) {
    console.error('RSS parsing error:', error);
  }

  return articles;
}

/**
 * Extract image URL from RSS item content
 */
function extractImageFromRSSItem(itemContent: string): string {
  // Try multiple RSS image formats
  const imagePatterns = [
    // Media RSS namespace
    /<media:content[^>]+url="([^"]+)"[^>]*type="image/i,
    /<media:thumbnail[^>]+url="([^"]+)"/i,
    /<media:content[^>]+url="([^"]+)"/i,
    
    // Enclosure tags for images
    /<enclosure[^>]+type="image[^"]*"[^>]+url="([^"]+)"/i,
    /<enclosure[^>]+url="([^"]+)"[^>]+type="image[^"]*"/i,
    
    // iTunes image
    /<itunes:image[^>]+href="([^"]+)"/i,
    
    // Image in description/content
    /<img[^>]+src="([^"]+)"/i,
    
    // WordPress featured image
    /<wp:featuredImage>([^<]+)<\/wp:featuredImage>/i,
    
    // Custom image tags
    /<image[^>]*>([^<]+)<\/image>/i,
    /<image[^>]+url="([^"]+)"/i,
  ];

  for (const pattern of imagePatterns) {
    const match = itemContent.match(pattern);
    if (match && match[1]) {
      const imageUrl = match[1].trim();
      // Validate it's a proper image URL
      if (isValidImageUrl(imageUrl)) {
        return imageUrl;
      }
    }
  }

  return '';
}

/**
 * Validate if URL is a proper image URL
 */
function isValidImageUrl(url: string): boolean {
  if (!url || !url.startsWith('http')) {
    return false;
  }
  
  // Check for common image extensions
  const imageExtensions = /\.(jpg|jpeg|png|gif|webp|svg|bmp|tiff)(\?|$)/i;
  if (imageExtensions.test(url)) {
    return true;
  }
  
  // Check for image hosting domains
  const imageHosts = [
    'images.unsplash.com',
    'cdn.pixabay.com',
    'images.pexels.com',
    'i.imgur.com',
    'media.gettyimages.com',
    'cloudinary.com',
    'amazonaws.com',
    'googleusercontent.com',
    'bbci.co.uk',
    'aljazeera.com',
    'reuters.com',
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

/**
 * Extract content from XML tags
 */
function extractXMLContent(xml: string, tag: string): string {
  const patterns = [
    new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i'),
    new RegExp(`<${tag}[^>]*\\/>`, 'i'), // Self-closing tags
  ];

  for (const pattern of patterns) {
    const match = xml.match(pattern);
    if (match) {
      let content = match[1] || '';
      // Handle CDATA sections
      content = content.replace(/^\s*<!\[CDATA\[(.*?)\]\]>\s*$/s, '$1');
      return content.trim();
    }
  }

  return '';
}

/**
 * Clean text content
 */
function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
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

/**
 * Normalize date formats
 */
function normalizeDate(dateString: string): string {
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) {
      // Try parsing common RSS date formats
      const cleanDate = dateString
        .replace(/\s*\([^)]*\)/, '') // Remove timezone names in parentheses
        .replace(/\s+/, ' ')
        .trim();
      
      const parsedDate = new Date(cleanDate);
      if (isNaN(parsedDate.getTime())) {
        console.warn(`Could not parse date: ${dateString}`);
        return new Date().toISOString(); // Fallback to current time
      }
      return parsedDate.toISOString();
    }
    return date.toISOString();
  } catch (error) {
    console.warn(`Date parsing error for "${dateString}":`, error);
    return new Date().toISOString();
  }
}

/**
 * Validate article has required fields
 */
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

/**
 * Check if content should be excluded
 */
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

/**
 * Remove duplicate articles based on title similarity
 */
function removeDuplicates(articles: Article[]): Article[] {
  const unique: Article[] = [];
  const seenTitles = new Set<string>();

  for (const article of articles) {
    const normalizedTitle = article.title.toLowerCase().replace(/[^a-z0-9\s]/g, '').trim();
    
    // Check for exact matches
    if (seenTitles.has(normalizedTitle)) {
      continue;
    }

    // Check for similar titles (simple similarity check)
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
 * Calculate simple string similarity
 */
function calculateSimilarity(str1: string, str2: string): number {
  const words1 = str1.split(/\s+/);
  const words2 = str2.split(/\s+/);
  
  const commonWords = words1.filter(word => 
    word.length > 3 && words2.includes(word)
  ).length;
  
  const totalWords = Math.max(words1.length, words2.length);
  
  return totalWords > 0 ? commonWords / totalWords : 0;
}