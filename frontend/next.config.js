/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  eslint: {
    // Don't fail build on ESLint warnings (only errors)
    // React Hook dependency warnings are common and often intentional
    ignoreDuringBuilds: false,
  },
  typescript: {
    // Warning: This allows production builds to successfully complete even if
    // your project has type errors. Only use this if you need to.
    ignoreBuildErrors: false,
  },
  images: {
    domains: ['localhost'],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
      },
    ],
  },
  // Environment variables are automatically available in Next.js
  // No need to explicitly define them in env object for Vercel
  async rewrites() {
    // Only use rewrites in development or if API_URL is set
    // In production on Vercel, use direct API calls or Vercel rewrites
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    
    // Only add rewrite if API_URL is explicitly set and not localhost
    if (apiUrl && !apiUrl.includes('localhost')) {
      return [
        {
          source: '/api/:path*',
          destination: `${apiUrl}/api/:path*`,
        },
      ];
    }
    
    // In development, use localhost
    if (process.env.NODE_ENV === 'development') {
      return [
        {
          source: '/api/:path*',
          destination: 'http://localhost:5000/api/:path*',
        },
      ];
    }
    
    return [];
  },
}

module.exports = nextConfig
