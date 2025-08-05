const validCategories = ['politics', 'business', 'technology', 'sports', 'entertainment']

// Generate static params for all categories
export async function generateStaticParams() {
  return validCategories.map((category) => ({
    slug: category,
  }))
}

export default function CategoryPage({ params }: { params: { slug: string } }) {
  const categorySlug = params.slug.toLowerCase()
  
  if (!validCategories.includes(categorySlug)) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-text-primary mb-4">404</h1>
          <p className="text-text-secondary mb-6">Category not found</p>
          <a href="/" className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">
            Back to Home
          </a>
        </div>
      </div>
    )
  }

  const categoryName = categorySlug.charAt(0).toUpperCase() + categorySlug.slice(1)

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <ClientCategoryPage category={categoryName} categorySlug={categorySlug} />
      </div>
    </div>
  )
}

function ClientCategoryPage({ category, categorySlug }: { category: string, categorySlug: string }) {
  const categoryEmojis: { [key: string]: string } = {
    politics: '🏛️',
    business: '💼',
    technology: '💻',
    sports: '⚽',
    entertainment: '🎬'
  }

  const categoryDescriptions: { [key: string]: string } = {
    politics: 'Stay updated with the latest political developments, government policies, and civic affairs from Kenya and beyond.',
    business: 'Get insights into market trends, economic developments, startup news, and business opportunities across Africa.',
    technology: 'Discover the latest in tech innovation, digital transformation, and technological advancements shaping our future.',
    sports: 'Follow your favorite teams and athletes with comprehensive coverage of local and international sports events.',
    entertainment: 'Explore the world of entertainment with news about movies, music, celebrities, and cultural events.'
  }

  return (
    <div>
      <script
        dangerouslySetInnerHTML={{
          __html: `
            window.addEventListener('DOMContentLoaded', function() {
              loadCategoryArticles('${category}');
            });

            async function loadCategoryArticles(category) {
              const container = document.getElementById('articles-container');
              container.innerHTML = '<div class="text-center py-12"><div class="spinner mx-auto mb-4"></div><p class="text-text-secondary">Loading ' + category.toLowerCase() + ' articles...</p></div>';
              
              try {
                const response = await fetch('https://lnmrpwmtvscsczslzvec.supabase.co/rest/v1/articles?category=eq.' + category + '&order=published_at.desc', {
                  headers: {
                    'Authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubXJwd210dnNjc2N6c2x6dmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNDU1MjAsImV4cCI6MjA2OTcyMTUyMH0.ezg1YgFm3k3yXXCtKbI844tRbh7v2WXwnvD9jnIc7pY',
                    'apikey': 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxubXJwd210dnNjc2N6c2x6dmVjIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTQxNDU1MjAsImV4cCI6MjA2OTcyMTUyMH0.ezg1YgFm3k3yXXCtKbI844tRbh7v2WXwnvD9jnIc7pY',
                    'Content-Type': 'application/json',
                  },
                });

                if (!response.ok) {
                  throw new Error('Failed to load articles');
                }

                const articles = await response.json();
                renderCategoryArticles(articles, category);
              } catch (error) {
                container.innerHTML = \`
                  <div class="text-center py-12">
                    <div class="text-red-500 text-6xl mb-4">⚠️</div>
                    <h2 class="text-2xl font-bold text-text-primary mb-4">Error Loading Articles</h2>
                    <p class="text-text-secondary mb-6">Failed to load articles. Please try again later.</p>
                    <button onclick="loadCategoryArticles('\${category}')" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">Try Again</button>
                  </div>
                \`;
              }
            }

            function renderCategoryArticles(articles, category) {
              const container = document.getElementById('articles-container');
              
              if (articles.length === 0) {
                container.innerHTML = \`
                  <div class="text-center py-12">
                    <div class="text-gray-400 text-6xl mb-4">📰</div>
                    <h3 class="text-xl font-semibold text-text-primary mb-2">No \${category.toLowerCase()} articles yet</h3>
                    <p class="text-text-secondary mb-6">Check back later for the latest \${category.toLowerCase()} news and updates.</p>
                    <a href="/" class="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors">Browse All Articles</a>
                  </div>
                \`;
                return;
              }

              const fallbackImage = 'https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop&crop=top';
              
              let articlesHtml = \`
                <div class="mb-6">
                  <p class="text-text-secondary">Showing \${articles.length} \${category.toLowerCase()} articles</p>
                </div>
                <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              \`;

              articles.forEach(article => {
                const publishedDate = new Date(article.published_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric'
                });

                articlesHtml += \`
                  <article class="article-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
                    <div class="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
                      <img
                        src="\${article.image_url || fallbackImage}"
                        alt="\${article.title}"
                        class="w-full h-full object-cover"
                        onerror="this.src='\${fallbackImage}'"
                      />
                      <div class="absolute top-2 left-2">
                        <span class="px-2 py-1 bg-primary text-white text-xs font-medium rounded">
                          \${article.category}
                        </span>
                      </div>
                    </div>
                    
                    <div class="p-6">
                      <h2 class="text-xl font-bold text-text-primary mb-2 line-clamp-2">
                        <a href="/article/\${article.slug}/" class="hover:text-primary transition-colors">
                          \${article.title}
                        </a>
                      </h2>
                      
                      <p class="text-text-secondary text-sm mb-3 line-clamp-3">
                        \${article.summary}
                      </p>
                      
                      <div class="flex items-center justify-between text-sm text-text-secondary">
                        <time datetime="\${article.published_at}">
                          \${publishedDate}
                        </time>
                        \${article.source_url ? \`
                          <a href="\${article.source_url}" target="_blank" rel="noopener noreferrer" class="text-primary hover:underline">
                            Source
                          </a>
                        \` : ''}
                      </div>
                    </div>
                  </article>
                \`;
              });

              articlesHtml += '</div>';
              container.innerHTML = articlesHtml;
            }
          `,
        }}
      />

      {/* Breadcrumb */}
      <nav className="mb-8">
        <ol className="flex items-center space-x-2 text-sm text-text-secondary">
          <li><a href="/" className="hover:text-primary">Home</a></li>
          <li>/</li>
          <li className="text-text-primary">{category}</li>
        </ol>
      </nav>

      {/* Category Header */}
      <div className="text-center mb-12">
        <div className="text-6xl mb-4">{categoryEmojis[categorySlug]}</div>
        <h1 className="text-4xl md:text-5xl font-bold text-text-primary mb-4">
          {category} News
        </h1>
        <p className="text-xl text-text-secondary max-w-3xl mx-auto">
          {categoryDescriptions[categorySlug]}
        </p>
      </div>

      {/* Articles Container */}
      <div id="articles-container">
        <div className="text-center py-12">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading {category.toLowerCase()} articles...</p>
        </div>
      </div>

      {/* Other Categories */}
      <section className="mt-16 pt-8 border-t border-gray-200 dark:border-gray-700">
        <h2 className="text-2xl font-bold text-text-primary mb-6">Explore Other Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {validCategories
            .filter(cat => cat !== categorySlug)
            .map(cat => (
              <a
                key={cat}
                href={`/category/${cat}/`}
                className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow text-center"
              >
                <div className="text-3xl mb-2">{categoryEmojis[cat]}</div>
                <div className="font-medium text-text-primary">
                  {cat.charAt(0).toUpperCase() + cat.slice(1)}
                </div>
              </a>
            ))
          }
        </div>
      </section>
    </div>
  )
}