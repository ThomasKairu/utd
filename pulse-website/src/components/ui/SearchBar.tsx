'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { MagnifyingGlassIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { Article } from '@/types/database';

interface SearchBarProps {
  onSearch: (query: string) => void;
  onResults: (results: Article[]) => void;
  placeholder?: string;
  className?: string;
}

export function SearchBar({
  onSearch,
  onResults,
  placeholder = 'Search articles...',
  className = '',
}: SearchBarProps) {
  const [query, setQuery] = useState('');
  const [isSearching, setIsSearching] = useState(false);
  const [showResults, setShowResults] = useState(false);
  const [searchResults, setSearchResults] = useState<Article[]>([]);
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const performSearch = useCallback(
    async (searchQuery: string) => {
      setIsSearching(true);
      try {
        // Direct Supabase search for static export compatibility
        const { createClient } = await import('@/utils/supabase/client');
        const supabase = createClient();
        
        const { data: articles, error } = await supabase
          .from('articles')
          .select('id, title, slug, summary, category, published_at, image_url')
          .or(`title.ilike.%${searchQuery}%,summary.ilike.%${searchQuery}%,content.ilike.%${searchQuery}%`)
          .order('published_at', { ascending: false })
          .limit(10);

        if (error) {
          console.error('Search error:', error);
          setSearchResults([]);
        } else {
          setSearchResults(articles || []);
          setShowResults(true);
          onResults(articles || []);
        }
      } catch (error) {
        console.error('Search error:', error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    },
    [onResults]
  );

  // Debounced search
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (query.trim().length > 2) {
        performSearch(query);
      } else {
        setSearchResults([]);
        setShowResults(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [query, performSearch]);

  // Close search results when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setShowResults(false);
      }
    }

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      onSearch(query.trim());
      setShowResults(false);
    }
  };

  const clearSearch = () => {
    setQuery('');
    setSearchResults([]);
    setShowResults(false);
    inputRef.current?.focus();
  };

  const highlightText = (text: string, highlight: string) => {
    if (!highlight.trim()) return text;

    const regex = new RegExp(`(${highlight})`, 'gi');
    const parts = text.split(regex);

    return parts.map((part, index) =>
      regex.test(part) ? (
        <mark
          key={index}
          className="bg-yellow-200 text-yellow-900 px-1 rounded"
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  };

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      <form onSubmit={handleSubmit} className="relative">
        <div className="relative">
          <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder={placeholder}
            className="w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white text-gray-900 placeholder-gray-500"
            autoComplete="off"
          />
          {query && (
            <button
              type="button"
              onClick={clearSearch}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400 hover:text-gray-600"
            >
              <XMarkIcon className="h-5 w-5" />
            </button>
          )}
        </div>
      </form>

      {/* Search Results Dropdown */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-96 overflow-y-auto">
          {isSearching ? (
            <div className="p-4 text-center text-gray-500">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500 mx-auto"></div>
              <p className="mt-2">Searching...</p>
            </div>
          ) : searchResults.length > 0 ? (
            <>
              <div className="p-3 border-b border-gray-100 text-sm text-gray-600">
                {searchResults.length} result
                {searchResults.length !== 1 ? 's' : ''} found
              </div>
              {searchResults.map(article => (
                <a
                  key={article.id}
                  href={`/article/${article.slug}`}
                  className="block p-4 hover:bg-gray-50 border-b border-gray-100 last:border-b-0"
                  onClick={() => setShowResults(false)}
                >
                  <h3 className="font-medium text-gray-900 mb-1">
                    {highlightText(article.title, query)}
                  </h3>
                  {article.summary && (
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {highlightText(article.summary, query)}
                    </p>
                  )}
                  <div className="flex items-center mt-2 text-xs text-gray-500">
                    <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded-full">
                      {article.category}
                    </span>
                    <span className="ml-2">
                      {new Date(article.published_at).toLocaleDateString()}
                    </span>
                  </div>
                </a>
              ))}
            </>
          ) : (
            <div className="p-4 text-center text-gray-500">
              <MagnifyingGlassIcon className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No articles found for &ldquo;{query}&rdquo;</p>
              <p className="text-sm mt-1">
                Try different keywords or check spelling
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default SearchBar;
