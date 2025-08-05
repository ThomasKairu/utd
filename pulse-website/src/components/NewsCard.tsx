import Link from 'next/link'
import Image from 'next/image'

interface NewsCardProps {
  title: string
  summary: string
  category: string
  imageUrl: string
  slug: string
  publishedAt: string
  isLarge?: boolean
}

export default function NewsCard({
  title,
  summary,
  category,
  imageUrl,
  slug,
  publishedAt,
  isLarge = false
}: NewsCardProps) {
  const publishedDate = new Date(publishedAt).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })

  return (
    <article className={`news-card bg-white rounded-lg shadow-md overflow-hidden ${isLarge ? 'md:col-span-2' : ''}`}>
      <div className={`news-card-image relative ${isLarge ? 'aspect-[16/9]' : 'aspect-video'} bg-gray-200 overflow-hidden`}>
        <img
          src={imageUrl}
          alt={title}
          className="w-full h-full object-cover transition-transform duration-300"
        />
        <div className="absolute top-3 left-3">
          <span className="category-tag">
            {category}
          </span>
        </div>
      </div>
      
      <div className={`p-${isLarge ? '6' : '4'}`}>
        <h2 className={`heading-secondary text-text-primary mb-2 line-clamp-2 ${isLarge ? 'text-2xl' : 'text-lg'}`}>
          <Link 
            href={`/article/${slug}`}
            className="hover:text-pulse-red transition-colors duration-200"
          >
            {title}
          </Link>
        </h2>
        
        <p className={`text-text-secondary text-body mb-3 line-clamp-3 ${isLarge ? 'text-base' : 'text-sm'}`}>
          {summary}
        </p>
        
        <div className="flex items-center justify-between text-sm text-text-secondary">
          <time dateTime={publishedAt} className="text-body">
            {publishedDate}
          </time>
          <Link
            href={`/article/${slug}`}
            className="text-pulse-red hover:text-pulse-red-dark font-medium transition-colors duration-200"
          >
            Read More
          </Link>
        </div>
      </div>
    </article>
  )
}