import "server-only";

const domain = process.env.SHOPIFY_STORE_DOMAIN;
const apiVersion = process.env.SHOPIFY_STOREFRONT_API_VERSION ?? "2026-07";
const privateToken = process.env.SHOPIFY_STOREFRONT_PRIVATE_TOKEN;

/** Etiquetas de caché del catálogo; las invalida el webhook de /api/revalidate. */
export const CACHE_TAGS = { products: "products" } as const;

/** Segundos que se reutiliza el catálogo antes de volver a pedirlo a Shopify. */
const CATALOG_REVALIDATE = 3600;

export function isShopifyConfigured() {
  return Boolean(domain && privateToken);
}

export class ShopifyError extends Error {
  constructor(message: string, readonly details?: unknown) {
    super(message);
    this.name = "ShopifyError";
  }
}

type FetchOptions = {
  variables?: Record<string, unknown>;
  /** Datos por usuario (carrito): nunca se cachean. */
  noStore?: boolean;
  /** IP del cliente, recomendada por Shopify para peticiones desde servidor. */
  buyerIp?: string | null;
};

export async function shopifyFetch<T>(
  query: string,
  { variables, noStore = false, buyerIp }: FetchOptions = {}
): Promise<T> {
  if (!domain || !privateToken) {
    throw new ShopifyError(
      "Faltan SHOPIFY_STORE_DOMAIN o SHOPIFY_STOREFRONT_PRIVATE_TOKEN en el entorno"
    );
  }

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    "Shopify-Storefront-Private-Token": privateToken,
  };
  if (buyerIp) headers["Shopify-Storefront-Buyer-IP"] = buyerIp;

  const res = await fetch(`https://${domain}/api/${apiVersion}/graphql.json`, {
    method: "POST",
    headers,
    body: JSON.stringify({ query, variables }),
    ...(noStore
      ? { cache: "no-store" }
      : { next: { revalidate: CATALOG_REVALIDATE, tags: [CACHE_TAGS.products] } }),
  });

  if (!res.ok) {
    throw new ShopifyError(`Storefront API respondió ${res.status} ${res.statusText}`);
  }

  const body = (await res.json()) as { data?: T; errors?: { message: string }[] };
  if (body.errors?.length) {
    throw new ShopifyError(body.errors.map((e) => e.message).join("; "), body.errors);
  }
  if (!body.data) throw new ShopifyError("Respuesta de Shopify sin datos");

  return body.data;
}
