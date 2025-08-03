'use client';

import React, { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Article, Category } from '@/types/database';
import ArticleCard from '@/components/ui/ArticleCard';
import Button from '@/components/common/Button';
import AdPlaceholder from '@/components/common/AdPlaceholder';
import Sidebar from '@/components/layout/Sidebar';
import LoadingSpinner from '@/components/common/LoadingSpinner';
import { createClient } from '@/utils/supabase/client';

export default function CategoryPage() {
  const params = useParams();
  const slug = params.slug as string;
  
  const [category, setCategory] = useState<Category | null>(null);
  const [articles, setArticles] = useState<Article[]>([]);
  const [allCategories, setAllCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    async function fetchData() {
      if (!slug) return;

      try {
        const supabase = createClient();
        
        // Fetch the category
        const { data: categoryData, error: categoryError } = await supabase
          .from('categories')
          .select('*')
          .eq('slug', slug)
          .single();

        if (categoryError || !categoryData) {
          setNotFound(true);
          return;
        }

        setCategory(categoryData);

        // Fetch articles for this category
        const { data: articlesData } = await supabase
          .from('articles')
          .select('*')
          .eq('category', categoryData.name)
          .order('published_at', { ascending: false });

        if (articlesData) {
          setArticles(articlesData);
        }

        // Fetch all categories for navigation
        const { data: categoriesData } = await supabase
          .from('categories')
          .select('*')
          .order('name');

        if (categoriesData) {
          setAllCategories(categoriesData);
        }
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setNotFound(true);
      } finally {
        setIsLoading(false);
      }
    }

    fetchData();
  }, [slug]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (notFound || !category) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">Category Not Found</h1>
          <p className="text-text-secondary mb-6">The category you're looking for doesn't exist.</p>
          <Link href="/">
            <Button variant="primary">Back to Home</Button>
          </Link>
        </div>
      </div>
    );
  }

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
                          article={article}
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
                          <ArticleCard article={article} variant="horizontal" />
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
                  <Button 
                    variant="primary" 
                    size="lg"
                    onClick={() => console.log('Load more clicked')}
                  >
                    Load More {category.name} Articles
                  </Button>
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