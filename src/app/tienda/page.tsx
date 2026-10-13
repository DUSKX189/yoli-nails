import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import FilterPanel from "@/components/shop/filter-panel";
import ProductCard from "@/components/shop/product-card";
import {
  applyFilters,
  catalogHref,
  FACET_KEYS,
  getFacetGroups,
  hasActiveFilters,
  parseFilters,
  SORT_OPTIONS,
} from "@/lib/catalog/filters";
import { getProducts } from "@/lib/shopify/products";

export const metadata: Metadata = {
  title: "Tienda",
  description:
    "Cosmética facial profesional seleccionada por YOLI NAILS: limpiadores, sérums, cremas, contorno de ojos y protección solar.",
  alternates: { canonical: "/tienda" },
};

type TiendaPageProps = {
  searchParams: Promise<Record<string, string | string[] | undefined>>;
};

export default async function TiendaPage({ searchParams }: TiendaPageProps) {
  const filters = parseFilters(await searchParams);
  const products = await getProducts();
  const results = applyFilters(products, filters);
  const groups = getFacetGroups(products, filters);
  const filtered = hasActiveFilters(filters);

  return (
    <>
      <section className="relative flex min-h-[440px] items-end overflow-hidden">
        <Image
          src="/images/hero-tienda.jpg"
          alt="Muestrario de esmaltes de uñas"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/40 via-ink/5 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-32">
          <h1 className="font-display text-5xl font-bold text-white md:text-6xl">Tienda</h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-14 text-center">
        <p className="font-body text-2xl font-semibold leading-relaxed text-ink/75">
          Descubre una cuidada colección de productos profesionales seleccionados por nuestro
          equipo para prolongar los resultados de tus tratamientos y convertir tu rutina diaria en
          un auténtico ritual de cuidado.
        </p>
      </section>

      {products.length === 0 ? (
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="font-body text-xl text-ink/60">
            Estamos preparando la tienda online. Vuelve muy pronto.
          </p>
        </section>
      ) : (
        <section className="mx-auto grid max-w-6xl gap-10 px-6 py-12 md:grid-cols-[220px_1fr]">
          <aside>
            <details className="group md:hidden">
              <summary className="cursor-pointer list-none rounded-full border border-ink/20 px-5 py-2.5 text-center font-body font-semibold">
                Filtros
              </summary>
              <div className="mt-6">
                <FilterPanel groups={groups} filters={filters} />
              </div>
            </details>
            <div className="hidden md:block">
              <FilterPanel groups={groups} filters={filters} />
            </div>
          </aside>

          <div className="min-w-0">
            <div className="flex flex-col gap-4 border-b border-ink/10 pb-5 lg:flex-row lg:items-center lg:justify-between">
              <form action="/tienda" role="search" className="flex flex-1 gap-2 lg:max-w-sm">
                {FACET_KEYS.map((key) =>
                  filters.facets[key] ? (
                    <input key={key} type="hidden" name={key} value={filters.facets[key].join(",")} />
                  ) : null
                )}
                {filters.orden && <input type="hidden" name="orden" value={filters.orden} />}
                <input
                  type="search"
                  name="q"
                  defaultValue={filters.q}
                  placeholder="Buscar productos"
                  aria-label="Buscar productos"
                  className="min-w-0 flex-1 rounded-full border border-ink/20 bg-white/60 px-5 py-2 font-body outline-none focus:border-wine"
                />
                <button
                  type="submit"
                  className="rounded-full bg-wine px-5 py-2 font-body text-sm font-semibold text-white"
                >
                  Buscar
                </button>
              </form>

              <nav aria-label="Ordenar" className="flex flex-wrap gap-x-4 gap-y-1 font-body text-sm">
                {SORT_OPTIONS.map((option) => (
                  <Link
                    key={option.value}
                    href={catalogHref({ ...filters, orden: option.value })}
                    scroll={false}
                    aria-current={filters.orden === option.value ? "true" : undefined}
                    className={
                      filters.orden === option.value
                        ? "font-semibold text-wine"
                        : "text-ink/60 hover:text-ink"
                    }
                  >
                    {option.label}
                  </Link>
                ))}
              </nav>
            </div>

            <div className="mt-5 flex items-center justify-between font-body text-ink/60">
              <p aria-live="polite">
                {results.length} {results.length === 1 ? "producto" : "productos"}
              </p>
              {filtered && (
                <Link href="/tienda" scroll={false} className="text-wine underline-offset-4 hover:underline">
                  Quitar filtros
                </Link>
              )}
            </div>

            {results.length === 0 ? (
              <p className="py-16 text-center font-body text-lg text-ink/60">
                No hay productos que coincidan con tu búsqueda.
              </p>
            ) : (
              <div className="mt-8 grid grid-cols-2 gap-x-6 gap-y-10 lg:grid-cols-3">
                {results.map((product, i) => (
                  <ProductCard key={product.id} product={product} priority={i < 3} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}
    </>
  );
}
