# Deployment Checklist - Pulse UTD News

## ✅ **Completed Tasks**

- [x] Frontend application built and tested
- [x] Database configured with sample data
- [x] Cloudflare Worker code written
- [x] OpenRouter API keys obtained
- [x] Site extractors configured for 12 news sources
- [x] Documentation completed

## 🔄 **Current Task: Deploy Cloudflare Worker**

### **Prerequisites Check**
- [ ] Cloudflare account created
- [ ] Wrangler CLI installed
- [ ] Node.js 18+ installed
- [ ] Supabase service key obtained

### **Deployment Steps**

#### 1. Install Wrangler CLI
```bash
npm install -g wrangler@latest
```

#### 2. Login to Cloudflare
```bash
wrangler login
```

#### 3. Navigate to Worker Directory
```bash
cd worker
npm install
```

#### 4. Create KV Namespaces
```bash
# Production namespace
wrangler kv:namespace create KV_NAMESPACE

# Preview namespace  
wrangler kv:namespace create KV_NAMESPACE --preview
```

#### 5. Update wrangler.toml
Replace the placeholder IDs with actual namespace IDs from step 4.

#### 6. Set Secrets
```bash
# OpenRouter API key (required)
wrangler secret put OPENROUTER_API_KEY
# Enter: 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

# Supabase service key (required)
wrangler secret put SUPABASE_SERVICE_KEY
# Enter your Supabase service role key from dashboard
```

#### 7. Test Locally
```bash
npm run dev
```

#### 8. Deploy to Production
```bash
npm run deploy:prod
```

#### 9. Test Deployment
```bash
# Check status
curl https://your-worker.workers.dev/status

# Manual trigger test
curl -X POST https://your-worker.workers.dev/trigger
```

## 📋 **Post-Deployment Tasks**

### **Immediate (Next 30 minutes)**
- [ ] Verify worker is running
- [ ] Check first articles are being processed
- [ ] Monitor logs for errors
- [ ] Test manual trigger endpoint

### **Short-term (Next 2 hours)**
- [ ] Verify cron is triggering every 5 minutes
- [ ] Check articles appearing in Supabase database
- [ ] Test all 12 RSS feeds are being processed
- [ ] Verify AI processing is working

### **Medium-term (Next 24 hours)**
- [ ] Monitor processing statistics
- [ ] Check error rates and success rates
- [ ] Verify no duplicate articles
- [ ] Test frontend displays new articles

## 🚀 **Production Readiness Checklist**

### **Infrastructure**
- [ ] Cloudflare Worker deployed and running
- [ ] KV namespaces created and configured
- [ ] Cron triggers active (every 5 minutes)
- [ ] All secrets properly set

### **Data Flow**
- [ ] RSS feeds being fetched successfully
- [ ] Custom extractors working for all 12 sites
- [ ] AI processing categorizing articles correctly
- [ ] Articles saving to Supabase database
- [ ] Frontend displaying new articles

### **Monitoring**
- [ ] Status endpoint responding
- [ ] Logs showing successful processing
- [ ] Error handling working correctly
- [ ] Performance within expected ranges

### **Quality Assurance**
- [ ] No duplicate articles being created
- [ ] Article content quality is good
- [ ] Categories being assigned correctly
- [ ] Images being extracted or fallbacks used

## 🎯 **Success Criteria**

**✅ Deployment Successful When:**
- Worker responds to `/status` endpoint
- Articles are processed every 5 minutes
- New articles appear in database
- Frontend shows updated content
- Error rate < 5%
- Processing time < 60 seconds per run

## 📊 **Expected Results**

### **First Hour**
- 12 cron triggers executed
- 5-20 articles processed
- All 12 RSS feeds tested
- Basic functionality verified

### **First Day**
- 288 cron triggers executed
- 50-200 articles processed
- All categories populated
- System stability confirmed

### **First Week**
- 2,016 cron triggers executed
- 300-1,000 articles processed
- Performance patterns established
- Any issues identified and resolved

## 🔧 **Troubleshooting Guide**

### **Common Issues**
1. **KV Namespace errors** → Check IDs in wrangler.toml
2. **Secret not found** → Re-run `wrangler secret put`
3. **Supabase connection failed** → Verify service key and URL
4. **RSS parsing errors** → Check feed URLs are accessible
5. **AI processing failed** → Verify OpenRouter API key

### **Debug Commands**
```bash
# View logs
wrangler tail --format pretty

# Check KV contents
wrangler kv:key list --binding KV_NAMESPACE

# Get processing timestamp
wrangler kv:key get "last_processed_timestamp" --binding KV_NAMESPACE

# List all secrets
wrangler secret list
```

---

**Current Status**: Ready for Cloudflare Worker deployment 🚀
**Next Action**: Follow deployment steps above
**Estimated Time**: 30-45 minutes for complete deployment