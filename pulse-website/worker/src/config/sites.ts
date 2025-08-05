// Site-specific extractor configurations for Kenyan news sites
export interface SiteConfig {
  hostname: string;
  titleSelector: string;
  contentSelector: string;
  imageSelector: string;
  fallbackImageSelector?: string;
}

export const SITE_CONFIGS: Record<string, SiteConfig> = {
  'tuko.co.ke': {
    hostname: 'tuko.co.ke',
    titleSelector: 'h1.article-title, h1.entry-title, h1',
    contentSelector: 'article .article-body, .entry-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.article-image img, .featured-image img',
  },
  'standardmedia.co.ke': {
    hostname: 'standardmedia.co.ke',
    titleSelector: 'h1.article-title, h1.headline, h1',
    contentSelector: '.article-body, .story-body, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.article-image img, .story-image img',
  },
  'the-star.co.ke': {
    hostname: 'the-star.co.ke',
    titleSelector: 'h1.article-title, h1.entry-title, h1',
    contentSelector: '.article-content, .entry-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.featured-image img, .article-img img',
  },
  'kenyans.co.ke': {
    hostname: 'kenyans.co.ke',
    titleSelector: 'h1.post-title, h1.entry-title, h1',
    contentSelector: '.post-content, .entry-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.post-thumbnail img, .featured-image img',
  },
  'nation.africa': {
    hostname: 'nation.africa',
    titleSelector: 'h1.article-title, h1.headline, h1',
    contentSelector: '.article-content, .story-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.article-image img, .story-image img',
  },
  'businessdailyafrica.com': {
    hostname: 'businessdailyafrica.com',
    titleSelector: 'h1.article-title, h1.headline, h1',
    contentSelector: '.article-body, .story-body, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.article-image img, .story-image img',
  },
  'theeastafrican.co.ke': {
    hostname: 'theeastafrican.co.ke',
    titleSelector: 'h1.article-title, h1.headline, h1',
    contentSelector: '.article-content, .story-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.article-image img, .story-image img',
  },
  'ntvkenya.co.ke': {
    hostname: 'ntvkenya.co.ke',
    titleSelector: 'h1.article-title, h1.entry-title, h1',
    contentSelector: '.article-content, .entry-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.featured-image img, .article-image img',
  },
  'kbc.co.ke': {
    hostname: 'kbc.co.ke',
    titleSelector: 'h1.article-title, h1.post-title, h1',
    contentSelector: '.article-content, .post-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.featured-image img, .post-thumbnail img',
  },
  'k24tv.co.ke': {
    hostname: 'k24tv.co.ke',
    titleSelector: 'h1.article-title, h1.entry-title, h1',
    contentSelector: '.article-content, .entry-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.featured-image img, .article-image img',
  },
  'pd.co.ke': {
    hostname: 'pd.co.ke',
    titleSelector: 'h1.article-title, h1.post-title, h1',
    contentSelector: '.article-content, .post-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.featured-image img, .post-thumbnail img',
  },
  'capitalfm.co.ke': {
    hostname: 'capitalfm.co.ke',
    titleSelector: 'h1.article-title, h1.entry-title, h1',
    contentSelector: '.article-content, .entry-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.featured-image img, .article-image img',
  },
};

// RSS Feeds for the 12 sites with custom extractors (exact match)
export const RSS_FEEDS = [
  'https://www.tuko.co.ke/rss/',
  'https://www.standardmedia.co.ke/rss',
  'https://www.the-star.co.ke/rss',
  'https://www.kenyans.co.ke/rss',
  'https://nation.africa/kenya/rss',
  'https://www.businessdailyafrica.com/rss',
  'https://www.theeastafrican.co.ke/rss',
  'https://ntvkenya.co.ke/feed',
  'https://www.kbc.co.ke/feed',
  'https://www.k24tv.co.ke/feed/',
  'https://www.pd.co.ke/feed/',
  'https://www.capitalfm.co.ke/news/rss/',
];

// Content Categories
export const CATEGORIES = {
  POLITICS: 'Politics',
  BUSINESS: 'Business',
  ENTERTAINMENT: 'Entertainment',
  SPORTS: 'Sports',
  TECHNOLOGY: 'Technology',
} as const;

export const CATEGORY_FALLBACK_IMAGES = {
  [CATEGORIES.POLITICS]: 'https://images.unsplash.com/photo-1529107386315-e1a2ed48a620?w=800&h=400&fit=crop',
  [CATEGORIES.BUSINESS]: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800&h=400&fit=crop',
  [CATEGORIES.ENTERTAINMENT]: 'https://images.unsplash.com/photo-1514525253161-7a46d19cd819?w=800&h=400&fit=crop',
  [CATEGORIES.SPORTS]: 'https://images.unsplash.com/photo-1461896836934-ffe607ba8211?w=800&h=400&fit=crop',
  [CATEGORIES.TECHNOLOGY]: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=800&h=400&fit=crop',
  LATEST: 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop',
};