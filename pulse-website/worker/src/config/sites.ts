// Site-specific extractor configurations for Kenyan news sites
export interface SiteConfig {
  hostname: string;
  titleSelector: string;
  contentSelector: string;
  imageSelector: string;
  fallbackImageSelector?: string;
}

export const SITE_CONFIGS: Record<string, SiteConfig> = {
  'ntvkenya.co.ke': {
    hostname: 'ntvkenya.co.ke',
    titleSelector: 'h1.article-title, h1.entry-title, h1',
    contentSelector: '.article-content, .entry-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.featured-image img, .article-image img',
  },
  'citizen.digital': {
    hostname: 'citizen.digital',
    titleSelector: 'h1.article-title, h1.entry-title, h1',
    contentSelector: '.article-content, .entry-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.featured-image img, .article-image img',
  },
  'capitalfm.co.ke': {
    hostname: 'capitalfm.co.ke',
    titleSelector: 'h1.article-title, h1.entry-title, h1',
    contentSelector: '.article-content, .entry-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.featured-image img, .article-image img',
  },
  'pulselive.co.ke': {
    hostname: 'pulselive.co.ke',
    titleSelector: 'h1.article-title, h1.entry-title, h1',
    contentSelector: '.article-content, .entry-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.featured-image img, .article-image img',
  },
  'ghafla.com': {
    hostname: 'ghafla.com',
    titleSelector: 'h1.article-title, h1.entry-title, h1',
    contentSelector: '.article-content, .entry-content, article',
    imageSelector: 'meta[property="og:image"]',
    fallbackImageSelector: '.featured-image img, .article-image img',
  },
};

// RSS Feeds - Updated to only include working/reliable sources (Based on test results)
export const RSS_FEEDS = [
  // Confirmed working feeds (from test results)
  'https://ntvkenya.co.ke/feed',
  'https://www.capitalfm.co.ke/news/rss/',
  
  // Additional reliable feeds to test
  'https://www.citizen.digital/rss',
  'https://www.pulselive.co.ke/rss',
  'https://www.ghafla.com/ke/feed/',
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