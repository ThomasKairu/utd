import { createClient } from '../../../utils/supabase/client'

// Generate static params for all articles
export async function generateStaticParams() {
  return [
    { slug: 'kenya-digital-identity-system-2024' },
    { slug: 'kenyan-fintech-50m-series-b-2024' },
    { slug: 'nairobi-quantum-computing-center-2024' },
    { slug: 'kenya-marathon-triple-victory-2024' },
    { slug: 'kenyan-films-cannes-recognition-2024' },
    { slug: 'service-key-test-database-write-verification' },
    { slug: 'test-article-enhanced-automation-working' },
  ]
}

export default function ArticlePage({ params }: { params: { slug: string } }) {
  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ClientArticlePage slug={params.slug} />
      </div>
    </div>
  )
}

function ClientArticlePage({ slug }: { slug: string }) {
  return (
    <div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('DOMContentLoaded', function() {
              // This will be handled by client-side JavaScript
              const articleContainer = document.getElementById('article-container');
              if (articleContainer) {
                loadArticle('${slug}');
              }
            });

            async function loadArticle(slug) {
              const container = document.getElementById('article-container');
              container.innerHTML = '<div class="text-center py-12"><div class="spinner mx-auto mb-4"></div><p class="text-text-secondary">Loading article...</p></div>';
              
              try {
                const response = await fetch('https://lnmrpwmtvscsczslzvec.supabase.co/rest/v1/articles?slug=eq.' + slug, {
                  headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubXJwd210dnNjc2N6c2x6dmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNDU1MjAsImV4cCI6MjA2OTcyMTUyMH0.ezg1YgFm3k3yXXCtKbI844tRbh7v2WXwnvD9jnIc7pY',
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubXJwd210dnNjc2N6c2x6dmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNDU1MjAsImV4cCI6MjA2OTcyMTUyMH0.ezg1YgFm3k3yXXCtKbI844tRbh7v2WXwnvD9jnIc7pY',
                    'Content-Type': 'application/json',
                  },
                });

                if (!response.ok) {
                  throw new Error('Article not found');
                }

                const articles = await response.json();
                if (articles.length === 0) {
                  throw new Error('Article not found');
                }

                const article = articles[0];
                renderArticle(article);
              } catch (error) {
                container.innerHTML = \`
                  <div class="text-center py-12">
                    <div class="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 class="text-2xl font-bold text-text-primary mb-4">Article Not Found</h2>
                    <p class="text-text-secondary mb-6">The article you are looking for does not exist.</p>
                    <a href="/" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">Back to Home</a>
                  </div>
                \`;
              }
            }

            function renderArticle(article) {
              const publishedDate = new Date(article.published_at).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
              });

              const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=800&h=400&fit=crop&crop=top';

              document.getElementById('article-container').innerHTML = \`
                <nav class="mb-8">
                  <ol class="flex items-center space-x-2 text-sm text-text-secondary">
                    <li><a href="/" class="hover:text-primary">Home</a></li>
                    <li>/</li>
                    <li><a href="/category/\${article.category.toLowerCase()}/" class="hover:text-primary">\${article.category}</a></li>
                    <li>/</li>
                    <li class="text-text-primary">\${article.title}</li>
                  </ol>
                </nav>

                <article class="max-w-4xl mx-auto">
                  <header class="mb-8">
                    <div class="mb-4">
                      <span class="px-3 py-1 bg-primary text-white text-sm font-medium rounded">
                        \${article.category}
                      </span>
                    </div>
                    
                    <h1 class="text-3xl md:text-4xl lg:text-5xl font-bold text-text-primary mb-4 leading-tight">
                      \${article.title}
                    </h1>
                    
                    <p class="text-xl text-text-secondary mb-6 leading-relaxed">
                      \${article.summary}
                    </p>
                    
                    <div class="flex items-center justify-between text-sm text-text-secondary border-b border-gray-200 dark:border-gray-700 pb-6">
                      <div class="flex items-center space-x-4">
                        <time datetime="\${article.published_at}">
                          Published \${publishedDate}
                        </time>
                        \${article.source_url ? \`
                          <a href="\${article.source_url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline flex items-center space-x-1">
                            <span>View Source</span>
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                            </svg>
                          </a>
                        \` : ''}
                      </div>
                    </div>
                  </header>

                  <div class="mb-8">
                    <img
                      src="\${article.image_url || fallbackImage}"
                      alt="\${article.title}"
                      class="w-full h-64 md:h-96 object-cover rounded-lg"
                      onerror="this.src='\${fallbackImage}'"
                    />
                  </div>

                  <div class="prose prose-lg max-w-none mb-12">
                    <div class="text-text-primary leading-relaxed">
                      \${article.content.replace(/\\n/g, '<br />')}
                    </div>
                  </div>

                  <footer class="border-t border-gray-200 dark:border-gray-700 pt-8">
                    <div class="flex items-center justify-between">
                      <div class="text-sm text-text-secondary">
                        Last updated: \${new Date(article.updated_at).toLocaleDateString()}
                      </div>
                    </div>
                  </footer>
                </article>
              \`;
            }
          `,
        }}
      />
      <div id="article-container">
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading article...</p>
        </div>
      </div>
    </div>
  )
}