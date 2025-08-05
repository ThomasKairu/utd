'use client'

export default function BreakingNews() {
  const breakingNews = [
    "Kenya's economy shows strong growth in Q4 2024",
    "New infrastructure projects announced for Nairobi",
    "Technology sector receives major investment boost",
    "Sports: Kenya dominates East African championships",
    "Breaking: Parliament passes new digital identity bill"
  ]

  return (
    <div className="bg-pulse-red text-white py-2 overflow-hidden">
      <div className="container mx-auto px-4">
        <div className="flex items-center">
          <div className="flex-shrink-0 mr-4">
            <span className="bg-white text-pulse-red px-3 py-1 text-sm font-bold rounded">
              BREAKING
            </span>
          </div>
          <div className="flex-1 overflow-hidden">
            <div className="breaking-news-scroll whitespace-nowrap">
              <span className="text-sm font-medium">
                {breakingNews.join(' • ')} • 
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}