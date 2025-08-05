interface AdBannerProps {
  width?: string
  height?: string
  className?: string
}

export default function AdBanner({ 
  width = '728px', 
  height = '90px', 
  className = '' 
}: AdBannerProps) {
  return (
    <div 
      className={`ad-placeholder rounded-lg ${className}`}
      style={{ width, height, minHeight: height }}
    >
      Advertisement
    </div>
  )
}