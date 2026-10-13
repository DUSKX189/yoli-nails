import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Servidor autónomo (.next/standalone/server.js) para Docker/Coolify en el VPS.
  output: "standalone",
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Imágenes de producto servidas por el CDN de Shopify.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" }],
  },
};

export default nextConfig;
