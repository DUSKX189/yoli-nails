import { FAJA_PRODUCT_TYPE } from "@/lib/shopify/constants";

/** Ruta de la ficha: las fajas tienen su propia tienda. */
export function productHref(product: { handle: string; productType: string }) {
  return product.productType === FAJA_PRODUCT_TYPE
    ? `/fajas-charlotte/${product.handle}`
    : `/producto/${product.handle}`;
}
