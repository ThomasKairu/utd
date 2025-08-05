import type { Metadata } from 'next'
import './globals.css'

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
        <script
          dangerouslySetInnerHTML={{
            __html: `
              (function() {
                try {
                  var theme = localStorage.getItem('theme');
                  var systemTheme = window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
                  var resolvedTheme = theme === 'system' || !theme ? systemTheme : theme;
                  
                  document.documentElement.classList.add(resolvedTheme);
                  document.documentElement.style.colorScheme = resolvedTheme;
                  
                  // Set initial meta theme-color
                  var metaThemeColor = document.querySelector('meta[name="theme-color"]');
                  if (metaThemeColor) {
                    metaThemeColor.setAttribute('content', resolvedTheme === 'dark' ? '#1f2937' : '#ffffff');
                  }
                } catch (e) {
                  console.error('Theme initialization error:', e);
                }
              })();
            `,
          }}
        />
        <meta name="theme-color" content="#ffffff" />
      </head>
      <body className="antialiased min-h-screen flex flex-col">
        <ThemeProvider>
          <Header />
          <main className="flex-1">
            {children}
          </main>
          <Footer />
        </ThemeProvider>
      </body>
    </html>
  )
}

function ThemeProvider({ children }: { children: React.ReactNode }) {
  return <>{children}</>
}

function Header() {
  return (
    <header className="bg-white dark:bg-gray-900 shadow-md sticky top-0 z-50 transition-colors duration-200" role="banner">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <a className="flex items-center space-x-2 flex-shrink-0" href="/">
            <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
              <span className="text-white font-bold text-xl">P</span>
            </div>
            <span className="text-2xl font-bold text-primary hidden sm:block">Pulse UTD News</span>
            <span className="text-xl font-bold text-primary sm:hidden">Pulse</span>
          </a>
          
          <div className="hidden lg:block">
            <nav className="flex items-center space-x-8" role="navigation">
              <a className="transition-colors font-medium relative text-primary" href="/">
                Latest
                <span className="absolute -bottom-1 left-0 right-0 h-0.5 bg-primary rounded-full"></span>
              </a>
              <a className="transition-colors font-medium relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="/category/politics/">Politics</a>
              <a className="transition-colors font-medium relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="/category/business/">Business</a>
              <a className="transition-colors font-medium relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="/category/technology/">Technology</a>
              <a className="transition-colors font-medium relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="/category/sports/">Sports</a>
              <a className="transition-colors font-medium relative text-gray-700 dark:text-gray-300 hover:text-primary dark:hover:text-primary" href="/category/entertainment/">Entertainment</a>
            </nav>
          </div>
          
          <div className="flex items-center space-x-2">
            <div className="relative">
              <button className="p-2 rounded-lg bg-gray-100 hover:bg-gray-200 dark:bg-gray-800 dark:hover:bg-gray-700 transition-colors duration-200" aria-label="Toggle theme" title="Current theme: System">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="h-5 w-5 text-gray-700 dark:text-gray-300">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25"></path>
                </svg>
              </button>
            </div>
            <button className="p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" aria-label="Search">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z"></path>
              </svg>
            </button>
            <button className="lg:hidden p-2 text-gray-600 dark:text-gray-300 hover:text-primary dark:hover:text-primary transition-colors" aria-label="Menu">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" aria-hidden="true" data-slot="icon" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5"></path>
              </svg>
            </button>
          </div>
        </div>
      </div>
    </header>
  )
}

function Footer() {
  return (
    <footer className="bg-dark-gray text-white mt-16">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="col-span-1 md:col-span-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="w-8 h-8 bg-primary rounded-full flex items-center justify-center">
                <span className="text-white font-bold text-lg">P</span>
              </div>
              <span className="text-xl font-bold">Pulse UTD News</span>
            </div>
            <p className="text-text-secondary mb-4 max-w-md">
              Your trusted source for the latest news and insights from Kenya and around the world. 
              Stay informed with our comprehensive coverage of politics, business, technology, and more.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-text-secondary hover:text-white transition-colors">
                <span className="sr-only">Twitter</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84"></path>
                </svg>
              </a>
              <a href="#" className="text-text-secondary hover:text-white transition-colors">
                <span className="sr-only">Facebook</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M22 12c0-5.523-4.477-10-10-10S2 6.477 2 12c0 4.991 3.657 9.128 8.438 9.878v-6.987h-2.54V12h2.54V9.797c0-2.506 1.492-3.89 3.777-3.89 1.094 0 2.238.195 2.238.195v2.46h-1.26c-1.243 0-1.63.771-1.63 1.562V12h2.773l-.443 2.89h-2.33v6.988C18.343 21.128 22 16.991 22 12z" clipRule="evenodd"></path>
                </svg>
              </a>
              <a href="#" className="text-text-secondary hover:text-white transition-colors">
                <span className="sr-only">LinkedIn</span>
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path fillRule="evenodd" d="M19 0H5a5 5 0 00-5 5v14a5 5 0 005 5h14a5 5 0 005-5V5a5 5 0 00-5-5zM8 19H5V8h3v11zM6.5 6.732c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zM20 19h-3v-5.604c0-3.368-4-3.113-4 0V19h-3V8h3v1.765c1.396-2.586 7-2.777 7 2.476V19z" clipRule="evenodd"></path>
                </svg>
              </a>
            </div>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Quick Links</h3>
            <ul className="space-y-2">
              <li><a className="text-text-secondary hover:text-white transition-colors" href="/about/">About Us</a></li>
              <li><a className="text-text-secondary hover:text-white transition-colors" href="/contact/">Contact</a></li>
              <li><a className="text-text-secondary hover:text-white transition-colors" href="/editorial-policy/">Editorial Policy</a></li>
              <li><a className="text-text-secondary hover:text-white transition-colors" href="/privacy/">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-semibold mb-4">Categories</h3>
            <ul className="space-y-2">
              <li><a className="text-text-secondary hover:text-white transition-colors" href="/politics/">Politics</a></li>
              <li><a className="text-text-secondary hover:text-white transition-colors" href="/business/">Business</a></li>
              <li><a className="text-text-secondary hover:text-white transition-colors" href="/technology/">Technology</a></li>
              <li><a className="text-text-secondary hover:text-white transition-colors" href="/sports/">Sports</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-medium-gray mt-8 pt-8 text-center">
          <p className="text-text-secondary text-sm">© {new Date().getFullYear()} Pulse UTD News. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}