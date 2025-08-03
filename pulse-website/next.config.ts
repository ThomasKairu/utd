import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for GitHub Pages
  },
  eslint: {
    dirs: ['src'],
  },
  // Configure correct asset paths for GitHub Pages static hosting
  basePath: isProd ? '/pulse-website' : '', // Replace with your repo-name if different
  assetPrefix: isProd ? '/pulse-website/' : '',
};

export default nextConfig;
