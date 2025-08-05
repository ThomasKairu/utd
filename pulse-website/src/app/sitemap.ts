import { MetadataRoute } from 'next';
import { createClient } from '@/utils/supabase/client';

export const dynamic = 'force-static';

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = 'https://www.pulsenews.publicvm.com';
  
  try {
    const supabase = createClient();
    
    // Fetch all articles
    const { data: articles } = await supabase
      .from('articles')
      .select('slug, updated_at, created_at, published_at')
      .order('published_at', { ascending: false });

    const sitemap: MetadataRoute.Sitemap = [
      // Static pages
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/editorial-policy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
      {
        url: `${baseUrl}/search`,
        lastModified: new Date(),
        changeFrequency: 'weekly',
        priority: 0.6,
      },
    ];

    // Add category pages (hardcoded for now)
    const categories = ['politics', 'business', 'technology', 'sports', 'entertainment'];
    categories.forEach((category) => {
      sitemap.push({
        url: `${baseUrl}/category/${category}`,
        lastModified: new Date(),
        changeFrequency: 'daily',
        priority: 0.8,
      });
    });

    // Add article pages
    if (articles) {
      articles.forEach((article) => {
        sitemap.push({
          url: `${baseUrl}/article/${article.slug}`,
          lastModified: new Date(article.updated_at || article.created_at || article.published_at || new Date()),
          changeFrequency: 'weekly',
          priority: 0.9,
        });
      });
    }

    return sitemap;
  } catch (error) {
    console.error('Error generating sitemap:', error);
    
    // Return basic sitemap if database fails
    return [
      {
        url: baseUrl,
        lastModified: new Date(),
        changeFrequency: 'hourly',
        priority: 1,
      },
      {
        url: `${baseUrl}/about`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.8,
      },
      {
        url: `${baseUrl}/editorial-policy`,
        lastModified: new Date(),
        changeFrequency: 'monthly',
        priority: 0.7,
      },
    ];
  }
}