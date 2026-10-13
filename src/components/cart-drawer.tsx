"use client";

import Image from "next/image";
import Link from "next/link";
import { useEffect } from "react";
import { useCart } from "@/components/cart-context";
import { formatPrice } from "@/lib/catalog/format";

export default function CartDrawer() {
  const { cart, isOpen, isPending, message, closeCart, removeItem, updateQuantity } = useCart();
  const lines = cart?.lines ?? [];

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [isOpen, closeCart]);

  return (
    <div
      className={`fixed inset-0 z-[60] transition-opacity ${
        isOpen ? "pointer-events-auto opacity-100" : "pointer-events-none opacity-0"
      }`}
      inert={!isOpen}
    >
      <div onClick={closeCart} className="absolute inset-0 bg-ink/40 backdrop-blur-[2px]" />

      <aside
        role="dialog"
        aria-modal="true"
        aria-label="Carrito"
        className={`absolute right-0 top-0 flex h-full w-full max-w-md flex-col bg-cream shadow-2xl transition-transform duration-300 ${
          isOpen ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-ink/10 px-6 py-5">
          <h2 className="font-display text-2xl font-medium">Tu carrito</h2>
          <button
            type="button"
            onClick={closeCart}
            aria-label="Cerrar carrito"
            className="text-2xl leading-none"
          >
            ×
          </button>
        </div>

        <div
          className={`flex-1 overflow-y-auto px-6 py-4 transition-opacity ${
            isPending ? "opacity-60" : ""
          }`}
          aria-busy={isPending}
        >
          {message && (
            <p role="alert" className="mb-4 rounded-lg bg-wine/10 px-4 py-3 font-body text-sm text-wine">
              {message}
            </p>
          )}

          {lines.length === 0 ? (
            <p className="mt-10 text-center font-body text-ink/60">
              {isPending ? "Cargando…" : "Tu carrito está vacío."}
            </p>
          ) : (
            <ul className="flex flex-col gap-5">
              {lines.map((line) => {
                const { merchandise } = line;
                const title = merchandise.product.title;
                return (
                  <li key={line.id} className="flex gap-4">
                    <div className="relative h-20 w-20 shrink-0 overflow-hidden rounded-lg bg-cream-dark">
                      {merchandise.image && (
                        <Image
                          src={merchandise.image.url}
                          alt={merchandise.image.altText || title}
                          fill
                          sizes="80px"
                          className="object-cover"
                        />
                      )}
                    </div>
                    <div className="flex flex-1 flex-col">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          href={`/producto/${merchandise.product.handle}`}
                          onClick={closeCart}
                          className="font-body text-base leading-snug hover:text-wine"
                        >
                          {title}
                        </Link>
                        <button
                          type="button"
                          onClick={() => removeItem(line.id)}
                          disabled={isPending}
                          aria-label={`Eliminar ${title}`}
                          className="text-ink/40 hover:text-wine"
                        >
                          ×
                        </button>
                      </div>
                      <p className="font-body text-sm text-ink/60">
                        {formatPrice(merchandise.price)}
                      </p>
                      <div className="mt-2 flex items-center gap-3">
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, line.quantity - 1)}
                          disabled={isPending}
                          aria-label="Quitar una unidad"
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-ink/20"
                        >
                          −
                        </button>
                        <span className="w-4 text-center text-sm">{line.quantity}</span>
                        <button
                          type="button"
                          onClick={() => updateQuantity(line.id, line.quantity + 1)}
                          disabled={isPending}
                          aria-label="Añadir una unidad"
                          className="flex h-6 w-6 items-center justify-center rounded-full border border-ink/20"
                        >
                          +
                        </button>
                      </div>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        <div className="border-t border-ink/10 px-6 py-5">
          {cart && (
            <div className="mb-4 flex items-center justify-between font-body text-lg">
              <span>Subtotal</span>
              <span>{formatPrice(cart.cost.subtotalAmount)}</span>
            </div>
          )}
          {cart && lines.length > 0 && !isPending ? (
            <a
              href={cart.checkoutUrl}
              className="block w-full rounded-full bg-wine py-3 text-center font-body text-sm font-semibold tracking-wide text-white"
            >
              Finalizar compra
            </a>
          ) : (
            <button
              type="button"
              disabled
              className="w-full rounded-full bg-wine py-3 font-body text-sm font-semibold tracking-wide text-white opacity-40"
            >
              Finalizar compra
            </button>
          )}
          <p className="mt-3 text-center text-xs text-ink/45">
            Los gastos de envío se calculan al finalizar la compra.
          </p>
        </div>
      </aside>
    </div>
  );
}
