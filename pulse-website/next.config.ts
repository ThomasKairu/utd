import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const isCustomDomain = process.env.CUSTOM_DOMAIN === 'true';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

console.log('🔧 Next.js Config Environment:', {
  isProd,
  isCustomDomain,
  isGitHubPages,
  NODE_ENV: process.env.NODE_ENV,
  CUSTOM_DOMAIN: process.env.CUSTOM_DOMAIN,
  GITHUB_PAGES: process.env.GITHUB_PAGES,
});

// Determine if we should use basePath
// Only use basePath for GitHub Pages deployment WITHOUT custom domain
const shouldUseBasePath = isProd && isGitHubPages && !isCustomDomain;

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  eslint: {
    dirs: ['src'],
  },
  // For custom domain (www.pulsenews.publicvm.com), don't use any path prefix
  // Only use basePath for GitHub Pages deployment without custom domain
  basePath: shouldUseBasePath ? '/utd' : '',
  assetPrefix: shouldUseBasePath ? '/utd/' : '',
};

console.log('🚀 Final Next.js Config:', {
  basePath: nextConfig.basePath,
  assetPrefix: nextConfig.assetPrefix,
  shouldUseBasePath,
  customDomainDetected: isCustomDomain,
});

export default nextConfig;