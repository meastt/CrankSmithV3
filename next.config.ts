import type { NextConfig } from "next";

const withBundleAnalyzer = require('@next/bundle-analyzer')({
  enabled: process.env.ANALYZE === 'true',
});

const nextConfig: NextConfig = {
  reactCompiler: true,

  // Optional: comma-separated hostnames for LAN device testing (e.g. NEXT_DEV_ALLOWED_ORIGINS=192.168.1.26)
  ...(process.env.NODE_ENV === 'development' && process.env.NEXT_DEV_ALLOWED_ORIGINS
    ? {
        allowedDevOrigins: process.env.NEXT_DEV_ALLOWED_ORIGINS.split(',')
          .map((s) => s.trim())
          .filter(Boolean),
      }
    : {}),

  async headers() {
    return [
      {
        source: '/(.*)',
        headers: [
          { key: 'X-Frame-Options', value: 'DENY' },
          { key: 'X-Content-Type-Options', value: 'nosniff' },
          { key: 'X-DNS-Prefetch-Control', value: 'on' },
          { key: 'Referrer-Policy', value: 'strict-origin-when-cross-origin' },
          { key: 'Strict-Transport-Security', value: 'max-age=31536000; includeSubDomains; preload' },
          { key: 'Permissions-Policy', value: 'camera=(), microphone=(), geolocation=()' },
        ],
      },
    ];
  },

  async redirects() {
    return [
      {
        source: '/landing',
        destination: '/',
        permanent: true,
      },
    ];
  },
};

export default withBundleAnalyzer(nextConfig);
