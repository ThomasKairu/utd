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
  generateBuildId: () => `pulse-${Date.now()}`,
  experimental: {
    esmExternals: false
  },
  // Ensure proper static export
  eslint: {
    ignoreDuringBuilds: true,
  },
  typescript: {
    ignoreBuildErrors: true,
  },
  // Force cache busting
  env: {
    BUILD_TIME: new Date().toISOString(),
  }
}

module.exports = nextConfig