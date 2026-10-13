import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/shop/add-to-cart-button";
import ProductCard from "@/components/shop/product-card";
import { formatPrice, hasPrice, slugify } from "@/lib/catalog/format";
import { tagLabel } from "@/lib/catalog/labels";
import { sanitizeDescription } from "@/lib/catalog/sanitize";
import { getProduct, getProducts } from "@/lib/shopify/products";
import type { Product, ProductSummary } from "@/lib/shopify/types";

type ProductPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateStaticParams() {
  const products = await getProducts();
  return products.map((p) => ({ handle: p.handle }));
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const product = await getProduct((await params).handle);
  if (!product) return {};

  const description = product.seo.description || product.description.slice(0, 160);
  const image = product.featuredImage;
  return {
    title: product.seo.title || product.title,
    description,
    alternates: { canonical: `/producto/${product.handle}` },
    openGraph: {
      title: product.title,
      description,
      images: image ? [{ url: image.url, alt: image.altText || product.title }] : undefined,
    },
  };
}

/** Misma línea de producto o, si no hay suficientes, mismo tipo. */
function getRelated(product: Product, all: ProductSummary[], limit = 4) {
  const line = product.tags.find((t) => t.startsWith("linea:"));
  const others = all.filter((p) => p.handle !== product.handle);
  const sameLine = line ? others.filter((p) => p.tags.includes(line)) : [];
  const sameType = others.filter(
    (p) => p.productType === product.productType && !sameLine.includes(p)
  );
  return [...sameLine, ...sameType].slice(0, limit);
}

function productJsonLd(product: Product) {
  const price = product.priceRange.minVariantPrice;
  return {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.images.map((i) => i.url),
    brand: { "@type": "Brand", name: product.vendor },
    ...(hasPrice(price) && {
      offers: {
        "@type": "Offer",
        price: price.amount,
        priceCurrency: price.currencyCode,
        availability: product.availableForSale
          ? "https://schema.org/InStock"
          : "https://schema.org/OutOfStock",
      },
    }),
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { handle } = await params;
  const [product, all] = await Promise.all([getProduct(handle), getProducts()]);
  if (!product) notFound();

  const price = product.priceRange.minVariantPrice;
  const variant = product.variants.find((v) => v.availableForSale) ?? product.variants[0];
  const [mainImage, ...extraImages] = product.images.length
    ? product.images
    : product.featuredImage
      ? [product.featuredImage]
      : [];
  const description = sanitizeDescription(product.descriptionHtml);
  const chips = product.tags.filter((t) => t.startsWith("necesidad:") || t.startsWith("piel:"));
  const related = getRelated(product, all);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd(product)).replace(/</g, "\\u003c"),
        }}
      />

      <div className="bg-wine-dark pb-6 pt-32 md:pt-36" />

      <article className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <nav aria-label="Ruta" className="mb-8 font-body text-sm text-ink/50">
          <Link href="/tienda" className="hover:text-wine">
            Tienda
          </Link>
          <span className="mx-2">/</span>
          {product.productType && (
            <>
              <Link href={`/tienda?tipo=${slugify(product.productType)}`} className="hover:text-wine">
                {product.productType}
              </Link>
              <span className="mx-2">/</span>
            </>
          )}
          <span className="text-ink/70">{product.title}</span>
        </nav>

        <div className="grid gap-10 md:grid-cols-2 md:gap-14">
          <div className="flex flex-col gap-4">
            <div className="relative aspect-square overflow-hidden rounded-2xl bg-cream-dark">
              {mainImage && (
                <Image
                  src={mainImage.url}
                  alt={mainImage.altText || product.title}
                  fill
                  priority
                  sizes="(min-width: 768px) 560px, 100vw"
                  className="object-cover"
                />
              )}
            </div>
            {extraImages.length > 0 && (
              <div className="grid grid-cols-4 gap-3">
                {extraImages.map((image) => (
                  <div
                    key={image.url}
                    className="relative aspect-square overflow-hidden rounded-lg bg-cream-dark"
                  >
                    <Image
                      src={image.url}
                      alt={image.altText || product.title}
                      fill
                      sizes="140px"
                      className="object-cover"
                    />
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="flex flex-col gap-6">
            <div>
              <p className="font-body text-sm uppercase tracking-widest text-ink/50">
                {product.vendor}
              </p>
              <h1 className="mt-2 font-display text-4xl font-medium leading-tight md:text-5xl">
                {product.title}
              </h1>
            </div>

            <div className="flex flex-wrap items-center gap-5">
              {hasPrice(price) && (
                <p className="font-body text-3xl font-semibold">{formatPrice(price)}</p>
              )}
              {!product.availableForSale && (
                <span className="rounded-full bg-cream-dark px-4 py-1.5 font-body text-sm font-semibold uppercase tracking-wide text-ink/60">
                  Agotado
                </span>
              )}
            </div>

            <AddToCartButton
              variantId={variant?.id ?? null}
              available={Boolean(variant?.availableForSale && hasPrice(price))}
            />

            {chips.length > 0 && (
              <ul className="flex flex-wrap gap-2">
                {chips.map((tag) => {
                  const [facet, value] = tag.split(":");
                  return (
                    <li key={tag}>
                      <Link
                        href={`/tienda?${facet}=${value}`}
                        className="inline-block rounded-full border border-wine/30 px-4 py-1.5 font-body text-sm text-wine hover:bg-wine hover:text-white"
                      >
                        {tagLabel(tag)}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            )}

            {description && (
              <section>
                <h2 className="font-display text-2xl font-medium">Descripción</h2>
                <div
                  className="mt-3 space-y-3 font-body text-lg leading-relaxed text-ink/80 [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
                  dangerouslySetInnerHTML={{ __html: description }}
                />
              </section>
            )}

            {product.uso && (
              <section>
                <h2 className="font-display text-2xl font-medium">Modo de uso</h2>
                <p className="mt-3 whitespace-pre-line font-body text-lg leading-relaxed text-ink/80">
                  {product.uso}
                </p>
              </section>
            )}

            {product.ingredientes && (
              <details className="border-t border-ink/10 pt-4">
                <summary className="cursor-pointer font-display text-2xl font-medium">
                  Ingredientes
                </summary>
                {/* Separador ", " y no "," a secas: hay nombres INCI con coma interna (1,2-Hexanodiol). */}
                <p className="mt-3 font-body leading-relaxed text-ink/70">
                  {product.ingredientes.split(", ").join(" · ")}
                </p>
              </details>
            )}
          </div>
        </div>
      </article>

      {related.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pb-20">
          <h2 className="font-display text-3xl font-medium text-wine">También te puede gustar</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 md:grid-cols-4">
            {related.map((p) => (
              <ProductCard key={p.id} product={p} />
            ))}
          </div>
        </section>
      )}
    </>
  );
}
