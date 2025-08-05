# Enhanced Pulse News Worker Deployment Guide

## Overview

This guide covers deploying the enhanced Pulse News Worker with bot-resistant RSS fetching, alternative news APIs, and comprehensive monitoring.

## New Features

### 🛡️ Bot-Resistant RSS Fetching
- Multiple user agent rotation
- Request delays and retry logic
- Cloudflare bypass techniques
- Site-specific configurations

### 🔄 Alternative News APIs
- NewsAPI.org integration
- Guardian API support
- Reuters RSS feeds
- BBC RSS feeds

### 📊 Comprehensive Monitoring
- Real-time health monitoring
- Error aggregation and analysis
- Performance metrics tracking
- Alert system for critical failures

## Prerequisites

1. **Cloudflare Workers Account** with KV namespace
2. **Supabase Database** (already configured)
3. **API Keys** (optional but recommended):
   - OpenRouter API key (required)
   - ScraperAPI key (optional)
   - NewsAPI.org key (optional)
   - Guardian API key (optional)

## Deployment Steps

### 1. Install Dependencies

```bash
cd worker
npm install
```

### 2. Configure Secrets

Set up the required API keys as Cloudflare Workers secrets:

```bash
# Required
npx wrangler secret put OPENROUTER_API_KEY
npx wrangler secret put SUPABASE_SERVICE_KEY

# Optional but recommended
npx wrangler secret put SCRAPER_API_KEY
npx wrangler secret put NEWS_API_KEY
npx wrangler secret put GUARDIAN_API_KEY
```

### 3. Deploy to Cloudflare Workers

```bash
# Deploy to production
npx wrangler deploy

# Or deploy to development environment
npx wrangler deploy --env development
```

### 4. Verify Deployment

Test the enhanced endpoints:

```bash
# Basic status
curl https://pulse-news-worker.pulsenews.workers.dev/status

# Health monitoring
curl https://pulse-news-worker.pulsenews.workers.dev/health

# Monitoring dashboard
curl https://pulse-news-worker.pulsenews.workers.dev/dashboard

# Test RSS feeds
curl https://pulse-news-worker.pulsenews.workers.dev/test-rss

# Manual trigger
curl -X POST https://pulse-news-worker.pulsenews.workers.dev/trigger
```

## API Key Setup

### NewsAPI.org (Optional)
1. Sign up at https://newsapi.org/
2. Get your free API key (1000 requests/day)
3. Add as `NEWS_API_KEY` secret

### Guardian API (Optional)
1. Register at https://open-platform.theguardian.com/
2. Get your free API key
3. Add as `GUARDIAN_API_KEY` secret

### ScraperAPI (Optional)
1. Sign up at https://www.scraperapi.com/
2. Get your API key
3. Add as `SCRAPER_API_KEY` secret

## Enhanced Endpoints

### `/status`
Basic health check with database stats
```json
{
  "status": "healthy",
  "timestamp": "2025-01-04T23:30:00.000Z",
  "database": {
    "totalArticles": 15,
    "todayArticles": 3,
    "lastProcessed": "2025-01-04T23:25:00.000Z"
  },
  "lastProcessed": "2025-01-04T23:25:00.000Z"
}
```

### `/health`
Comprehensive health monitoring
```json
{
  "status": "healthy",
  "timestamp": "2025-01-04T23:30:00.000Z",
  "services": [
    {
      "name": "RSS Feeds",
      "status": "up",
      "responseTime": 1250,
      "errorRate": 0.2,
      "lastCheck": "2025-01-04T23:30:00.000Z"
    },
    {
      "name": "Database",
      "status": "up",
      "responseTime": 150,
      "errorRate": 0,
      "lastCheck": "2025-01-04T23:30:00.000Z"
    }
  ],
  "metrics": {
    "avgProcessingTime": 45000,
    "successRate": 0.85,
    "articlesPerHour": 12,
    "rssSuccessRate": 0.8
  },
  "alerts": []
}
```

### `/dashboard`
Complete monitoring dashboard data
```json
{
  "health": { /* health report */ },
  "errors": {
    "totalErrors": 15,
    "errorsByType": {
      "RSS_FETCH": 8,
      "SCRAPING": 4,
      "AI_PROCESSING": 2,
      "DATABASE": 1
    },
    "topErrorMessages": [
      {
        "message": "Received HTML instead of RSS XML - likely blocked by anti-bot protection",
        "count": 5
      }
    ]
  },
  "recentActivity": [ /* recent processing runs */ ],
  "summary": {
    "totalRuns": 24,
    "avgSuccessRate": 0.85,
    "totalArticlesProcessed": 45,
    "totalErrors": 15
  }
}
```

### `/test-rss`
Test RSS feed fetching without processing
```json
{
  "success": true,
  "stats": {
    "totalFeeds": 16,
    "successfulFeeds": 12,
    "failedFeeds": 4,
    "totalArticles": 25,
    "processingTime": 8500,
    "alternativeSourcesUsed": 1
  },
  "articlesFound": 25,
  "errors": [
    {
      "feedUrl": "https://www.tuko.co.ke/rss/",
      "error": "Received HTML instead of RSS XML - likely blocked by anti-bot protection",
      "timestamp": "2025-01-04T23:30:00.000Z",
      "retryAttempt": 3
    }
  ],
  "sampleArticles": [
    {
      "title": "Kenya's Economic Growth Outlook for 2025",
      "source": "standardmedia.co.ke",
      "pubDate": "2025-01-04T22:45:00.000Z"
    }
  ]
}
```

## Monitoring and Alerts

### Error Categories
- **RSS_FETCH**: RSS feed access issues
- **SCRAPING**: Content extraction failures
- **AI_PROCESSING**: AI service errors
- **DATABASE**: Database connection/save issues
- **VALIDATION**: Data validation failures

### Alert Levels
- **info**: General information
- **warning**: Performance degradation
- **error**: Service failures
- **critical**: System-wide issues

### Performance Metrics
- **avgProcessingTime**: Average time per processing run
- **successRate**: Percentage of successfully processed articles
- **articlesPerHour**: Throughput metric
- **rssSuccessRate**: RSS feed success percentage

## Troubleshooting

### Common Issues

#### RSS Feeds Blocked
**Symptoms**: High RSS error rate, "HTML instead of RSS XML" errors
**Solutions**:
1. Check if alternative APIs are configured
2. Verify user agent rotation is working
3. Consider adding more delays between requests

#### Low Success Rate
**Symptoms**: successRate < 0.5 in health metrics
**Solutions**:
1. Check AI processing errors
2. Verify database connectivity
3. Review scraping failures

#### No Articles Processing
**Symptoms**: articlesPerHour = 0
**Solutions**:
1. Check `/test-rss` endpoint
2. Verify last processed timestamp
3. Check if all RSS feeds are failing

### Debug Commands

```bash
# Check worker logs
npx wrangler tail

# Test specific functionality
curl https://pulse-news-worker.pulsenews.workers.dev/test-rss

# Check health status
curl https://pulse-news-worker.pulsenews.workers.dev/health

# View monitoring dashboard
curl https://pulse-news-worker.pulsenews.workers.dev/dashboard
```

## Performance Optimization

### RSS Fetching
- Staggered delays between requests (1-3 seconds)
- Exponential backoff for retries
- User agent rotation
- Site-specific configurations

### Alternative APIs
- Rate limit compliance
- Fallback activation when RSS success rate < 30%
- Geographic targeting (Kenya, East Africa)

### Error Handling
- Comprehensive error categorization
- Retry logic with backoff
- Graceful degradation
- Detailed logging

## Security Considerations

### API Keys
- Store all keys as Cloudflare Workers secrets
- Never commit keys to version control
- Rotate keys regularly

### Rate Limiting
- Respect RSS feed rate limits
- Implement delays between requests
- Monitor API usage quotas

### Bot Detection Avoidance
- Use realistic user agents
- Implement random delays
- Respect robots.txt (where applicable)

## Maintenance

### Regular Tasks
1. **Monitor health endpoint** daily
2. **Review error reports** weekly
3. **Check API quotas** monthly
4. **Update user agents** quarterly

### Scaling Considerations
- Monitor KV storage usage
- Track API quota consumption
- Consider additional alternative APIs
- Optimize processing performance

## Support

For issues or questions:
1. Check the monitoring dashboard
2. Review worker logs
3. Test individual endpoints
4. Check API key configurations

The enhanced system provides comprehensive monitoring and fallback mechanisms to ensure reliable news processing even when individual RSS feeds are blocked or unavailable.