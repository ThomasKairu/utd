'use client'

import { useState, useEffect } from 'react'
import { createClient } from '../utils/supabase/client'

interface SearchModalProps {
  isOpen: boolean
  onClose: () => void
}

interface Article {
  id: string
  title: string
  slug: string
  summary: string
  category: string
  image_url: string | null
  published_at: string
}

const SearchIcon = () => (
  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
  </svg>
)

const CloseIcon = () => (
  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
  </svg>
)

export default function SearchModal({ isOpen, onClose }: SearchModalProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState<Article[]>([])
  const [loading, setLoading] = useState(false)
  const [hasSearched, setHasSearched] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = 'unset'
      setSearchTerm('')
      setSearchResults([])
      setHasSearched(false)
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  const handleSearch = async (term: string) => {
    if (!term.trim()) {
      setSearchResults([])
      setHasSearched(false)
      return
    }

    setLoading(true)
    setHasSearched(true)

    try {
      const { data, error } = await supabase
        .from('articles')
        .select('id, title, slug, summary, category, image_url, published_at')
        .or(`title.ilike.%${term}%,summary.ilike.%${term}%,category.ilike.%${term}%`)
        .order('published_at', { ascending: false })
        .limit(10)

      if (error) {
        console.error('Search error:', error)
        setSearchResults([])
      } else {
        setSearchResults(data || [])
      }
    } catch (err) {
      console.error('Search error:', err)
      setSearchResults([])
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    const debounceTimer = setTimeout(() => {
      handleSearch(searchTerm)
    }, 300)

    return () => clearTimeout(debounceTimer)
  }, [searchTerm])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-50 transition-opacity"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="flex min-h-full items-start justify-center p-4 pt-16">
        <div className="relative w-full max-w-2xl transform overflow-hidden rounded-lg bg-white shadow-modern transition-all">
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h2 className="heading-secondary text-xl text-text-primary">Search News</h2>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors duration-200"
            >
              <CloseIcon />
            </button>
          </div>

          {/* Search Input */}
          <div className="p-6 border-b border-gray-200">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <SearchIcon />
              </div>
              <input
                type="text"
                placeholder="Search for news articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-pulse-red focus:border-transparent text-body"
                autoFocus
              />
            </div>
          </div>

          {/* Results */}
          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="spinner"></div>
                <span className="ml-3 text-text-secondary">Searching...</span>
              </div>
            ) : hasSearched ? (
              searchResults.length > 0 ? (
                <div className="divide-y divide-gray-200">
                  {searchResults.map((article) => (
                    <div key={article.id} className="p-4 hover:bg-gray-50 transition-colors duration-200">
                      <div className="flex space-x-3">
                        {article.image_url && (
                          <img
                            src={article.image_url}
                            alt={article.title}
                            className="w-16 h-16 object-cover rounded-lg flex-shrink-0"
                          />
                        )}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="category-tag text-xs">
                              {article.category}
                            </span>
                            <span className="text-xs text-text-secondary">
                              {new Date(article.published_at).toLocaleDateString()}
                            </span>
                          </div>
                          <h3 className="text-sm font-medium text-text-primary line-clamp-2 mb-1">
                            <a 
                              href={`/article/${article.slug}`}
                              className="hover:text-pulse-red transition-colors duration-200"
                              onClick={onClose}
                            >
                              {article.title}
                            </a>
                          </h3>
                          <p className="text-xs text-text-secondary line-clamp-2">
                            {article.summary}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <div className="text-gray-400 text-4xl mb-2">🔍</div>
                  <h3 className="text-lg font-medium text-text-primary mb-1">No results found</h3>
                  <p className="text-text-secondary">
                    Try different keywords or check your spelling
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-8">
                <div className="text-gray-400 text-4xl mb-2">📰</div>
                <h3 className="text-lg font-medium text-text-primary mb-1">Search Pulse News</h3>
                <p className="text-text-secondary">
                  Find articles by title, content, or category
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}