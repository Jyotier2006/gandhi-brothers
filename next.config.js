/** @type {import('next').NextConfig} */
const nextConfig = {
  // Local /public images only — no external CDN dependency.
  // If you later add Unsplash or other remote hosts, list them here.
  images: {
    remotePatterns: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: '2mb',
    },
  },
};

module.exports = nextConfig;
