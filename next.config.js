const createNextIntlPlugin = require("next-intl/plugin");
const withNextIntl = createNextIntlPlugin("./i18n/request.ts");

/** @type {import('next').NextConfig} */
const nextConfig = {
  output: "export",
  distDir: "dist-export",
  trailingSlash: true,
  reactStrictMode: true,
  env: {
    NEXT_PUBLIC_SITE_URL: process.env.NEXT_PUBLIC_SITE_URL || "https://blockout.cc",
    NEXT_PUBLIC_SITE_NAME:
      process.env.NEXT_PUBLIC_SITE_NAME ||
      "Block Out! - Color Sort Puzzle Walkthrough Guide",
    NEXT_PUBLIC_GAME_NAME: process.env.NEXT_PUBLIC_GAME_NAME || "Block Out!",
    NEXT_PUBLIC_GAME_DEVELOPER:
      process.env.NEXT_PUBLIC_GAME_DEVELOPER || "Grand Games",
  },
  webpack: (config) => {
    config.resolve.alias = {
      ...config.resolve.alias,
      "@": __dirname,
    };
    return config;
  },
  images: {
    unoptimized: true,
  },
};

module.exports = withNextIntl(nextConfig);
