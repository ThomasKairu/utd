'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import SearchBar from '@/components/ui/SearchBar';
import ArticleCard from '@/components/ui/ArticleCard';
import { Article } from '@/types/database';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchFilters {
  category: string;
  dateFrom: string;
  dateTo: string;
  sortBy: 'relevance' | 'date';
}


function SearchPageContent() {
  const searchParams = useSearchParams();
  const initialQuery = searchParams.get('q') || '';

  const [query, setQuery] = useState(initialQuery);
  const [results, setResults] = useState<Article[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(!!initialQuery);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [totalResults, setTotalResults] = useState(0);
  const [filters, setFilters] = useState<SearchFilters>({
    category: 'all',
    dateFrom: '',
    dateTo: '',
    sortBy: 'relevance',
  });

  // Perform search when component mounts with initial query
  useEffect(() => {
    if (initialQuery) {
      performAdvancedSearch(initialQuery, filters, 1);
    }
  }, [initialQuery, filters]);

  const performAdvancedSearch = async (
    searchQuery: string,
    searchFilters: SearchFilters,
    page: number = 1
  ) => {
    if (!searchQuery.trim()) return;

    setIsLoading(true);
    setHasSearched(true);

    try {
      // Direct Supabase search for static export compatibility
      const { createClient } = await import('@/utils/supabase/client');
      const supabase = createClient();
      
      let queryBuilder = supabase
        .from('articles')
        .select('*', { count: 'exact' });

      // Apply search query
      queryBuilder = queryBuilder.or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`);

      // Apply filters if provided
      if (searchFilters?.category && searchFilters.category !== 'all') {
        queryBuilder = queryBuilder.eq('category', searchFilters.category);
      }

      if (searchFilters?.dateFrom) {
        queryBuilder = queryBuilder.gte('published_at', searchFilters.dateFrom);
      }

      if (searchFilters?.dateTo) {
        queryBuilder = queryBuilder.lte('published_at', searchFilters.dateTo);
      }

      // Apply pagination
      const limit = 12;
      const offset = (page - 1) * limit;

      const { data: articles, error, count } = await queryBuilder
        .order('published_at', { ascending: false })
        .range(offset, offset + limit - 1);

      if (error) {
        console.error('Search error:', error);
        setResults([]);
      } else {
        setResults(articles || []);
        setCurrentPage(page);
        setTotalPages(Math.ceil((count || 0) / limit));
        setTotalResults(count || 0);
      }
    } catch (error) {
      console.error('Search error:', error);
      setResults([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (searchQuery: string) => {
    setQuery(searchQuery);
    setCurrentPage(1);
    performAdvancedSearch(searchQuery, filters, 1);

    // Update URL without page reload
    const url = new URL(window.location.href);
    url.searchParams.set('q', searchQuery);
    window.history.pushState({}, '', url.toString());
  };

  const handleFilterChange = (newFilters: Partial<SearchFilters>) => {
    const updatedFilters = { ...filters, ...newFilters };
    setFilters(updatedFilters);
    setCurrentPage(1);
    if (query) {
      performAdvancedSearch(query, updatedFilters, 1);
    }
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    performAdvancedSearch(query, filters, page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const categories = [
    { value: 'all', label: 'All Categories' },
    { value: 'Politics', label: 'Politics' },
    { value: 'Business', label: 'Business' },
    { value: 'Technology', label: 'Technology' },
    { value: 'Sports', label: 'Sports' },
    { value: 'Entertainment', label: 'Entertainment' },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Search Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-4">
            Search Articles
          </h1>
          <div className="max-w-2xl mx-auto">
            <SearchBar
              onSearch={handleSearch}
              onResults={() => {}} // We handle results in the main search
              placeholder="Search for articles, topics, or keywords..."
              className="w-full"
            />
          </div>
        </div>

        {/* Search Filters */}
        {hasSearched && (
          <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mb-8">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Filter Results
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Category Filter */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category
                </label>
                <select
                  value={filters.category}
                  onChange={e =>
                    handleFilterChange({ category: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {categories.map(category => (
                    <option key={category.value} value={category.value}>
                      {category.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Date From */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  From Date
                </label>
                <input
                  type="date"
                  value={filters.dateFrom}
                  onChange={e =>
                    handleFilterChange({ dateFrom: e.target.value })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Date To */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  To Date
                </label>
                <input
                  type="date"
                  value={filters.dateTo}
                  onChange={e => handleFilterChange({ dateTo: e.target.value })}
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Sort By */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Sort By
                </label>
                <select
                  value={filters.sortBy}
                  onChange={e =>
                    handleFilterChange({
                      sortBy: e.target.value as 'relevance' | 'date',
                    })
                  }
                  className="w-full border border-gray-300 rounded-md px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  <option value="relevance">Relevance</option>
                  <option value="date">Date</option>
                </select>
              </div>
            </div>
          </div>
        )}

        {/* Search Results */}
        {hasSearched && (
          <div>
            {/* Results Header */}
            <div className="flex items-center justify-between mb-6">
              <div>
                {isLoading ? (
                  <p className="text-gray-600">Searching...</p>
                ) : (
                  <p className="text-gray-600">
                    {totalResults > 0 ? (
                      <>
                        Showing {(currentPage - 1) * 12 + 1}-
                        {Math.min(currentPage * 12, totalResults)} of{' '}
                        {totalResults} results
                        {query && (
                          <span>
                            {' '}
                            for &ldquo;<strong>{query}</strong>&rdquo;
                          </span>
                        )}
                      </>
                    ) : (
                      <>
                        No results found
                        {query && (
                          <span>
                            {' '}
                            for &ldquo;<strong>{query}</strong>&rdquo;
                          </span>
                        )}
                      </>
                    )}
                  </p>
                )}
              </div>
            </div>

            {/* Loading State */}
            {isLoading && (
              <div className="flex justify-center items-center py-12">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
                <span className="ml-3 text-gray-600">
                  Searching articles...
                </span>
              </div>
            )}

            {/* Results Grid */}
            {!isLoading && results.length > 0 && (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
                  {results.map(article => (
                    <ArticleCard 
                      key={article.id} 
                      article={{
                        ...article,
                        summary: article.summary || undefined,
                        image_url: article.image_url || undefined,
                        source_url: article.source_url || undefined,
                        published_at: article.published_at || new Date().toISOString(),
                      }} 
                    />
                  ))}
                </div>

                {/* Pagination */}
                {totalPages > 1 && (
                  <div className="flex justify-center items-center space-x-2">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Previous
                    </button>

                    {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                      const page = i + Math.max(1, currentPage - 2);
                      if (page > totalPages) return null;

                      return (
                        <button
                          key={page}
                          onClick={() => handlePageChange(page)}
                          className={`px-4 py-2 border rounded-md text-sm font-medium ${
                            page === currentPage
                              ? 'bg-blue-500 text-white border-blue-500'
                              : 'border-gray-300 text-gray-700 bg-white hover:bg-gray-50'
                          }`}
                        >
                          {page}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      Next
                    </button>
                  </div>
                )}
              </>
            )}

            {/* No Results */}
            {!isLoading && hasSearched && results.length === 0 && (
              <div className="text-center py-12">
                <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  No articles found
                </h3>
                <p className="text-gray-600 mb-4">
                  We couldn&apos;t find any articles matching your search
                  criteria.
                </p>
                <div className="text-sm text-gray-500">
                  <p>Try:</p>
                  <ul className="list-disc list-inside mt-2 space-y-1">
                    <li>Using different keywords</li>
                    <li>Checking your spelling</li>
                    <li>Using more general terms</li>
                    <li>Removing some filters</li>
                  </ul>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Initial State */}
        {!hasSearched && (
          <div className="text-center py-12">
            <MagnifyingGlassIcon className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Search for Articles
            </h3>
            <p className="text-gray-600">
              Enter keywords above to find articles on topics that interest you.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
        <span className="ml-3 text-gray-600">Loading search...</span>
      </div>
    }>
      <SearchPageContent />
    </Suspense>
  );
}
