const createNextIntlPlugin = require("next-intl/plugin");

// Point the plugin at our request config (default location is ./i18n/request.ts).
const withNextIntl = createNextIntlPlugin("./src/i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  // Local /public images only — no external CDN dependency.
  // If you later add Unsplash or other remote hosts, list them here.
  images: {
    remotePatterns: [],
  },
  experimental: {
    serverActions: {
      bodySizeLimit: "2mb",
    },
  },
};

module.exports = withNextIntl(nextConfig);
