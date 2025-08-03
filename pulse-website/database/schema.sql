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