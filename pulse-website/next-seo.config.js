/** @type {import('next-seo').DefaultSeoProps} */
const defaultSEO = {
  titleTemplate: '%s | Pulse News',
  defaultTitle: 'Pulse News - Latest News from Kenya and Beyond',
  description:
    'Stay informed with Pulse News – your trusted source for the latest news and insights from Kenya and around the world. Comprehensive coverage of politics, business, technology, sports, and entertainment.',
  canonical: 'https://www.pulsenews.publicvm.com',
  
  // Open Graph
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
        url: 'https://www.pulsenews.publicvm.com/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Pulse News - Latest News from Kenya and Beyond',
        type: 'image/jpeg',
      },
      {
        url: 'https://www.pulsenews.publicvm.com/og-image-square.jpg',
        width: 1200,
        height: 1200,
        alt: 'Pulse News Logo',
        type: 'image/jpeg',
      },
    ],
  },

  // Twitter
  twitter: {
    handle: '@pulsenews',
    site: '@pulsenews',
    cardType: 'summary_large_image',
  },

  // Additional meta tags
  additionalMetaTags: [
    {
      name: 'viewport',
      content: 'width=device-width, initial-scale=1',
    },
    {
      name: 'application-name',
      content: 'Pulse News',
    },
    {
      name: 'apple-mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'apple-mobile-web-app-status-bar-style',
      content: 'default',
    },
    {
      name: 'apple-mobile-web-app-title',
      content: 'Pulse News',
    },
    {
      name: 'format-detection',
      content: 'telephone=no',
    },
    {
      name: 'mobile-web-app-capable',
      content: 'yes',
    },
    {
      name: 'msapplication-config',
      content: '/browserconfig.xml',
    },
    {
      name: 'msapplication-TileColor',
      content: '#0d47a1',
    },
    {
      name: 'msapplication-tap-highlight',
      content: 'no',
    },
    {
      name: 'theme-color',
      content: '#ffffff',
    },
    {
      name: 'geo.region',
      content: 'KE',
    },
    {
      name: 'geo.placename',
      content: 'Kenya',
    },
    {
      name: 'news_keywords',
      content: 'Kenya, Africa, Politics, Business, Technology, Sports, Entertainment, Breaking News',
    },
    {
      property: 'article:publisher',
      content: 'https://www.facebook.com/pulsenews',
    },
    {
      property: 'fb:app_id',
      content: 'your-facebook-app-id', // Replace with actual Facebook App ID
    },
  ],

  // Additional link tags
  additionalLinkTags: [
    {
      rel: 'icon',
      href: '/favicon.ico',
    },
    {
      rel: 'apple-touch-icon',
      href: '/apple-touch-icon.png',
      sizes: '180x180',
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon-32x32.png',
      sizes: '32x32',
    },
    {
      rel: 'icon',
      type: 'image/png',
      href: '/favicon-16x16.png',
      sizes: '16x16',
    },
    {
      rel: 'manifest',
      href: '/site.webmanifest',
    },
    {
      rel: 'mask-icon',
      href: '/safari-pinned-tab.svg',
      color: '#0d47a1',
    },
    {
      rel: 'shortcut icon',
      href: '/favicon.ico',
    },
    {
      rel: 'alternate',
      type: 'application/rss+xml',
      title: 'Pulse News RSS Feed',
      href: 'https://www.pulsenews.publicvm.com/rss.xml',
    },
    {
      rel: 'sitemap',
      type: 'application/xml',
      href: 'https://www.pulsenews.publicvm.com/sitemap.xml',
    },
  ],

  // Robots
  robotsProps: {
    nosnippet: false,
    notranslate: false,
    noimageindex: false,
    noarchive: false,
    maxSnippet: -1,
    maxImagePreview: 'large',
    maxVideoPreview: -1,
  },

  // Language alternatives
  languageAlternates: [
    {
      hrefLang: 'en',
      href: 'https://www.pulsenews.publicvm.com',
    },
    {
      hrefLang: 'x-default',
      href: 'https://www.pulsenews.publicvm.com',
    },
  ],
};

export default defaultSEO;