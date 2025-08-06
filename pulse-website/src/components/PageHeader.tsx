interface PageHeaderProps {
  title: string
  description?: string
  breadcrumbs?: Array<{ name: string; href: string }>
}

export default function PageHeader({ title, description, breadcrumbs }: PageHeaderProps) {
  return (
    <div className="bg-gradient-to-r from-pulse-red to-pulse-red-dark text-white py-16">
      <div className="container mx-auto px-4">
        {/* Breadcrumbs */}
        {breadcrumbs && (
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg className="w-4 h-4 mx-2 text-white/70" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  <a
                    href={crumb.href}
                    className={`hover:text-white transition-colors duration-200 ${
                      index === breadcrumbs.length - 1 ? 'text-white font-medium' : 'text-white/70'
                    }`}
                  >
                    {crumb.name}
                  </a>
                </li>
              ))}
            </ol>
          </nav>
        )}
        
        {/* Page Title */}
        <h1 className="heading-primary text-4xl md:text-5xl lg:text-6xl font-bold mb-4">
          {title}
        </h1>
        
        {/* Description */}
        {description && (
          <p className="text-xl text-white/90 max-w-3xl text-body leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}