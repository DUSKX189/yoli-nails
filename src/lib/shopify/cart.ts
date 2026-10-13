import "server-only";

import { cookies, headers } from "next/headers";
import { isShopifyConfigured, shopifyFetch } from "./client";
import {
  CART_CREATE_MUTATION,
  CART_LINES_ADD_MUTATION,
  CART_LINES_REMOVE_MUTATION,
  CART_LINES_UPDATE_MUTATION,
  GET_CART_QUERY,
} from "./queries";
import type { Cart, CartLine, CartWarning, UserError } from "./types";

// El ID del carrito (con su ?key=) da acceso total al carrito: se guarda solo en
// una cookie httpOnly y nunca se expone al navegador, a la URL ni a los logs.
const CART_COOKIE = "cartId";
const CART_MAX_AGE = 60 * 60 * 24 * 30; // Shopify caduca los carritos a los 30 días

type RawCart = Omit<Cart, "lines"> & { lines: { nodes: CartLine[] } };
type CartPayload = { cart: RawCart | null; userErrors: UserError[]; warnings: CartWarning[] };

export type CartResult = { cart: Cart | null; warnings: CartWarning[] };

export class CartError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "CartError";
  }
}

// Sin stock, Shopify no da error: deja la línea con cantidad 0 y añade un aviso
// MERCHANDISE_OUT_OF_STOCK. Esas líneas no se muestran.
function normalize(cart: RawCart | null): Cart | null {
  return cart ? { ...cart, lines: cart.lines.nodes.filter((l) => l.quantity > 0) } : null;
}

async function getBuyerIp() {
  const h = await headers();
  return h.get("x-forwarded-for")?.split(",")[0].trim() || h.get("x-real-ip");
}

async function cartRequest<T>(query: string, variables: Record<string, unknown>) {
  return shopifyFetch<T>(query, { variables, noStore: true, buyerIp: await getBuyerIp() });
}

function unwrap(payload: CartPayload): CartResult {
  if (payload.userErrors.length) {
    throw new CartError(payload.userErrors.map((e) => e.message).join(" "));
  }
  return { cart: normalize(payload.cart), warnings: payload.warnings };
}

async function getCartId() {
  return (await cookies()).get(CART_COOKIE)?.value;
}

async function setCartId(id: string) {
  (await cookies()).set(CART_COOKIE, id, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: CART_MAX_AGE,
  });
}

/** Carrito actual o null si no hay, ha caducado o ya se pagó. */
export async function getCart(): Promise<Cart | null> {
  if (!isShopifyConfigured()) return null;
  const cartId = await getCartId();
  if (!cartId) return null;

  const { cart } = await cartRequest<{ cart: RawCart | null }>(GET_CART_QUERY, { cartId });
  if (!cart) (await cookies()).delete(CART_COOKIE);
  return normalize(cart);
}

export async function addToCart(merchandiseId: string, quantity: number): Promise<CartResult> {
  const lines = [{ merchandiseId, quantity }];
  const cartId = (await getCart())?.id;

  if (!cartId) {
    const { cartCreate } = await cartRequest<{ cartCreate: CartPayload }>(CART_CREATE_MUTATION, {
      lines,
    });
    const result = unwrap(cartCreate);
    if (result.cart) await setCartId(result.cart.id);
    return result;
  }

  const { cartLinesAdd } = await cartRequest<{ cartLinesAdd: CartPayload }>(
    CART_LINES_ADD_MUTATION,
    { cartId, lines }
  );
  return unwrap(cartLinesAdd);
}

export async function updateCartLine(lineId: string, quantity: number): Promise<CartResult> {
  const cartId = await getCartId();
  if (!cartId) return { cart: null, warnings: [] };
  if (quantity <= 0) return removeCartLine(lineId);

  const { cartLinesUpdate } = await cartRequest<{ cartLinesUpdate: CartPayload }>(
    CART_LINES_UPDATE_MUTATION,
    { cartId, lines: [{ id: lineId, quantity }] }
  );
  return unwrap(cartLinesUpdate);
}

export async function removeCartLine(lineId: string): Promise<CartResult> {
  const cartId = await getCartId();
  if (!cartId) return { cart: null, warnings: [] };

  const { cartLinesRemove } = await cartRequest<{ cartLinesRemove: CartPayload }>(
    CART_LINES_REMOVE_MUTATION,
    { cartId, lineIds: [lineId] }
  );
  return unwrap(cartLinesRemove);
}
