import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Card from '../common/Card';

interface ArticleCardProps {
  article: {
    id: string;
    title: string;
    slug: string;
    summary?: string;
    category: string;
    image_url?: string;
    published_at: string;
    source_url?: string;
    sponsored?: boolean;
  };
  variant?: 'default' | 'featured' | 'compact' | 'horizontal';
  className?: string;
}

const ArticleCard: React.FC<ArticleCardProps> = ({
  article,
  variant = 'default',
  className = '',
}) => {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getCategoryColor = (category: string) => {
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

  if (variant === 'featured') {
    return (
      <Card hover className={`overflow-hidden ${className}`} role="article">
        <Link href={`/article/${article.slug}`}>
          <div className="relative">
            {article.image_url && (
              <div className="relative h-64 w-full">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-6 text-white">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium mb-2 ${getCategoryColor(article.category)}`}
              >
                {article.category}
              </span>
              <h2 className="text-2xl font-bold mb-2 line-clamp-2">
                {article.title}
              </h2>
              {article.summary && (
                <p className="text-sm opacity-90 line-clamp-2">
                  {article.summary}
                </p>
              )}
              <p className="text-xs opacity-75 mt-2">
                {formatDate(article.published_at)}
              </p>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  if (variant === 'compact') {
    return (
      <Card hover className={`p-3 ${className}`} role="article">
        <Link href={`/article/${article.slug}`}>
          <div className="flex space-x-3">
            {article.image_url && (
              <div className="relative w-20 h-16 flex-shrink-0">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover rounded"
                />
              </div>
            )}
            <div className="flex-1 min-w-0">
              <span
                className={`inline-block px-2 py-1 rounded text-xs font-medium mb-1 ${getCategoryColor(article.category)}`}
              >
                {article.category}
              </span>
              <h3 className="text-sm font-semibold line-clamp-2 mb-1">
                {article.title}
              </h3>
              <p className="text-xs text-text-secondary">
                {formatDate(article.published_at)}
              </p>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  if (variant === 'horizontal') {
    return (
      <Card hover className={`overflow-hidden ${className}`} role="article">
        <Link href={`/article/${article.slug}`}>
          <div className="flex">
            {article.image_url && (
              <div className="relative w-48 h-32 flex-shrink-0">
                <Image
                  src={article.image_url}
                  alt={article.title}
                  fill
                  className="object-cover"
                />
              </div>
            )}
            <div className="p-4 flex-1">
              <div className="flex items-center gap-2 mb-2">
                <span
                  className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(article.category)}`}
                >
                  {article.category}
                </span>
                {article.sponsored && (
                  <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-accent text-white">
                    Sponsored
                  </span>
                )}
              </div>
              <h3 className="text-lg font-semibold mb-2 line-clamp-2">
                {article.title}
              </h3>
              {article.summary && (
                <p className="text-text-secondary text-sm mb-3 line-clamp-2">
                  {article.summary}
                </p>
              )}
              <div className="flex justify-between items-center text-xs text-text-secondary">
                <span>{formatDate(article.published_at)}</span>
                {article.source_url && (
                  <span className="text-primary">Read more →</span>
                )}
              </div>
            </div>
          </div>
        </Link>
      </Card>
    );
  }

  return (
    <Card hover className={`overflow-hidden ${className}`} role="article">
      <Link href={`/article/${article.slug}`}>
        {article.image_url && (
          <div className="relative h-48 w-full mb-4">
            <Image
              src={article.image_url}
              alt={article.title}
              fill
              className="object-cover"
            />
          </div>
        )}
        <div className="p-4">
          <div className="flex items-center gap-2 mb-2">
            <span
              className={`inline-block px-2 py-1 rounded text-xs font-medium ${getCategoryColor(article.category)}`}
            >
              {article.category}
            </span>
            {article.sponsored && (
              <span className="inline-block px-2 py-1 rounded text-xs font-medium bg-accent text-white">
                Sponsored
              </span>
            )}
          </div>
          <h3 className="text-lg font-semibold mb-2 line-clamp-2">
            {article.title}
          </h3>
          {article.summary && (
            <p className="text-text-secondary text-sm mb-3 line-clamp-3">
              {article.summary}
            </p>
          )}
          <div className="flex justify-between items-center text-xs text-text-secondary">
            <span>{formatDate(article.published_at)}</span>
            {article.source_url && (
              <span className="text-primary">Read more →</span>
            )}
          </div>
        </div>
      </Link>
    </Card>
  );
};

export default ArticleCard;
