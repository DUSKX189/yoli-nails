import type { MetadataRoute } from "next";
import { getProducts } from "@/lib/shopify/products";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Se regenera cada hora para incluir productos nuevos.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const products = await getProducts().catch(() => []);
  const pages = ["", "/servicios", "/tienda", "/contacto"];

  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}` })),
    ...products.map((p) => ({ url: `${siteUrl}/producto/${p.handle}` })),
  ];
}
