import type { NextConfig } from "next";

// Bundle analyzer - use ANALYZE=true npm run build to analyze bundle
const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  // Enable compression
  compress: true,

  // Optimize images
  images: {
    formats: ['image/avif', 'image/webp'],
    minimumCacheTTL: 60 * 60 * 24 * 30, // 30 days
    deviceSizes: [640, 750, 828, 1080, 1200],
    imageSizes: [16, 32, 48, 64, 96],
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
      {
        protocol: 'http',
        hostname: 'localhost',
      },
    ],
  },

  // Production source maps (disabled for smaller bundle)
  productionBrowserSourceMaps: false,

  // Experimental features for better performance
  experimental: {
    optimizeCss: true,
    optimizePackageImports: ['@/lib', '@/components'],
  },

  // Enable React strict mode for better performance
  reactStrictMode: true,

  // Optimize build output
  poweredByHeader: false,

  // Advanced minification and tree shaking
  compiler: {
    removeConsole: process.env.NODE_ENV === 'production' ? {
      exclude: ['error', 'warn'],
    } : false,
  },
};

export default withBundleAnalyzer(nextConfig);
