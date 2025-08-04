import React from 'react';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Metadata } from 'next';
import { Article, Category } from '@/types/database';
import ArticleCard from '@/components/ui/ArticleCard';
import Button from '@/components/common/Button';
import AdPlaceholder from '@/components/common/AdPlaceholder';
import Sidebar from '@/components/layout/Sidebar';
import { createClient } from '@/utils/supabase/client';
import LoadMoreButton from './LoadMoreButton';

// Generate static params for all categories
export async function generateStaticParams() {
  try {
    const supabase = createClient();
    const { data: categories } = await supabase
      .from('categories')
      .select('slug');

    return categories?.map((category) => ({
      slug: category.slug,
    })) || [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

async function getCategoryData(slug: string): Promise<{ category: Category; articles: Article[]; allCategories: Category[] } | null> {
  try {
    const supabase = createClient();
    
    // Fetch the category
    const { data: categoryData, error: categoryError } = await supabase
      .from('categories')
      .select('*')
      .eq('slug', slug)
      .single();

    if (categoryError || !categoryData) {
      return null;
    }

    // Fetch articles for this category
    const { data: articlesData } = await supabase
      .from('articles')
      .select('*')
      .eq('category', categoryData.name)
      .order('published_at', { ascending: false });

    // Fetch all categories for navigation
    const { data: categoriesData } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    return {
      category: categoryData,
      articles: articlesData || [],
      allCategories: categoriesData || [],
    };
  } catch (error) {
    console.error('Failed to fetch data:', error);
    return null;
  }
}

// Generate metadata for SEO
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const data = await getCategoryData(slug);
  
  if (!data) {
    return {
      title: 'Category Not Found | Pulse News',
      description: 'The requested category could not be found.',
    };
  }

  const { category, articles } = data;
  const baseUrl = 'https://www.pulsenews.publicvm.com';
  const categoryUrl = `${baseUrl}/category/${category.slug}`;
  
  const description = category.description || 
    `Latest ${category.name.toLowerCase()} news from Kenya and around the world. Stay updated with breaking news, analysis, and insights.`;

  const latestArticle = articles[0];

  return {
    title: `${category.name} News | Pulse News`,
    description,
    keywords: [
      category.name,
      `${category.name} news`,
      'Kenya news',
      'breaking news',
      'latest news',
      'African news',
      `${category.name.toLowerCase()} updates`,
    ].join(', '),
    authors: [{ name: 'Pulse News Editorial Team' }],
    publisher: 'Pulse News',
    category: category.name,
    openGraph: {
      title: `${category.name} News | Pulse News`,
      description,
      url: categoryUrl,
      siteName: 'Pulse News',
      images: latestArticle?.image_url ? [
        {
          url: latestArticle.image_url,
          width: 1200,
          height: 630,
          alt: `Latest ${category.name} news`,
        }
      ] : [],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: 'summary_large_image',
      title: `${category.name} News | Pulse News`,
      description,
      images: latestArticle?.image_url ? [latestArticle.image_url] : [],
      creator: '@pulsenews',
      site: '@pulsenews',
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    alternates: {
      canonical: categoryUrl,
    },
    other: {
      'article:section': category.name,
      'article:tag': category.name,
      'news:section': category.name,
      'news:keywords': `${category.name}, Kenya, News`,
    },
  };
}

export default async function CategoryPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getCategoryData(slug);
  
  if (!data) {
    notFound();
  }

  const { category, articles, allCategories } = data;

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

  const featuredArticles = articles.slice(0, 3);
  const remainingArticles = articles.slice(3);

  return (
    <div className="min-h-screen bg-background">
      {/* Ad Bar */}
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

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Main Content */}
          <main className="lg:col-span-3">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-text-secondary">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li className="text-text-primary">{category.name}</li>
              </ol>
            </nav>

            {/* Category Header */}
            <header className="mb-8">
              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
                {category.name} News
              </h1>
              {category.description && (
                <p className="text-xl text-text-secondary leading-relaxed">
                  {category.description}
                </p>
              )}
            </header>

            {/* Category Navigation */}
            <div className="mb-8">
              <h2 className="text-lg font-semibold mb-4">Browse Categories</h2>
              <div className="flex flex-wrap gap-2">
                <Link
                  href="/"
                  className="px-4 py-2 bg-light-gray text-text-primary rounded-full hover:bg-medium-gray transition-colors"
                >
                  All News
                </Link>
                {allCategories.map(cat => (
                  <Link
                    key={cat.id}
                    href={`/category/${cat.slug}`}
                    className={`px-4 py-2 rounded-full transition-colors ${
                      cat.slug === slug
                        ? 'bg-primary text-white'
                        : 'bg-light-gray text-text-primary hover:bg-medium-gray'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
              </div>
            </div>

            {articles.length === 0 ? (
              /* No Articles State */
              <div className="text-center py-12">
                <h2 className="text-2xl font-semibold text-text-primary mb-4">
                  No articles found in {category.name}
                </h2>
                <p className="text-text-secondary mb-6">
                  Check back later for the latest {category.name.toLowerCase()}{' '}
                  news.
                </p>
                <Link href="/">
                  <Button variant="primary">Browse All News</Button>
                </Link>
              </div>
            ) : (
              <>
                {/* Featured Articles */}
                {featuredArticles.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">
                      Featured {category.name} Stories
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      {featuredArticles.map(article => (
                        <ArticleCard
                          key={article.id}
                          article={convertArticle(article)}
                          variant="default"
                        />
                      ))}
                    </div>
                  </section>
                )}

                {/* In-Feed Ad */}
                <div className="my-8 flex justify-center">
                  <AdPlaceholder width={728} height={90} label="In-Feed Ad" />
                </div>

                {/* All Articles */}
                {remainingArticles.length > 0 && (
                  <section className="mb-12">
                    <h2 className="text-2xl font-bold mb-6">
                      Latest {category.name} News
                    </h2>
                    <div className="space-y-6">
                      {remainingArticles.map((article, index) => (
                        <React.Fragment key={article.id}>
                          <ArticleCard 
                            article={convertArticle(article)} 
                            variant="horizontal" 
                          />
                          {/* Insert ad every 5 articles */}
                          {(index + 1) % 5 === 0 && (
                            <div className="flex justify-center my-6">
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
                  </section>
                )}

                {/* Load More Button */}
                <div className="text-center">
                  <LoadMoreButton categoryName={category.name} />
                </div>
              </>
            )}
          </main>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Sidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}