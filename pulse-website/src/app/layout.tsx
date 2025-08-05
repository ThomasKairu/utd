import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider, themeScript } from '@/contexts/ThemeContext';
import ServiceWorkerProvider from '@/components/common/ServiceWorkerProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://www.pulsenews.publicvm.com'),
  title: 'Pulse News - Latest News from Kenya and Beyond',
  description:
    'Stay informed with Pulse News – your trusted source for the latest news and insights from Kenya and around the world. Comprehensive coverage of politics, business, technology, sports, and entertainment.',
  keywords: [
    'Kenya news',
    'latest news',
    'politics',
    'business',
    'technology',
    'sports',
    'entertainment',
    'African news',
    'breaking news',
  ],
  authors: [{ name: 'Pulse News Editorial Team' }],
  creator: 'Pulse News',
  publisher: 'Pulse News',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://www.pulsenews.publicvm.com',
    siteName: 'Pulse News',
    title: 'Pulse News - Latest News from Kenya and Beyond',
    description:
      'Stay informed with Pulse News – your trusted source for the latest news and insights from Kenya and around the world.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pulse News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse News - Latest News from Kenya and Beyond',
    description:
      'Stay informed with Pulse News – your trusted source for the latest news and insights from Kenya and around the world.',
    images: ['/og-image.jpg'],
    creator: '@pulsenews',
    site: '@pulsenews',
  },
  alternates: {
    canonical: 'https://www.pulsenews.publicvm.com',
  },
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: themeScript }} />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <ServiceWorkerProvider>
            <Header />
            <main className="flex-1">{children}</main>
            <Footer />
          </ServiceWorkerProvider>
        </ThemeProvider>
      </body>
    </html>
  );
}