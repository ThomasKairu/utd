# Pulse News Cloudflare Worker

Automated news collection and processing system for Pulse News. This worker runs every 15 minutes to collect, process, and store news articles from Kenyan sources.

## 🚀 Features

- **Automated RSS Processing** - Fetches from 7 major Kenyan news sources
- **GNews API Integration** - Supplementary news collection
- **AI-Powered Processing** - Content summarization and categorization using OpenRouter
- **Duplicate Detection** - Prevents duplicate articles using similarity matching
- **Real-time Database Updates** - Stores processed articles in Supabase
- **KV Storage Caching** - Efficient state management and duplicate prevention
- **Comprehensive Monitoring** - Health checks and processing statistics

## 📊 Architecture

```
┌─────────────────┐    ┌──────────────────┐    ┌─────────────────┐
│   RSS Feeds     │    │   Cloudflare     │    │    Supabase     │
│   GNews API     │───▶│     Worker       │───▶│    Database     │
│   Guardian API  │    │  (Every 15min)   │    │   (Articles)    │
└─────────────────┘    └──────────────────┘    └─────────────────┘
                              │
                              ▼
                       ┌──────────────────┐
                       │   KV Storage     │
                       │   (Caching)      │
                       └──────────────────┘
```

## 🔧 Setup Instructions

### 1. Install Dependencies

```bash
cd worker
npm install
```

### 2. Configure Secrets

Set up the required secrets using Wrangler CLI:

```bash
# Required secrets
wrangler secret put SUPABASE_SERVICE_KEY
wrangler secret put OPENROUTER_API_KEY

# Optional secrets
wrangler secret put NEWS_API_KEY
wrangler secret put GUARDIAN_API_KEY
```

### 3. Create KV Namespace

```bash
# Create KV namespace
wrangler kv:namespace create KV_NAMESPACE

# Update wrangler.toml with the returned namespace ID
```

### 4. Deploy Worker

```bash
# Deploy to development
npm run deploy:dev

# Deploy to production
npm run deploy:prod
```

## 🔑 Required Environment Variables

### Secrets (via `wrangler secret put`)

- **SUPABASE_SERVICE_KEY** - Service role key for database write access
- **OPENROUTER_API_KEY** - API key for AI processing
- **NEWS_API_KEY** (optional) - GNews API key for additional coverage
- **GUARDIAN_API_KEY** (optional) - Guardian API key for UK/international news

### Public Variables (in wrangler.toml)

- **SUPABASE_URL** - Your Supabase project URL

## 📡 API Endpoints

### Health Check
```
GET /health
```
Returns worker status and last execution statistics.

### Manual Trigger
```
POST /trigger
```
Manually triggers the news processing workflow.

### Processing Statistics
```
GET /stats
```
Returns detailed processing statistics and metrics.

## 🔄 Processing Workflow

1. **RSS Feed Collection** (7 Kenyan news sources)
   - Nation Media Group
   - Standard Media
   - The Star
   - KBC
   - Capital FM
   - Business Daily
   - The East African

2. **GNews API Processing** (if configured)
   - Kenya-specific queries
   - Rate-limited to respect API quotas

3. **Duplicate Detection**
   - URL-based caching in KV storage
   - Title similarity matching (85% threshold)

4. **AI Processing** (OpenRouter)
   - Content summarization (2-3 sentences)
   - Category classification (Politics, Business, Technology, Sports, Entertainment)
   - Content enhancement and formatting

5. **Database Storage**
   - Supabase REST API integration
   - Automatic slug generation
   - Metadata enrichment

## 📊 Monitoring & Statistics

The worker tracks comprehensive statistics:

- **RSS articles processed**
- **GNews articles collected**
- **Unique articles after deduplication**
- **AI processing success rate**
- **Database save success rate**
- **Error counts and types**
- **Execution time metrics**

## 🛠️ Development

### Local Development
```bash
npm run dev
```

### Testing
```bash
npm run test
```

### View Logs
```bash
npm run logs
```

### KV Storage Management
```bash
# List KV namespaces
npm run kv:list

# Create new namespace
npm run kv:create
```

## 🔧 Configuration

### RSS Feeds
Edit the `RSS_FEEDS` array in `src/index.ts` to add/remove news sources.

### Category Keywords
Modify `CATEGORY_KEYWORDS` object to adjust article categorization logic.

### Processing Frequency
Update cron triggers in `wrangler.toml`:
- Development: Every 20 minutes
- Production: Every 15 minutes

## 📈 Performance Optimization

- **Cloudflare Edge Caching** - RSS feeds cached for 5 minutes
- **KV Storage** - Processed URLs cached for 7 days
- **Rate Limiting** - Respects API quotas and limits
- **Error Handling** - Graceful degradation on failures
- **Batch Processing** - Efficient article processing pipeline

## 🚨 Error Handling

The worker includes comprehensive error handling:

- **RSS Feed Failures** - Continues with other sources
- **API Rate Limits** - Implements backoff strategies
- **AI Processing Errors** - Falls back to basic categorization
- **Database Failures** - Logs errors and continues processing
- **Network Issues** - Retry logic with exponential backoff

## 📝 Logs & Debugging

Monitor worker execution:

```bash
# Real-time logs
wrangler tail

# Specific environment
wrangler tail --env production
```

## 🔄 Deployment Environments

### Development
- Runs every 20 minutes
- Uses development KV namespace
- Separate worker instance for testing

### Production
- Runs every 15 minutes
- Production KV namespace
- Optimized for performance and reliability

## 📊 Expected Performance

- **Processing Time**: 30-60 seconds per execution
- **Articles per Run**: 5-20 new articles (varies by news cycle)
- **Success Rate**: >95% for RSS processing
- **AI Processing**: >90% success rate
- **Database Writes**: >98% success rate

## 🔐 Security

- **Service Key Protection** - Stored as encrypted secrets
- **API Key Management** - Secure secret storage
- **CORS Configuration** - Proper origin restrictions
- **Rate Limiting** - Prevents API abuse
- **Input Validation** - Sanitizes all content

## 📞 Support

For issues or questions:
1. Check worker logs: `wrangler tail`
2. Verify secrets are set: `wrangler secret list`
3. Test endpoints: `/health`, `/stats`
4. Review processing statistics in KV storage