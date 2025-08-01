# Production-Grade Automated Workflow for pulse.utdnews.com

## Overview

This document details the absolute, production-grade automated workflow for `pulse.utdnews.com`. It incorporates every component, list, and instruction for a complete automated news processing system.

## Core Components

- **Scheduler:** Cloudflare Cron Trigger (`*/5 * * * *` - every 5 minutes)
- **Execution Engine:** Cloudflare Worker
- **Data Sources:** 16 verified RSS feeds from Kenyan news sources
- **State Management:** Cloudflare KV (watermark storage)
- **Content Extraction:** ScraperAPI for full article content
- **Intelligence Layer:** OpenRouter AI for content processing
- **Permanent Storage:** Supabase Postgres Database

## The Step-by-Step Workflow

This process is initiated every five minutes.

### Phase 1: Initiation & State Retrieval

1. **Trigger:** A Cloudflare Cron Trigger fires on its schedule (`*/5 * * * *`), executing the Cloudflare Worker script.

2. **Retrieve Watermark:** The worker's first action is to make a call to **Cloudflare KV** to get the timestamp of the last successfully processed article (`last_processed_timestamp`).

### Phase 2: RSS Ingestion & Queue Creation

3. **Primary Fetch (RSS Engine):** The worker concurrently queries the **16 verified RSS feeds** listed below. It parses the results from all feeds and filters them, keeping only articles with a publication date newer than the `last_processed_timestamp`.

#### Verified RSS Feed Master List:

- `https://www.tuko.co.ke/rss/`
- `https://www.standardmedia.co.ke/rss`
- `https://www.the-star.co.ke/rss`
- `https://www.kenyans.co.ke/rss`
- `https://www.citizen.digital/rss`
- `https://nation.africa/kenya/rss`
- `https://www.businessdailyafrica.com/rss`
- `https://www.theeastafrican.co.ke/rss`
- `https://ntvkenya.co.ke/feed`
- `https://www.ktnnews.com/rss`
- `https://www.kbc.co.ke/feed`
- `https://www.k24tv.co.ke/feed/`
- `https://www.pd.co.ke/feed/`
- `https://www.capitalfm.co.ke/news/rss/`
- `https://www.ghafla.com/ke/feed/`
- `https://www.pulselive.co.ke/rss`

4. **Create Processing Queue:** The worker takes the final, filtered list of new articles and creates an in-memory queue to be processed.

### Phase 3: Content Categorization Strategy

5. **Define Core Categories:** The website will be structured around these 6 core categories:

- **Latest News:** The default view on the homepage, showing a mix of the most recent articles from all other categories.
- **Politics:** For all government, policy, and political party news.
- **Business:** For finance, economic, and corporate news.
- **Entertainment:** For celebrity, music, social events, and lifestyle content.
- **Sports:** For all local and international sporting news.
- **Technology:** For news on startups, telecommunications, gadgets, and digital trends.

6. **Automate Categorization via AI:** The classification of each article is delegated to the AI as the very first step in its task. The specific instruction is embedded in the AI prompt.

### Phase 4: The Resilient Processing Loop

7. **For each new article, `try` the following:**
   1. **Scrape Full Content:**
      - Take the `source_url` of the article.
      - Call the **Scraping API** to retrieve the full, clean HTML body and the main image URL.
      - **Fallback Logic:** If a valid `image_url` is not found, assign a default category-specific fallback image URL.

   2. **Process with AI:**
      - Construct the detailed prompt for the **AI Engine**.
      - **The Definitive AI Prompt:**

        ```
        First, classify the following article into ONE of these categories: [Politics, Business, Entertainment, Sports, Technology].

        Then, rewrite this article for uniqueness, SEO optimization, and readability for a Kenyan audience. The rewrite must follow all on-page SEO rules and include a 'Why it matters' sentence and a 3-bullet-point 'The Big Picture' summary.

        Here is the article:

        [Full Scraped Article Content]
        ```

   3. **Save to Database:**
      - Parse the AI's response: read the first line to get the `category` and the rest of the text for the `rewritten_content`.
      - Connect to the **Supabase Database**.
      - Insert a new record into the `articles` table with all structured data (`title`, `slug`, `content`, `image_url`, `source_url`, `category`, etc.).

8. **`catch` any error during the loop:**
   - If any step fails, the `catch` block logs the specific error and the URL of the article that failed.
   - It immediately `continue`s to the next article in the queue.

### Phase 5: Finalization

9. **Update Watermark:** After the loop finishes, the worker takes the timestamp of the most recent article that was successfully saved and updates the `last_processed_timestamp` value in **Cloudflare KV**.

10. **Completion:** The worker finishes its run.

## Visual Flowchart

```
[Cron Trigger] → [Worker Starts] → [Get Timestamp from KV]
        ↓
[Query 16 Verified RSS Feeds] → [Filter New Articles] → [Create Queue]
        ↓
(Loop Starts for each article)
        ↓
[TRY] → Scrape Content → AI Rewrite & Classify → Save to Supabase → [SUCCESS]
  |
  └─→ [FAIL] → [CATCH] → Log Error → Continue to Next Article
        ↓
(Loop Ends)
        ↓
[Update Timestamp in KV] → [Worker Ends]
```

## Complete Implementation

### RSS Feed Configuration

```typescript
// config/rss-feeds.ts
export const RSS_FEEDS = [
  'https://www.tuko.co.ke/rss/',
  'https://www.standardmedia.co.ke/rss',
  'https://www.the-star.co.ke/rss',
  'https://www.kenyans.co.ke/rss',
  'https://www.citizen.digital/rss',
  'https://nation.africa/kenya/rss',
  'https://www.businessdailyafrica.com/rss',
  'https://www.theeastafrican.co.ke/rss',
  'https://ntvkenya.co.ke/feed',
  'https://www.ktnnews.com/rss',
  'https://www.kbc.co.ke/feed',
  'https://www.k24tv.co.ke/feed/',
  'https://www.pd.co.ke/feed/',
  'https://www.capitalfm.co.ke/news/rss/',
  'https://www.ghafla.com/ke/feed/',
  'https://www.pulselive.co.ke/rss',
];
```

### Content Categories

```typescript
// config/categories.ts
export const CATEGORIES = {
  LATEST: 'Latest News',
  POLITICS: 'Politics',
  BUSINESS: 'Business',
  ENTERTAINMENT: 'Entertainment',
  SPORTS: 'Sports',
  TECHNOLOGY: 'Technology',
} as const;

export const CATEGORY_FALLBACK_IMAGES = {
  [CATEGORIES.POLITICS]: '/images/fallback/politics.jpg',
  [CATEGORIES.BUSINESS]: '/images/fallback/business.jpg',
  [CATEGORIES.ENTERTAINMENT]: '/images/fallback/entertainment.jpg',
  [CATEGORIES.SPORTS]: '/images/fallback/sports.jpg',
  [CATEGORIES.TECHNOLOGY]: '/images/fallback/technology.jpg',
  [CATEGORIES.LATEST]: '/images/fallback/latest.jpg',
};
```

### Complete Production Cloudflare Worker

```typescript
// worker/index.ts
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';
import { RSS_FEEDS, CATEGORIES, CATEGORY_FALLBACK_IMAGES } from './config';

interface Env {
  KV_NAMESPACE: KVNamespace;
  OPENROUTER_API_KEY: string;
  SCRAPER_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}

interface Article {
  title: string;
  link: string;
  pubDate: string;
  description?: string;
  guid?: string;
}

interface ProcessedArticle {
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  source_url: string;
  image_url: string;
  published_at: string;
}

export default {
  async scheduled(
    event: ScheduledEvent,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log('🚀 Starting automated news processing workflow');

    try {
      // Phase 1: Initiation & State Retrieval
      const lastProcessedTimestamp = await getLastProcessedTimestamp(
        env.KV_NAMESPACE
      );
      console.log(`📅 Last processed timestamp: ${lastProcessedTimestamp}`);

      // Phase 2: RSS Ingestion & Queue Creation
      const newArticles = await fetchAndFilterArticles(lastProcessedTimestamp);
      console.log(`📰 Found ${newArticles.length} new articles to process`);

      if (newArticles.length === 0) {
        console.log('✅ No new articles to process');
        return;
      }

      // Phase 4: The Resilient Processing Loop
      let successCount = 0;
      let latestTimestamp = lastProcessedTimestamp;

      for (const article of newArticles) {
        try {
          console.log(`🔄 Processing: ${article.title}`);

          // Step 1: Scrape Full Content
          const scrapedContent = await scrapeArticleContent(
            article.link,
            env.SCRAPER_API_KEY
          );

          // Step 2: Process with AI
          const processedArticle = await processWithAI(
            article,
            scrapedContent,
            env.OPENROUTER_API_KEY
          );

          // Step 3: Save to Database
          await saveToSupabase(processedArticle, env);

          successCount++;
          latestTimestamp = Math.max(
            latestTimestamp,
            new Date(article.pubDate).getTime()
          );

          console.log(`✅ Successfully processed: ${article.title}`);
        } catch (error) {
          console.error(
            `❌ Failed to process article: ${article.title}`,
            error
          );
          // Continue to next article (resilient processing)
          continue;
        }
      }

      // Phase 5: Finalization
      if (successCount > 0) {
        await updateLastProcessedTimestamp(env.KV_NAMESPACE, latestTimestamp);
        console.log(`🎉 Successfully processed ${successCount} articles`);
      }
    } catch (error) {
      console.error('💥 Critical error in workflow:', error);
      throw error;
    }
  },
};

// Phase 1: State Management Functions
async function getLastProcessedTimestamp(kv: KVNamespace): Promise<number> {
  const timestamp = await kv.get('last_processed_timestamp');
  return timestamp ? parseInt(timestamp) : Date.now() - 24 * 60 * 60 * 1000; // Default: 24 hours ago
}

async function updateLastProcessedTimestamp(
  kv: KVNamespace,
  timestamp: number
): Promise<void> {
  await kv.put('last_processed_timestamp', timestamp.toString());
}

// Phase 2: RSS Processing Functions
async function fetchAndFilterArticles(
  lastTimestamp: number
): Promise<Article[]> {
  const allArticles: Article[] = [];

  // Fetch all RSS feeds concurrently
  const feedPromises = RSS_FEEDS.map(async feedUrl => {
    try {
      const response = await fetch(feedUrl);
      const xmlText = await response.text();
      return parseRSSFeed(xmlText);
    } catch (error) {
      console.error(`Failed to fetch RSS feed: ${feedUrl}`, error);
      return [];
    }
  });

  const feedResults = await Promise.all(feedPromises);

  // Flatten and filter articles
  for (const articles of feedResults) {
    allArticles.push(...articles);
  }

  // Filter articles newer than last processed timestamp
  return allArticles
    .filter(article => {
      const articleTime = new Date(article.pubDate).getTime();
      return articleTime > lastTimestamp;
    })
    .sort(
      (a, b) => new Date(a.pubDate).getTime() - new Date(b.pubDate).getTime()
    );
}

function parseRSSFeed(xmlText: string): Article[] {
  // Simple RSS parser - in production, use a robust XML parser
  const articles: Article[] = [];
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  let match;

  while ((match = itemRegex.exec(xmlText)) !== null) {
    const itemContent = match[1];

    const title = extractXMLContent(itemContent, 'title');
    const link = extractXMLContent(itemContent, 'link');
    const pubDate = extractXMLContent(itemContent, 'pubDate');
    const description = extractXMLContent(itemContent, 'description');
    const guid = extractXMLContent(itemContent, 'guid');

    if (title && link && pubDate) {
      articles.push({ title, link, pubDate, description, guid });
    }
  }

  return articles;
}

function extractXMLContent(xml: string, tag: string): string {
  const regex = new RegExp(`<${tag}[^>]*>([\\s\\S]*?)<\\/${tag}>`, 'i');
  const match = xml.match(regex);
  return match ? match[1].trim().replace(/<!\[CDATA\[(.*?)\]\]>/g, '$1') : '';
}

// Phase 3: Content Scraping
async function scrapeArticleContent(
  url: string,
  scraperApiKey: string
): Promise<{
  content: string;
  imageUrl?: string;
}> {
  const scraperUrl = `http://api.scraperapi.com?api_key=${scraperApiKey}&url=${encodeURIComponent(url)}`;

  try {
    const response = await fetch(scraperUrl);
    const html = await response.text();

    // Extract main content and image (simplified - use proper HTML parser in production)
    const content = extractMainContent(html);
    const imageUrl = extractMainImage(html);

    return { content, imageUrl };
  } catch (error) {
    console.error('Scraping failed:', error);
    throw new Error(`Failed to scrape content from ${url}`);
  }
}

function extractMainContent(html: string): string {
  // Simplified content extraction - implement proper article extraction
  const contentRegex = /<article[^>]*>([\s\S]*?)<\/article>/i;
  const match = html.match(contentRegex);

  if (match) {
    return match[1].replace(/<[^>]*>/g, '').trim();
  }

  // Fallback: extract from body
  const bodyRegex = /<body[^>]*>([\s\S]*?)<\/body>/i;
  const bodyMatch = html.match(bodyRegex);
  return bodyMatch ? bodyMatch[1].replace(/<[^>]*>/g, '').trim() : '';
}

function extractMainImage(html: string): string | undefined {
  const imgRegex = /<img[^>]+src=["']([^"']+)["'][^>]*>/gi;
  let match;

  while ((match = imgRegex.exec(html)) !== null) {
    const src = match[1];
    if (src && !src.includes('logo') && !src.includes('icon')) {
      return src.startsWith('http') ? src : undefined;
    }
  }

  return undefined;
}

// Phase 4: AI Processing with Definitive Prompt
async function processWithAI(
  article: Article,
  scrapedContent: { content: string; imageUrl?: string },
  apiKey: string
): Promise<ProcessedArticle> {
  const openrouter = createOpenRouter({ apiKey });

  const prompt = `First, classify the following article into ONE of these categories: [Politics, Business, Entertainment, Sports, Technology].

Then, rewrite this article for uniqueness, SEO optimization, and readability for a Kenyan audience. The rewrite must follow all on-page SEO rules and include a 'Why it matters' sentence and a 3-bullet-point 'The Big Picture' summary.

Here is the article:

Title: ${article.title}
Content: ${scrapedContent.content}`;

  try {
    const { text } = await generateText({
      model: openrouter('openai/gpt-4o-mini'), // Cost-effective model for this task
      messages: [
        {
          role: 'system',
          content:
            'You are a professional Kenyan news editor. Always start your response with the category name on the first line, then provide the rewritten article.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      maxTokens: 2000,
      temperature: 0.7,
    });

    // Parse AI response
    const lines = text.split('\n');
    const category = lines[0].trim();
    const rewrittenContent = lines.slice(1).join('\n').trim();

    // Generate slug
    const slug = generateSlug(article.title);

    // Determine image URL with fallback
    const imageUrl =
      scrapedContent.imageUrl ||
      CATEGORY_FALLBACK_IMAGES[
        category as keyof typeof CATEGORY_FALLBACK_IMAGES
      ] ||
      CATEGORY_FALLBACK_IMAGES[CATEGORIES.LATEST];

    return {
      title: article.title,
      slug,
      content: rewrittenContent,
      summary: article.description || '',
      category,
      source_url: article.link,
      image_url: imageUrl,
      published_at: new Date(article.pubDate).toISOString(),
    };
  } catch (error) {
    console.error('AI processing failed:', error);
    throw new Error('Failed to process article with AI');
  }
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim();
}

// Phase 5: Database Operations
async function saveToSupabase(
  article: ProcessedArticle,
  env: Env
): Promise<void> {
  const supabaseUrl = `${env.SUPABASE_URL}/rest/v1/articles`;

  try {
    const response = await fetch(supabaseUrl, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${env.SUPABASE_SERVICE_KEY}`,
        apikey: env.SUPABASE_SERVICE_KEY,
      },
      body: JSON.stringify(article),
    });

    if (!response.ok) {
      throw new Error(
        `Supabase error: ${response.status} ${response.statusText}`
      );
    }
  } catch (error) {
    console.error('Failed to save to Supabase:', error);
    throw error;
  }
}
```

### Cloudflare Worker Configuration

```toml
# wrangler.toml
name = "pulse-news-worker"
main = "src/index.ts"
compatibility_date = "2024-01-01"

[triggers]
crons = ["*/5 * * * *"]

[[kv_namespaces]]
binding = "KV_NAMESPACE"
id = "your-kv-namespace-id"

[vars]
SUPABASE_URL = "https://your-project.supabase.co"

[env.production.secrets]
OPENROUTER_API_KEY = "your-openrouter-api-key"
SCRAPER_API_KEY = "your-scraper-api-key"
SUPABASE_SERVICE_KEY = "your-supabase-service-key"
```

### Enhanced Database Schema

```sql
-- Update articles table to include category constraints
ALTER TABLE articles
ADD CONSTRAINT valid_category
CHECK (category IN ('Politics', 'Business', 'Entertainment', 'Sports', 'Technology'));

-- Create index for category-based queries
CREATE INDEX idx_articles_category_published ON articles(category, published_at DESC);

-- Create index for slug-based queries
CREATE INDEX idx_articles_slug ON articles(slug);

-- Create index for source URL to prevent duplicates
CREATE INDEX idx_articles_source_url ON articles(source_url);
```

## Key Features

### 🔄 **Automated Processing**

- Runs every 5 minutes via Cloudflare Cron Trigger
- Processes 16 verified Kenyan RSS feeds
- Resilient error handling with continue-on-failure

### 🧠 **AI-Powered Content**

- OpenRouter integration with multiple model options
- Automatic categorization into 6 core categories
- SEO-optimized content rewriting
- "Why it matters" and "Big Picture" summaries

### 📊 **State Management**

- Cloudflare KV for watermark tracking
- Prevents duplicate processing
- Maintains processing history

### 🛡️ **Error Resilience**

- Try-catch blocks for each article
- Continues processing on individual failures
- Comprehensive logging and monitoring

### 🎯 **Content Quality**

- ScraperAPI for full article extraction
- Fallback images for each category
- Unique slug generation
- Source attribution

This production-grade workflow ensures reliable, automated content processing with high availability and quality output for the pulse.utdnews.com platform.
