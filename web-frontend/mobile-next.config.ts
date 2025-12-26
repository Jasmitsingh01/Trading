/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',
  reactStrictMode: true,
  
  images: {
    unoptimized: true,
  },
  
  trailingSlash: true,
  
  typescript: {
    ignoreBuildErrors: false,
  },
  
  compress: true,
  
  // Exclude non-dashboard routes from export
  experimental: {
    // This won't export API routes
  },
}

module.exports = nextConfig
