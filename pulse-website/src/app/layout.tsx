import type { Metadata } from 'next'
import './globals.css'
import Header from '../components/Header'
import Footer from '../components/Footer'

export const metadata: Metadata = {
  title: 'Pulse News - Latest News from Kenya and Beyond',
  description: 'Stay informed with Pulse News – your trusted source for the latest news and insights from Kenya and around the world. Comprehensive coverage of politics, business, technology, sports, and entertainment.',
  keywords: 'Kenya news,latest news,politics,business,technology,sports,entertainment,African news,breaking news',
  authors: [{ name: 'Pulse News Editorial Team' }],
  creator: 'Pulse News',
  publisher: 'Pulse News',
  robots: 'index, follow',
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
        alt: 'Pulse News',
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
        <meta name="theme-color" content="#ffffff" />
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