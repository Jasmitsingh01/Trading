/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Remove or comment out output: 'export'
  // output: 'export', 
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: false,
  },
}

module.exports = nextConfig
