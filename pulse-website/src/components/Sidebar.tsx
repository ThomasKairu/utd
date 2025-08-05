'use client'

import Link from 'next/link'
import AdBanner from './AdBanner'

const FacebookIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd" />
  </svg>
)

const TwitterIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
  </svg>
)

const InstagramIcon = () => (
  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
    <path fillRule="evenodd" d="M12.017 0C8.396 0 7.929.013 6.71.072 5.493.131 4.67.333 3.946.63c-.789.306-1.459.717-2.126 1.384S.935 3.35.63 4.14C.333 4.864.131 5.687.072 6.905.013 8.124 0 8.591 0 12.017s.013 3.893.072 5.112c.059 1.218.261 2.04.558 2.765.306.788.717 1.459 1.384 2.126.667.666 1.336 1.079 2.126 1.384.724.297 1.547.499 2.765.558 1.219.059 1.686.072 5.112.072s3.893-.013 5.112-.072c1.218-.059 2.04-.261 2.765-.558a5.106 5.106 0 002.126-1.384 5.106 5.106 0 001.384-2.126c.297-.725.499-1.547.558-2.765.059-1.219.072-1.686.072-5.112s-.013-3.893-.072-5.112c-.059-1.218-.261-2.04-.558-2.765a5.106 5.106 0 00-1.384-2.126A5.106 5.106 0 0019.777.63c-.725-.297-1.547-.499-2.765-.558C15.893.013 15.426 0 12.017 0zm0 2.17c3.291 0 3.683.013 4.947.072 1.194.055 1.843.249 2.274.413.572.222.98.487 1.41.916.42.42.694.828.916 1.41.164.431.358 1.08.413 2.274.059 1.264.072 1.656.072 4.947s-.013 3.683-.072 4.947c-.055 1.194-.249 1.843-.413 2.274-.222.572-.487.98-.916 1.41a3.8 3.8 0 01-1.41.916c-.431.164-1.08.358-2.274.413-1.264.059-1.656.072-4.947.072s-3.683-.013-4.947-.072c-1.194-.055-1.843-.249-2.274-.413a3.8 3.8 0 01-1.41-.916 3.8 3.8 0 01-.916-1.41c-.164-.431-.358-1.08-.413-2.274-.059-1.264-.072-1.656-.072-4.947s.013-3.683.072-4.947c.055-1.194.249-1.843.413-2.274.222-.572.487-.98.916-1.41a3.8 3.8 0 011.41-.916c.431-.164 1.08-.358 2.274-.413 1.264-.059 1.656-.072 4.947-.072z" clipRule="evenodd" />
    <path fillRule="evenodd" d="M12.017 5.838a6.179 6.179 0 100 12.358 6.179 6.179 0 000-12.358zM12.017 16a4 4 0 110-8 4 4 0 010 8z" clipRule="evenodd" />
    <path d="M19.846 5.595a1.441 1.441 0 11-2.883 0 1.441 1.441 0 012.883 0z" />
  </svg>
)

interface TrendingNewsItem {
  title: string
  slug: string
  imageUrl: string
}

export default function Sidebar() {
  const trendingNews: TrendingNewsItem[] = [
    {
      title: "Kenya's Digital Identity System Launches Nationwide",
      slug: "kenya-digital-identity-system-2024",
      imageUrl: "https://images.unsplash.com/photo-1600506451234-9e555c0c8d05?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxjb25mZXJlbmNlJTIwZ292ZXJubWVudCUyMG1lZXRpbmclMjBwb2xpdGljc3xlbnwwfDB8fHwxNzU0MzkzNTM3fDA&ixlib=rb-4.1.0&q=85"
    },
    {
      title: "Tech Startup Funding Reaches Record High",
      slug: "tech-startup-funding-record-2024",
      imageUrl: "https://images.unsplash.com/photo-1642522029691-029b5a432954?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwyfHxidXNpbmVzcyUyMG1lZXRpbmclMjBvZmZpY2UlMjBjb3Jwb3JhdGV8ZW58MHwwfHx8MTc1NDM5MzUzN3ww&ixlib=rb-4.1.0&q=85"
    },
    {
      title: "Marathon Champions Return Home",
      slug: "marathon-champions-return-2024",
      imageUrl: "https://images.unsplash.com/photo-1600442715978-d0268caa17f5?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHwxfHxmb290YmFsbCUyMHNvY2NlciUyMHN0YWRpdW0lMjBzcG9ydHN8ZW58MHwwfHxncmVlbnwxNzU0MzkzNTM3fDA&ixlib=rb-4.1.0&q=85"
    },
    {
      title: "New Infrastructure Projects Announced",
      slug: "infrastructure-projects-2024",
      imageUrl: "https://images.unsplash.com/photo-1614793319738-bde496bbe85e?crop=entropy&cs=srgb&fm=jpg&ixid=M3w3NTAwNDR8MHwxfHNlYXJjaHw4fHxjb25mZXJlbmNlJTIwZ292ZXJubWVudCUyMG1lZXRpbmclMjBwb2xpdGljc3xlbnwwfDB8fHwxNzU0MzkzNTM3fDA&ixlib=rb-4.1.0&q=85"
    }
  ]

  return (
    <aside className="space-y-8">
      {/* Trending News Widget */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="heading-secondary text-xl text-text-primary mb-4 border-b border-gray-200 pb-2">
          Trending News
        </h3>
        <div className="space-y-4">
          {trendingNews.map((item, index) => (
            <div key={index} className="flex space-x-3 group">
              <div className="flex-shrink-0">
                <img
                  src={item.imageUrl}
                  alt={item.title}
                  className="w-16 h-16 object-cover rounded-lg"
                />
              </div>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/article/${item.slug}`}
                  className="text-sm font-medium text-text-primary group-hover:text-pulse-red transition-colors duration-200 line-clamp-3 text-body"
                >
                  {item.title}
                </Link>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Social Media Links */}
      <div className="bg-white rounded-lg shadow-md p-6">
        <h3 className="heading-secondary text-xl text-text-primary mb-4 border-b border-gray-200 pb-2">
          Follow Us
        </h3>
        <div className="flex space-x-4">
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors duration-200"
          >
            <FacebookIcon />
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 bg-blue-400 text-white rounded-full hover:bg-blue-500 transition-colors duration-200"
          >
            <TwitterIcon />
          </a>
          <a
            href="#"
            className="flex items-center justify-center w-10 h-10 bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-full hover:from-purple-600 hover:to-pink-600 transition-all duration-200"
          >
            <InstagramIcon />
          </a>
        </div>
      </div>

      {/* Vertical Ad Banner */}
      <div className="sticky top-24">
        <AdBanner width="100%" height="600px" className="max-w-sm mx-auto" />
      </div>
    </aside>
  )
}