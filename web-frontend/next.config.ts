/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  // Enable static export for Capacitor
  // Disable server-side features for static export
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
  typescript: {
    ignoreBuildErrors: false,
  },
  // Optimize for mobile
  compress: true,
  // Configure output directory for Capacitor
  distDir: 'out',
  // Disable features not compatible with static export
  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
