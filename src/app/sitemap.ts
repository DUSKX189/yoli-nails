import type { MetadataRoute } from "next";
import { productHref } from "@/lib/catalog/routes";
import { getFajas, getProducts } from "@/lib/shopify/products";

const siteUrl = process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3000";

// Se regenera cada hora para incluir productos nuevos.
export const revalidate = 3600;

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [products, fajas] = await Promise.all([
    getProducts().catch(() => []),
    getFajas().catch(() => []),
  ]);
  const pages = ["", "/servicios", "/tienda", "/fajas-charlotte", "/contacto"];

  return [
    ...pages.map((path) => ({ url: `${siteUrl}${path}` })),
    ...[...products, ...fajas].map((p) => ({ url: `${siteUrl}${productHref(p)}` })),
  ];
}
