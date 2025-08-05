# Database Setup Instructions for Pulse UTD News

## Supabase Project Details

- **Organization**: Erick
- **Project Name**: pulse
- **Project URL**: https://lnmrpwmtvscsczslzvec.supabase.co
- **Database Password**: zqXkx5xbYFw4t0xy

## Step-by-Step Database Setup

### 1. Access Supabase Dashboard

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Navigate to your project: **pulse** (https://lnmrpwmtvscsczslzvec.supabase.co)

### 2. Execute Database Schema

1. In the Supabase dashboard, click on **"SQL Editor"** in the left sidebar
2. Click **"New Query"**
3. Copy and paste the entire contents of `schema.sql` (provided below)
4. Click **"Run"** to execute the schema

### 3. Verify Database Setup

After running the schema, verify that the following were created:

#### Tables Created:

- ✅ `categories` - News categories (Politics, Business, Technology, Sports, Entertainment)
- ✅ `articles` - News articles with full content

#### Indexes Created:

- ✅ `idx_articles_category` - For category filtering
- ✅ `idx_articles_published_at` - For chronological sorting
- ✅ `idx_articles_slug` - For URL routing
- ✅ `idx_articles_search` - For full-text search

#### Security Policies:

- ✅ Row Level Security (RLS) enabled
- ✅ Public read access for articles and categories
- ✅ Authenticated write access for content management

### 4. Get Service Role Key

1. In Supabase dashboard, go to **"Settings"** → **"API"**
2. Copy the **"service_role"** key (not the anon key)
3. Update your `.env.local` file with this key

### 5. Test Database Connection

Run this command to test the database connection:

```bash
npm run dev
```

Then visit `http://localhost:3000` to see if the site loads with database integration.

## Database Schema (Copy this to SQL Editor)

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create categories table
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  name VARCHAR(100) UNIQUE NOT NULL,
  slug VARCHAR(100) UNIQUE NOT NULL,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create articles table
CREATE TABLE IF NOT EXISTS articles (
  id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) UNIQUE NOT NULL,
  content TEXT NOT NULL,
  summary TEXT,
  category VARCHAR(100) NOT NULL,
  source_url TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_articles_category ON articles(category);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_created_at ON articles(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_categories_slug ON categories(slug);

-- Create full-text search index for articles
CREATE INDEX IF NOT EXISTS idx_articles_search ON articles USING gin(to_tsvector('english', title || ' ' || COALESCE(content, '') || ' ' || COALESCE(summary, '')));

-- Enable Row Level Security (RLS)
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access
CREATE POLICY "Articles are viewable by everyone" ON articles
  FOR SELECT USING (true);

CREATE POLICY "Categories are viewable by everyone" ON categories
  FOR SELECT USING (true);

-- Create policies for authenticated users (for admin operations)
CREATE POLICY "Articles can be inserted by authenticated users" ON articles
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Articles can be updated by authenticated users" ON articles
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Articles can be deleted by authenticated users" ON articles
  FOR DELETE USING (auth.role() = 'authenticated');

CREATE POLICY "Categories can be inserted by authenticated users" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');

CREATE POLICY "Categories can be updated by authenticated users" ON categories
  FOR UPDATE USING (auth.role() = 'authenticated');

CREATE POLICY "Categories can be deleted by authenticated users" ON categories
  FOR DELETE USING (auth.role() = 'authenticated');

-- Insert default categories
INSERT INTO categories (name, slug, description) VALUES
  ('Politics', 'politics', 'Political news and government affairs'),
  ('Business', 'business', 'Economic news, markets, and business developments'),
  ('Technology', 'technology', 'Tech innovations, startups, and digital trends'),
  ('Sports', 'sports', 'Sports news, results, and athlete profiles'),
  ('Entertainment', 'entertainment', 'Entertainment news, movies, music, and culture')
ON CONFLICT (slug) DO NOTHING;

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_articles_updated_at BEFORE UPDATE ON articles
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- Create function for full-text search
CREATE OR REPLACE FUNCTION search_articles(search_query TEXT)
RETURNS TABLE(
  id UUID,
  title VARCHAR(255),
  slug VARCHAR(255),
  content TEXT,
  summary TEXT,
  category VARCHAR(100),
  source_url TEXT,
  image_url TEXT,
  published_at TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE,
  rank REAL
) AS $$
BEGIN
  RETURN QUERY
  SELECT
    a.id,
    a.title,
    a.slug,
    a.content,
    a.summary,
    a.category,
    a.source_url,
    a.image_url,
    a.published_at,
    a.created_at,
    a.updated_at,
    ts_rank(to_tsvector('english', a.title || ' ' || COALESCE(a.content, '') || ' ' || COALESCE(a.summary, '')), plainto_tsquery('english', search_query)) as rank
  FROM articles a
  WHERE to_tsvector('english', a.title || ' ' || COALESCE(a.content, '') || ' ' || COALESCE(a.summary, '')) @@ plainto_tsquery('english', search_query)
  ORDER BY rank DESC, a.published_at DESC;
END;
$$ LANGUAGE plpgsql;
```

## Troubleshooting

### Common Issues:

1. **"relation already exists" errors**: This is normal if running the schema multiple times. The `IF NOT EXISTS` clauses prevent conflicts.

2. **Permission denied errors**: Make sure you're logged into the correct Supabase project and have admin access.

3. **RLS policy errors**: The policies are designed to allow public read access and authenticated write access.

### Verification Queries:

After setup, run these queries in the SQL Editor to verify everything works:

```sql
-- Check if tables exist
SELECT table_name FROM information_schema.tables
WHERE table_schema = 'public' AND table_name IN ('articles', 'categories');

-- Check if categories were inserted
SELECT * FROM categories;

-- Check if indexes exist
SELECT indexname FROM pg_indexes WHERE tablename IN ('articles', 'categories');

-- Test RLS policies
SELECT * FROM articles LIMIT 1;
SELECT * FROM categories LIMIT 1;
```

## Next Steps

After database setup:

1. ✅ Update `.env.local` with the service role key
2. ✅ Test the application locally: `npm run dev`
3. ✅ Deploy the Cloudflare Worker for automated content processing
4. ✅ Configure domain and SSL for production deployment

## Support

If you encounter any issues:

1. Check the Supabase logs in the dashboard
2. Verify your API keys are correct
3. Ensure RLS policies are properly configured
4. Contact support if needed
