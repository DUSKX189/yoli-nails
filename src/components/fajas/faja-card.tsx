import Image from "next/image";
import Link from "next/link";
import { formatPrice, hasPrice } from "@/lib/catalog/format";
import { productHref } from "@/lib/catalog/routes";
import { isSizeOption } from "@/lib/catalog/variants";
import type { FajaSummary } from "@/lib/shopify/types";

type FajaCardProps = {
  faja: FajaSummary;
  priority?: boolean;
  className?: string;
};

/** "C-1 Peggy" → { ref: "C-1", name: "Peggy" }; si no sigue ese patrón, todo es nombre. */
function splitTitle(title: string) {
  const match = title.match(/^([A-Z]+-?\d+)\s+(.+)$/);
  return match ? { ref: match[1], name: match[2] } : { ref: null, name: title };
}

/** Tallas con stock en algún color, en el orden de Shopify: "S – XL" o "M". */
function availableSizes(faja: FajaSummary) {
  const option = faja.options.find((o) => isSizeOption(o.name));
  if (!option) return null;
  const sizes = option.optionValues
    .map((v) => v.name)
    .filter((size) =>
      faja.variants.some(
        (v) =>
          v.availableForSale &&
          v.selectedOptions.some((o) => o.name === option.name && o.value === size)
      )
    );
  if (sizes.length === 0) return null;
  return sizes.length === 1 ? sizes[0] : `${sizes[0]} – ${sizes[sizes.length - 1]}`;
}

export default function FajaCard({ faja, priority = false, className = "" }: FajaCardProps) {
  const { ref, name } = splitTitle(faja.title);
  const price = faja.priceRange.minVariantPrice;
  const [front, back] = faja.images.length ? faja.images : faja.featuredImage ? [faja.featuredImage] : [];
  const colors = faja.options.find((o) => /^colou?r$/i.test(o.name))?.optionValues ?? [];
  const sizes = availableSizes(faja);

  return (
    <Link href={productHref(faja)} className={`group flex flex-col ${className}`}>
      <div className="relative aspect-3/4 w-full overflow-hidden rounded-2xl bg-cream-dark">
        {front && (
          <Image
            src={front.url}
            alt={front.altText || faja.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 360px, 50vw"
            className={`object-cover transition-[opacity,transform] duration-700 group-hover:scale-105 ${
              back ? "group-hover:opacity-0" : ""
            }`}
          />
        )}
        {back && (
          <Image
            src={back.url}
            alt=""
            fill
            sizes="(min-width: 1024px) 360px, 50vw"
            className="object-cover opacity-0 transition-[opacity,transform] duration-700 group-hover:scale-105 group-hover:opacity-100"
          />
        )}

        <div className="absolute inset-x-3 top-3 flex items-start justify-between gap-2">
          {ref && (
            <span className="rounded-full bg-cream/90 px-3 py-1 font-body text-xs font-semibold uppercase tracking-widest text-wine">
              Ref. {ref}
            </span>
          )}
          {!faja.availableForSale && (
            <span className="ml-auto rounded-full bg-ink/70 px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-white">
              Agotado
            </span>
          )}
        </div>

        <div className="absolute inset-x-0 bottom-0 hidden translate-y-full justify-center bg-linear-to-t from-ink/50 to-transparent pb-5 pt-12 transition-transform duration-500 group-hover:translate-y-0 md:flex">
          <span className="rounded-full bg-cream px-6 py-2 font-body text-sm font-semibold tracking-wide text-wine">
            Ver modelo
          </span>
        </div>
      </div>

      <div className="mt-4 flex flex-col gap-1 sm:flex-row sm:items-baseline sm:justify-between sm:gap-4">
        <h3 className="font-display text-2xl font-medium text-wine md:text-3xl">{name}</h3>
        {hasPrice(price) && (
          <p className="font-body text-lg font-semibold text-ink/85">{formatPrice(price)}</p>
        )}
      </div>

      <div className="mt-2 flex flex-wrap items-center gap-x-4 gap-y-2 font-body text-sm text-ink/60">
        {colors.length > 0 && (
          <ul className="flex items-center gap-1.5" aria-label="Colores">
            {colors.map((color) => (
              <li key={color.name} title={color.name}>
                {color.swatch?.color ? (
                  <span
                    className="block h-4 w-4 rounded-full border border-ink/20"
                    style={{ backgroundColor: color.swatch.color }}
                  >
                    <span className="sr-only">{color.name}</span>
                  </span>
                ) : (
                  <span className="rounded-full border border-ink/15 px-2 py-0.5">{color.name}</span>
                )}
              </li>
            ))}
          </ul>
        )}
        {sizes && <p>Tallas {sizes}</p>}
      </div>
    </Link>
  );
}
