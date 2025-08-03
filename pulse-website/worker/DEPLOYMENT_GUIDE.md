# Cloudflare Worker Deployment Guide

Complete step-by-step guide to deploy the Pulse UTD News automation worker.

## Prerequisites Checklist

- [ ] Cloudflare account (free tier works)
- [ ] Node.js 18+ installed
- [ ] Wrangler CLI installed globally
- [ ] OpenRouter API keys (provided)
- [ ] Supabase service key
- [ ] ScraperAPI key (optional)

## Step 1: Environment Setup

### Install Wrangler CLI
```bash
npm install -g wrangler@latest
```

### Login to Cloudflare
```bash
wrangler login
```
This will open a browser window to authenticate.

### Verify Login
```bash
wrangler whoami
```

## Step 2: Project Setup

### Navigate to Worker Directory
```bash
cd worker
```

### Install Dependencies
```bash
npm install
```

## Step 3: Create KV Namespaces

### Create Production KV Namespace
```bash
wrangler kv:namespace create KV_NAMESPACE
```

**Example Output:**
```
🌀 Creating namespace with title "pulse-news-worker-KV_NAMESPACE"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "KV_NAMESPACE", id = "abcd1234567890abcd1234567890abcd" }
```

### Create Preview KV Namespace
```bash
wrangler kv:namespace create KV_NAMESPACE --preview
```

**Example Output:**
```
🌀 Creating namespace with title "pulse-news-worker-KV_NAMESPACE_preview"
✨ Success!
Add the following to your configuration file in your kv_namespaces array:
{ binding = "KV_NAMESPACE", preview_id = "efgh5678901234efgh5678901234efgh" }
```

### Update wrangler.toml
Replace the placeholder IDs in `wrangler.toml`:

```toml
[[kv_namespaces]]
binding = "KV_NAMESPACE"
id = "abcd1234567890abcd1234567890abcd"  # Your actual production ID
preview_id = "efgh5678901234efgh5678901234efgh"  # Your actual preview ID
```

## Step 4: Configure Secrets

### Set OpenRouter API Key
```bash
wrangler secret put OPENROUTER_API_KEY
```
**Enter:** `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`

### Set Supabase Service Key
```bash
wrangler secret put SUPABASE_SERVICE_KEY
```
**Enter your Supabase service role key** (get from Supabase dashboard > Settings > API)

### Set ScraperAPI Key (Optional)
```bash
wrangler secret put SCRAPER_API_KEY
```
**Enter your ScraperAPI key** (if you have one, otherwise skip)

## Step 5: Test Locally

### Start Development Server
```bash
npm run dev
```

### Test Scheduled Trigger
```bash
npm run test
```

### Check Status Endpoint
```bash
curl http://localhost:8787/status
```

## Step 6: Deploy to Production

### Deploy Worker
```bash
npm run deploy:prod
```

**Expected Output:**
```
✨ Compiled Worker successfully
🌀 Uploading...
✨ Success! Deployed to https://pulse-news-worker.your-subdomain.workers.dev
```

### Verify Deployment
```bash
curl https://pulse-news-worker.your-subdomain.workers.dev/status
```

## Step 7: Configure Custom Domain (Optional)

### Add Custom Domain
1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages
3. Select your worker
4. Go to Settings > Triggers
5. Add custom domain: `worker.pulse.utdnews.com`

### Update DNS
Add a CNAME record in your domain's DNS:
```
worker.pulse.utdnews.com CNAME pulse-news-worker.your-subdomain.workers.dev
```

## Step 8: Monitor and Test

### View Live Logs
```bash
npm run tail
```

### Check Processing Status
```bash
curl https://pulse-news-worker.your-subdomain.workers.dev/status
```

### Manual Trigger Test
```bash
curl -X POST https://pulse-news-worker.your-subdomain.workers.dev/trigger
```

### Check Database
Verify articles are being created in your Supabase database.

## Step 9: Monitoring Setup

### Set Up Alerts (Optional)
1. Go to Cloudflare Dashboard
2. Navigate to Workers & Pages > your-worker > Observability
3. Set up alerts for:
   - High error rates
   - Execution timeouts
   - Memory usage

### Monitor KV Usage
```bash
# List all keys
wrangler kv:key list --binding KV_NAMESPACE

# Get last processed timestamp
wrangler kv:key get "last_processed_timestamp" --binding KV_NAMESPACE

# Get processing stats
wrangler kv:key get "processing_stats" --binding KV_NAMESPACE
```

## Troubleshooting

### Common Deployment Issues

#### 1. KV Namespace Not Found
**Error:** `KV namespace with binding 'KV_NAMESPACE' not found`

**Solution:**
- Verify KV namespace IDs in `wrangler.toml`
- Recreate namespaces if needed

#### 2. Secret Not Set
**Error:** `env.OPENROUTER_API_KEY is undefined`

**Solution:**
```bash
wrangler secret put OPENROUTER_API_KEY
```

#### 3. Supabase Connection Failed
**Error:** `Failed to save to Supabase: 401 Unauthorized`

**Solution:**
- Verify Supabase URL in `wrangler.toml`
- Check service key with: `wrangler secret list`
- Ensure RLS policies allow service role access

#### 4. Cron Not Triggering
**Issue:** Worker deployed but not running automatically

**Solution:**
- Verify cron syntax in `wrangler.toml`
- Check Workers dashboard for cron status
- Manually trigger to test: `curl -X POST .../trigger`

### Debug Commands

```bash
# View all secrets (names only)
wrangler secret list

# Delete a secret
wrangler secret delete SECRET_NAME

# View worker logs in real-time
wrangler tail --format pretty

# Get worker info
wrangler whoami
```

## Production Checklist

- [ ] KV namespaces created and configured
- [ ] All secrets set correctly
- [ ] Worker deployed successfully
- [ ] Status endpoint returns healthy response
- [ ] Manual trigger works
- [ ] Articles appear in Supabase database
- [ ] Cron trigger is active (check after 5 minutes)
- [ ] Logs show successful processing
- [ ] Error handling works (test with invalid RSS feed)

## Performance Optimization

### Monitor Resource Usage
- CPU time: Should be <10ms per article
- Memory: Should be <128MB
- Duration: Should be <30s per run

### Optimize if Needed
- Reduce concurrent RSS fetches
- Implement article batching
- Add request timeouts
- Cache RSS responses

## Security Best Practices

- [ ] API keys stored as secrets (not in code)
- [ ] Supabase RLS policies configured
- [ ] CORS headers set appropriately
- [ ] Input validation in place
- [ ] Error messages don't expose sensitive data

## Maintenance

### Regular Tasks
- Monitor error rates weekly
- Check processing statistics
- Update AI prompts if needed
- Review and update site extractors
- Monitor API usage and costs

### Updates
```bash
# Update dependencies
npm update

# Redeploy
npm run deploy:prod
```

## Success Criteria

✅ **Deployment Successful When:**
- Worker responds to status checks
- Articles are being processed every 5 minutes
- Database receives new articles
- Error rate is <5%
- Processing time is <60 seconds per run

🎉 **Your automated news processing system is now live!**