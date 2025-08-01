# Final Implementation Plan: pulse.utdnews.com

## Complete Fullstack Development Roadmap & Verified Best Practices

### Overview

This document provides a comprehensive, step-by-step implementation plan for building the automated news platform `pulse.utdnews.com`. Each phase includes development tasks, testing requirements, security measures, and best practices, incorporating verified insights from Context7 research.

**GitHub Repository:** https://github.com/ThomasKairu/utd.git

---

## **🔍 Verified Technologies & Best Practices**

### **1. Cloudflare Workers - Production Ready ✅**

**Key Findings from Context7:**

- **Cron Triggers:** `*/5 * * * *` syntax is correct and well-documented
- **Scheduled Handler:** Use `async scheduled(controller, env, ctx)` format
- **State Management:** Cloudflare KV is optimal for watermark storage
- **Error Handling:** Use `ctx.waitUntil()` for async operations
- **Testing:** Local testing with `wrangler dev --test-scheduled`

**Updated Worker Configuration:**

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
preview_id = "your-preview-kv-namespace-id"

[vars]
SUPABASE_URL = "https://your-project.supabase.co"

[env.production.secrets]
OPENROUTER_API_KEY = "your-openrouter-api-key"
SCRAPER_API_KEY = "your-scraper-api-key"
SUPABASE_SERVICE_KEY = "your-supabase-service-key"
```

### **2. RSS Parsing - Verified Best Practices ✅**

**Key Findings:**

- Use native `DOMParser()` for XML parsing in Cloudflare Workers
- Handle CDATA sections properly
- Implement robust error handling for malformed feeds
- Use concurrent fetching for multiple RSS feeds

### **3. ScraperAPI Integration - Verified Implementation ✅**

**Key Findings:**

- ScraperAPI uses simple HTTP GET requests with API key
- Supports custom headers and geotargeting
- Has built-in proxy rotation and CAPTCHA handling
- 2MB limit per request

### **4. OpenRouter Integration - Verified Best Practices ✅**

**Key Findings:**

- OpenRouter provides access to 100+ AI models through unified API
- Supports model fallbacks and automatic routing
- Cost optimization through model selection
- Built-in error handling and rate limiting

### **5. Cloudflare KV - Verified State Management ✅**

**Key Findings:**

- KV operations are eventually consistent
- Use simple key-value pairs for watermarks
- Built-in TTL support for cache management
- Global edge distribution

---

## Phase 1: Project Foundation & Environment Setup

### Step 1.1: Development Environment Setup

**Objective:** Establish a clean, secure development environment

**Tasks:**

- [ ] Initialize Git repository with proper `.gitignore`
- [ ] Set up Node.js environment (v18+ recommended)
- [ ] Create Next.js 15 project with TypeScript using latest template
- [ ] Configure ESLint and Prettier for code quality
- [ ] Set up environment variables management (.env.local)
- [ ] Install core dependencies with latest versions

**Updated Dependencies (Latest Versions):**

```bash
npm install @supabase/supabase-js@latest @supabase/ssr@latest
npm install @openrouter/ai-sdk-provider@latest ai@latest
npm install @types/node@latest typescript@latest
```

**Security Considerations:**

- Use `.env.local` for sensitive data (never commit)
- Implement proper API key rotation schedule
- Set up proper file permissions
- Configure CORS policies appropriately

**Testing:**

- Verify Node.js and npm versions (Node 18+)
- Test Next.js 15 development server startup
- Validate linting and formatting rules
- Test TypeScript compilation

**Deliverables:**

- Working Next.js 15 development environment
- Configured code quality tools
- Basic project structure with latest dependencies

---

### Step 1.2: Project Structure & Configuration

**Objective:** Create scalable project architecture

**Tasks:**

- [ ] Set up folder structure following Next.js best practices
- [ ] Configure `next.config.js` for static export
- [ ] Create TypeScript configuration
- [ ] Set up component and utility folders
- [ ] Configure path aliases for clean imports

**File Structure:**

```
/
├── components/
│   ├── common/
│   ├── layout/
│   └── ui/
├── pages/
├── styles/
├── utils/
├── types/
├── public/
└── lib/
```

**Testing:**

- Verify TypeScript compilation
- Test import paths and aliases
- Validate Next.js configuration

**Deliverables:**

- Organized project structure
- Working TypeScript configuration
- Configured Next.js for static export

---

## Phase 2: Design System Implementation

### Step 2.1: Core Design System

**Objective:** Implement the defined color palette and typography

**Tasks:**

- [ ] Set up CSS custom properties for color palette
- [ ] Configure Google Fonts (Poppins, Inter)
- [ ] Create base typography styles
- [ ] Implement responsive breakpoints
- [ ] Set up CSS modules or styled-components

**Color Palette Implementation:**

```css
:root {
  --color-background: #f8f5f2;
  --color-primary: #0d47a1;
  --color-accent: #e65100;
  --color-text-primary: #1a1a1a;
  --color-text-secondary: #aab1b7;
}
```

**Testing:**

- Visual regression testing for typography
- Cross-browser font rendering
- Responsive design validation

**Deliverables:**

- Complete design system CSS
- Typography components
- Color palette implementation

---

### Step 2.2: UI Component Library

**Objective:** Build reusable, accessible UI components

**Tasks:**

- [ ] Create Button component with variants
- [ ] Build Card component for news articles
- [ ] Implement Header/Navigation component
- [ ] Create Footer component
- [ ] Build Loading and Error state components
- [ ] Implement responsive Grid system

**Best Practices:**

- Follow accessibility guidelines (WCAG 2.1)
- Use semantic HTML elements
- Implement proper ARIA attributes
- Ensure keyboard navigation support

**Testing:**

- Unit tests for each component
- Accessibility testing with screen readers
- Visual testing across devices
- Component interaction testing

**Deliverables:**

- Complete UI component library
- Storybook documentation (optional)
- Accessibility-compliant components

---

## Phase 3: Database & Backend Setup

### Step 3.1: Supabase Database Configuration

**Objective:** Set up secure, scalable database infrastructure

**Tasks:**

- [ ] Create Supabase project
- [ ] Design database schema for articles
- [ ] Set up Row Level Security (RLS) policies
- [ ] Create database indexes for performance
- [ ] Configure backup and recovery

**Database Schema:**

```sql
-- Articles table
CREATE TABLE articles (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category VARCHAR(100) NOT NULL,
  source_url TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

**Security Measures:**

- Enable RLS on all tables
- Create service role with minimal permissions
- Set up API key rotation schedule
- Configure CORS policies

**Testing:**

- Database connection testing
- CRUD operations validation
- Performance testing with sample data
- Security policy verification

**Deliverables:**

- Configured Supabase database
- Secure database schema
- Performance-optimized indexes

---

### Step 3.2: API Integration Layer

**Objective:** Create secure, type-safe database interactions

**Tasks:**

- [ ] Set up Supabase SSR client configuration for Next.js 15
- [ ] Create TypeScript types for database entities
- [ ] Implement data access layer (DAL) with proper client selection
- [ ] Add error handling and logging
- [ ] Create data validation schemas

**Updated Supabase Client Configuration:**

```typescript
// utils/supabase/server.ts (for Server Components)
import { createServerClient } from '@supabase/ssr';
import { cookies } from 'next/headers';

export async function createClient() {
  const cookieStore = await cookies();

  return createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return cookieStore.getAll();
        },
        setAll(cookiesToSet) {
          try {
            cookiesToSet.forEach(({ name, value, options }) =>
              cookieStore.set(name, value, options)
            );
          } catch {
            // The `setAll` method was called from a Server Component.
            // This can be ignored if you have middleware refreshing
            // user sessions.
          }
        },
      },
    }
  );
}

// utils/supabase/client.ts (for Client Components)
import { createBrowserClient } from '@supabase/ssr';

export function createClient() {
  return createBrowserClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// types/database.ts
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: string;
  source_url?: string;
  image_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
}

// lib/api/articles.ts
import { createClient } from '@/utils/supabase/server';

export const articlesApi = {
  getAll: async (): Promise<Article[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  getBySlug: async (slug: string): Promise<Article | null> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (error) return null;
    return data;
  },

  getByCategory: async (category: string): Promise<Article[]> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('articles')
      .select('*')
      .eq('category', category)
      .order('published_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  create: async (article: Partial<Article>): Promise<Article> => {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('articles')
      .insert(article)
      .select()
      .single();

    if (error) throw error;
    return data;
  },
};
```

**Client Selection Guide:**

- **Server Components/Actions/Route Handlers:** Use `utils/supabase/server.ts`
- **Client Components:** Use `utils/supabase/client.ts`
- **Static Generation (getStaticProps):** Use dedicated static client

**Testing:**

- Integration tests for all API methods
- Error handling validation
- Type safety verification
- Performance benchmarking
- SSR/Client hydration testing

**Deliverables:**

- Type-safe API layer with proper SSR support
- Comprehensive error handling
- Validated data access methods
- Next.js 15 compatible Supabase integration

---

## Phase 4: Frontend Development

### Step 4.1: Core Pages Implementation

**Objective:** Build main application pages with SEO optimization

**Tasks:**

- [ ] Create Homepage with hero section and article grid
- [ ] Build Article detail page with structured data
- [ ] Implement Category pages with infinite scroll
- [ ] Create About and Editorial Policy pages
- [ ] Add 404 and error pages

**SEO Implementation:**

- [ ] Add Next.js Head component for meta tags
- [ ] Implement structured data (JSON-LD)
- [ ] Create dynamic sitemap generation
- [ ] Add Open Graph and Twitter Card meta tags

**Homepage Features:**

- Hero section with featured article
- "Trending Now" section
- Category-based article grid
- Responsive design implementation

**Testing:**

- Page load performance testing
- SEO validation with tools
- Cross-browser compatibility
- Mobile responsiveness testing

**Deliverables:**

- Complete page implementations
- SEO-optimized meta tags
- Responsive design across devices

---

### Step 4.2: Advanced Features Implementation

**Objective:** Add engagement and performance features

**Tasks:**

- [ ] Implement infinite scroll for category pages
- [ ] Add search functionality
- [ ] Create article sharing features
- [ ] Implement reading progress indicator
- [ ] Add dark/light mode toggle
- [ ] Create newsletter signup component

**Performance Optimizations:**

- [ ] Implement image lazy loading
- [ ] Add service worker for caching
- [ ] Optimize bundle size with code splitting
- [ ] Implement prefetching for critical resources

**Testing:**

- Performance testing with Lighthouse
- User interaction testing
- Accessibility compliance verification
- Cross-device functionality testing

**Deliverables:**

- Enhanced user experience features
- Performance-optimized application
- Accessibility-compliant interface

---

## Phase 5: Automation & Content Management

### Step 5.1: Cloudflare Worker Development

**Objective:** Create automated content fetching and processing system

**Best Practice Worker Implementation:**

```typescript
// worker/index.ts
interface Env {
  KV_NAMESPACE: KVNamespace;
  OPENROUTER_API_KEY: string;
  SCRAPER_API_KEY: string;
  SUPABASE_URL: string;
  SUPABASE_SERVICE_KEY: string;
}

export default {
  async scheduled(
    controller: ScheduledController,
    env: Env,
    ctx: ExecutionContext
  ): Promise<void> {
    console.log('🚀 Starting automated news processing workflow');

    // Use ctx.waitUntil for async operations
    ctx.waitUntil(processNewsWorkflow(env, controller));
  },
};

async function processNewsWorkflow(env: Env, controller: ScheduledController) {
  try {
    // Phase 1: Get watermark from KV
    const lastTimestamp = await getLastProcessedTimestamp(env.KV_NAMESPACE);

    // Phase 2: Process RSS feeds
    const newArticles = await fetchAndFilterArticles(lastTimestamp);

    // Phase 3: Process each article with resilient error handling
    let successCount = 0;
    let latestTimestamp = lastTimestamp;

    for (const article of newArticles) {
      try {
        await processArticle(article, env);
        successCount++;
        latestTimestamp = Math.max(
          latestTimestamp,
          new Date(article.pubDate).getTime()
        );
      } catch (error) {
        console.error(`❌ Failed to process: ${article.title}`, error);
        // Continue processing other articles
        continue;
      }
    }

    // Phase 4: Update watermark
    if (successCount > 0) {
      await env.KV_NAMESPACE.put(
        'last_processed_timestamp',
        latestTimestamp.toString()
      );
    }

    console.log(`✅ Processed ${successCount} articles successfully`);
  } catch (error) {
    console.error('💥 Critical workflow error:', error);
    throw error;
  }
}
```

**Production RSS Parser:**

```typescript
// utils/rss-parser.ts
export async function fetchAndParseRSS(feedUrl: string): Promise<Article[]> {
  try {
    const response = await fetch(feedUrl, {
      headers: {
        'User-Agent': 'pulse.utdnews.com/1.0 (+https://pulse.utdnews.com)',
        Accept: 'application/rss+xml, application/xml, text/xml',
      },
      cf: {
        cacheTtl: 300, // Cache for 5 minutes
        cacheEverything: true,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    const xmlText = await response.text();
    const parser = new DOMParser();
    const xmlDoc = parser.parseFromString(xmlText, 'text/xml');

    // Check for parsing errors
    const parserError = xmlDoc.querySelector('parsererror');
    if (parserError) {
      throw new Error(`XML parsing error: ${parserError.textContent}`);
    }

    return parseRSSItems(xmlDoc);
  } catch (error) {
    console.error(`Failed to fetch RSS feed: ${feedUrl}`, error);
    return []; // Return empty array to continue processing other feeds
  }
}

function parseRSSItems(xmlDoc: Document): Article[] {
  const items = xmlDoc.querySelectorAll('item');
  const articles: Article[] = [];

  items.forEach(item => {
    try {
      const title = extractTextContent(item, 'title');
      const link = extractTextContent(item, 'link');
      const pubDate = extractTextContent(item, 'pubDate');
      const description = extractTextContent(item, 'description');
      const guid = extractTextContent(item, 'guid');

      if (title && link && pubDate) {
        articles.push({
          title: cleanText(title),
          link: link.trim(),
          pubDate,
          description: description ? cleanText(description) : '',
          guid: guid || link,
        });
      }
    } catch (error) {
      console.warn('Failed to parse RSS item:', error);
      // Continue processing other items
    }
  });

  return articles;
}

function extractTextContent(element: Element, tagName: string): string {
  const node = element.querySelector(tagName);
  if (!node) return '';

  // Handle CDATA sections
  const textContent = node.textContent || '';
  return textContent.replace(/^\s*<!\[CDATA\[(.*?)\]\]>\s*$/s, '$1').trim();
}

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
```

**Production ScraperAPI Implementation:**

```typescript
// utils/scraper.ts
export async function scrapeArticleContent(
  url: string,
  scraperApiKey: string
): Promise<{ content: string; imageUrl?: string }> {
  const scraperUrl = new URL('http://api.scraperapi.com');
  scraperUrl.searchParams.set('api_key', scraperApiKey);
  scraperUrl.searchParams.set('url', url);
  scraperUrl.searchParams.set('render', 'false'); // Faster for news sites
  scraperUrl.searchParams.set('country_code', 'KE'); // Kenya geotargeting

  try {
    const response = await fetch(scraperUrl.toString(), {
      method: 'GET',
      headers: {
        Accept:
          'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.5',
      },
      cf: {
        timeout: 70000, // 70 second timeout as recommended
      },
    });

    if (!response.ok) {
      throw new Error(
        `ScraperAPI error: ${response.status} ${response.statusText}`
      );
    }

    const html = await response.text();

    // Extract content and image
    const content = extractMainContent(html);
    const imageUrl = extractMainImage(html);

    return { content, imageUrl };
  } catch (error) {
    console.error(`Scraping failed for ${url}:`, error);
    throw new Error(`Failed to scrape content from ${url}: ${error.message}`);
  }
}

function extractMainContent(html: string): string {
  // Priority order for content extraction
  const contentSelectors = [
    'article',
    '[role="main"]',
    '.post-content',
    '.entry-content',
    '.article-content',
    '.content',
    'main',
  ];

  for (const selector of contentSelectors) {
    const regex = new RegExp(`<${selector}[^>]*>(.*?)</${selector}>`, 'is');
    const match = html.match(regex);
    if (match) {
      return cleanHtmlContent(match[1]);
    }
  }

  // Fallback: extract from body
  const bodyMatch = html.match(/<body[^>]*>(.*?)<\/body>/is);
  return bodyMatch ? cleanHtmlContent(bodyMatch[1]) : '';
}

function extractMainImage(html: string): string | undefined {
  // Priority order for image extraction
  const imagePatterns = [
    /<meta property="og:image" content="([^"]+)"/i,
    /<meta name="twitter:image" content="([^"]+)"/i,
    /<img[^>]+class="[^"]*featured[^"]*"[^>]+src="([^"]+)"/i,
    /<img[^>]+src="([^"]+)"[^>]*class="[^"]*featured[^"]*"/i,
    /<img[^>]+src="([^"]+)"[^>]*>/i,
  ];

  for (const pattern of imagePatterns) {
    const match = html.match(pattern);
    if (match && match[1]) {
      const src = match[1];
      // Validate image URL
      if (
        src.startsWith('http') &&
        !src.includes('logo') &&
        !src.includes('icon')
      ) {
        return src;
      }
    }
  }

  return undefined;
}

function cleanHtmlContent(html: string): string {
  return html
    .replace(/<script[^>]*>.*?<\/script>/gis, '') // Remove scripts
    .replace(/<style[^>]*>.*?<\/style>/gis, '') // Remove styles
    .replace(/<nav[^>]*>.*?<\/nav>/gis, '') // Remove navigation
    .replace(/<footer[^>]*>.*?<\/footer>/gis, '') // Remove footer
    .replace(/<aside[^>]*>.*?<\/aside>/gis, '') // Remove sidebar
    .replace(/<[^>]*>/g, '') // Remove all HTML tags
    .replace(/\s+/g, ' ') // Normalize whitespace
    .trim();
}
```

**Production KV Implementation:**

```typescript
// utils/kv-state.ts
export async function getLastProcessedTimestamp(
  kv: KVNamespace
): Promise<number> {
  try {
    const timestamp = await kv.get('last_processed_timestamp');
    if (timestamp) {
      const parsed = parseInt(timestamp);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
  } catch (error) {
    console.error('Failed to get last processed timestamp:', error);
  }

  // Default: 24 hours ago
  return Date.now() - 24 * 60 * 60 * 1000;
}

export async function updateLastProcessedTimestamp(
  kv: KVNamespace,
  timestamp: number
): Promise<void> {
  try {
    await kv.put('last_processed_timestamp', timestamp.toString(), {
      metadata: {
        updated_at: new Date().toISOString(),
        source: 'automated_workflow',
      },
    });
  } catch (error) {
    console.error('Failed to update last processed timestamp:', error);
    throw error;
  }
}

export async function getProcessingStats(
  kv: KVNamespace
): Promise<ProcessingStats> {
  try {
    const stats = await kv.get('processing_stats', 'json');
    return (
      stats || {
        total_processed: 0,
        last_run: null,
        success_rate: 0,
        errors: [],
      }
    );
  } catch (error) {
    console.error('Failed to get processing stats:', error);
    return {
      total_processed: 0,
      last_run: null,
      success_rate: 0,
      errors: [],
    };
  }
}

export async function updateProcessingStats(
  kv: KVNamespace,
  stats: ProcessingStats
): Promise<void> {
  try {
    await kv.put('processing_stats', JSON.stringify(stats), {
      expirationTtl: 30 * 24 * 60 * 60, // 30 days
    });
  } catch (error) {
    console.error('Failed to update processing stats:', error);
  }
}
```

---

### Step 5.2: AI Content Processing with OpenRouter

**Objective:** Implement intelligent content rewriting and optimization with multiple AI model options

**Production OpenRouter Implementation:**

```typescript
// utils/openrouter.ts
import { createOpenRouter } from '@openrouter/ai-sdk-provider';
import { generateText } from 'ai';

export const AI_MODELS = {
  PRIMARY: {
    'gpt-4o-mini': 'openai/gpt-4o-mini', // Cost-effective for news processing
    'claude-3-haiku': 'anthropic/claude-3-haiku',
    'gemini-1.5-flash': 'google/gemini-1.5-flash',
  },
  FALLBACK: {
    'llama-3.1-70b': 'meta-llama/llama-3.1-70b-instruct',
    'mixtral-8x7b': 'mistralai/mixtral-8x7b-instruct',
  },
} as const;

export async function processWithAI(
  article: Article,
  scrapedContent: { content: string; imageUrl?: string },
  apiKey: string
): Promise<ProcessedArticle> {
  const openrouter = createOpenRouter({
    apiKey,
    baseURL: 'https://openrouter.ai/api/v1',
  });

  const prompt = `First, classify the following article into ONE of these categories: [Politics, Business, Entertainment, Sports, Technology].

Then, rewrite this article for uniqueness, SEO optimization, and readability for a Kenyan audience. The rewrite must follow all on-page SEO rules and include a 'Why it matters' sentence and a 3-bullet-point 'The Big Picture' summary.

Here is the article:

Title: ${article.title}
Content: ${scrapedContent.content}`;

  // Try primary models with fallback
  const modelOrder = [
    ...Object.values(AI_MODELS.PRIMARY),
    ...Object.values(AI_MODELS.FALLBACK),
  ];

  for (const modelId of modelOrder) {
    try {
      const { text } = await generateText({
        model: openrouter(modelId),
        messages: [
          {
            role: 'system',
            content:
              'You are a professional Kenyan news editor. Always start your response with the category name on the first line, then provide the rewritten article with "Why it matters" and "The Big Picture" sections.',
          },
          {
            role: 'user',
            content: prompt,
          },
        ],
        maxTokens: 2000,
        temperature: 0.7,
        timeout: 30000, // 30 second timeout
      });

      return parseAIResponse(text, article, scrapedContent.imageUrl);
    } catch (error) {
      console.warn(`Model ${modelId} failed:`, error);
      // Continue to next model
      continue;
    }
  }

  throw new Error('All AI models failed to process the article');
}

function parseAIResponse(
  text: string,
  article: Article,
  imageUrl?: string
): ProcessedArticle {
  const lines = text.split('\n');
  const category = lines[0].trim();
  const rewrittenContent = lines.slice(1).join('\n').trim();

  // Generate SEO-friendly slug
  const slug = generateSlug(article.title);

  // Determine final image URL with fallback
  const finalImageUrl =
    imageUrl ||
    CATEGORY_FALLBACK_IMAGES[
      category as keyof typeof CATEGORY_FALLBACK_IMAGES
    ] ||
    CATEGORY_FALLBACK_IMAGES.LATEST;

  return {
    title: article.title,
    slug,
    content: rewrittenContent,
    summary: article.description || '',
    category,
    source_url: article.link,
    image_url: finalImageUrl,
    published_at: new Date(article.pubDate).toISOString(),
    created_at: new Date().toISOString(),
  };
}

function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100); // Limit length
}
```

**Enhanced AI Processing Pipeline with Model Selection:**

1. **Model Selection:** Choose optimal model based on task complexity and cost
2. **Content Moderation:** Use content filtering models when available
3. **Fetch original article content** from NewsAPI
4. **Generate unique rewrite** with primary models (GPT-4o, Claude-3.5-Sonnet)
5. **Create "Why it matters" summary** with cost-effective models
6. **Generate 3-bullet-point summary** with secondary models
7. **Extract and optimize keywords** for SEO
8. **Generate SEO-friendly meta tags** with lightweight models
9. **Quality scoring** based on readability and engagement metrics

**Model Configuration Options:**

```typescript
// config/ai-models.ts
export const MODEL_CONFIG = {
  // User can configure preferred models
  preferences: {
    primary: 'gpt-4o', // or 'claude-3.5-sonnet', 'gemini-2.0-flash'
    secondary: 'gpt-4o-mini', // or 'claude-3-haiku', 'gemini-1.5-flash'
    reasoning: 'o1-preview', // or 'claude-3-opus'
  },

  // Cost optimization settings
  costLimits: {
    maxCostPerArticle: 0.1, // USD
    preferCheaperModels: true,
  },

  // Performance settings
  timeouts: {
    rewrite: 30000, // 30 seconds
    meta: 10000, // 10 seconds
    summary: 15000, // 15 seconds
  },
};
```

**Content Quality Assurance:**

- Multi-model content verification for accuracy
- Content uniqueness verification using similarity algorithms
- Fact-checking against original source URLs
- SEO optimization validation (keyword density, meta tags)
- Readability score assessment (Flesch-Kincaid)
- Automated plagiarism detection

**Enhanced Error Handling & Fallbacks:**

```typescript
// Enhanced error handling with model fallbacks
export async function processArticleWithFallback(
  article: any,
  userPreferences?: any
) {
  try {
    // Primary: User's preferred model
    return await processWithFallback(
      modelId => rewriteArticle(article.content, article.url, modelId),
      'rewrite',
      userPreferences?.primaryModel
    );
  } catch (error) {
    if (error.message.includes('rate_limit')) {
      // Fallback: Queue for later processing
      await queueForLaterProcessing(article);
      return null;
    } else if (error.message.includes('content_filter')) {
      // Skip articles that violate content policies
      console.log('Article filtered due to content policy');
      return null;
    } else {
      // Fallback: Basic content extraction without AI
      return extractBasicContent(article);
    }
  }
}
```

**Model Selection UI Component:**

```typescript
// components/ModelSelector.tsx
export function ModelSelector({ onModelChange, currentModel }: {
  onModelChange: (model: string) => void;
  currentModel: string;
}) {
  return (
    <div className="model-selector">
      <h3>AI Model Preferences</h3>
      <div className="model-grid">
        {Object.entries(AI_MODELS.PRIMARY).map(([name, id]) => (
          <button
            key={id}
            className={`model-option ${currentModel === name ? 'active' : ''}`}
            onClick={() => onModelChange(name)}
          >
            <span className="model-name">{name}</span>
            <span className="model-provider">{id.split('/')[0]}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
```

**Testing:**

- Content quality assessment across different models
- AI response validation and consistency testing
- Performance testing with rate limiting
- Cost optimization testing
- Error handling verification for all failure modes
- A/B testing for content engagement metrics across models

**Deliverables:**

- AI-powered content processing system with multiple model options
- Model selection and fallback mechanisms
- Cost optimization and usage tracking
- Comprehensive quality assurance mechanisms
- Robust error handling and fallback systems
- User-configurable model preferences
- Optimized content output with SEO enhancements

---

## Phase 6: Deployment & DevOps

### Step 6.1: GitHub Actions CI/CD Pipeline

**Objective:** Automate testing, building, and deployment processes

**Tasks:**

- [ ] Create GitHub Actions workflow for testing
- [ ] Set up automated building and deployment
- [ ] Implement environment-specific configurations
- [ ] Add automated security scanning
- [ ] Create rollback mechanisms

**CI/CD Pipeline:**

```yaml
# .github/workflows/deploy.yml
name: Build and Deploy
on:
  push:
    branches: [main]
  workflow_dispatch:

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - name: Setup Node.js
        uses: actions/setup-node@v3
      - name: Install dependencies
        run: npm ci
      - name: Run tests
        run: npm test
      - name: Run linting
        run: npm run lint

  build-and-deploy:
    needs: test
    runs-on: ubuntu-latest
    steps:
      - name: Build Next.js
        run: npm run build
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
```

**Security Measures:**

- Secure secret management
- Dependency vulnerability scanning
- Code quality gates
- Automated security testing

**Testing:**

- Pipeline execution testing
- Deployment verification
- Rollback procedure testing
- Performance monitoring

**Deliverables:**

- Automated CI/CD pipeline
- Secure deployment process
- Monitoring and alerting setup

---

### Step 6.2: Domain & CDN Configuration

**Objective:** Configure production domain with optimal performance

**Tasks:**

- [ ] Set up FreeDNS subdomain configuration
- [ ] Configure Cloudflare CDN and SSL
- [ ] Implement caching strategies
- [ ] Set up performance monitoring
- [ ] Configure security headers

**Cloudflare Configuration:**

- SSL/TLS encryption (Full Strict)
- Page Rules for caching optimization
- Security headers (HSTS, CSP, etc.)
- DDoS protection and rate limiting
- Analytics and performance monitoring

**Security Headers:**

```
Content-Security-Policy: default-src 'self'; script-src 'self' 'unsafe-inline'
X-Frame-Options: DENY
X-Content-Type-Options: nosniff
Referrer-Policy: strict-origin-when-cross-origin
```

**Testing:**

- SSL certificate validation
- CDN performance testing
- Security header verification
- Global accessibility testing

**Deliverables:**

- Production-ready domain configuration
- Optimized CDN setup
- Security-hardened infrastructure

---

## Phase 7: Testing & Quality Assurance

### Step 7.1: Comprehensive Testing Suite

**Objective:** Ensure application reliability and performance

**Testing Strategy:**

- [ ] Unit tests for all components and utilities
- [ ] Integration tests for API interactions
- [ ] End-to-end tests for critical user flows
- [ ] Performance testing and optimization
- [ ] Security testing and vulnerability assessment

**Testing Tools:**

- Jest for unit testing
- React Testing Library for component testing
- Playwright for E2E testing
- Lighthouse for performance testing
- OWASP ZAP for security testing

**Test Coverage Requirements:**

- Minimum 80% code coverage
- All critical user paths tested
- Error scenarios covered
- Performance benchmarks met

**Deliverables:**

- Comprehensive test suite
- Performance benchmarks
- Security assessment report

---

### Step 7.2: User Acceptance Testing

**Objective:** Validate user experience and functionality

**Tasks:**

- [ ] Create user testing scenarios
- [ ] Conduct accessibility testing
- [ ] Perform cross-browser testing
- [ ] Validate mobile responsiveness
- [ ] Test content automation workflow

**Testing Scenarios:**

1. Homepage navigation and article discovery
2. Article reading experience
3. Category browsing and filtering
4. Search functionality
5. Social sharing features
6. Mobile user experience

**Accessibility Testing:**

- Screen reader compatibility
- Keyboard navigation
- Color contrast validation
- Focus management
- ARIA label verification

**Deliverables:**

- User testing report
- Accessibility compliance certification
- Cross-browser compatibility matrix

---

## Phase 8: Launch & Monitoring

### Step 8.1: Production Launch

**Objective:** Successfully deploy to production environment

**Pre-Launch Checklist:**

- [ ] All tests passing
- [ ] Performance benchmarks met
- [ ] Security scan completed
- [ ] Content automation tested
- [ ] Monitoring systems active
- [ ] Backup procedures verified

**Launch Tasks:**

- [ ] Deploy to production environment
- [ ] Configure monitoring and alerting
- [ ] Set up analytics tracking
- [ ] Implement error logging
- [ ] Create operational runbooks

**Monitoring Setup:**

- Application performance monitoring
- Error tracking and alerting
- User analytics and behavior tracking
- Infrastructure monitoring
- Security incident detection

**Deliverables:**

- Live production application
- Monitoring and alerting systems
- Operational documentation

---

### Step 8.2: Post-Launch Optimization

**Objective:** Continuously improve performance and user experience

**Tasks:**

- [ ] Monitor application performance
- [ ] Analyze user behavior and engagement
- [ ] Optimize content automation
- [ ] Implement user feedback
- [ ] Plan feature enhancements

**Optimization Areas:**

- Page load speed improvements
- Content quality enhancement
- SEO performance optimization
- User engagement features
- Mobile experience refinement

**Success Metrics:**

- Page load time < 3 seconds
- Core Web Vitals scores in green
- User engagement metrics
- Search engine ranking improvements
- Content automation efficiency

**Deliverables:**

- Performance optimization report
- User engagement analysis
- Feature enhancement roadmap

---

## Implementation Guidelines

### Code Quality Standards

- Follow TypeScript strict mode
- Implement comprehensive error handling
- Use consistent naming conventions
- Write self-documenting code
- Maintain clean architecture principles

### Security Best Practices

- Validate all user inputs
- Sanitize content before rendering
- Implement proper authentication
- Use HTTPS everywhere
- Regular security audits

### Performance Optimization

- Implement lazy loading
- Optimize images and assets
- Use efficient caching strategies
- Minimize bundle sizes
- Monitor Core Web Vitals

### Testing Requirements

- Write tests before implementation (TDD)
- Maintain high test coverage
- Test error scenarios
- Validate accessibility
- Performance testing for all features

---

## Risk Mitigation

### Technical Risks

- **API Rate Limits:** Implement caching and fallback mechanisms
- **Content Quality:** Add manual review processes for critical content
- **Performance Issues:** Regular monitoring and optimization
- **Security Vulnerabilities:** Automated scanning and updates

### Business Risks

- **Content Copyright:** Ensure proper attribution and fair use
- **SEO Penalties:** Follow Google guidelines strictly
- **User Experience:** Regular usability testing and feedback collection

---

## Success Criteria

### Technical Success

- ✅ Application loads in < 3 seconds
- ✅ 99.9% uptime achieved
- ✅ All accessibility standards met
- ✅ Security vulnerabilities < critical level
- ✅ Automated content pipeline functional

### Business Success

- ✅ Search engine indexing achieved
- ✅ User engagement metrics positive
- ✅ Content automation efficiency > 90%
- ✅ Mobile user experience optimized
- ✅ SEO rankings improving

---

## Conclusion

This implementation plan provides a comprehensive roadmap for building `pulse.utdnews.com` from conception to production. Each phase builds upon the previous one, ensuring a solid foundation while maintaining focus on code quality, security, and user experience.

The key to success is following the plan step-by-step, completing each phase thoroughly before moving to the next, and maintaining high standards for testing and quality assurance throughout the development process.
