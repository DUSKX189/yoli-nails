"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  useTransition,
  type ReactNode,
} from "react";
import {
  addItem as addItemAction,
  fetchCart,
  removeItem as removeItemAction,
  updateItemQuantity as updateItemQuantityAction,
  type CartActionResult,
} from "@/app/actions/cart";
import type { Cart } from "@/lib/shopify/types";

// El carrito vive en Shopify y su ID en una cookie httpOnly. Este contexto solo
// refleja el estado que devuelven las Server Actions; se carga en el cliente para
// que el layout siga siendo estático.

type CartContextValue = {
  cart: Cart | null;
  isOpen: boolean;
  isPending: boolean;
  message: string | null;
  openCart: () => void;
  closeCart: () => void;
  addItem: (variantId: string, quantity?: number) => void;
  updateQuantity: (lineId: string, quantity: number) => void;
  removeItem: (lineId: string) => void;
};

const CartContext = createContext<CartContextValue | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const [cart, setCart] = useState<Cart | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [message, setMessage] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();

  useEffect(() => {
    startTransition(async () => {
      const initial = await fetchCart();
      startTransition(() => setCart(initial));
    });
  }, []);

  const mutate = useCallback((action: () => Promise<CartActionResult>) => {
    setMessage(null);
    startTransition(async () => {
      const result = await action();
      startTransition(() => {
        // Si la acción falla sin devolver carrito, se conserva el que había.
        setCart((prev) => (result.error && !result.cart ? prev : result.cart));
        setMessage(result.error ?? result.warnings[0] ?? null);
      });
    });
  }, []);

  const value = useMemo<CartContextValue>(
    () => ({
      cart,
      isOpen,
      isPending,
      message,
      openCart: () => setIsOpen(true),
      closeCart: () => setIsOpen(false),
      addItem: (variantId, quantity = 1) => {
        setIsOpen(true);
        mutate(() => addItemAction(variantId, quantity));
      },
      updateQuantity: (lineId, quantity) =>
        mutate(() => updateItemQuantityAction(lineId, quantity)),
      removeItem: (lineId) => mutate(() => removeItemAction(lineId)),
    }),
    [cart, isOpen, isPending, message, mutate]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}
