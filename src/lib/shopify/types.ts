export type Money = {
  amount: string;
  currencyCode: string;
};

export type ShopifyImage = {
  url: string;
  altText: string | null;
  width: number | null;
  height: number | null;
};

/** Datos de la query ligera: lo justo para tarjetas, filtros y búsqueda. */
export type ProductSummary = {
  id: string;
  handle: string;
  title: string;
  vendor: string;
  productType: string;
  tags: string[];
  availableForSale: boolean;
  featuredImage: ShopifyImage | null;
  priceRange: { minVariantPrice: Money };
  compareAtPriceRange: { minVariantPrice: Money };
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  quantityAvailable: number | null;
  price: Money;
  compareAtPrice: Money | null;
  selectedOptions: { name: string; value: string }[];
};

/** Datos de la ficha completa (query por handle). */
export type Product = ProductSummary & {
  description: string;
  descriptionHtml: string;
  seo: { title: string | null; description: string | null };
  images: ShopifyImage[];
  variants: ProductVariant[];
  ingredientes: string | null;
  uso: string | null;
};

export type CartLine = {
  id: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    availableForSale: boolean;
    price: Money;
    image: ShopifyImage | null;
    product: { handle: string; title: string; vendor: string };
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  cost: { subtotalAmount: Money; totalAmount: Money };
  lines: CartLine[];
};

export type UserError = { field: string[] | null; message: string; code: string | null };
export type CartWarning = { code: string; message: string; target: string };
