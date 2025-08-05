// Date formatting utilities
export const formatDate = (
  dateString: string,
  options?: Intl.DateTimeFormatOptions
): string => {
  const date = new Date(dateString);
  const defaultOptions: Intl.DateTimeFormatOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  };

  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options });
};

export const formatRelativeTime = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  if (diffInSeconds < 60) {
    return 'Just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return formatDate(dateString, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  }
};

// Text utilities
export const truncateText = (text: string, maxLength: number): string => {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength).trim() + '...';
};

export const generateSlug = (title: string): string => {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .replace(/^-|-$/g, '')
    .substring(0, 100);
};

export const capitalizeFirst = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
};

// URL utilities
export const isValidUrl = (url: string): boolean => {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
};

export const getBaseUrl = (): string => {
  if (typeof window !== 'undefined') {
    return window.location.origin;
  }
  return process.env.NEXT_PUBLIC_BASE_URL || 'https://www.pulsenews.publicvm.com';
};

// Category utilities
export const getCategoryColor = (category: string): string => {
  const colors: { [key: string]: string } = {
    Politics: 'bg-blue-100 text-blue-800',
    Business: 'bg-green-100 text-green-800',
    Technology: 'bg-purple-100 text-purple-800',
    Sports: 'bg-orange-100 text-orange-800',
    Entertainment: 'bg-pink-100 text-pink-800',
    default: 'bg-gray-100 text-gray-800',
  };
  return colors[category] || colors.default;
};

export const getCategoryIcon = (category: string): string => {
  const icons: { [key: string]: string } = {
    Politics: '🏛️',
    Business: '💼',
    Technology: '💻',
    Sports: '⚽',
    Entertainment: '🎬',
    default: '📰',
  };
  return icons[category] || icons.default;
};

// SEO utilities
export const generateMetaDescription = (
  content: string,
  maxLength: number = 160
): string => {
  const cleanContent = content
    .replace(/<[^>]*>/g, '')
    .replace(/\s+/g, ' ')
    .trim();
  return truncateText(cleanContent, maxLength);
};

export const generateKeywords = (
  title: string,
  content: string,
  category: string
): string[] => {
  const commonWords = [
    'the',
    'and',
    'or',
    'but',
    'in',
    'on',
    'at',
    'to',
    'for',
    'of',
    'with',
    'by',
    'is',
    'are',
    'was',
    'were',
    'be',
    'been',
    'have',
    'has',
    'had',
    'do',
    'does',
    'did',
    'will',
    'would',
    'could',
    'should',
    'may',
    'might',
    'must',
    'can',
    'shall',
  ];

  const text = `${title} ${content}`.toLowerCase();
  const words = text.match(/\b\w{3,}\b/g) || [];

  const wordCount: { [key: string]: number } = {};
  words.forEach(word => {
    if (!commonWords.includes(word)) {
      wordCount[word] = (wordCount[word] || 0) + 1;
    }
  });

  const sortedWords = Object.entries(wordCount)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 8)
    .map(([word]) => word);

  return [category.toLowerCase(), 'Kenya news', ...sortedWords];
};

// Validation utilities
export const validateEmail = (email: string): boolean => {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
};

export const sanitizeHtml = (html: string): string => {
  // Basic HTML sanitization - in production, use a proper library like DOMPurify
  return html
    .replace(/<script[^>]*>.*?<\/script>/gis, '')
    .replace(/<iframe[^>]*>.*?<\/iframe>/gis, '')
    .replace(/on\w+="[^"]*"/gi, '')
    .replace(/javascript:/gi, '');
};

// Local storage utilities
export const getFromLocalStorage = <T>(key: string, defaultValue: T): T => {
  if (typeof window === 'undefined') return defaultValue;

  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch {
    return defaultValue;
  }
};

export const setToLocalStorage = <T>(key: string, value: T): void => {
  if (typeof window === 'undefined') return;

  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error('Error saving to localStorage:', error);
  }
};

// Error handling utilities
export const handleApiError = (error: unknown): string => {
  if (typeof error === 'object' && error !== null) {
    if ('response' in error) {
      const response = (error as { response: unknown }).response;
      if (
        typeof response === 'object' &&
        response !== null &&
        'data' in response
      ) {
        const data = (response as { data: unknown }).data;
        if (typeof data === 'object' && data !== null && 'message' in data) {
          return (data as { message: string }).message;
        }
      }
    }
    if ('message' in error) {
      return (error as { message: string }).message;
    }
  }
  return 'An unexpected error occurred. Please try again.';
};

// Performance utilities
export const debounce = <T extends (...args: unknown[]) => void>(
  func: T,
  delay: number
): ((...args: Parameters<T>) => void) => {
  let timeoutId: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

export const throttle = <T extends (...args: unknown[]) => void>(
  func: T,
  limit: number
): ((...args: Parameters<T>) => void) => {
  let inThrottle: boolean;

  return (...args: Parameters<T>) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};
