// Working RSS feeds - Updated to bypass bot protection
export const WORKING_RSS_FEEDS = [
  // Working international feeds with Africa/Kenya content
  'https://feeds.bbci.co.uk/news/world/africa/rss.xml',
  'https://www.aljazeera.com/xml/rss/all.xml',
  'https://feeds.reuters.com/reuters/AFRICAWorldNews',
  'https://www.africanews.com/api/rss/en/news.xml',
  'https://www.theafricareport.com/feed/',
  
  // Tech and business feeds (often have Kenya content)
  'https://techcrunch.com/feed/',
  'https://feeds.feedburner.com/venturebeat/SZYF',
  
  // Backup general news with Africa coverage
  'https://rss.cnn.com/rss/edition.rss',
  'https://feeds.skynews.com/feeds/rss/world.xml',
  
  // Try some original feeds (may work with better headers)
  'https://www.capitalfm.co.ke/news/rss/',
  'https://www.kbc.co.ke/feed',
  'https://ntvkenya.co.ke/feed',
];

// Better headers to avoid bot detection
export const IMPROVED_HEADERS = {
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