import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import FajaPurchase from "@/components/fajas/faja-purchase";
import FajasContact from "@/components/fajas/fajas-contact";
import SizeGuideTable from "@/components/fajas/size-guide-table";
import FajaCard from "@/components/fajas/faja-card";
import { hasPrice } from "@/lib/catalog/format";
import { sanitizeDescription } from "@/lib/catalog/sanitize";
import { getFaja, getFajas } from "@/lib/shopify/products";
import type { Faja } from "@/lib/shopify/types";

type FajaPageProps = {
  params: Promise<{ handle: string }>;
};

export async function generateStaticParams() {
  const fajas = await getFajas();
  return fajas.map((f) => ({ handle: f.handle }));
}

export async function generateMetadata({ params }: FajaPageProps): Promise<Metadata> {
  const faja = await getFaja((await params).handle);
  if (!faja) return {};

  const description = faja.seo.description || faja.description.slice(0, 160);
  const image = faja.featuredImage;
  return {
    title: faja.seo.title || `${faja.title} · Fajas Charlotte`,
    description,
    alternates: { canonical: `/fajas-charlotte/${faja.handle}` },
    openGraph: {
      title: faja.title,
      description,
      images: image ? [{ url: image.url, alt: image.altText || faja.title }] : undefined,
    },
  };
}

/** Un producto con variantes de color y talla: ProductGroup con una Product por variante. */
function fajaJsonLd(faja: Faja) {
  return {
    "@context": "https://schema.org",
    "@type": "ProductGroup",
    name: faja.title,
    description: faja.description,
    image: faja.images.map((i) => i.url),
    brand: { "@type": "Brand", name: faja.vendor },
    productGroupID: faja.handle,
    variesBy: faja.options.map((o) => o.name),
    hasVariant: faja.variants
      .filter((v) => hasPrice(v.price))
      .map((v) => ({
        "@type": "Product",
        name: `${faja.title} ${v.title}`,
        ...(v.image && { image: v.image.url }),
        offers: {
          "@type": "Offer",
          price: v.price.amount,
          priceCurrency: v.price.currencyCode,
          availability: v.availableForSale
            ? "https://schema.org/InStock"
            : "https://schema.org/OutOfStock",
        },
      })),
  };
}

export default async function FajaPage({ params }: FajaPageProps) {
  const { handle } = await params;
  const [faja, all] = await Promise.all([getFaja(handle), getFajas()]);
  if (!faja) notFound();

  const images = faja.images.length
    ? faja.images
    : faja.featuredImage
      ? [faja.featuredImage]
      : [];
  const description = sanitizeDescription(faja.descriptionHtml);
  const others = all.filter((f) => f.handle !== faja.handle).slice(0, 4);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(fajaJsonLd(faja)).replace(/</g, "\\u003c"),
        }}
      />

      <div className="bg-wine-dark pb-6 pt-32 md:pt-36" />

      <article className="mx-auto max-w-6xl px-6 py-10 md:py-14">
        <nav aria-label="Ruta" className="mb-8 font-body text-sm text-ink/60">
          <Link href="/fajas-charlotte" className="hover:text-wine">
            Fajas Charlotte
          </Link>
          <span className="mx-2">/</span>
          <span className="text-ink/70">{faja.title}</span>
        </nav>

        <FajaPurchase
          title={faja.title}
          vendor={faja.vendor}
          images={images}
          options={faja.options}
          variants={faja.variants}
          fallbackPrice={faja.priceRange.minVariantPrice}
          hasSizeGuide={Boolean(faja.guia)}
        >
          {description && (
            <section>
              <h2 className="font-display text-2xl font-medium">Descripción</h2>
              <div
                className="mt-3 space-y-3 font-body text-lg leading-relaxed text-ink/80 [&_li]:ml-5 [&_ol]:list-decimal [&_ul]:list-disc"
                dangerouslySetInnerHTML={{ __html: description }}
              />
            </section>
          )}
        </FajaPurchase>
      </article>

      {faja.guia && <SizeGuideTable guide={faja.guia} />}

      {others.length > 0 && (
        <section className="mx-auto max-w-6xl px-6 pt-16">
          <h2 className="font-display text-3xl font-medium text-wine">Otros modelos</h2>
          <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-12 md:grid-cols-4">
            {others.map((f) => (
              <FajaCard key={f.id} faja={f} />
            ))}
          </div>
        </section>
      )}

      <FajasContact />
    </>
  );
}
