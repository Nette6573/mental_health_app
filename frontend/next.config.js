// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // This enables static export
  images: {
    unoptimized: true, // Required for static export with Next.js Image component
  },
  trailingSlash: true, // Optional but recommended for Cloudflare
}

module.exports = nextConfig