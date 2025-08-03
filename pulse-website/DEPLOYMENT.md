# Deployment Guide for Pulse UTD News

This guide provides step-by-step instructions for deploying the Pulse UTD News platform to production.

## Prerequisites

Before deploying, ensure you have:

1. **Node.js 18+** installed
2. **Git** configured with your GitHub account
3. **Supabase account** and project created
4. **Cloudflare account** with Workers enabled
5. **OpenRouter API key** for AI processing
6. **ScraperAPI key** for content scraping

## Environment Setup

### 1. Create Environment Variables

Copy the example environment file and fill in your values:

```bash
cp .env.local.example .env.local
```

Required environment variables:

```env
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# OpenRouter AI Configuration
OPENROUTER_API_KEY=your_openrouter_api_key

# ScraperAPI Configuration
SCRAPER_API_KEY=your_scraper_api_key

# Cloudflare Configuration (for workers)
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token
CLOUDFLARE_ACCOUNT_ID=your_cloudflare_account_id

# Site Configuration
NEXT_PUBLIC_SITE_URL=https://pulse.utdnews.com
NEXT_PUBLIC_SITE_NAME=Pulse UTD News
```

## Database Setup

### 1. Create Supabase Project

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project
3. Wait for the project to be ready
4. Copy your project URL and API keys

### 2. Run Database Schema

1. Open the Supabase SQL Editor
2. Copy the contents of `database/schema.sql`
3. Execute the SQL to create tables, indexes, and policies

### 3. Verify Database Setup

Check that the following tables were created:

- `articles`
- `categories`

And that Row Level Security (RLS) is enabled.

## Cloudflare Worker Setup

### 1. Install Wrangler CLI

```bash
npm install -g wrangler
```

### 2. Authenticate with Cloudflare

```bash
wrangler login
```

### 3. Create KV Namespace

```bash
cd worker
wrangler kv:namespace create KV_NAMESPACE
wrangler kv:namespace create KV_NAMESPACE --preview
```

### 4. Update wrangler.toml

Update the KV namespace IDs in `worker/wrangler.toml` with the IDs from step 3.

### 5. Set Worker Secrets

```bash
cd worker
wrangler secret put OPENROUTER_API_KEY
wrangler secret put SCRAPER_API_KEY
wrangler secret put SUPABASE_SERVICE_KEY
```

## Website Deployment

### Option 1: Automated Deployment (Recommended)

Run the deployment script:

```bash
chmod +x scripts/deploy.sh
./scripts/deploy.sh
```

### Option 2: Manual Deployment

#### Step 1: Install Dependencies

```bash
npm install
```

#### Step 2: Run Tests

```bash
npm run test
```

#### Step 3: Build the Application

```bash
npm run build
```

#### Step 4: Deploy to GitHub Pages

```bash
npm install -g gh-pages
npx gh-pages -d out -b gh-pages
```

## Worker Deployment

### Deploy the Cloudflare Worker

```bash
cd worker
npm install
npm run deploy
```

### Test the Worker

```bash
# Test manual trigger
curl https://pulse-news-worker.your-subdomain.workers.dev/trigger

# Check status
curl https://pulse-news-worker.your-subdomain.workers.dev/status
```

## Domain Configuration

### 1. GitHub Pages Custom Domain

1. Go to your repository settings
2. Navigate to "Pages" section
3. Set custom domain to `pulse.utdnews.com`
4. Enable "Enforce HTTPS"

### 2. Cloudflare DNS Setup

Add the following DNS records in Cloudflare:

```
Type: CNAME
Name: pulse
Target: yourusername.github.io
Proxy: Enabled (Orange cloud)
```

### 3. SSL/TLS Configuration

1. Set SSL/TLS encryption mode to "Full (strict)"
2. Enable "Always Use HTTPS"
3. Enable "Automatic HTTPS Rewrites"

## Monitoring and Maintenance

### 1. Monitor Worker Performance

- Check Cloudflare Workers dashboard for execution metrics
- Monitor KV namespace usage
- Review worker logs for errors

### 2. Database Monitoring

- Monitor Supabase dashboard for database performance
- Check API usage and rate limits
- Review database logs for errors

### 3. Content Quality Assurance

- Regularly review automated content for quality
- Monitor AI processing costs
- Check for duplicate content

## Troubleshooting

### Common Issues

#### 1. Worker Not Triggering

- Check cron trigger syntax in `wrangler.toml`
- Verify worker is deployed and active
- Check worker logs for errors

#### 2. Database Connection Issues

- Verify Supabase URL and keys
- Check RLS policies
- Ensure service role key has proper permissions

#### 3. Build Failures

- Check Node.js version (requires 18+)
- Verify all environment variables are set
- Clear `node_modules` and reinstall dependencies

#### 4. AI Processing Errors

- Verify OpenRouter API key
- Check API usage limits
- Monitor model availability

### Getting Help

If you encounter issues:

1. Check the GitHub Issues page
2. Review Cloudflare Workers documentation
3. Check Supabase documentation
4. Contact support through the appropriate channels

## Security Considerations

### 1. API Key Management

- Never commit API keys to version control
- Rotate API keys regularly
- Use environment variables for all secrets

### 2. Database Security

- Keep RLS policies up to date
- Regularly review database access logs
- Use service role key only where necessary

### 3. Content Moderation

- Implement content filtering
- Review automated content regularly
- Have manual review processes for sensitive topics

## Performance Optimization

### 1. Caching Strategy

- Leverage Cloudflare CDN caching
- Implement proper cache headers
- Use KV storage for frequently accessed data

### 2. Image Optimization

- Use Next.js Image component
- Implement lazy loading
- Optimize image sizes and formats

### 3. Database Optimization

- Monitor query performance
- Use appropriate indexes
- Implement pagination for large datasets

## Backup and Recovery

### 1. Database Backups

- Enable Supabase automatic backups
- Implement regular manual backups
- Test backup restoration procedures

### 2. Code Backups

- Use Git for version control
- Maintain multiple deployment environments
- Document rollback procedures

## Compliance and Legal

### 1. Content Attribution

- Ensure proper source attribution
- Respect copyright and fair use
- Implement content takedown procedures

### 2. Privacy Policy

- Implement privacy policy
- Handle user data appropriately
- Comply with relevant data protection laws

### 3. Terms of Service

- Create clear terms of service
- Define acceptable use policies
- Implement user reporting mechanisms
