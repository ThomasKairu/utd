'use client'

import { useState, useEffect } from 'react'
import { useSearchParams } from 'next/navigation'
import { createClient } from '../utils/supabase/client'
import BreakingNews from '../components/BreakingNews'
import AdBanner from '../components/AdBanner'
import NewsCard from '../components/NewsCard'
import Sidebar from '../components/Sidebar'

interface Article {
  id: string
  title: string
  slug: string
  content: string
  summary: string
  category: string
  source_url: string
  image_url: string | null
  published_at: string
  created_at: string
  updated_at: string
}

export default function HomePage() {
  const [articles, setArticles] = useState<Article[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const searchParams = useSearchParams()
  const categoryFilter = searchParams?.get('category')
  
  const supabase = createClient()

  // Force component refresh for deployment
  useEffect(() => {
    console.log('Pulse News - Modern Design Loaded')
  }, [])

  useEffect(() => {
    fetchArticles()
  }, [categoryFilter])

  async function fetchArticles() {
    try {
      setLoading(true)
      setError(null)

      let query = supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })

      // Apply category filter if present
      if (categoryFilter) {
        query = query.eq('category', categoryFilter)
      }

      const { data, error } = await query

      if (error) {
        throw error
      }

      setArticles(data || [])
    } catch (err) {
      console.error('Error fetching articles:', err)
      setError('Failed to load articles. Please try again later.')
      // Fallback to mock data if Supabase fails
      setArticles(mockArticles)
    } finally {
      setLoading(false)
    }
  }

  // Mock data as fallback
  const mockArticles: Article[] = [
    {
      id: '1',
      title: "Kenya's Digital Identity System Launches Nationwide",
      slug: 'kenya-digital-identity-system-2024',
      content: 'Full article content...',
      summary: 'The government has officially launched a comprehensive digital identity system that will revolutionize how citizens access government services.',
      category: 'Politics',
      source_url: 'https://example.com',
      image_url: 'https://images.unsplash.com/photo-1600506451234-9e555c0c8d05?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxjb25mZXJlbmNlJTIwZ292ZXJubWVudCUyMG1lZXRpbmclMjBwb2xpdGljc3xlbnwwfDB8fHwxNzU0MzkzNTM3fDA&ixlib=rb-4.1.0&q=85',
      published_at: '2024-01-05T10:00:00Z',
      created_at: '2024-01-05T10:00:00Z',
      updated_at: '2024-01-05T10:00:00Z'
    },
    {
      id: '2',
      title: 'Tech Startup Funding Reaches Record High in East Africa',
      slug: 'tech-startup-funding-record-2024',
      content: 'Full article content...',
      summary: 'Investment in technology startups across East Africa has reached unprecedented levels, with Kenya leading the charge.',
      category: 'Business',
      source_url: 'https://example.com',
      image_url: 'https://images.unsplash.com/photo-1642522029691-029b5a432954?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMG1lZXRpbmclMjBvZmZpY2UlMjBjb3Jwb3JhdGV8ZW58MHwwfHx8MTc1NDM5MzUzN3ww&ixlib=rb-4.1.0&q=85',
      published_at: '2024-01-04T15:30:00Z',
      created_at: '2024-01-04T15:30:00Z',
      updated_at: '2024-01-04T15:30:00Z'
    },
    {
      id: '3',
      title: 'Kenyan Athletes Dominate Marathon Championships',
      slug: 'kenyan-athletes-marathon-championships-2024',
      content: 'Full article content...',
      summary: 'Kenyan runners secured the top three positions in the international marathon championships, continuing the country\'s dominance in long-distance running.',
      category: 'Sports',
      source_url: 'https://example.com',
      image_url: 'https://images.unsplash.com/photo-1600442715978-d0268caa17f5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHNvY2NlciUyMHN0YWRpdW0lMjBzcG9ydHN8ZW58MHwwfHx8Z3JlZW58MTc1NDM5MzUzN3ww&ixlib=rb-4.1.0&q=85',
      published_at: '2024-01-04T12:00:00Z',
      created_at: '2024-01-04T12:00:00Z',
      updated_at: '2024-01-04T12:00:00Z'
    }
  ]

  const featuredArticle = articles[0]
  const heroSideArticles = articles.slice(1, 3)
  const remainingArticles = articles.slice(3)

  // Get page title based on category filter
  const getPageTitle = () => {
    if (categoryFilter) {
      return `${categoryFilter.charAt(0).toUpperCase() + categoryFilter.slice(1)} News`
    }
    return 'Latest News'
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading articles...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Top Ad Banner */}
      <div className="container mx-auto px-4 py-4">
        <AdBanner className="mx-auto" />
      </div>

      {/* Breaking News Ticker */}
      <BreakingNews />

      <div className="container mx-auto px-4 py-8">
        {/* Category Filter Indicator */}
        {categoryFilter && (
          <div className="mb-6">
            <div className="flex items-center space-x-2">
              <span className="category-tag">
                {categoryFilter.toUpperCase()}
              </span>
              <span className="text-text-secondary">
                Showing {articles.length} articles
              </span>
            </div>
          </div>
        )}

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Main Content */}
          <div className="flex-1">
            {articles.length > 0 ? (
              <>
                {/* Hero Section - Only show on main page */}
                {!categoryFilter && (
                  <section className="mb-12">
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                      {/* Featured Article */}
                      <div className="lg:col-span-2">
                        {featuredArticle && (
                          <NewsCard
                            title={featuredArticle.title}
                            summary={featuredArticle.summary}
                            category={featuredArticle.category}
                            imageUrl={featuredArticle.image_url || ''}
                            slug={featuredArticle.slug}
                            publishedAt={featuredArticle.published_at}
                            isLarge={true}
                          />
                        )}
                      </div>
                      
                      {/* Side Articles */}
                      <div className="space-y-6">
                        {heroSideArticles.map((article) => (
                          <NewsCard
                            key={article.id}
                            title={article.title}
                            summary={article.summary}
                            category={article.category}
                            imageUrl={article.image_url || ''}
                            slug={article.slug}
                            publishedAt={article.published_at}
                          />
                        ))}
                      </div>
                    </div>
                  </section>
                )}

                {/* News Section */}
                <section className="mb-12">
                  <div className="flex items-center justify-between mb-6">
                    <h2 className="heading-primary text-3xl text-text-primary">{getPageTitle()}</h2>
                    <div className="h-1 flex-1 bg-gradient-to-r from-pulse-red to-transparent ml-4 rounded"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {(categoryFilter ? articles : remainingArticles).map((article, index) => (
                      <div key={article.id}>
                        <NewsCard
                          title={article.title}
                          summary={article.summary}
                          category={article.category}
                          imageUrl={article.image_url || ''}
                          slug={article.slug}
                          publishedAt={article.published_at}
                        />
                        {/* Insert ad after every 3 articles */}
                        {(index + 1) % 3 === 0 && (
                          <div className="mt-6">
                            <AdBanner width="100%" height="250px" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                </section>

                {/* Categories Preview - Only show on main page */}
                {!categoryFilter && (
                  <section className="mb-12">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                      {/* Politics Section */}
                      <div>
                        <div className="flex items-center mb-4">
                          <h3 className="heading-secondary text-xl text-text-primary">Politics</h3>
                          <div className="h-0.5 flex-1 bg-pulse-red ml-3 rounded"></div>
                        </div>
                        <div className="space-y-4">
                          {articles.filter(a => a.category === 'Politics').slice(0, 3).map((article) => (
                            <div key={article.id} className="flex space-x-3 group">
                              <img
                                src={article.image_url || ''}
                                alt={article.title}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-text-primary group-hover:text-pulse-red transition-colors duration-200 line-clamp-2 mb-1">
                                  {article.title}
                                </h4>
                                <p className="text-xs text-text-secondary line-clamp-2">
                                  {article.summary}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>

                      {/* Sports Section */}
                      <div>
                        <div className="flex items-center mb-4">
                          <h3 className="heading-secondary text-xl text-text-primary">Sports</h3>
                          <div className="h-0.5 flex-1 bg-pulse-red ml-3 rounded"></div>
                        </div>
                        <div className="space-y-4">
                          {articles.filter(a => a.category === 'Sports').slice(0, 3).map((article) => (
                            <div key={article.id} className="flex space-x-3 group">
                              <img
                                src={article.image_url || ''}
                                alt={article.title}
                                className="w-20 h-20 object-cover rounded-lg flex-shrink-0"
                              />
                              <div className="flex-1">
                                <h4 className="text-sm font-medium text-text-primary group-hover:text-pulse-red transition-colors duration-200 line-clamp-2 mb-1">
                                  {article.title}
                                </h4>
                                <p className="text-xs text-text-secondary line-clamp-2">
                                  {article.summary}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </section>
                )}
              </>
            ) : (
              <div className="text-center py-12">
                <div className="text-gray-400 text-6xl mb-4">📰</div>
                <h3 className="text-xl font-semibold text-text-primary mb-2">No articles found</h3>
                <p className="text-text-secondary">
                  {categoryFilter 
                    ? `No articles available in the ${categoryFilter} category at the moment.`
                    : 'No articles available at the moment.'
                  }
                </p>
                {categoryFilter && (
                  <a 
                    href="/" 
                    className="inline-block mt-4 px-6 py-2 bg-pulse-red text-white rounded-lg hover:bg-pulse-red-dark transition-colors duration-200"
                  >
                    View All News
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Sidebar - Desktop Only */}
          <div className="hidden lg:block lg:w-80">
            <Sidebar />
          </div>
        </div>
      </div>
    </div>
  )
}