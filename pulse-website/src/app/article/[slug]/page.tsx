import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { notFound } from 'next/navigation';
import { Article } from '@/types/database';
import AdPlaceholder from '@/components/common/AdPlaceholder';
import Sidebar from '@/components/layout/Sidebar';
import { createClient } from '@/utils/supabase/client';
import SocialShare from './SocialShare';

// Generate static params for all articles
export async function generateStaticParams() {
  try {
    const supabase = createClient();
    const { data: articles } = await supabase
      .from('articles')
      .select('slug');

    return articles?.map((article) => ({
      slug: article.slug,
    })) || [];
  } catch (error) {
    console.error('Error generating static params:', error);
    return [];
  }
}

async function getArticle(slug: string): Promise<{ article: Article; relatedArticles: Article[] } | null> {
  try {
    const supabase = createClient();
    
    // Fetch the article
    const { data: articleData, error: articleError } = await supabase
      .from('articles')
      .select('*')
      .eq('slug', slug)
      .single();

    if (articleError || !articleData) {
      return null;
    }

    // Fetch related articles
    const { data: relatedData } = await supabase
      .from('articles')
      .select('*')
      .eq('category', articleData.category)
      .neq('id', articleData.id)
      .limit(3);

    return {
      article: articleData,
      relatedArticles: relatedData || [],
    };
  } catch (error) {
    console.error('Failed to fetch article:', error);
    return null;
  }
}

export default async function ArticlePage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  const data = await getArticle(slug);
  
  if (!data) {
    notFound();
  }

  const { article, relatedArticles } = data;

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

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
          {/* Main Article Content */}
          <article className="lg:col-span-3">
            {/* Breadcrumb */}
            <nav className="mb-6">
              <ol className="flex items-center space-x-2 text-sm text-text-secondary">
                <li>
                  <Link href="/" className="hover:text-primary">
                    Home
                  </Link>
                </li>
                <li>/</li>
                <li>
                  <Link
                    href={`/category/${article.category.toLowerCase()}`}
                    className="hover:text-primary"
                  >
                    {article.category}
                  </Link>
                </li>
                <li>/</li>
                <li className="text-text-primary">{article.title}</li>
              </ol>
            </nav>

            {/* Article Header */}
            <header className="mb-8">
              <div className="mb-4">
                <span className="inline-block px-3 py-1 bg-primary text-white text-sm font-medium rounded-full">
                  {article.category}
                </span>
              </div>

              <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4 leading-tight">
                {article.title}
              </h1>

              {article.summary && (
                <p className="text-xl text-text-secondary mb-6 leading-relaxed">
                  {article.summary}
                </p>
              )}

              <div className="flex items-center justify-between text-sm text-text-secondary border-b border-medium-gray pb-6">
                <div className="flex items-center space-x-4">
                  <span>Published: {formatDate(article.published_at || article.created_at || '')}</span>
                  {article.source_url && (
                    <a
                      href={article.source_url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-primary hover:underline"
                    >
                      View Original Source
                    </a>
                  )}
                </div>

                {/* Social Share Buttons */}
                <SocialShare 
                  title={article.title} 
                  url={`https://pulse.utdnews.com/article/${article.slug}`} 
                />
              </div>
            </header>

            {/* Featured Image */}
            {article.image_url && (
              <div className="mb-8">
                <div className="relative aspect-video w-full overflow-hidden rounded-lg">
                  <Image
                    src={article.image_url}
                    alt={article.title}
                    fill
                    className="object-cover"
                    priority
                  />
                </div>
              </div>
            )}

            {/* Article Content */}
            <div className="prose prose-lg max-w-none mb-8">
              <div
                className="text-text-primary leading-relaxed"
                dangerouslySetInnerHTML={{
                  __html: article.content.replace(/\n/g, '<br />'),
                }}
              />
            </div>

            {/* In-Article Ad */}
            <div className="my-8 flex justify-center">
              <AdPlaceholder width={728} height={90} label="In-Article Ad" />
            </div>

            {/* Article Footer */}
            <footer className="border-t border-medium-gray pt-6">
              <div className="flex items-center justify-between">
                <div className="text-sm text-text-secondary">
                  Last updated: {formatDate(article.updated_at || article.created_at || '')}
                </div>

                {/* Tags/Category */}
                <div className="flex items-center space-x-2">
                  <span className="text-sm text-text-secondary">Category:</span>
                  <Link
                    href={`/category/${article.category.toLowerCase()}`}
                    className="px-2 py-1 bg-light-gray text-primary text-sm rounded hover:bg-medium-gray transition-colors"
                  >
                    {article.category}
                  </Link>
                </div>
              </div>
            </footer>

            {/* Related Articles */}
            {relatedArticles.length > 0 && (
              <section className="mt-12">
                <h2 className="text-2xl font-bold mb-6">Related Articles</h2>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  {relatedArticles.map(relatedArticle => (
                    <Link
                      key={relatedArticle.id}
                      href={`/article/${relatedArticle.slug}`}
                      className="group"
                    >
                      <article className="bg-white rounded-lg shadow-sm border border-medium-gray overflow-hidden hover:shadow-md transition-shadow">
                        {relatedArticle.image_url && (
                          <div className="relative aspect-video w-full overflow-hidden">
                            <Image
                              src={relatedArticle.image_url}
                              alt={relatedArticle.title}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                            />
                          </div>
                        )}
                        <div className="p-4">
                          <h3 className="font-semibold text-text-primary group-hover:text-primary transition-colors line-clamp-2">
                            {relatedArticle.title}
                          </h3>
                          <p className="text-sm text-text-secondary mt-2 line-clamp-2">
                            {relatedArticle.summary}
                          </p>
                          <div className="flex items-center justify-between mt-3">
                            <span className="text-xs text-primary font-medium">
                              {relatedArticle.category}
                            </span>
                            <span className="text-xs text-text-secondary">
                              {formatDate(relatedArticle.published_at || relatedArticle.created_at || '')}
                            </span>
                          </div>
                        </div>
                      </article>
                    </Link>
                  ))}
                </div>
              </section>
            )}
          </article>

          {/* Sidebar */}
          <aside className="lg:col-span-1">
            <Sidebar />
          </aside>
        </div>
      </div>
    </div>
  );
}