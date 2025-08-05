# 🔧 Supabase Setup Required for Automation

## ✅ **Current Status:**
- **Supabase URL**: `https://lnmrpwmtvscsczslzvec.supabase.co` ✅ Configured
- **Anon Key**: ✅ Configured  
- **Service Key**: ❌ **NEEDED**
- **Database Schema**: ❌ **NEEDS SETUP**

---

## 🔑 **Step 1: Get Your Supabase Service Key**

1. **Go to your Supabase Dashboard**: https://supabase.com/dashboard
2. **Select your project**: `lnmrpwmtvscsczslzvec`
3. **Go to Settings → API**
4. **Copy the `service_role` key** (NOT the anon key)
5. **Set it as a secret**:

```bash
cd worker
npx wrangler secret put SUPABASE_SERVICE_KEY
# Paste your service_role key when prompted
```

---

## 🗄️ **Step 2: Create Database Schema**

Run this SQL in your Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category VARCHAR(100) NOT NULL,
  source_url TEXT UNIQUE,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Politics', 'politics', 'Political news and government affairs'),
  ('Business', 'business', 'Business and economic news'),
  ('Technology', 'technology', 'Technology and innovation news'),
  ('Sports', 'sports', 'Sports news and updates'),
  ('Entertainment', 'entertainment', 'Entertainment and cultural news')
ON CONFLICT (slug) DO NOTHING;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_source_url ON articles(source_url);

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Articles are viewable by everyone" ON articles
  FOR SELECT USING (true);

CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Create policies for service role write access
CREATE POLICY "Service role can insert articles" ON articles
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Service role can update articles" ON articles
  FOR UPDATE USING (true);

CREATE POLICY "Service role can delete articles" ON articles
  FOR DELETE USING (true);
```

---

## 🧪 **Step 3: Test the Setup**

After completing steps 1 & 2, test the worker:

```bash
# Test manual trigger
curl -X POST https://pulse-news-worker.pulsenews.workers.dev/trigger

# Check status
curl https://pulse-news-worker.pulsenews.workers.dev/status

# Watch logs
npx wrangler tail
```

---

## 🎯 **What Happens Next:**

Once you complete these steps, the automation will:

1. **🕐 Run every 5 minutes** automatically
2. **📡 Fetch news** from 12 Kenyan RSS feeds
3. **🎯 Extract content** using custom scrapers
4. **🤖 Process with AI** using your OpenRouter keys
5. **💾 Save to database** using the service key
6. **📊 Track progress** in KV storage

---

## 🚨 **Important Notes:**

- **Service Key**: Keep this secret! It has full database access
- **Database Schema**: Must be created before the worker can save articles
- **RLS Policies**: Ensure public can read but only service role can write
- **Testing**: Always test with manual trigger first

---

## ✅ **Completion Checklist:**

- [ ] Get Supabase service key from dashboard
- [ ] Set service key as worker secret
- [ ] Run database schema SQL
- [ ] Test worker with manual trigger
- [ ] Verify articles are being saved
- [ ] Check logs for any errors

**Once complete, your automated news system will be fully operational!** 🚀