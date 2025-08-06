import Head from 'next/head'

interface SEOHeadProps {
  title: string
  description: string
  canonical?: string
  ogImage?: string
  ogType?: string
  keywords?: string
  author?: string
  publishedTime?: string
  modifiedTime?: string
}

export default function SEOHead({
  title,
  description,
  canonical,
  ogImage = 'https://www.pulsenews.publicvm.com/og-image.jpg',
  ogType = 'website',
  keywords,
  author = 'Pulse News Editorial Team',
  publishedTime,
  modifiedTime
}: SEOHeadProps) {
  const fullTitle = title.includes('Pulse News') ? title : `${title} | Pulse News`
  const url = canonical || 'https://www.pulsenews.publicvm.com'

  return (
    <Head>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      {keywords && <meta name="keywords" content={keywords} />}
      <meta name="author" content={author} />
      <meta name="robots" content="index, follow" />
      <meta name="language" content="English" />
      <meta name="revisit-after" content="1 days" />
      
      {/* Canonical URL */}
      <link rel="canonical" href={url} />
      
      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={ogImage} />
      <meta property="og:site_name" content="Pulse News" />
      <meta property="og:locale" content="en_US" />
      
      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={ogImage} />
      <meta property="twitter:site" content="@pulsenews" />
      <meta property="twitter:creator" content="@pulsenews" />
      
      {/* Article specific meta tags */}
      {publishedTime && <meta property="article:published_time" content={publishedTime} />}
      {modifiedTime && <meta property="article:modified_time" content={modifiedTime} />}
      {ogType === 'article' && <meta property="article:author" content={author} />}
      
      {/* Additional SEO */}
      <meta name="theme-color" content="#d32f2f" />
      <meta name="msapplication-TileColor" content="#d32f2f" />
      
      {/* Structured Data */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "NewsMediaOrganization",
            "name": "Pulse News",
            "url": "https://www.pulsenews.publicvm.com",
            "logo": {
              "@type": "ImageObject",
              "url": "https://www.pulsenews.publicvm.com/logo.png"
            },
            "sameAs": [
              "https://twitter.com/pulsenews",
              "https://facebook.com/pulsenews",
              "https://instagram.com/pulsenews"
            ],
            "description": "Your trusted source for the latest news and insights from Kenya and around the world."
          })
        }}
      />
    </Head>
  )
}