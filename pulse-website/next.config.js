/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  trailingSlash: true,
  images: {
    unoptimized: true
  },
  // Removed assetPrefix and basePath for custom domain deployment
  // Custom domains don't need these prefixes
  distDir: 'out',
  generateBuildId: () => 'build',
  experimental: {
    esmExternals: false
  },
  // Ensure proper static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  }
}

module.exports = nextConfig