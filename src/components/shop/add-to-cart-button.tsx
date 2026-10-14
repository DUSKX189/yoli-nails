"use client";

import { useCart } from "@/components/cart-context";

type AddToCartButtonProps = {
  variantId: string | null;
  available: boolean;
  /** Texto con el botón desactivado; por defecto "Agotado". */
  unavailableLabel?: string;
  quantity?: number;
};

export default function AddToCartButton({
  variantId,
  available,
  unavailableLabel = "Agotado",
  quantity = 1,
}: AddToCartButtonProps) {
  const { addItem, isPending } = useCart();
  const canAdd = available && variantId !== null;

  return (
    <button
      type="button"
      disabled={!canAdd || isPending}
      onClick={() => variantId && addItem(variantId, quantity)}
      className="w-full rounded-full bg-wine px-8 py-3.5 font-body text-base font-semibold tracking-wide text-white transition-[opacity,transform] hover:scale-[1.01] disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:scale-100 sm:w-auto"
    >
      {canAdd ? (isPending ? "Añadiendo…" : "Añadir al carrito") : unavailableLabel}
    </button>
  );
}
