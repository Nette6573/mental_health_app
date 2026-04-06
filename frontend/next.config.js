// frontend/next.config.js

/** @type {import('next').NextConfig} */
const nextConfig = {
  // ❌ REMOVED: output: 'export'

  images: {
    unoptimized: true, // Kept this (safe)
  },

  // OPTIONAL: can remove this later if not needed
  trailingSlash: true,

  eslint: {
    ignoreDuringBuilds: true,
  },
}

module.exports = nextConfig