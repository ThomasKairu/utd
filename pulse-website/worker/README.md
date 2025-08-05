# Pulse UTD News - Cloudflare Worker

Automated news processing worker that fetches, processes, and publishes Kenyan news articles.

## Features

- **🔄 Automated Processing**: Runs every 5 minutes via Cloudflare Cron Triggers
- **📰 Multi-Source RSS**: Processes 12 verified Kenyan news RSS feeds
- **🎯 Free Scraping**: Custom extractors for all 12 sites (no API costs)
- **🤖 AI Processing**: OpenRouter integration with multiple model fallbacks
- **💾 State Management**: Cloudflare KV for watermarks and statistics
- **🛡️ Resilient**: Continues processing on individual failures
- **📊 Monitoring**: Comprehensive logging and status endpoints

## Architecture

```
RSS Feeds → Content Extraction → AI Processing → Database Storage
    ↓              ↓                   ↓              ↓
12 Sources    12 Custom Sites    OpenRouter AI    Supabase
              (Free Scraping)    (Free Models)    PostgreSQL
```

## Setup Instructions

### 1. Prerequisites

- Cloudflare account with Workers plan
- Node.js 18+ installed
- Wrangler CLI installed: `npm install -g wrangler`

### 2. Clone and Install

```bash
cd worker
npm install
```

### 3. Configure Cloudflare

```bash
# Login to Cloudflare
wrangler login

# Create KV namespaces
wrangler kv:namespace create KV_NAMESPACE
wrangler kv:namespace create KV_NAMESPACE --preview

# Update wrangler.toml with the returned namespace IDs
```

### 4. Set Environment Variables

Update `wrangler.toml` with your Supabase URL, then set secrets:

```bash
# Set OpenRouter API key (required)
wrangler secret put OPENROUTER_API_KEY
# Enter your OpenRouter API key

# Set Supabase service key (required)
wrangler secret put SUPABASE_SERVICE_KEY
# Enter your Supabase service role key

# Set ScraperAPI key (optional - for fallback)
wrangler secret put SCRAPER_API_KEY
# Enter your ScraperAPI key if you have one
```

### 5. Deploy

```bash
# Deploy to development
npm run deploy:dev

# Deploy to production
npm run deploy:prod
```

## API Endpoints

### Status Check
```bash
GET https://your-worker.workers.dev/status
```

Returns current processing statistics and health status.

### Manual Trigger
```bash
POST https://your-worker.workers.dev/trigger
```

Manually triggers the processing workflow.

## Monitoring

### View Logs
```bash
npm run tail
```

### Check Status
```bash
npm run status
```

### Manual Trigger
```bash
npm run trigger
```

## Configuration

### Supported News Sites

**Custom Extractors (Free):**
1. tuko.co.ke
2. standardmedia.co.ke
3. the-star.co.ke
4. kenyans.co.ke
5. nation.africa
6. businessdailyafrica.com
7. theeastafrican.co.ke
8. ntvkenya.co.ke
9. kbc.co.ke
10. k24tv.co.ke
11. pd.co.ke
12. capitalfm.co.ke

**RSS Feeds (12 Total):**
All 12 sites above have corresponding RSS feeds that are processed every 5 minutes.

### AI Models

**Primary**: `z-ai/glm-4.5-air:free`
**Fallback**: `google/gemma-3-27b-it:free`

Both models are free tier with the provided API keys.

### Categories

- Politics
- Business
- Entertainment
- Sports
- Technology

## Workflow

1. **Trigger**: Cron runs every 5 minutes
2. **State**: Get last processed timestamp from KV
3. **Fetch**: Query all RSS feeds concurrently
4. **Filter**: Keep only new articles
5. **Process**: For each article:
   - Scrape full content (custom extractor or ScraperAPI)
   - Process with AI (categorize + rewrite)
   - Save to Supabase database
6. **Update**: Store new timestamp in KV
7. **Log**: Record statistics and errors

## Error Handling

- **Individual Failures**: Continue processing other articles
- **Model Failures**: Automatic fallback to secondary AI model
- **Scraping Failures**: Fallback from custom to ScraperAPI
- **Database Errors**: Skip duplicates, log failures
- **Critical Errors**: Store in KV for debugging

## Performance

- **Processing Time**: ~30-60 seconds per run
- **Articles/Run**: 0-50 (depends on news volume)
- **Success Rate**: >95% typical
- **Cost**: **$0.00 per day** (free AI models + free custom extractors)

## Troubleshooting

### Common Issues

1. **No articles processed**
   - Check RSS feeds are accessible
   - Verify timestamp logic in KV

2. **Scraping failures**
   - Check site structure changes
   - Verify ScraperAPI quota

3. **AI processing errors**
   - Check OpenRouter API key validity
   - Monitor rate limits

4. **Database errors**
   - Verify Supabase service key
   - Check database schema

### Debug Commands

```bash
# View recent logs
wrangler tail --format pretty

# Test scheduled trigger locally
npm run test

# Check KV contents
wrangler kv:key list --binding KV_NAMESPACE

# Get specific KV value
wrangler kv:key get "last_processed_timestamp" --binding KV_NAMESPACE
```

## Development

### Local Testing

```bash
# Start development server
npm run dev

# Test scheduled trigger
npm run test
```

### Adding New Sites

1. Add site config to `src/config/sites.ts`
2. Test extraction with the site's HTML structure
3. Deploy and monitor

### Modifying AI Prompts

Edit the prompt in `src/utils/ai.ts` and redeploy.

## Security

- API keys stored as Cloudflare secrets
- No sensitive data in code
- CORS headers for web requests
- Input validation and sanitization

## License

MIT License - see LICENSE file for details.