import "server-only";

import { isShopifyConfigured, shopifyFetch } from "./client";
import { FAJA_PRODUCT_TYPE } from "./constants";
import {
  FAJA_BY_HANDLE_QUERY,
  FAJAS_LIST_QUERY,
  PRODUCT_BY_HANDLE_QUERY,
  PRODUCTS_LIST_QUERY,
} from "./queries";
import type {
  Faja,
  FajaSummary,
  FajaVariant,
  Product,
  ProductSummary,
  ProductVariant,
  ShopifyImage,
  SizeGuide,
  SizeGuideRow,
} from "./types";

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

/** Catálogo de cosmética: todo salvo las fajas. */
export async function getProducts(): Promise<ProductSummary[]> {
  const products = await getAllProducts();
  return products.filter((p) => p.productType !== FAJA_PRODUCT_TYPE);
}

/** Todo el catálogo con la query ligera (cacheado y etiquetado con "products"). */
async function getAllProducts(): Promise<ProductSummary[]> {
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

// ─── Fajas Charlotte ──────────────────────────────────────────────────────────

/** Colección automática de Shopify con regla "Tipo de producto = Faja". */
const FAJAS_COLLECTION = "fajas-charlotte";

type MetaobjectField = {
  key: string;
  value: string | null;
  reference?: { image?: ShopifyImage } | null;
  references?: Connection<{ fields: { key: string; value: string | null }[] }> | null;
};

type FajaByHandleResponse = {
  product:
    | (Omit<Faja, "images" | "variants" | "guia"> & {
        images: Connection<ShopifyImage>;
        variants: Connection<FajaVariant>;
        guia: { reference: { fields: MetaobjectField[] } | null } | null;
      })
    | null;
};

/** La API devuelve los metaobjetos como listas de {key, value}; los pasamos a objeto. */
function fieldMap(fields: { key: string; value: string | null }[]) {
  return Object.fromEntries(fields.map((f) => [f.key, f.value?.trim() || null]));
}

function parseSizeGuide(fields: MetaobjectField[] | undefined): SizeGuide | null {
  if (!fields) return null;
  const values = fieldMap(fields);
  const filas = (fields.find((f) => f.key === "filas")?.references?.nodes ?? [])
    .map((row) => fieldMap(row.fields) as SizeGuideRow)
    .filter((row) => row.talla);
  if (filas.length === 0) return null;

  return {
    nombre: values.nombre ?? "Guía de tallas",
    comoMedir: values.como_medir ?? null,
    imagen: fields.find((f) => f.key === "imagen")?.reference?.image ?? null,
    filas,
  };
}

/** Tarjetas de la tienda de fajas, en el orden de la colección. */
export async function getFajas(): Promise<FajaSummary[]> {
  if (!isShopifyConfigured()) {
    warnNotConfigured();
    return [];
  }

  const { collection } = await shopifyFetch<{
    collection: {
      products: Connection<
        Omit<FajaSummary, "images" | "variants"> & {
          images: Connection<ShopifyImage>;
          variants: Connection<FajaSummary["variants"][number]>;
        }
      >;
    } | null;
  }>(FAJAS_LIST_QUERY, { variables: { handle: FAJAS_COLLECTION } });
  return (collection?.products.nodes ?? []).map((p) => ({
    ...p,
    images: p.images.nodes,
    variants: p.variants.nodes,
  }));
}

/** Ficha completa de una faja, o null si no existe o no es una faja. */
export async function getFaja(handle: string): Promise<Faja | null> {
  if (!isShopifyConfigured()) {
    warnNotConfigured();
    return null;
  }

  const { product } = await shopifyFetch<FajaByHandleResponse>(FAJA_BY_HANDLE_QUERY, {
    variables: { handle },
  });
  if (!product || product.productType !== FAJA_PRODUCT_TYPE) return null;

  return {
    ...product,
    images: product.images.nodes,
    variants: product.variants.nodes,
    guia: parseSizeGuide(product.guia?.reference?.fields),
  };
}
