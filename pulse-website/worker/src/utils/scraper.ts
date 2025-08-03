import { SITE_CONFIGS, CATEGORY_FALLBACK_IMAGES } from '../config/sites';

export interface ScrapedContent {
  title: string;
  content: string;
  imageUrl?: string;
}

/**
 * Main scraping router - determines which extraction method to use
 */
export async function scrapeArticleContent(
  url: string,
  scraperApiKey?: string
): Promise<ScrapedContent> {
  try {
    const hostname = new URL(url).hostname.replace('www.', '');
    
    // Check if we have a custom extractor for this site
    if (SITE_CONFIGS[hostname]) {
      console.log(`🎯 Using custom extractor for ${hostname}`);
      return await extractWithCustomParser(url, SITE_CONFIGS[hostname]);
    }
    
    // Fallback to ScraperAPI for dynamic sites (if available)
    if (scraperApiKey) {
      console.log(`🔄 Using ScraperAPI fallback for ${hostname}`);
      return await extractWithScraperAPI(url, scraperApiKey);
    }
    
    // Last resort: direct fetch with generic extraction
    console.log(`⚠️ Using generic extraction for ${hostname}`);
    return await extractWithGenericParser(url);
    
  } catch (error) {
    console.error(`❌ Scraping failed for ${url}:`, error);
    throw new Error(`Failed to scrape content from ${url}: ${(error as Error).message}`);
  }
}

/**
 * Custom extraction for known Kenyan news sites
 */
async function extractWithCustomParser(
  url: string,
  config: typeof SITE_CONFIGS[string]
): Promise<ScrapedContent> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
      'Accept-Encoding': 'gzip, deflate',
      'Connection': 'keep-alive',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();
  
  // Extract title
  const title = extractBySelector(html, config.titleSelector) || 
                extractMetaContent(html, 'og:title') ||
                extractBySelector(html, 'title') ||
                '';

  // Extract content
  let content = extractBySelector(html, config.contentSelector) || '';
  
  // Clean content
  content = cleanContent(content);
  
  // Validate content length (minimum threshold)
  if (content.length < 300) {
    throw new Error('Extracted content too short, may be incomplete');
  }

  // Extract image
  let imageUrl = extractMetaContent(html, 'og:image');
  
  if (!imageUrl && config.fallbackImageSelector) {
    const imgSrc = extractImageSrc(html, config.fallbackImageSelector);
    if (imgSrc) {
      imageUrl = makeAbsoluteUrl(imgSrc, url);
    }
  }

  return {
    title: cleanText(title),
    content: content,
    imageUrl: imageUrl,
  };
}

/**
 * ScraperAPI fallback for dynamic sites
 */
async function extractWithScraperAPI(
  url: string,
  scraperApiKey: string
): Promise<ScrapedContent> {
  const scraperUrl = new URL('http://api.scraperapi.com');
  scraperUrl.searchParams.set('api_key', scraperApiKey);
  scraperUrl.searchParams.set('url', url);
  scraperUrl.searchParams.set('render', 'false');
  scraperUrl.searchParams.set('country_code', 'KE');

  const response = await fetch(scraperUrl.toString(), {
    method: 'GET',
    headers: {
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.5',
    },
  });

  if (!response.ok) {
    throw new Error(`ScraperAPI error: ${response.status} ${response.statusText}`);
  }

  const html = await response.text();
  
  return {
    title: extractMetaContent(html, 'og:title') || extractBySelector(html, 'h1') || '',
    content: cleanContent(extractMainContent(html)),
    imageUrl: extractMetaContent(html, 'og:image'),
  };
}

/**
 * Generic extraction as last resort
 */
async function extractWithGenericParser(url: string): Promise<ScrapedContent> {
  const response = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (compatible; PulseNewsBot/1.0)',
    },
  });

  if (!response.ok) {
    throw new Error(`HTTP ${response.status}: ${response.statusText}`);
  }

  const html = await response.text();
  
  return {
    title: extractMetaContent(html, 'og:title') || extractBySelector(html, 'h1') || '',
    content: cleanContent(extractMainContent(html)),
    imageUrl: extractMetaContent(html, 'og:image'),
  };
}

/**
 * Extract content by CSS selector
 */
function extractBySelector(html: string, selector: string): string {
  // Handle multiple selectors separated by commas
  const selectors = selector.split(',').map(s => s.trim());
  
  for (const sel of selectors) {
    // Simple selector matching for common patterns
    if (sel.includes('.')) {
      const className = sel.replace(/^.*\./, '').replace(/\s.*$/, '');
      const classRegex = new RegExp(`<[^>]+class="[^"]*${className}[^"]*"[^>]*>([\\s\\S]*?)</[^>]+>`, 'i');
      const match = html.match(classRegex);
      if (match && match[1]) return match[1];
    } else if (sel.includes('#')) {
      const id = sel.replace(/^.*#/, '').replace(/\s.*$/, '');
      const idRegex = new RegExp(`<[^>]+id="${id}"[^>]*>([\\s\\S]*?)</[^>]+>`, 'i');
      const match = html.match(idRegex);
      if (match && match[1]) return match[1];
    } else {
      // Tag selector
      const tag = sel.trim();
      const tagRegex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)</${tag}>`, 'i');
      const match = html.match(tagRegex);
      if (match && match[1]) return match[1];
    }
  }
  
  return '';
}

/**
 * Extract meta content
 */
function extractMetaContent(html: string, property: string): string {
  const patterns = [
    new RegExp(`<meta\\s+property="${property}"\\s+content="([^"]+)"`, 'i'),
    new RegExp(`<meta\\s+content="([^"]+)"\\s+property="${property}"`, 'i'),
    new RegExp(`<meta\\s+name="${property}"\\s+content="([^"]+)"`, 'i'),
    new RegExp(`<meta\\s+content="([^"]+)"\\s+name="${property}"`, 'i'),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      return match[1];
    }
  }

  return '';
}

/**
 * Extract image src from HTML
 */
function extractImageSrc(html: string, selector: string): string {
  const imgRegex = new RegExp(`<img[^>]+src="([^"]+)"[^>]*>`, 'gi');
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src && !src.includes('logo') && !src.includes('icon') && !src.includes('avatar')) {
      return src;
    }
  }

  return '';
}

/**
 * Extract main content using multiple strategies
 */
function extractMainContent(html: string): string {
  const contentSelectors = [
    'article',
    '[role="main"]',
    '.post-content',
    '.entry-content',
    '.article-content',
    '.article-body',
    '.story-content',
    '.content',
    'main',
  ];

  for (const selector of contentSelectors) {
    const content = extractBySelector(html, selector);
    if (content && content.length > 200) {
      return content;
    }
  }

  // Fallback: extract from body
  const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/is);
  return bodyMatch ? bodyMatch[1] : '';
}

/**
 * Clean extracted content
 */
function cleanContent(content: string): string {
  return content
    .replace(/<script[^>]*>.*?<\/script>/gis, '') // Remove scripts
    .replace(/<style[^>]*>.*?<\/style>/gis, '') // Remove styles
    .replace(/<nav[^>]*>.*?<\/nav>/gis, '') // Remove navigation
    .replace(/<footer[^>]*>.*?<\/footer>/gis, '') // Remove footer
    .replace(/<aside[^>]*>.*?<\/aside>/gis, '') // Remove sidebar
    .replace(/<header[^>]*>.*?<\/header>/gis, '') // Remove header
    .replace(/<!--[\s\S]*?-->/g, '') // Remove comments
    .replace(/<[^>]*>/g, ' ') // Remove all HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .replace(/&nbsp;/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .trim();
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
    .replace(/\s+/g, ' ')
    .trim();
}

/**
 * Make relative URLs absolute
 */
function makeAbsoluteUrl(url: string, baseUrl: string): string {
  if (url.startsWith('http')) {
    return url;
  }
  
  const base = new URL(baseUrl);
  
  if (url.startsWith('//')) {
    return base.protocol + url;
  }
  
  if (url.startsWith('/')) {
    return base.origin + url;
  }
  
  return new URL(url, baseUrl).href;
}