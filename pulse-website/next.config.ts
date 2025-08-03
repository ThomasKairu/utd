import type { NextConfig } from 'next';

const isProd = process.env.NODE_ENV === 'production';
const isCustomDomain = process.env.CUSTOM_DOMAIN === 'true';

const nextConfig: NextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true, // Required for GitHub Pages
  },
  eslint: {
    dirs: ['src'],
  },
  // Configure paths based on deployment type
  basePath: isProd && !isCustomDomain ? '/utd' : '',
  assetPrefix: isProd && !isCustomDomain ? '/utd/' : '',
};

export default nextConfig;
