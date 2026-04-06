// frontend/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },

  trailingSlash: true,

  eslint: {
    ignoreDuringBuilds: true,
  },

  // 🔥 CRITICAL FIX — DISABLE WEBPACK CACHE
  webpack: (config) => {
    config.cache = false
    return config
  },
}

module.exports = nextConfig