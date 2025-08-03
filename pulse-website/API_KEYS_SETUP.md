# API Keys Setup Guide - Pulse UTD News

## 🔑 **Required API Keys for Full Functionality**

### **1. OpenRouter API Key (REQUIRED for AI processing)**

**What it does**: Powers the AI content processing, categorization, and rewriting

**How to get it**:
1. Go to [OpenRouter.ai](https://openrouter.ai/)
2. Click "Sign Up" and create an account
3. Verify your email address
4. Go to "Keys" section in your dashboard
5. Click "Create Key"
6. Name it "Pulse UTD News"
7. Copy the key (starts with `sk-or-v1-...`)

**Cost**: 
- Pay-per-use model
- ~$0.001-0.01 per article processed
- Estimated $5-10/month for moderate usage
- Free $1 credit to start

**Add to .env.local**:
```bash
OPENROUTER_API_KEY=sk-or-v1-your-actual-key-here
```

---

### **2. ScraperAPI Key (OPTIONAL - for fallback scraping)**

**What it does**: Provides fallback web scraping when direct scraping fails

**How to get it**:
1. Go to [ScraperAPI.com](https://www.scraperapi.com/)
2. Click "Start Free Trial"
3. Create account with email
4. Go to dashboard
5. Copy your API key

**Cost**:
- Free tier: 1,000 requests/month
- Paid plans: $29/month for 100,000 requests
- Most sites work with direct scraping, so this is optional

**Add to .env.local**:
```bash
SCRAPER_API_KEY=your-scraper-api-key-here
```

---

### **3. Cloudflare API Token (REQUIRED for worker deployment)**

**What it does**: Allows deployment and management of Cloudflare Workers

**How to get it**:
1. Go to [Cloudflare.com](https://cloudflare.com/)
2. Sign up for free account
3. Go to "My Profile" → "API Tokens"
4. Click "Create Token"
5. Use "Custom token" template
6. Set permissions:
   - `Account:Cloudflare Workers:Edit`
   - `Zone:Zone:Read`
   - `Zone:Zone Settings:Edit`
7. Set account resources: Include your account
8. Set zone resources: Include all zones
9. Click "Continue to summary" → "Create Token"
10. Copy the token

**Cost**: Free

**Add to .env.local**:
```bash
CLOUDFLARE_API_TOKEN=your-cloudflare-token-here
```

---

## 🔧 **Quick Setup Commands**

### **Step 1: Update Environment File**
```bash
# Open your .env.local file and replace the placeholder values:

# Before (placeholders):
OPENROUTER_API_KEY=your_openrouter_api_key
SCRAPER_API_KEY=your_scraper_api_key
CLOUDFLARE_API_TOKEN=your_cloudflare_api_token

# After (real keys):
OPENROUTER_API_KEY=sk-or-v1-abc123...
SCRAPER_API_KEY=def456...
CLOUDFLARE_API_TOKEN=ghi789...
```

### **Step 2: Test API Keys**
```bash
# Test OpenRouter connection
node scripts/test-apis.js

# Test Supabase connection (should already work)
npm run test:db
```

### **Step 3: Deploy Worker with Keys**
```bash
cd worker
wrangler secret put OPENROUTER_API_KEY
# Paste your OpenRouter key when prompted

wrangler secret put SCRAPER_API_KEY
# Paste your ScraperAPI key when prompted (or skip if not using)

wrangler secret put SUPABASE_SERVICE_KEY
# Use the service key from your .env.local file
```

---

## 🧪 **Testing Your Setup**

### **Test 1: OpenRouter API**
```bash
curl -X POST "https://openrouter.ai/api/v1/chat/completions" \
  -H "Authorization: Bearer YOUR_OPENROUTER_KEY" \
  -H "Content-Type: application/json" \
  -d '{
    "model": "openai/gpt-4o-mini",
    "messages": [{"role": "user", "content": "Hello"}]
  }'
```

### **Test 2: ScraperAPI (if using)**
```bash
curl "http://api.scraperapi.com?api_key=YOUR_SCRAPER_KEY&url=https://example.com"
```

### **Test 3: Cloudflare Worker**
```bash
# After deployment
curl https://pulse-news-worker.your-subdomain.workers.dev/status
```

---

## 🚨 **Security Best Practices**

### **Environment Variables**
- ✅ Never commit `.env.local` to Git
- ✅ Use different keys for development and production
- ✅ Rotate keys regularly (monthly)
- ✅ Monitor usage and costs

### **API Key Management**
- ✅ Set spending limits on paid APIs
- ✅ Use least-privilege access
- ✅ Monitor API usage logs
- ✅ Revoke unused keys

### **Cloudflare Security**
- ✅ Enable 2FA on Cloudflare account
- ✅ Use API tokens instead of global API keys
- ✅ Set IP restrictions if possible
- ✅ Monitor worker logs for suspicious activity

---

## 💰 **Cost Optimization Tips**

### **OpenRouter**
- Use cheaper models for simple tasks (gpt-4o-mini vs gpt-4)
- Implement caching to avoid reprocessing
- Set monthly spending limits
- Monitor usage in dashboard

### **ScraperAPI**
- Start with free tier
- Use direct scraping first, ScraperAPI as fallback
- Optimize scraping frequency
- Consider upgrading only if needed

### **Cloudflare**
- Free tier covers most use cases
- Workers have 100,000 requests/day free
- KV storage has 1GB free
- Monitor usage in dashboard

---

## 🔍 **Troubleshooting**

### **OpenRouter Issues**
- **Invalid API key**: Check key format (starts with `sk-or-v1-`)
- **Rate limits**: Implement exponential backoff
- **Model errors**: Use fallback models
- **Billing issues**: Check account balance

### **ScraperAPI Issues**
- **Request limits**: Monitor usage dashboard
- **Blocked requests**: Try different proxy locations
- **Timeout errors**: Increase timeout settings
- **Quality issues**: Validate scraped content

### **Cloudflare Issues**
- **Authentication**: Verify API token permissions
- **Deployment**: Check wrangler.toml configuration
- **Runtime errors**: Check worker logs
- **KV issues**: Verify namespace bindings

---

## 📞 **Support Resources**

### **API Documentation**
- [OpenRouter API Docs](https://openrouter.ai/docs)
- [ScraperAPI Docs](https://www.scraperapi.com/documentation/)
- [Cloudflare Workers Docs](https://developers.cloudflare.com/workers/)

### **Community Support**
- [OpenRouter Discord](https://discord.gg/openrouter)
- [Cloudflare Discord](https://discord.gg/cloudflaredev)
- [ScraperAPI Support](https://www.scraperapi.com/support/)

---

**🎯 Priority: Get OpenRouter API key first - it's required for the automation to work!**