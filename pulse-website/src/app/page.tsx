'use client';

import React, { useState, useEffect } from 'react';
import ArticleCard from '@/components/ui/ArticleCard';
import CategoryFilter from '@/components/ui/CategoryFilter';
import NewsletterSignup from '@/components/ui/NewsletterSignup';
import Sidebar from '@/components/layout/Sidebar';
import Button from '@/components/common/Button';
import { Article } from '@/types/database';
import AdPlaceholder from '@/components/common/AdPlaceholder';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { createClient } from '@/utils/supabase/client';

// Fallback data for when database is not available
const fallbackArticles: Article[] = [
  {
    id: '1',
    title: "Kenya's Economic Recovery Shows Promising Signs in Q4 2024",
    slug: 'kenya-economic-recovery-q4-2024',
    content: 'Full article content here...',
    summary:
      "Kenya's economy demonstrates resilience with improved GDP growth, reduced inflation, and increased foreign investment in the final quarter of 2024.",
    category: 'Business',
    source_url: 'https://example.com/article1',
    image_url:
      'https://images.unsplash.com/photo-1590283603385-17ffb3a7f29f?w=800&h=400&fit=crop',
    published_at: '2024-12-15T10:30:00Z',
    created_at: '2024-12-15T10:30:00Z',
    updated_at: '2024-12-15T10:30:00Z',
  },
  {
    id: '2',
    title: 'Technology Innovation Hub Opens in Nairobi, Creating 5000 Jobs',
    slug: 'nairobi-tech-hub-5000-jobs',
    content: 'Full article content here...',
    summary:
      'A new state-of-the-art technology innovation hub in Nairobi promises to create thousands of jobs and position Kenya as a regional tech leader.',
    category: 'Technology',
    source_url: 'https://example.com/article2',
    image_url:
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?w=800&h=400&fit=crop',
    published_at: '2024-12-15T08:15:00Z',
    created_at: '2024-12-15T08:15:00Z',
    updated_at: '2024-12-15T08:15:00Z',
  },
  {
    id: '3',
    title: 'Climate Change Summit: Kenya Leads East African Green Initiative',
    slug: 'kenya-climate-summit-green-initiative',
    content: 'Full article content here...',
    summary:
      'Kenya spearheads a groundbreaking environmental initiative at the regional climate summit, focusing on renewable energy and conservation.',
    category: 'Politics',
    source_url: 'https://example.com/article3',
    image_url:
      'https://images.unsplash.com/photo-1569163139394-de4e4f43e4e5?w=800&h=400&fit=crop',
    published_at: '2024-12-14T16:45:00Z',
    created_at: '2024-12-14T16:45:00Z',
    updated_at: '2024-12-14T16:45:00Z',
  },
  {
    id: '4',
    title: 'Kenyan Athletes Dominate International Championships',
    slug: 'kenyan-athletes-international-championships',
    content: 'Full article content here...',
    summary:
      'Kenyan runners continue their winning streak at international athletics championships, bringing home multiple gold medals.',
    category: 'Sports',
    source_url: 'https://example.com/article4',
    image_url:
      'https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800&h=400&fit=crop',
    published_at: '2024-12-14T14:20:00Z',
    created_at: '2024-12-14T14:20:00Z',
    updated_at: '2024-12-14T14:20:00Z',
  },
  {
    id: '5',
    title: 'New Entertainment Complex Opens in Mombasa',
    slug: 'mombasa-entertainment-complex-opens',
    content: 'Full article content here...',
    summary:
      'A world-class entertainment complex featuring cinemas, restaurants, and cultural venues opens in Mombasa, boosting tourism.',
    category: 'Entertainment',
    source_url: 'https://example.com/article5',
    image_url:
      'https://images.unsplash.com/photo-1489599162163-3f4b2c5b8b5b?w=800&h=400&fit=crop',
    published_at: '2024-12-14T12:00:00Z',
    created_at: '2024-12-14T12:00:00Z',
    updated_at: '2024-12-14T12:00:00Z',
  },
];

const fallbackCategories = [
  'Politics',
  'Business',
  'Technology',
  'Sports',
  'Entertainment',
];

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>(fallbackArticles);
  const [categories, setCategories] = useState<string[]>(fallbackCategories);
  const [isLoading, setIsLoading] = useState(true);
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    async function fetchData() {
      try {
        const supabase = createClient();
        
        // Fetch articles
        const { data: articlesData, error: articlesError } = await supabase
          .from('articles')
          .select('*')
          .order('published_at', { ascending: false });

        if (articlesData && !articlesError) {
          setArticles(articlesData);
        }

        // Fetch categories
        const { data: categoriesData, error: categoriesError } = await supabase
          .from('categories')
          .select('name')
          .order('name');

        if (categoriesData && !categoriesError) {
          setCategories(categoriesData.map(cat => cat.name));
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        // Keep fallback data
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, []);

  // Helper function to convert database article to component props
  const convertArticle = (article: Article) => ({
    id: article.id,
    title: article.title,
    slug: article.slug,
    summary: article.summary || undefined,
    category: article.category,
    image_url: article.image_url || undefined,
    published_at: article.published_at || article.created_at || new Date().toISOString(),
    source_url: article.source_url || undefined,
  });

  const filteredArticles = activeCategory === 'All' 
    ? articles 
    : articles.filter(article => article.category === activeCategory);

  const featuredArticle = filteredArticles[0];
  const recentArticles = filteredArticles.slice(1);

  const handleCategoryChange = (category: string) => {
    setActiveCategory(category);
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <>
      {/* WebPage JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebPage',
            '@id': 'https://www.pulsenews.publicvm.com/#webpage',
            name: 'Pulse News - Latest News from Kenya and Beyond',
            description: 'Stay informed with Pulse News – your trusted source for the latest news and insights from Kenya and around the world.',
            url: 'https://www.pulsenews.publicvm.com',
            lastReviewed: new Date().toISOString(),
            reviewedBy: {
              '@type': 'Organization',
              name: 'Pulse News Editorial Team',
            },
          }),
        }}
      />

      {/* Sitelinks Search Box JSON-LD */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            '@context': 'https://schema.org',
            '@type': 'WebSite',
            url: 'https://www.pulsenews.publicvm.com',
            potentialAction: {
              '@type': 'SearchAction',
              target: 'https://www.pulsenews.publicvm.com/search?q={search_term_string}',
              'query-input': 'required name=search_term_string',
            },
          }),
        }}
      />

      <div className="min-h-screen bg-background">
        {/* Ad Bar Below Header */}
      <div className="bg-light-gray border-b border-medium-gray">
        <div className="container mx-auto px-4 h-24 flex items-center justify-center">
          <AdPlaceholder
            width={970}
            height={90}
            className="hidden lg:block"
            label="Leaderboard Ad"
          />
          <AdPlaceholder
            width={728}
            height={90}
            className="hidden md:block lg:hidden"
            label="Leaderboard Ad"
          />
          <AdPlaceholder
            width={320}
            height={50}
            className="md:hidden"
            label="Mobile Ad"
          />
        </div>
      </div>

      {/* Main Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-3">
              {/* Category Filter */}
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-4">Browse by Category</h2>
                <CategoryFilter
                  categories={categories}
                  activeCategory={activeCategory}
                  onCategoryChange={handleCategoryChange}
                />
              </div>

              {/* Featured Article */}
              {featuredArticle && (
                <div className="mb-12">
                  <h2 className="text-2xl font-bold mb-6">Featured Story</h2>
                  <ArticleCard 
                    article={convertArticle(featuredArticle)} 
                    variant="featured" 
                  />
                </div>
              )}

              {/* Recent Articles Grid */}
              <div className="mb-12">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold">Latest News</h2>
                  <Button variant="outline" onClick={() => console.log('View all clicked')}>
                    View All
                  </Button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {recentArticles.map((article, index) => (
                    <React.Fragment key={article.id}>
                      <ArticleCard article={convertArticle(article)} variant="default" />
                      {(index + 1) % 2 === 0 && (
                        <div className="md:col-span-2 flex justify-center my-4">
                          <AdPlaceholder
                            width={728}
                            height={90}
                            label="In-Feed Ad"
                          />
                        </div>
                      )}
                    </React.Fragment>
                  ))}
                </div>
              </div>

              {/* Load More */}
              <div className="text-center">
                <Button 
                  variant="primary" 
                  size="lg"
                  onClick={() => console.log('Load more clicked')}
                >
                  Load More Articles
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Sidebar />
            </div>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="bg-light-gray py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <NewsletterSignup />
          </div>
        </div>
      </section>

      {/* Trending Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Trending Stories</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {filteredArticles.slice(0, 3).map(article => (
              <ArticleCard
                key={article.id}
                article={convertArticle(article)}
                variant="compact"
              />
            ))}
          </div>
        </div>
      </section>
      </div>
    </>
  );
}