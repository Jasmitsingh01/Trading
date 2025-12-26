import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async rewrites() {
    return [
      {
        source: '/api/:path*',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/api/:path*`
      },
      {
        source: '/graphql',
        destination: `${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8080'}/graphql`
      }
    ];
  },
  // Important: This ensures cookies work correctly with rewrites
  async headers() {
    return [
      {
        source: '/api/:path*',
        headers: [
          { key: 'Access-Control-Allow-Credentials', value: 'true' },
          { key: 'Access-Control-Allow-Origin', value: 'http://localhost:3000' },
        ],
      },
    ];
  },
};

export default nextConfig;
