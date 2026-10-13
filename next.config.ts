import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Servidor autónomo (.next/standalone/server.js) para Docker/Coolify en el VPS.
  // En Vercel no se usa: su build empaqueta el servidor por su cuenta y el paso
  // standalone falla buscando .next/next-server.js.nft.json (VERCEL=1 en su build).
  output: process.env.VERCEL ? undefined : "standalone",
  poweredByHeader: false,
  images: {
    formats: ["image/avif", "image/webp"],
    // Imágenes de producto servidas por el CDN de Shopify.
    remotePatterns: [{ protocol: "https", hostname: "cdn.shopify.com", pathname: "/s/files/**" }],
  },
};

export default nextConfig;
