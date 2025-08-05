/**
 * Pulse News Cloudflare Worker
 * Automated news collection and processing for Kenyan news sources
 * 
 * Features:
 * - RSS feed processing from Kenyan news sources
 * - GNews API integration for additional coverage
 * - AI-powered content summarization and categorization
 * - Duplicate detection and filtering
 * - Automated database storage via Supabase
 * - KV storage for caching and state management
 */

interface Env {
  KV_NAMESPACE: KVNamespace;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
  OPENROUTER_API_KEY: string;
  NEWS_API_KEY?: string;
  GUARDIAN_API_KEY?: string;
}

interface Article {
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  source_url: string;
  image_url?: string;
  published_at: string;
}

interface ProcessingStats {
  rss_articles: number;
  gnews_articles: number;
  unique_articles: number;
  ai_processed: number;
  saved_articles: number;
  errors: number;
  execution_time: number;
}

// Kenyan news RSS feeds - updated reliable sources
const RSS_FEEDS = [
  'https://ntvkenya.co.ke/feed',
  'https://www.capitalfm.co.ke/news/rss/',
  'https://www.pulselive.co.ke/rss',
  'https://www.ghafla.com/ke/feed/',
  'https://www.nation.co.ke/kenya/news/rss' // Keep as backup
];

// Category classification keywords
const CATEGORY_KEYWORDS = {
  'Politics': [
    'government', 'parliament', 'election', 'political', 'minister', 'president', 
    'governor', 'senator', 'mp', 'cabinet', 'uhuru', 'ruto', 'raila', 'policy',
    'legislation', 'democracy', 'voting', 'campaign', 'coalition'
  ],
  'Business': [
    'business', 'economy', 'financial', 'market', 'investment', 'company', 
    'startup', 'funding', 'trade', 'banking', 'finance', 'revenue', 'profit',
    'economic', 'commercial', 'industry', 'corporate', 'entrepreneur'
  ],
  'Technology': [
    'technology', 'tech', 'digital', 'innovation', 'software', 'internet', 
    'mobile', 'ai', 'quantum', 'startup', 'fintech', 'blockchain', 'cyber',
    'data', 'computing', 'telecommunications', 'innovation', 'digital'
  ],
  'Sports': [
    'sports', 'football', 'athletics', 'marathon', 'rugby', 'basketball', 
    'cricket', 'olympics', 'fifa', 'athlete', 'championship', 'tournament',
    'soccer', 'running', 'swimming', 'volleyball', 'tennis'
  ],
  'Entertainment': [
    'entertainment', 'music', 'film', 'movie', 'celebrity', 'arts', 'culture', 
    'festival', 'concert', 'artist', 'actor', 'musician', 'show', 'performance',
    'cinema', 'theater', 'comedy', 'drama'
  ]
};

export default {
  /**
   * Scheduled event handler - runs every 15 minutes
   */
  async scheduled(event: ScheduledEvent, env: Env, ctx: ExecutionContext): Promise<void> {
    const startTime = Date.now();
    const stats: ProcessingStats = {
      rss_articles: 0,
      gnews_articles: 0,
      unique_articles: 0,
      ai_processed: 0,
      saved_articles: 0,
      errors: 0,
      execution_time: 0
    };

    console.log('🚀 Pulse News Worker started at:', new Date().toISOString());
    
    try {
      // Get last processed timestamp for date filtering
      const lastProcessedTimestamp = await getLastProcessedTimestamp(env.KV_NAMESPACE);
      console.log(`📅 Last processed timestamp: ${new Date(lastProcessedTimestamp).toISOString()}`);
      
      // Step 1: Process RSS feeds with date filtering
      console.log('📰 Processing RSS feeds...');
      const rssArticles = await processRSSFeeds(env);
      stats.rss_articles = rssArticles.length;
      console.log(`📰 Processed ${rssArticles.length} fresh articles from RSS feeds`);

      // Step 2: Process GNews API as fallback/supplement
      console.log('📡 Processing GNews API...');
      const gnewsArticles = await processGNewsAPI(env);
      stats.gnews_articles = gnewsArticles.length;
      console.log(`📡 Processed ${gnewsArticles.length} articles from GNews API`);

      // Step 3: Combine and deduplicate
      console.log('🔍 Filtering unique articles...');
      const allArticles = [...rssArticles, ...gnewsArticles];
      const uniqueArticles = await filterUniqueArticles(allArticles, env);
      stats.unique_articles = uniqueArticles.length;
      console.log(`✨ ${uniqueArticles.length} unique articles after deduplication`);

      if (uniqueArticles.length === 0) {
        console.log('📭 No new articles to process');
        return;
      }

      // Step 4: Process with AI and save to database
      console.log('🤖 Processing articles with AI...');
      let latestTimestamp = lastProcessedTimestamp;
      
      for (const article of uniqueArticles) {
        try {
          const processedArticle = await processWithAI(article, env);
          stats.ai_processed++;
          
          const saved = await saveToSupabase(processedArticle, env);
          if (saved) {
            stats.saved_articles++;
            
            // Update latest timestamp
            const articleTimestamp = new Date(article.published_at).getTime();
            latestTimestamp = Math.max(latestTimestamp, articleTimestamp);
            
            // Cache the URL to prevent reprocessing
            await env.KV_NAMESPACE.put(
              `processed:${hashUrl(article.source_url)}`, 
              'true', 
              { expirationTtl: 86400 * 7 } // 7 days
            );
          }
        } catch (error) {
          stats.errors++;
          console.error('Error processing article:', error);
        }
      }

      // Step 5: Update timestamps and statistics
      if (stats.saved_articles > 0) {
        await updateLastProcessedTimestamp(env.KV_NAMESPACE, latestTimestamp);
        console.log(`📅 Updated last processed timestamp to: ${new Date(latestTimestamp).toISOString()}`);
      }
      
      stats.execution_time = Date.now() - startTime;
      await updateProcessingStats(stats, env);
      
      console.log('✅ Worker execution completed successfully');
      console.log(`📊 Stats: ${stats.saved_articles} saved, ${stats.errors} errors, ${stats.execution_time}ms`);
      
    } catch (error) {
      stats.errors++;
      stats.execution_time = Date.now() - startTime;
      console.error('❌ Worker execution failed:', error);
      
      // Save error stats
      await updateProcessingStats(stats, env);
      throw error;
    }
  },

  /**
   * HTTP request handler for manual triggers and health checks
   */
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    
    // Health check endpoint
    if (url.pathname === '/health') {
      const lastRun = await env.KV_NAMESPACE.get('last_run');
      const stats = await env.KV_NAMESPACE.get('processing_stats');
      
      return new Response(JSON.stringify({
        status: 'healthy',
        lastRun: lastRun,
        stats: stats ? JSON.parse(stats) : null,
        timestamp: new Date().toISOString(),
        version: '1.0.0'
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    // Manual trigger endpoint
    if (url.pathname === '/trigger' && request.method === 'POST') {
      const event = { scheduledTime: Date.now() } as ScheduledEvent;
      const ctx = { 
        waitUntil: (promise: Promise<any>) => promise,
        passThroughOnException: () => {}
      } as ExecutionContext;
      
      try {
        await this.scheduled(event, env, ctx);
        return new Response(JSON.stringify({ 
          success: true, 
          message: 'Worker executed successfully',
          timestamp: new Date().toISOString()
        }), {
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      } catch (error) {
        return new Response(JSON.stringify({ 
          success: false, 
          error: error.message,
          timestamp: new Date().toISOString()
        }), {
          status: 500,
          headers: { 
            'Content-Type': 'application/json',
            'Access-Control-Allow-Origin': '*'
          }
        });
      }
    }

    // Stats endpoint
    if (url.pathname === '/stats') {
      const stats = await env.KV_NAMESPACE.get('processing_stats');
      const lastRun = await env.KV_NAMESPACE.get('last_run');
      
      return new Response(JSON.stringify({
        stats: stats ? JSON.parse(stats) : null,
        lastRun: lastRun,
        timestamp: new Date().toISOString()
      }), {
        headers: { 
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': '*'
        }
      });
    }

    return new Response('Pulse News Worker v1.0.0\n\nEndpoints:\n- GET /health - Health check\n- POST /trigger - Manual execution\n- GET /stats - Processing statistics', {
      status: 404,
      headers: { 'Content-Type': 'text/plain' }
    });
  }
};

/**
 * Process RSS feeds from Kenyan news sources
 */
async function processRSSFeeds(env: Env): Promise<Article[]> {
  const articles: Article[] = [];
  
  for (const feedUrl of RSS_FEEDS) {
    try {
      console.log(`📡 Fetching RSS feed: ${feedUrl}`);
      
      const response = await fetch(feedUrl, {
        headers: {
          'User-Agent': 'PulseNews/1.0 (https://pulsenews.publicvm.com)',
          'Accept': 'application/rss+xml, application/xml, text/xml'
        },
        cf: {
          cacheTtl: 300, // Cache for 5 minutes
          cacheEverything: true
        }
      });
      
      if (!response.ok) {
        console.warn(`RSS feed failed: ${feedUrl} - ${response.status}`);
        continue;
      }
      
      const xmlText = await response.text();
      const feedArticles = parseRSSFeed(xmlText, feedUrl);
      articles.push(...feedArticles);
      
      console.log(`��� Parsed ${feedArticles.length} articles from ${feedUrl}`);
      
    } catch (error) {
      console.error(`Error processing RSS feed ${feedUrl}:`, error);
    }
  }
  
  return articles;
}

/**
 * Parse RSS XML and extract articles with strict date filtering
 */
function parseRSSFeed(xmlText: string, sourceUrl: string): Article[] {
  const articles: Article[] = [];
  
  try {
    // Simple XML parsing for RSS items
    const itemRegex = /<item[^>]*>([\s\S]*?)<\/item>/gi;
    const items = xmlText.match(itemRegex) || [];
    
    console.log(`📡 Found ${items.length} items in RSS feed from ${sourceUrl}`);
    
    for (const item of items) { // Process all items, filter by date
      try {
        const title = extractXMLContent(item, 'title');
        const link = extractXMLContent(item, 'link');
        const description = extractXMLContent(item, 'description');
        const pubDate = extractXMLContent(item, 'pubDate');
        const imageUrl = extractImageFromContent(item);
        
        // Skip if missing essential fields
        if (!title || !link || !description) {
          console.log(`⏭️ Skipping item - missing essential fields`);
          continue;
        }
        
        // Skip if no publication date
        if (!pubDate) {
          console.log(`⏭️ Skipping "${title}" - no publication date`);
          continue;
        }
        
        // Parse and validate date
        const parsedDate = parseAndValidateDate(pubDate);
        if (!parsedDate) {
          console.log(`⏭️ Skipping "${title}" - invalid date: ${pubDate}`);
          continue;
        }
        
        // Check if article is fresh (within last 24 hours)
        if (!isRecentArticle(parsedDate)) {
          console.log(`⏭️ Skipping "${title}" - too old: ${parsedDate.toISOString()}`);
          continue;
        }
        
        console.log(`✅ Fresh article: "${title}" - ${parsedDate.toISOString()}`);
        
        articles.push({
          title: cleanText(title),
          slug: generateSlug(title),
          content: cleanText(description),
          summary: generateSummary(cleanText(description)),
          category: categorizeContent(title + ' ' + description),
          source_url: link,
          image_url: imageUrl,
          published_at: parsedDate.toISOString()
        });
      } catch (error) {
        console.error('Error parsing RSS item:', error);
      }
    }
  } catch (error) {
    console.error('Error parsing RSS feed:', error);
  }
  
  console.log(`📰 Extracted ${articles.length} fresh articles from ${sourceUrl}`);
  return articles;
}

/**
 * Parse and validate publication date with timezone normalization
 */
function parseAndValidateDate(dateString: string): Date | null {
  try {
    // Clean up the date string
    const cleanDateString = dateString.trim();
    
    // Try parsing the date
    const date = new Date(cleanDateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
      return null;
    }
    
    // Check if date is reasonable (not in future, not too old)
    const now = new Date();
    const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const oneHourFromNow = new Date(now.getTime() + 60 * 60 * 1000);
    
    if (date > oneHourFromNow || date < oneWeekAgo) {
      console.warn(`Date out of reasonable range: ${date.toISOString()}`);
      return null;
    }
    
    return date;
  } catch (error) {
    console.error('Error parsing date:', dateString, error);
    return null;
  }
}

/**
 * Check if article is recent (within configurable time window)
 */
function isRecentArticle(date: Date, hoursWindow: number = 24): boolean {
  const now = new Date();
  const cutoffTime = new Date(now.getTime() - hoursWindow * 60 * 60 * 1000);
  
  return date >= cutoffTime;
}

/**
 * Process GNews API for additional coverage - optimized for rate limits
 */
async function processGNewsAPI(env: Env): Promise<Article[]> {
  if (!env.NEWS_API_KEY) {
    console.log('📡 GNews API key not configured, skipping');
    return [];
  }
  
  // Check if we should use GNews (only if RSS gave us few articles)
  const lastGNewsCall = await env.KV_NAMESPACE.get('last_gnews_call');
  const now = Date.now();
  const oneHour = 60 * 60 * 1000;
  
  if (lastGNewsCall && (now - parseInt(lastGNewsCall)) < oneHour) {
    console.log('📡 GNews API rate limit protection - skipping this run');
    return [];
  }
  
  const articles: Article[] = [];
  
  // Use targeted queries for better results
  const queries = [
    'Kenya breaking news',
    'Nairobi latest news'
  ];
  
  for (const query of queries.slice(0, 1)) { // Limit to 1 query to save API calls
    try {
      const url = `https://gnews.io/api/v4/search?q=${encodeURIComponent(query)}&lang=en&country=ke&max=5&apikey=${env.NEWS_API_KEY}`;
      
      const response = await fetch(url, {
        cf: {
          cacheTtl: 1800, // Cache for 30 minutes
          cacheEverything: true
        }
      });
      
      if (!response.ok) {
        console.warn(`GNews API failed for query "${query}": ${response.status}`);
        continue;
      }
      
      const data = await response.json();
      
      for (const article of data.articles || []) {
        // Fetch full content from the article URL
        const fullContent = await fetchFullArticleContent(article.url);
        
        // Use fallback strategy: scraped content -> GNews content -> description -> title
        const finalContent = fullContent || article.content || article.description || article.title;
        
        // Skip if content is too short (likely just a link)
        if (finalContent.length < 50) {
          console.log(`⏭️ Skipping article with insufficient content: ${article.title}`);
          continue;
        }
        
        articles.push({
          title: article.title,
          slug: generateSlug(article.title),
          content: finalContent,
          summary: article.description || generateSummary(finalContent),
          category: categorizeContent(article.title + ' ' + finalContent),
          source_url: article.url,
          image_url: article.image,
          published_at: new Date(article.publishedAt).toISOString()
        });
      }
      
      // Update last call timestamp
      await env.KV_NAMESPACE.put('last_gnews_call', now.toString());
      
      // Rate limiting - wait between requests
      await new Promise(resolve => setTimeout(resolve, 2000));
      
    } catch (error) {
      console.error(`Error processing GNews query ${query}:`, error);
    }
  }
  
  return articles;
}

/**
 * Enhanced content extraction with multiple fallback strategies
 */
async function fetchFullArticleContent(url: string): Promise<string | null> {
  try {
    const response = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8'
      },
      cf: {
        cacheTtl: 3600, // Cache for 1 hour
        cacheEverything: true
      }
    });
    
    if (!response.ok) return null;
    
    const html = await response.text();
    
    // Strategy 1: Try <article> tag first
    const articleContent = extractMainContent(html);
    if (articleContent && articleContent.length > 200) {
      return articleContent.substring(0, 2000);
    }
    
    // Strategy 2: Try Open Graph or meta description
    const metaDescription = extractMetaDescription(html);
    if (metaDescription && metaDescription.length > 100) {
      return metaDescription;
    }
    
    // Strategy 3: Try main div patterns
    const mainContent = extractMainDivContent(html);
    if (mainContent && mainContent.length > 200) {
      return mainContent.substring(0, 2000);
    }
    
    // Strategy 4: Extract paragraphs
    const paragraphContent = extractParagraphs(html);
    if (paragraphContent && paragraphContent.length > 200) {
      return paragraphContent.substring(0, 2000);
    }
    
    return null;
  } catch (error) {
    console.error('Error fetching full content:', error);
    return null;
  }
}

/**
 * Extract main content using multiple strategies
 */
function extractMainContent(html: string): string | null {
  const patterns = [
    /<article[^>]*>([\s\S]*?)<\/article>/i,
    /<div[^>]*class="[^"]*entry-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*post-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*article-body[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<main[^>]*>([\s\S]*?)<\/main>/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const content = cleanHTML(match[1]);
      if (content.length > 100) {
        return content;
      }
    }
  }
  
  return null;
}

/**
 * Extract meta description as fallback
 */
function extractMetaDescription(html: string): string | null {
  const patterns = [
    /<meta name="description" content="([^"]+)"/i,
    /<meta property="og:description" content="([^"]+)"/i,
    /<meta name="twitter:description" content="([^"]+)"/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match && match[1].length > 50) {
      return match[1];
    }
  }
  
  return null;
}

/**
 * Extract content from main div patterns
 */
function extractMainDivContent(html: string): string | null {
  const patterns = [
    /<div[^>]*class="[^"]*story[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*class="[^"]*news[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*id="[^"]*content[^"]*"[^>]*>([\s\S]*?)<\/div>/i,
    /<div[^>]*id="[^"]*main[^"]*"[^>]*>([\s\S]*?)<\/div>/i
  ];
  
  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) {
      const content = cleanHTML(match[1]);
      if (content.length > 100) {
        return content;
      }
    }
  }
  
  return null;
}

/**
 * Extract paragraphs as last resort
 */
function extractParagraphs(html: string): string | null {
  const paragraphs = html.match(/<p[^>]*>([\s\S]*?)<\/p>/gi) || [];
  
  let content = '';
  for (const p of paragraphs.slice(0, 10)) { // Limit to first 10 paragraphs
    const text = cleanHTML(p);
    if (text.length > 30) { // Only include substantial paragraphs
      content += text + '\n\n';
    }
  }
  
  return content.trim().length > 200 ? content.trim() : null;
}

/**
 * Clean HTML content
 */
function cleanHTML(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, '') // Remove scripts
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, '') // Remove styles
    .replace(/<nav[^>]*>[\s\S]*?<\/nav>/gi, '') // Remove navigation
    .replace(/<header[^>]*>[\s\S]*?<\/header>/gi, '') // Remove headers
    .replace(/<footer[^>]*>[\s\S]*?<\/footer>/gi, '') // Remove footers
    .replace(/<aside[^>]*>[\s\S]*?<\/aside>/gi, '') // Remove sidebars
    .replace(/<div[^>]*class="[^"]*ad[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '') // Remove ads
    .replace(/<div[^>]*class="[^"]*social[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '') // Remove social
    .replace(/<div[^>]*class="[^"]*share[^"]*"[^>]*>[\s\S]*?<\/div>/gi, '') // Remove share buttons
    .replace(/<[^>]*>/g, ' ') // Remove remaining HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

/**
 * Filter out duplicate articles using KV storage and similarity matching
 */
async function filterUniqueArticles(articles: Article[], env: Env): Promise<Article[]> {
  const unique: Article[] = [];
  
  for (const article of articles) {
    // Check if we've already processed this URL
    const urlHash = hashUrl(article.source_url);
    const processed = await env.KV_NAMESPACE.get(`processed:${urlHash}`);
    
    if (!processed) {
      // Check for similar titles to avoid duplicates
      const isDuplicate = unique.some(existing => 
        similarity(existing.title, article.title) > 0.85
      );
      
      if (!isDuplicate) {
        unique.push(article);
      }
    }
  }
  
  return unique;
}

/**
 * Process article with AI for summarization and categorization
 */
async function processWithAI(article: Article, env: Env): Promise<Article> {
  try {
    // Check if we have an OpenRouter API key
    if (!env.OPENROUTER_API_KEY) {
      console.log('🤖 OpenRouter API key not configured, using basic processing');
      return enhanceArticleBasic(article);
    }

    // Validate content length - skip if too short
    if (article.content.length < 50) {
      console.log('⏭️ Skipping AI processing - content too short');
      return enhanceArticleBasic(article);
    }

    const improvedPrompt = `
Classify the following Kenyan news article into one of these categories:

- Politics: Government, elections, policies, international relations, ministers, parliament, president, governors, MPs, legislation, democracy, voting, campaigns
- Business: Finance, economy, trade, markets, companies, startups, funding, banking, investment, revenue, profit, commercial, industry, corporate
- Entertainment: Music, celebrities, movies, culture, lifestyle, arts, festivals, concerts, artists, actors, musicians, shows, performances, cinema, theater
- Sports: Football, athletics, cricket, rugby, sports events, marathons, olympics, FIFA, athletes, championships, tournaments, soccer, running, swimming
- Technology: Gadgets, internet, startups, innovation, telecom, digital, software, mobile, AI, quantum, fintech, blockchain, cyber, data, computing

After classification, rewrite the article for uniqueness, SEO optimization, and Kenyan audience.

Follow this structure:
1. Category on the first line (exact category name)
2. New Title (engaging and SEO-friendly)
3. Body content rewritten (300-500 words)
4. "Why it matters" section
5. "The Big Picture" section (3 bullet points)

Here is the article:
Title: ${article.title}
Content: ${article.content}

IMPORTANT: 
- Only use the exact category names listed above
- If content is unclear, default to "Politics"
- Ensure the rewritten content is substantial and informative
- Focus on Kenyan context and relevance

Respond in this exact format:
{
  "category": "Exact category name from the list",
  "title": "New engaging title",
  "summary": "2-3 sentence compelling summary",
  "enhanced_content": "Full rewritten article with Why it matters and The Big Picture sections"
}
`;

    const response = await fetch('https://openrouter.ai/api/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'HTTP-Referer': 'https://pulsenews.publicvm.com',
        'X-Title': 'Pulse News'
      },
      body: JSON.stringify({
        model: 'meta-llama/llama-3.1-8b-instruct:free',
        messages: [
          {
            role: 'system',
            content: 'You are a professional Kenyan news editor. Classify articles accurately and rewrite them with proper structure, engaging content, and Kenyan context. Always use the exact category names provided.'
          },
          {
            role: 'user',
            content: improvedPrompt
          }
        ],
        max_tokens: 2000,
        temperature: 0.3
      })
    });

    if (response.ok) {
      const data = await response.json();
      const aiResponse = data.choices[0]?.message?.content;
      
      if (aiResponse) {
        try {
          // Try to parse JSON response
          const parsed = JSON.parse(aiResponse);
          
          // Validate category
          const validCategories = ['Politics', 'Business', 'Technology', 'Sports', 'Entertainment'];
          const category = validCategories.includes(parsed.category) ? parsed.category : 'Politics';
          
          // Validate content length
          const enhancedContent = parsed.enhanced_content && parsed.enhanced_content.length > 100 
            ? parsed.enhanced_content 
            : article.content;
          
          return {
            ...article,
            title: parsed.title || article.title,
            summary: parsed.summary || article.summary,
            category: category,
            content: enhancedContent
          };
        } catch (parseError) {
          console.error('Error parsing AI response, trying fallback extraction:', parseError);
          
          // Enhanced fallback parsing
          const categoryMatch = aiResponse.match(/"category":\s*"(Politics|Business|Technology|Sports|Entertainment)"/i);
          const titleMatch = aiResponse.match(/"title":\s*"([^"]+)"/);
          const summaryMatch = aiResponse.match(/"summary":\s*"([^"]+)"/);
          const contentMatch = aiResponse.match(/"enhanced_content":\s*"([^"]+)"/);
          
          return {
            ...article,
            title: titleMatch ? titleMatch[1] : article.title,
            summary: summaryMatch ? summaryMatch[1] : article.summary,
            category: categoryMatch ? categoryMatch[1] : categorizeContentAdvanced(article.title + ' ' + article.content),
            content: contentMatch && contentMatch[1].length > 100 ? contentMatch[1] : article.content
          };
        }
      }
    } else {
      console.warn('AI processing failed:', response.status);
    }
  } catch (error) {
    console.error('Error processing with AI:', error);
  }
  
  // Fallback to basic enhancement
  return enhanceArticleBasic(article);
}

/**
 * Basic article enhancement without AI
 */
function enhanceArticleBasic(article: Article): Article {
  // Enhance the content with basic formatting
  let enhancedContent = article.content;
  
  // Add structure if content is long enough
  if (enhancedContent.length > 200) {
    const sentences = enhancedContent.split(/[.!?]+/).filter(s => s.trim().length > 10);
    
    if (sentences.length > 3) {
      // Create paragraphs
      const paragraphs = [];
      for (let i = 0; i < sentences.length; i += 2) {
        const paragraph = sentences.slice(i, i + 2).join('. ').trim();
        if (paragraph) paragraphs.push(paragraph + '.');
      }
      enhancedContent = paragraphs.join('\n\n');
    }
  }
  
  // Improve category classification
  const improvedCategory = categorizeContentAdvanced(article.title + ' ' + article.content);
  
  // Generate better summary
  const improvedSummary = generateAdvancedSummary(article.content);
  
  return {
    ...article,
    content: enhancedContent,
    category: improvedCategory,
    summary: improvedSummary
  };
}

/**
 * Advanced categorization with better keyword matching
 */
function categorizeContentAdvanced(content: string): string {
  const lowerContent = content.toLowerCase();
  const categoryScores: { [key: string]: number } = {};
  
  // Initialize scores
  for (const category of Object.keys(CATEGORY_KEYWORDS)) {
    categoryScores[category] = 0;
  }
  
  // Score based on keyword matches with weights
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    for (const keyword of keywords) {
      const regex = new RegExp(`\\b${keyword}\\b`, 'gi');
      const matches = (lowerContent.match(regex) || []).length;
      
      // Weight keywords differently
      let weight = 1;
      if (keyword.length > 8) weight = 2; // Longer, more specific keywords get higher weight
      if (['president', 'minister', 'parliament', 'government'].includes(keyword)) weight = 3;
      if (['business', 'economy', 'financial', 'investment'].includes(keyword)) weight = 3;
      if (['technology', 'digital', 'innovation', 'tech'].includes(keyword)) weight = 3;
      
      categoryScores[category] += matches * weight;
    }
  }
  
  // Find category with highest score
  let bestCategory = 'Politics';
  let maxScore = 0;
  
  for (const [category, score] of Object.entries(categoryScores)) {
    if (score > maxScore) {
      maxScore = score;
      bestCategory = category;
    }
  }
  
  return bestCategory;
}

/**
 * Generate advanced summary
 */
function generateAdvancedSummary(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  
  if (sentences.length === 0) return content.substring(0, 200) + '...';
  
  // Take first sentence and most informative middle sentence
  let summary = sentences[0].trim();
  
  if (sentences.length > 2) {
    // Find sentence with most important keywords
    let bestSentence = '';
    let maxKeywords = 0;
    
    const importantWords = ['said', 'announced', 'revealed', 'confirmed', 'reported', 'according', 'will', 'plans', 'expected'];
    
    for (let i = 1; i < sentences.length - 1; i++) {
      const sentence = sentences[i].toLowerCase();
      const keywordCount = importantWords.filter(word => sentence.includes(word)).length;
      
      if (keywordCount > maxKeywords) {
        maxKeywords = keywordCount;
        bestSentence = sentences[i].trim();
      }
    }
    
    if (bestSentence) {
      summary += '. ' + bestSentence;
    } else if (sentences.length > 1) {
      summary += '. ' + sentences[1].trim();
    }
  }
  
  return summary + '.';
}

/**
 * Save processed article to Supabase database
 */
async function saveToSupabase(article: Article, env: Env): Promise<boolean> {
  try {
    const response = await fetch(`${env.SUPABASE_URL}/rest/v1/articles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        'apikey': env.SUPABASE_SERVICE_KEY,
        'Content-Type': 'application/json',
        'Prefer': 'return=minimal'
      },
      body: JSON.stringify({
        title: article.title,
        slug: article.slug,
        content: article.content,
        summary: article.summary,
        category: article.category,
        source_url: article.source_url,
        image_url: article.image_url,
        published_at: article.published_at,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      })
    });

    if (response.ok) {
      console.log(`✅ Saved article: ${article.title}`);
      return true;
    } else {
      const error = await response.text();
      console.error(`❌ Failed to save article: ${error}`);
      return false;
    }
  } catch (error) {
    console.error('Error saving to Supabase:', error);
    return false;
  }
}

/**
 * Get last processed timestamp for date filtering
 */
async function getLastProcessedTimestamp(kv: KVNamespace): Promise<number> {
  try {
    const timestamp = await kv.get('last_processed_timestamp');
    if (timestamp) {
      return parseInt(timestamp);
    }
    
    // Default to 24 hours ago if no timestamp exists
    return Date.now() - (24 * 60 * 60 * 1000);
  } catch (error) {
    console.error('Error getting last processed timestamp:', error);
    return Date.now() - (24 * 60 * 60 * 1000);
  }
}

/**
 * Update last processed timestamp
 */
async function updateLastProcessedTimestamp(kv: KVNamespace, timestamp: number): Promise<void> {
  try {
    await kv.put('last_processed_timestamp', timestamp.toString());
  } catch (error) {
    console.error('Error updating last processed timestamp:', error);
  }
}

/**
 * Update processing statistics in KV storage
 */
async function updateProcessingStats(stats: ProcessingStats, env: Env): Promise<void> {
  try {
    await env.KV_NAMESPACE.put('processing_stats', JSON.stringify(stats));
    await env.KV_NAMESPACE.put('last_run', new Date().toISOString());
  } catch (error) {
    console.error('Error updating stats:', error);
  }
}

// Utility functions
function extractXMLContent(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim() : '';
}

function extractImageFromContent(xml: string): string | undefined {
  // Try to extract image from various RSS formats
  const patterns = [
    /<media:content[^>]*url="([^"]*)"[^>]*>/i,
    /<enclosure[^>]*url="([^"]*)"[^>]*type="image/i,
    /<img[^>]*src="([^"]*)"[^>]*>/i
  ];
  
  for (const pattern of patterns) {
    const match = xml.match(pattern);
    if (match) return match[1];
  }
  
  return undefined;
}

function cleanText(text: string): string {
  return text
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/&[^;]+;/g, ' ') // Remove HTML entities
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .substring(0, 100)
    .trim();
}

function generateSummary(content: string): string {
  const sentences = content.split(/[.!?]+/).filter(s => s.trim().length > 20);
  return sentences.slice(0, 2).join('. ').trim() + (sentences.length > 2 ? '.' : '');
}

function categorizeContent(content: string): string {
  const lowerContent = content.toLowerCase();
  let bestCategory = 'Politics';
  let maxMatches = 0;
  
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    const matches = keywords.filter(keyword => lowerContent.includes(keyword)).length;
    if (matches > maxMatches) {
      maxMatches = matches;
      bestCategory = category;
    }
  }
  
  return bestCategory;
}

function parseDate(dateString: string): string {
  try {
    return new Date(dateString).toISOString();
  } catch {
    return new Date().toISOString();
  }
}

function hashUrl(url: string): string {
  // Simple hash function for URL
  let hash = 0;
  for (let i = 0; i < url.length; i++) {
    const char = url.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  return Math.abs(hash).toString(36);
}

function similarity(str1: string, str2: string): number {
  const longer = str1.length > str2.length ? str1 : str2;
  const shorter = str1.length > str2.length ? str2 : str1;
  
  if (longer.length === 0) return 1.0;
  
  const editDistance = levenshteinDistance(longer, shorter);
  return (longer.length - editDistance) / longer.length;
}

function levenshteinDistance(str1: string, str2: string): number {
  const matrix = [];
  
  for (let i = 0; i <= str2.length; i++) {
    matrix[i] = [i];
  }
  
  for (let j = 0; j <= str1.length; j++) {
    matrix[0][j] = j;
  }
  
  for (let i = 1; i <= str2.length; i++) {
    for (let j = 1; j <= str1.length; j++) {
      if (str2.charAt(i - 1) === str1.charAt(j - 1)) {
        matrix[i][j] = matrix[i - 1][j - 1];
      } else {
        matrix[i][j] = Math.min(
          matrix[i - 1][j - 1] + 1,
          matrix[i][j - 1] + 1,
          matrix[i - 1][j] + 1
        );
      }
    }
  }
  
  return matrix[str2.length][str1.length];
}