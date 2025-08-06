import type { Metadata } from 'next'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Pulse News - Latest News from Kenya and Beyond',
  description: 'Stay informed with Pulse News – your trusted source for the latest news and insights from Kenya and around the world. Comprehensive coverage of politics, business, technology, sports, and entertainment.',
  keywords: 'Kenya news,latest news,politics,business,technology,sports,entertainment,African news,breaking news,Nairobi news,East Africa news',
  authors: [{ name: 'Pulse News Editorial Team' }],
  creator: 'Pulse News',
  publisher: 'Pulse News',
  robots: 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1',
  verification: {
    google: 'your-google-verification-code',
  },
  openGraph: {
    title: 'Pulse News - Latest News from Kenya and Beyond',
    description: 'Stay informed with Pulse News – your trusted source for the latest news and insights from Kenya and around the world.',
    url: 'https://www.pulsenews.publicvm.com',
    siteName: 'Pulse News',
    locale: 'en_US',
    type: 'website',
    images: [
      {
        url: 'https://www.pulsenews.publicvm.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pulse News - Kenya\'s Trusted News Source',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    site: '@pulsenews',
    creator: '@pulsenews',
    title: 'Pulse News - Latest News from Kenya and Beyond',
    description: 'Stay informed with Pulse News – your trusted source for the latest news and insights from Kenya and around the world.',
    images: ['https://www.pulsenews.publicvm.com/og-image.jpg'],
  },
  icons: {
    icon: '/favicon.ico',
    shortcut: '/favicon.ico',
    apple: '/apple-touch-icon.png',
  },
  manifest: '/manifest.json',
  alternates: {
    canonical: 'https://www.pulsenews.publicvm.com',
    languages: {
      'en-US': 'https://www.pulsenews.publicvm.com',
    },
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="theme-color" content="#d32f2f" />
        <meta name="msapplication-TileColor" content="#d32f2f" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
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
                "url": "https://www.pulsenews.publicvm.com/logo.png",
                "width": 200,
                "height": 60
              },
              "sameAs": [
                "https://twitter.com/pulsenews",
                "https://facebook.com/pulsenews",
                "https://instagram.com/pulsenews"
              ],
              "description": "Your trusted source for the latest news and insights from Kenya and around the world.",
              "address": {
                "@type": "PostalAddress",
                "addressCountry": "KE",
                "addressLocality": "Nairobi"
              },
              "contactPoint": {
                "@type": "ContactPoint",
                "contactType": "Editorial",
                "email": "editorial@pulsenews.publicvm.com"
              }
            })
          }}
        />
      </head>
      <body className="antialiased min-h-screen flex flex-col bg-gray-50">
        <Header />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  )
}