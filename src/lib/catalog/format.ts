import type { Money } from "@/lib/shopify/types";

const formatters = new Map<string, Intl.NumberFormat>();

export function formatPrice({ amount, currencyCode }: Money) {
  let formatter = formatters.get(currencyCode);
  if (!formatter) {
    formatter = new Intl.NumberFormat("es-ES", { style: "currency", currency: currencyCode });
    formatters.set(currencyCode, formatter);
  }
  return formatter.format(Number(amount));
}

/** Precio 0 o ausente = dato pendiente en Shopify: no se muestra. */
export function hasPrice(money: Money | null | undefined): money is Money {
  return Boolean(money && Number(money.amount) > 0);
}

/** "Sérum facial" → "serum-facial"; "D'LUCANI" → "dlucani". */
export function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/['’]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}
