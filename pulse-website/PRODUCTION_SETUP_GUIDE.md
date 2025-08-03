# Production Setup Guide - Pulse UTD News

## 🎯 **Current Status: 90% Complete - Ready for Final Deployment**

The application is fully functional and running successfully. We need to complete the final 10% to go live:

### ✅ **What's Already Working**
- Frontend application (Next.js 15) - 100% complete
- Database (Supabase) - 100% complete with real data
- Search functionality - 100% complete
- Static export configuration - 100% complete
- All core features - 100% complete

### 🔄 **What's Needed for Production (Estimated: 2 hours)**

---

## **Step 1: Get Required API Keys (30 minutes)**

### 1.1 OpenRouter API Key (Required for AI processing)
1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Sign up for an account
3. Navigate to "Keys" section
4. Create a new API key
5. Copy the key (starts with `sk-or-v1-...`)

**Cost**: ~$5-10/month for moderate usage

### 1.2 ScraperAPI Key (Optional - for fallback scraping)
1. Go to [ScraperAPI.com](https://www.scraperapi.com/)
2. Sign up for free account (1000 requests/month free)
3. Get your API key from dashboard
4. Copy the key

**Cost**: Free tier available, $29/month for more requests

### 1.3 Cloudflare Account Setup
1. Go to [Cloudflare.com](https://cloudflare.com/)
2. Sign up for free account
3. Go to "My Profile" → "API Tokens"
4. Create token with "Custom token" template:
   - Permissions: `Zone:Zone:Read`, `Zone:Zone Settings:Edit`, `Account:Cloudflare Workers:Edit`
   - Account Resources: Include your account
   - Zone Resources: Include all zones
5. Copy the token

**Cost**: Free tier sufficient

---

## **Step 2: Configure Environment Variables (10 minutes)**

Update your `.env.local` file with the real API keys:

```bash
# Replace these placeholder values with real API keys:

# OpenRouter AI Configuration (REQUIRED)
OPENROUTER_API_KEY=sk-or-v1-your-actual-openrouter-key-here

# ScraperAPI Configuration (OPTIONAL)
SCRAPER_API_KEY=your-actual-scraper-api-key-here

# Cloudflare Configuration
CLOUDFLARE_API_TOKEN=your-actual-cloudflare-token-here
CLOUDFLARE_ACCOUNT_ID=your-actual-account-id-here
```

---

## **Step 3: Deploy Cloudflare Worker (45 minutes)**

### 3.1 Install Wrangler CLI
```bash
npm install -g wrangler
```

### 3.2 Login to Cloudflare
```bash
wrangler login
```

### 3.3 Create KV Namespace
```bash
cd worker
wrangler kv:namespace create "KV_NAMESPACE"
wrangler kv:namespace create "KV_NAMESPACE" --preview
```

### 3.4 Update wrangler.toml with KV IDs
Replace the placeholder IDs in `worker/wrangler.toml` with the actual IDs from step 3.3.

### 3.5 Set Worker Secrets
```bash
cd worker
wrangler secret put OPENROUTER_API_KEY
wrangler secret put SCRAPER_API_KEY
wrangler secret put SUPABASE_SERVICE_KEY
```

### 3.6 Deploy Worker
```bash
cd worker
npm run deploy
```

### 3.7 Test Worker
```bash
# Test the status endpoint
curl https://pulse-news-worker.your-subdomain.workers.dev/status

# Manually trigger processing
curl -X POST https://pulse-news-worker.your-subdomain.workers.dev/trigger
```

---

## **Step 4: Deploy Frontend to GitHub Pages (30 minutes)**

### 4.1 Build and Deploy
```bash
npm run build
npm run deploy
```

### 4.2 Configure GitHub Pages
1. Go to your GitHub repository settings
2. Navigate to "Pages" section
3. Set source to "Deploy from a branch"
4. Select "gh-pages" branch
5. Save settings

### 4.3 Verify Deployment
Your site will be available at: `https://yourusername.github.io/utd/`

---

## **Step 5: Configure Custom Domain (15 minutes)**

### 5.1 Set up FreeDNS Subdomain
1. Go to [FreeDNS.afraid.org](https://freedns.afraid.org/)
2. Create account and login
3. Add subdomain: `pulse.utdnews.com`
4. Point to your GitHub Pages URL

### 5.2 Configure GitHub Pages Custom Domain
1. In your repository settings → Pages
2. Add custom domain: `pulse.utdnews.com`
3. Enable "Enforce HTTPS"

---

## **Step 6: Final Testing & Monitoring (10 minutes)**

### 6.1 Test Complete Workflow
1. Visit `https://pulse.utdnews.com`
2. Verify homepage loads with articles
3. Test search functionality
4. Check article detail pages
5. Verify mobile responsiveness

### 6.2 Monitor Automation
1. Check worker logs in Cloudflare dashboard
2. Verify new articles are being processed
3. Monitor database for new content

---

## **🚀 Production Checklist**

### Before Going Live
- [ ] All API keys configured and tested
- [ ] Cloudflare Worker deployed and running
- [ ] Frontend deployed to GitHub Pages
- [ ] Custom domain configured
- [ ] SSL certificate active
- [ ] All functionality tested

### Post-Launch Monitoring
- [ ] Worker processing articles every 5 minutes
- [ ] Database growing with new content
- [ ] Site performance monitoring
- [ ] Error tracking and alerts

---

## **📊 Expected Performance**

### Content Automation
- **Frequency**: New articles every 5 minutes
- **Sources**: 12 Kenyan news RSS feeds
- **Processing**: AI categorization and rewriting
- **Storage**: Automatic database updates

### Site Performance
- **Load Time**: < 3 seconds
- **Mobile Score**: 90+ (Lighthouse)
- **SEO Score**: 95+ (Lighthouse)
- **Accessibility**: 100 (WCAG compliant)

---

## **💰 Monthly Costs**

### Required Services
- **Cloudflare Workers**: Free (100,000 requests/day)
- **Supabase**: Free (500MB database, 50MB file storage)
- **GitHub Pages**: Free
- **FreeDNS**: Free

### Optional Services
- **OpenRouter AI**: ~$5-10/month (for content processing)
- **ScraperAPI**: Free tier or $29/month
- **Custom Domain**: $10-15/year (if not using FreeDNS)

**Total Monthly Cost**: $5-10 (mostly AI processing)

---

## **🔧 Troubleshooting**

### Common Issues

#### Worker Not Processing Articles
1. Check worker logs in Cloudflare dashboard
2. Verify API keys are set correctly
3. Test RSS feeds manually
4. Check database connection

#### Site Not Loading
1. Verify GitHub Pages deployment
2. Check DNS configuration
3. Ensure SSL certificate is active
4. Test with different browsers

#### Search Not Working
1. Check Supabase connection
2. Verify database has articles
3. Test API endpoints manually
4. Check browser console for errors

---

## **📞 Support Resources**

### Documentation
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)
- [Supabase Docs](https://supabase.com/docs)
- [Next.js Docs](https://nextjs.org/docs)
- [GitHub Pages Docs](https://docs.github.com/en/pages)

### Community
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [Supabase Discord](https://discord.supabase.com/)
- [Next.js Discussions](https://github.com/vercel/next.js/discussions)

---

**🎉 You're almost there! Follow these steps and you'll have a fully automated news website running in production within 2 hours.**