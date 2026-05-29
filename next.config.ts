import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Enable gzip/brotli compression on responses
  compress: true,

  // Enable experimental package optimization to tree-shake unused three.js modules
  experimental: {
    optimizePackageImports: ["three", "@react-three/fiber", "@react-three/drei", "gsap"],
  },

  // Image optimization config
  images: {
    // Serve WebP and AVIF by default (Next.js auto-converts on request)
    formats: ["image/webp", "image/avif"],
    // Explicitly allow the optimized crew image sizes
    deviceSizes: [640, 750, 828, 1080, 1200, 1920],
    imageSizes: [16, 32, 48, 64, 96, 128, 256, 384],
  },

  // Add long-lived cache headers for static assets
  async headers() {
    return [
      {
        // Static media: videos, textures, models, music — 1 year
        source: "/(videos|textures|models|music|crew)/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
      {
        // JS/CSS chunks — cache with revalidation
        source: "/_next/static/(.*)",
        headers: [
          {
            key: "Cache-Control",
            value: "public, max-age=31536000, immutable",
          },
        ],
      },
    ];
  },
};

export default nextConfig;
