// Filtros del catálogo en el servidor de Next.js, sobre el listado ya cacheado.
// Estado en la URL: /tienda?tipo=crema-facial&necesidad=antiedad,hidratacion&orden=precio-asc&q=vitamina
// Dentro de una faceta los valores se suman (OR); entre facetas se restringe (AND).

import type { ProductSummary } from "@/lib/shopify/types";
import { slugify } from "./format";
import { tagLabel } from "./labels";

export const FACET_KEYS = ["tipo", "necesidad", "piel", "zona", "momento", "marca"] as const;
export type FacetKey = (typeof FACET_KEYS)[number];

export const FACET_LABELS: Record<FacetKey, string> = {
  tipo: "Tipo de producto",
  necesidad: "Necesidad",
  piel: "Tipo de piel",
  zona: "Zona",
  momento: "Momento de uso",
  marca: "Marca",
};

export const SORT_OPTIONS = [
  { value: "", label: "Destacados" },
  { value: "precio-asc", label: "Precio: menor a mayor" },
  { value: "precio-desc", label: "Precio: mayor a menor" },
  { value: "nombre", label: "Nombre" },
] as const;
type SortValue = (typeof SORT_OPTIONS)[number]["value"];

export type CatalogFilters = {
  facets: Partial<Record<FacetKey, string[]>>;
  q: string;
  orden: SortValue;
};

type Option = { value: string; label: string };

/** Valores (slug + texto) que un producto aporta a cada faceta. */
function productOptions(p: ProductSummary, key: FacetKey): Option[] {
  switch (key) {
    case "tipo":
      return p.productType ? [{ value: slugify(p.productType), label: p.productType }] : [];
    case "marca":
      return p.vendor ? [{ value: slugify(p.vendor), label: p.vendor }] : [];
    default: {
      const options = p.tags
        .filter((tag) => tag.startsWith(`${key}:`))
        .map((tag) => ({ value: tag.slice(key.length + 1), label: tagLabel(tag) }));
      // "dia-noche" vale para ambos momentos: cuenta como Día y como Noche.
      if (key === "momento") {
        return options.flatMap((o) =>
          o.value === "dia-noche"
            ? [
                { value: "dia", label: tagLabel("momento:dia") },
                { value: "noche", label: tagLabel("momento:noche") },
              ]
            : [o]
        );
      }
      return options;
    }
  }
}

type SearchParams = Record<string, string | string[] | undefined>;

export function parseFilters(params: SearchParams): CatalogFilters {
  const read = (key: string) => {
    const raw = params[key];
    return (Array.isArray(raw) ? raw.join(",") : (raw ?? "")).trim();
  };

  const facets: CatalogFilters["facets"] = {};
  for (const key of FACET_KEYS) {
    const values = read(key).split(",").map((v) => v.trim()).filter(Boolean);
    if (values.length) facets[key] = [...new Set(values)];
  }

  const orden = read("orden");
  return {
    facets,
    q: read("q").slice(0, 100),
    orden: SORT_OPTIONS.some((o) => o.value === orden) ? (orden as SortValue) : "",
  };
}

export function hasActiveFilters(f: CatalogFilters) {
  return Boolean(f.q) || Object.keys(f.facets).length > 0;
}

const normalizeText = (s: string) =>
  s.normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();

function matchesSearch(p: ProductSummary, q: string) {
  if (!q) return true;
  const haystack = normalizeText(
    [p.title, p.vendor, p.productType, ...p.tags.map(tagLabel)].join(" ")
  );
  return normalizeText(q)
    .split(/\s+/)
    .filter(Boolean)
    .every((word) => haystack.includes(word));
}

function matchesFacets(p: ProductSummary, f: CatalogFilters, skip?: FacetKey) {
  return FACET_KEYS.every((key) => {
    const selected = f.facets[key];
    if (key === skip || !selected?.length) return true;
    return productOptions(p, key).some((o) => selected.includes(o.value));
  });
}

const price = (p: ProductSummary) => Number(p.priceRange.minVariantPrice.amount);

export function applyFilters(products: ProductSummary[], f: CatalogFilters) {
  const result = products.filter((p) => matchesSearch(p, f.q) && matchesFacets(p, f));

  switch (f.orden) {
    case "precio-asc":
      return result.sort((a, b) => price(a) - price(b));
    case "precio-desc":
      return result.sort((a, b) => price(b) - price(a));
    case "nombre":
      return result.sort((a, b) => a.title.localeCompare(b.title, "es"));
    default:
      // Disponibles primero; el orden de la API (por título) se mantiene dentro de cada grupo.
      return result.sort((a, b) => Number(b.availableForSale) - Number(a.availableForSale));
  }
}

export type FacetGroup = {
  key: FacetKey;
  label: string;
  options: (Option & { count: number; selected: boolean })[];
};

/**
 * Opciones de cada faceta con su recuento: cuántos productos quedarían al marcarla,
 * respetando los filtros activos de las demás facetas.
 */
export function getFacetGroups(products: ProductSummary[], f: CatalogFilters): FacetGroup[] {
  const searched = products.filter((p) => matchesSearch(p, f.q));

  return FACET_KEYS.map((key) => {
    const labels = new Map<string, string>();
    for (const p of products) {
      for (const o of productOptions(p, key)) labels.set(o.value, o.label);
    }

    const counts = new Map<string, number>();
    for (const p of searched) {
      if (!matchesFacets(p, f, key)) continue;
      for (const value of new Set(productOptions(p, key).map((o) => o.value))) {
        counts.set(value, (counts.get(value) ?? 0) + 1);
      }
    }

    const selected = f.facets[key] ?? [];
    const options = [...labels]
      .map(([value, label]) => ({
        value,
        label,
        count: counts.get(value) ?? 0,
        selected: selected.includes(value),
      }))
      .sort((a, b) => a.label.localeCompare(b.label, "es"));

    return { key, label: FACET_LABELS[key], options };
  }).filter((group) => group.options.length > 1 || group.options.some((o) => o.selected));
}

/** URL de la tienda con los filtros dados (sin parámetros vacíos). */
export function catalogHref(f: CatalogFilters) {
  const params = new URLSearchParams();
  for (const key of FACET_KEYS) {
    const values = f.facets[key];
    if (values?.length) params.set(key, values.join(","));
  }
  if (f.q) params.set("q", f.q);
  if (f.orden) params.set("orden", f.orden);
  const query = params.toString().replace(/%2C/g, ",");
  return query ? `/tienda?${query}` : "/tienda";
}

/** Filtros resultantes de marcar o desmarcar un valor de una faceta. */
export function toggleFacet(f: CatalogFilters, key: FacetKey, value: string): CatalogFilters {
  const current = f.facets[key] ?? [];
  const next = current.includes(value) ? current.filter((v) => v !== value) : [...current, value];
  return { ...f, facets: { ...f.facets, [key]: next } };
}
