// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Remove or comment out the 'output: export' line
  // output: 'export',
  
  // Instead, use these settings for Cloudflare Pages
  images: {
    unoptimized: true,
  },
  trailingSlash: true,
}

module.exports = nextConfig