"use client";

import Image from "next/image";
import { useState, type ReactNode } from "react";
import AddToCartButton from "@/components/shop/add-to-cart-button";
import QuantitySelector from "@/components/shop/quantity-selector";
import { formatPrice, hasPrice } from "@/lib/catalog/format";
import {
  findVariant,
  initialSelection,
  isSizeOption,
  isValueAvailable,
  type Selection,
} from "@/lib/catalog/variants";
import type { FajaVariant, Money, ProductOption, ShopifyImage } from "@/lib/shopify/types";

/** Por debajo de este stock se avisa de que quedan pocas unidades. */
const LOW_STOCK = 5;
/** Tope de unidades por línea; coincide con la validación de las Server Actions del carrito. */
const MAX_QUANTITY = 99;

type FajaPurchaseProps = {
  title: string;
  vendor: string;
  images: ShopifyImage[];
  options: ProductOption[];
  variants: FajaVariant[];
  fallbackPrice: Money;
  hasSizeGuide: boolean;
  /** Descripción y demás contenido de servidor bajo el botón de compra. */
  children?: ReactNode;
};

export default function FajaPurchase({
  title,
  vendor,
  images,
  options,
  variants,
  fallbackPrice,
  hasSizeGuide,
  children,
}: FajaPurchaseProps) {
  const [selection, setSelection] = useState<Selection>(() =>
    initialSelection(options, variants)
  );
  const [imageIndex, setImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);

  const variant = findVariant(variants, selection);
  const price = variant?.price ?? fallbackPrice;
  const canBuy = Boolean(variant?.availableForSale && hasPrice(price));
  // quantityAvailable es null si la tienda no controla stock de esa variante.
  const maxQuantity = Math.min(variant?.quantityAvailable ?? MAX_QUANTITY, MAX_QUANTITY);
  const missing = options.find((o) => selection[o.name] == null);
  const visibleOptions = options.filter((o) => o.optionValues.length > 1);
  const mainImage = images[imageIndex] ?? images[0];
  // Mientras todas las variantes compartan foto, elegir color no mueve la galería.
  const hasVariantImages = new Set(variants.map((v) => v.image?.url)).size > 1;

  function select(option: string, value: string) {
    const next = { ...selection, [option]: value };
    setSelection(next);
    setQuantity(1);
    if (!hasVariantImages) return;
    const url = variants.find((v) =>
      v.selectedOptions.every((o) => next[o.name] == null || next[o.name] === o.value)
    )?.image?.url;
    const index = images.findIndex((i) => i.url === url);
    if (index >= 0) setImageIndex(index);
  }

  return (
    <div className="grid gap-10 md:grid-cols-2 md:gap-14">
      <div className="flex flex-col gap-4">
        <div className="relative aspect-3/4 overflow-hidden rounded-2xl bg-cream-dark">
          {mainImage && (
            <Image
              key={mainImage.url}
              src={mainImage.url}
              alt={mainImage.altText || title}
              fill
              priority
              sizes="(min-width: 768px) 560px, 100vw"
              className="object-cover"
            />
          )}
        </div>
        {images.length > 1 && (
          <div className="grid grid-cols-5 gap-3">
            {images.map((image, i) => (
              <button
                key={image.url}
                type="button"
                onClick={() => setImageIndex(i)}
                aria-label={`Ver foto ${i + 1}`}
                aria-current={i === imageIndex ? "true" : undefined}
                className={`relative aspect-3/4 overflow-hidden rounded-lg bg-cream-dark ring-offset-2 ring-offset-cream ${
                  i === imageIndex ? "ring-2 ring-wine" : "opacity-70 hover:opacity-100"
                }`}
              >
                <Image
                  src={image.url}
                  alt=""
                  fill
                  sizes="110px"
                  className="object-cover"
                />
              </button>
            ))}
          </div>
        )}
      </div>

      <div className="flex flex-col gap-6">
        <div>
          <p className="font-body text-sm uppercase tracking-widest text-ink/60">{vendor}</p>
          <h1 className="mt-2 font-display text-4xl font-medium leading-tight md:text-5xl">
            {title}
          </h1>
        </div>

        {hasPrice(price) && <p className="font-body text-3xl font-semibold">{formatPrice(price)}</p>}

        {visibleOptions.map((option) => {
          const size = isSizeOption(option.name);
          return (
            <fieldset key={option.name}>
              <div className="flex items-baseline justify-between gap-4">
                <legend className="font-body text-lg font-semibold">
                  {option.name}
                  {selection[option.name] && (
                    <span className="ml-2 font-normal text-ink/70">{selection[option.name]}</span>
                  )}
                </legend>
                {size && hasSizeGuide && (
                  <a
                    href="#guia-tallas"
                    className="font-body text-sm text-wine underline-offset-4 hover:underline"
                  >
                    Guía de tallas
                  </a>
                )}
              </div>
              <div className="mt-3 flex flex-wrap gap-2">
                {option.optionValues.map(({ name: value, swatch }) => {
                  const selected = selection[option.name] === value;
                  const available = isValueAvailable(variants, selection, option.name, value);
                  return (
                    <button
                      key={value}
                      type="button"
                      onClick={() => select(option.name, value)}
                      aria-pressed={selected}
                      aria-label={available ? value : `${value} (agotado)`}
                      className={`flex min-w-12 items-center justify-center gap-2 rounded-full border px-4 py-2 font-body text-base transition-colors ${
                        selected
                          ? "border-wine bg-wine text-white"
                          : "border-ink/20 hover:border-wine"
                      } ${available ? "" : "text-ink/40 line-through decoration-ink/40"} ${
                        selected && !available ? "bg-wine/60" : ""
                      }`}
                    >
                      {swatch?.color && (
                        <span
                          aria-hidden
                          className="h-4 w-4 rounded-full border border-ink/20"
                          style={{ backgroundColor: swatch.color }}
                        />
                      )}
                      {value}
                    </button>
                  );
                })}
              </div>
            </fieldset>
          );
        })}

        <div className="flex flex-col gap-2">
          <div className="flex gap-3">
            <QuantitySelector
              value={quantity}
              onChange={setQuantity}
              max={maxQuantity}
              disabled={!canBuy}
            />
            <div className="flex-1 [&>button]:w-full">
              <AddToCartButton
                variantId={variant?.id ?? null}
                available={canBuy}
                quantity={Math.min(quantity, maxQuantity)}
                unavailableLabel={missing ? `Elige ${missing.name.toLowerCase()}` : "Agotado"}
              />
            </div>
          </div>
          {variant?.availableForSale &&
            variant.quantityAvailable != null &&
            variant.quantityAvailable <= LOW_STOCK && (
              <p className="font-body text-sm text-wine">
                {variant.quantityAvailable === 1
                  ? "¡Última unidad en esta talla!"
                  : `¡Últimas ${variant.quantityAvailable} unidades en esta talla!`}
              </p>
            )}
        </div>

        {children}
      </div>
    </div>
  );
}
