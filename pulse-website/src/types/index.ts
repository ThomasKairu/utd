// Database types
export interface Article {
  id: string;
  title: string;
  slug: string;
  content: string;
  summary?: string;
  category: string;
  source_url?: string;
  image_url?: string;
  published_at: string;
  created_at: string;
  updated_at: string;
  sponsored?: boolean;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  created_at: string;
}

// API types
export interface ApiResponse<T> {
  data: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Component types
export interface ArticleCardProps {
  article: Article;
  variant?: 'default' | 'featured' | 'compact';
  className?: string;
}

export interface CategoryFilterProps {
  categories: string[];
  activeCategory: string;
  onCategoryChange: (category: string) => void;
  className?: string;
}

// RSS Feed types
export interface RSSItem {
  title: string;
  link: string;
  pubDate: string;
  description: string;
  guid: string;
}

export interface ProcessedArticle {
  title: string;
  slug: string;
  content: string;
  summary: string;
  category: string;
  source_url: string;
  image_url?: string;
  published_at: string;
  created_at: string;
}

// Search types
export interface SearchFilters {
  category?: string;
  dateFrom?: string;
  dateTo?: string;
  sortBy?: 'published_at' | 'created_at' | 'title';
  sortOrder?: 'asc' | 'desc';
}

export interface SearchParams {
  query?: string;
  filters?: SearchFilters;
  page?: number;
  limit?: number;
}

// Error types
export interface AppError {
  code: string;
  message: string;
  details?: unknown;
}

// Navigation types
export interface NavItem {
  href: string;
  label: string;
  icon?: React.ComponentType;
}

// SEO types
export interface SEOData {
  title: string;
  description: string;
  keywords?: string[];
  image?: string;
  url?: string;
  type?: 'article' | 'website';
  publishedTime?: string;
  modifiedTime?: string;
  author?: string;
  section?: string;
}
