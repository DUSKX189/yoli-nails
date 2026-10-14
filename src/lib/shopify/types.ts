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

export type ProductOption = {
  name: string;
  optionValues: { name: string; swatch: { color: string | null } | null }[];
};

export type FajaVariant = ProductVariant & { image: ShopifyImage | null };

/** Fila de la guía de tallas (metaobjeto `fila_de_talla`); medidas en cm. */
export type SizeGuideRow = {
  talla: string;
  cintura: string | null;
  cadera: string | null;
  busto_superior: string | null;
  bajo_pecho: string | null;
  largo_manga_3_4: string | null;
  largo_manga_larga: string | null;
};

export type SizeGuide = {
  nombre: string;
  comoMedir: string | null;
  imagen: ShopifyImage | null;
  filas: SizeGuideRow[];
};

/** Tarjeta de faja: colores, tallas con stock y segunda foto para el hover. */
export type FajaSummary = ProductSummary & {
  images: ShopifyImage[];
  options: ProductOption[];
  variants: Pick<ProductVariant, "availableForSale" | "selectedOptions">[];
};

/** Ficha completa de una faja: variantes por color y talla y guía de tallas. */
export type Faja = ProductSummary & {
  description: string;
  descriptionHtml: string;
  seo: { title: string | null; description: string | null };
  images: ShopifyImage[];
  options: ProductOption[];
  variants: FajaVariant[];
  guia: SizeGuide | null;
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
    product: { handle: string; title: string; vendor: string; productType: string };
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
