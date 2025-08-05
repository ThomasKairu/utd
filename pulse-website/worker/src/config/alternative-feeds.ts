// Alternative RSS feeds that are more accessible
export const ALTERNATIVE_RSS_FEEDS = [
  // International news with Kenya focus
  'https://feeds.bbci.co.uk/news/world/africa/rss.xml',
  'https://www.aljazeera.com/xml/rss/all.xml',
  'https://feeds.reuters.com/reuters/AFRICAWorldNews',
  
  // African news sources
  'https://www.africanews.com/api/rss/en/news.xml',
  'https://www.theafricareport.com/feed/',
  
  // Tech and business (often less protected)
  'https://techcrunch.com/feed/',
  'https://feeds.feedburner.com/venturebeat/SZYF',
  
  // Backup general news
  'https://rss.cnn.com/rss/edition.rss',
  'https://feeds.skynews.com/feeds/rss/world.xml',
];

// More permissive headers for RSS fetching
export const RSS_HEADERS = {
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
};