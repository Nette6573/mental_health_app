// frontend/next.config.js
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'export',  // This is crucial for Cloudflare Pages
  images: {
    unoptimized: true, // If you use Next.js Image component
  },
  trailingSlash: true, // Optional but recommended for Cloudflare
}

module.exports = nextConfig