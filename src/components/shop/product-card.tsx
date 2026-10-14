import Image from "next/image";
import Link from "next/link";
import { formatPrice, hasPrice } from "@/lib/catalog/format";
import { VEGAN_TAG } from "@/lib/catalog/labels";
import { productHref } from "@/lib/catalog/routes";
import type { ProductSummary } from "@/lib/shopify/types";

type ProductCardProps = {
  product: ProductSummary;
  priority?: boolean;
};

export default function ProductCard({ product, priority = false }: ProductCardProps) {
  const price = product.priceRange.minVariantPrice;
  const compareAt = product.compareAtPriceRange.minVariantPrice;
  const onSale = hasPrice(compareAt) && Number(compareAt.amount) > Number(price.amount);

  return (
    <Link href={productHref(product)} className="group flex flex-col gap-3">
      <div className="relative aspect-square w-full overflow-hidden rounded-xl bg-cream-dark">
        {product.featuredImage && (
          <Image
            src={product.featuredImage.url}
            alt={product.featuredImage.altText || product.title}
            fill
            priority={priority}
            sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 50vw"
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        )}
        <div className="absolute left-3 top-3 flex flex-col items-start gap-1.5">
          {!product.availableForSale && (
            <span className="rounded-full bg-cream/90 px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-ink/70">
              Agotado
            </span>
          )}
          {product.tags.includes(VEGAN_TAG) && (
            <span className="rounded-full bg-wine/90 px-3 py-1 font-body text-xs font-semibold uppercase tracking-wide text-white">
              Vegano
            </span>
          )}
        </div>
      </div>
      <div>
        <p className="font-body text-sm uppercase tracking-wide text-ink/60">{product.vendor}</p>
        <p className="font-body text-lg leading-snug text-ink/85 group-hover:text-wine">
          {product.title}
        </p>
        {hasPrice(price) && (
          <p className="mt-1 font-body text-lg font-semibold">
            {formatPrice(price)}
            {onSale && (
              <span className="ml-2 text-base font-normal text-ink/60 line-through">
                {formatPrice(compareAt)}
              </span>
            )}
          </p>
        )}
      </div>
    </Link>
  );
}
