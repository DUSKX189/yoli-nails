"use server";

import {
  addToCart,
  CartError,
  getCart,
  removeCartLine,
  updateCartLine,
  type CartResult,
} from "@/lib/shopify/cart";
import type { Cart, CartWarning } from "@/lib/shopify/types";

export type CartActionResult = {
  cart: Cart | null;
  error: string | null;
  warnings: string[];
};

const MAX_QUANTITY = 99;
const GENERIC_ERROR = "No hemos podido actualizar el carrito. Inténtalo de nuevo.";

const isGid = (value: unknown, type: string): value is string =>
  typeof value === "string" && value.startsWith(`gid://shopify/${type}/`);

const isQuantity = (value: unknown, min: number): value is number =>
  Number.isInteger(value) && (value as number) >= min && (value as number) <= MAX_QUANTITY;

// Los avisos de Shopify llegan en inglés; se traducen los conocidos.
const WARNING_MESSAGES: Record<string, string> = {
  MERCHANDISE_OUT_OF_STOCK: "Este producto está agotado.",
  MERCHANDISE_NOT_ENOUGH_STOCK: "No hay stock suficiente; hemos ajustado la cantidad disponible.",
  MERCHANDISE_NOT_APPLICABLE: "Este producto no está disponible.",
};
const warningMessage = (w: CartWarning) =>
  WARNING_MESSAGES[w.code] ?? "Hemos ajustado tu carrito según la disponibilidad.";

async function run(op: () => Promise<CartResult>): Promise<CartActionResult> {
  try {
    const { cart, warnings } = await op();
    return { cart, error: null, warnings: warnings.map(warningMessage) };
  } catch (err) {
    console.error("[cart]", err);
    // Los mensajes de userErrors son para el cliente; el resto se oculta.
    const error = err instanceof CartError ? err.message : GENERIC_ERROR;
    return { cart: await getCart().catch(() => null), error, warnings: [] };
  }
}

const invalid = (): CartActionResult => ({ cart: null, error: GENERIC_ERROR, warnings: [] });

export async function fetchCart(): Promise<Cart | null> {
  try {
    return await getCart();
  } catch (err) {
    console.error("[cart]", err);
    return null;
  }
}

export async function addItem(variantId: unknown, quantity: unknown = 1) {
  if (!isGid(variantId, "ProductVariant") || !isQuantity(quantity, 1)) return invalid();
  return run(() => addToCart(variantId, quantity));
}

export async function updateItemQuantity(lineId: unknown, quantity: unknown) {
  if (!isGid(lineId, "CartLine") || !isQuantity(quantity, 0)) return invalid();
  return run(() => updateCartLine(lineId, quantity));
}

export async function removeItem(lineId: unknown) {
  if (!isGid(lineId, "CartLine")) return invalid();
  return run(() => removeCartLine(lineId));
}
