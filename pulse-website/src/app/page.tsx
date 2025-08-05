'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../utils/supabase/client'

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
  const [selectedCategory, setSelectedCategory] = useState<string>('all')
  const [searchTerm, setSearchTerm] = useState('')
  const [displayedArticles, setDisplayedArticles] = useState(6)

  const supabase = createClient()

  const categories = ['all', 'Politics', 'Business', 'Technology', 'Sports', 'Entertainment']

  useEffect(() => {
    fetchArticles()
  }, [])

  useEffect(() => {
    filterArticles()
  }, [articles, selectedCategory, searchTerm])

  async function fetchArticles() {
    try {
      setLoading(true)
      setError(null)

      const { data, error } = await supabase
        .from('articles')
        .select('*')
        .order('published_at', { ascending: false })

      if (error) {
        throw error
      }

      setArticles(data || [])
    } catch (err) {
      console.error('Error fetching articles:', err)
      setError('Failed to load articles. Please try again later.')
    } finally {
      setLoading(false)
    }
  }

  function filterArticles() {
    let filtered = articles

    if (selectedCategory !== 'all') {
      filtered = filtered.filter(article => article.category === selectedCategory)
    }

    if (searchTerm) {
      filtered = filtered.filter(article =>
        article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.summary.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return filtered
  }

  function loadMoreArticles() {
    setDisplayedArticles(prev => prev + 6)
  }

  const filteredArticles = filterArticles()
  const articlesToShow = filteredArticles.slice(0, displayedArticles)
  const hasMoreArticles = filteredArticles.length > displayedArticles

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="spinner mx-auto mb-4"></div>
          <p className="text-text-secondary">Loading articles...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="text-red-500 text-6xl mb-4">⚠️</div>
          <h2 className="text-2xl font-bold text-text-primary mb-4">Error Loading Articles</h2>
          <p className="text-text-secondary mb-6">{error}</p>
          <button
            onClick={fetchArticles}
            className="px-6 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-6xl font-bold text-text-primary mb-4">
            Latest News from Kenya
          </h1>
          <p className="text-xl text-text-secondary max-w-2xl mx-auto">
            Stay informed with comprehensive coverage of politics, business, technology, sports, and entertainment
          </p>
        </div>

        {/* Search and Filter Controls */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="flex flex-wrap gap-2">
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-700'
                }`}
              >
                {category === 'all' ? 'All Categories' : category}
              </button>
            ))}
          </div>
          
          <div className="relative">
            <input
              type="text"
              placeholder="Search articles..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-text-primary focus:outline-none focus:ring-2 focus:ring-primary"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>

        {/* Articles Count */}
        <div className="mb-6">
          <p className="text-text-secondary">
            {filteredArticles.length === 0 
              ? 'No articles found' 
              : `Showing ${articlesToShow.length} of ${filteredArticles.length} articles`
            }
          </p>
        </div>

        {/* Articles Grid */}
        {articlesToShow.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 text-6xl mb-4">📰</div>
            <h3 className="text-xl font-semibold text-text-primary mb-2">No articles found</h3>
            <p className="text-text-secondary">
              {searchTerm || selectedCategory !== 'all' 
                ? 'Try adjusting your search or filter criteria'
                : 'No articles available at the moment'
              }
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {articlesToShow.map((article) => (
                <ArticleCard key={article.id} article={article} />
              ))}
            </div>

            {/* Load More Button */}
            {hasMoreArticles && (
              <div className="text-center">
                <button
                  onClick={loadMoreArticles}
                  className="px-8 py-3 bg-primary text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                >
                  Load More Articles
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}

function ArticleCard({ article }: { article: Article }) {
  const publishedDate = new Date(article.published_at).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  })

  const fallbackImage = `https://images.unsplash.com/photo-1504711434969-e33886168f5c?w=400&h=250&fit=crop&crop=top`

  return (
    <article className="article-card bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden">
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
        <img
          src={article.image_url || fallbackImage}
          alt={article.title}
          className="w-full h-full object-cover"
          onError={(e) => {
            const target = e.target as HTMLImageElement
            target.src = fallbackImage
          }}
        />
        <div className="absolute top-2 left-2">
          <span className="px-2 py-1 bg-primary text-white text-xs font-medium rounded">
            {article.category}
          </span>
        </div>
      </div>
      
      <div className="p-6">
        <h2 className="text-xl font-bold text-text-primary mb-2 line-clamp-2">
          <a 
            href={`/article/${article.slug}/`}
            className="hover:text-primary transition-colors"
          >
            {article.title}
          </a>
        </h2>
        
        <p className="text-text-secondary text-sm mb-3 line-clamp-3">
          {article.summary}
        </p>
        
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <time dateTime={article.published_at}>
            {publishedDate}
          </time>
          {article.source_url && (
            <a
              href={article.source_url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline"
            >
              Source
            </a>
          )}
        </div>
      </div>
    </article>
  )
}