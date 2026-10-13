import "server-only";

import { isShopifyConfigured, shopifyFetch } from "./client";
import { PRODUCT_BY_HANDLE_QUERY, PRODUCTS_LIST_QUERY } from "./queries";
import type { Product, ProductSummary, ProductVariant, ShopifyImage } from "./types";

type Connection<T> = { nodes: T[] };

type ProductsListResponse = {
  products: Connection<ProductSummary> & {
    pageInfo: { hasNextPage: boolean; endCursor: string | null };
  };
};

type ProductByHandleResponse = {
  product:
    | (Omit<Product, "images" | "variants" | "ingredientes" | "uso"> & {
        images: Connection<ShopifyImage>;
        variants: Connection<ProductVariant>;
        ingredientes: { value: string } | null;
        uso: { value: string } | null;
      })
    | null;
};

function warnNotConfigured() {
  console.warn(
    "[shopify] Tienda sin configurar: define SHOPIFY_STORE_DOMAIN y SHOPIFY_STOREFRONT_PRIVATE_TOKEN"
  );
}

/** Todo el catálogo con la query ligera (cacheado y etiquetado con "products"). */
export async function getProducts(): Promise<ProductSummary[]> {
  if (!isShopifyConfigured()) {
    warnNotConfigured();
    return [];
  }

  const products: ProductSummary[] = [];
  let after: string | null = null;
  do {
    const data: ProductsListResponse = await shopifyFetch<ProductsListResponse>(
      PRODUCTS_LIST_QUERY,
      { variables: { first: 250, after } }
    );
    products.push(...data.products.nodes);
    after = data.products.pageInfo.hasNextPage ? data.products.pageInfo.endCursor : null;
  } while (after);

  return products;
}

/** Ficha completa de un producto, o null si no existe o no está publicado. */
export async function getProduct(handle: string): Promise<Product | null> {
  if (!isShopifyConfigured()) {
    warnNotConfigured();
    return null;
  }

  const { product } = await shopifyFetch<ProductByHandleResponse>(PRODUCT_BY_HANDLE_QUERY, {
    variables: { handle },
  });
  if (!product) return null;

  return {
    ...product,
    images: product.images.nodes,
    variants: product.variants.nodes,
    ingredientes: product.ingredientes?.value.trim() || null,
    uso: product.uso?.value.trim() || null,
  };
}
