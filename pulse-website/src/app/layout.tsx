import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/layout/Header';
import Footer from '@/components/layout/Footer';
import { ThemeProvider, themeScript } from '@/contexts/ThemeContext';
import ServiceWorkerProvider from '@/components/common/ServiceWorkerProvider';

export const metadata: Metadata = {
  metadataBase: new URL('https://pulse.utdnews.com'),
  title: 'Pulse UTD News - Latest News from Kenya and Beyond',
  description:
    'Stay informed with Pulse UTD News – your trusted source for the latest news and insights from Kenya and around the world. Comprehensive coverage of politics, business, technology, sports, and entertainment.',
  keywords: [
    'Kenya news',
    'latest news',
    'politics',
    'business',
    'technology',
    'sports',
    'entertainment',
  ],
  authors: [{ name: 'Pulse UTD News Team' }],
  creator: 'Pulse UTD News',
  publisher: 'Pulse UTD News',
  robots: 'index, follow',
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://pulse.utdnews.com',
    siteName: 'Pulse UTD News',
    title: 'Pulse UTD News - Latest News from Kenya and Beyond',
    description:
      'Stay informed with Pulse UTD News – your trusted source for the latest news and insights from Kenya and around the world.',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pulse UTD News',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Pulse UTD News - Latest News from Kenya and Beyond',
    description:
      'Stay informed with Pulse UTD News – your trusted source for the latest news and insights from Kenya and around the world.',
    images: ['/og-image.jpg'],
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
