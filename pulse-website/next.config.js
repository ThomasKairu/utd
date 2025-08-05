/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Fix for GitHub Pages - use absolute paths for assets
  assetPrefix: process.env.NODE_ENV === 'production' ? '/utd' : '',
  basePath: process.env.NODE_ENV === 'production' ? '/utd' : '',
  distDir: 'out',
  generateBuildId: () => 'build',
  experimental: {
    esmExternals: false
  }
}

module.exports = nextConfig