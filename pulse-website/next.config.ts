import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const isCustomDomain = process.env.CUSTOM_DOMAIN === 'true';
const isGitHubPages = process.env.GITHUB_PAGES === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for static export
  },
  eslint: {
    dirs: ['src'],
  },
  // Only use basePath for GitHub Pages deployment, not for custom domain
  basePath: isProd && isGitHubPages && !isCustomDomain ? '/utd' : '',
  assetPrefix: isProd && isGitHubPages && !isCustomDomain ? '/utd/' : '',
};

export default nextConfig;
