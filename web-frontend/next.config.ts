/** @type {import('next').NextConfig} */
const nextConfig = {
  // CRITICAL: Enable static export for Capacitor
  output: 'export',

  reactStrictMode: true,

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
  // Note: When using output: 'export', the output goes to 'out' by default
  // So you don't need distDir: 'out'

  eslint: {
    ignoreDuringBuilds: false,
  },
}

module.exports = nextConfig
