import Link from "next/link";
import {
  catalogHref,
  toggleFacet,
  type CatalogFilters,
  type FacetGroup,
} from "@/lib/catalog/filters";

type FilterPanelProps = {
  groups: FacetGroup[];
  filters: CatalogFilters;
};

// Cada opción es un enlace a la URL con ese filtro añadido o quitado: funciona sin
// JavaScript en el cliente y cada combinación es una página indexable y compartible.
export default function FilterPanel({ groups, filters }: FilterPanelProps) {
  return (
    <nav aria-label="Filtros" className="flex flex-col gap-8">
      {groups.map((group) => (
        <div key={group.key}>
          <p className="font-display text-lg font-medium text-wine">{group.label}</p>
          <ul className="mt-3 flex flex-col gap-1.5">
            {group.options.map((option) => {
              const disabled = option.count === 0 && !option.selected;
              const label = (
                <>
                  <span
                    aria-hidden
                    className={`flex h-4 w-4 shrink-0 items-center justify-center rounded border text-[10px] ${
                      option.selected ? "border-wine bg-wine text-white" : "border-ink/30"
                    }`}
                  >
                    {option.selected && "✓"}
                  </span>
                  <span className="flex-1">{option.label}</span>
                  <span className="text-sm text-ink/60">{option.count}</span>
                </>
              );
              return (
                <li key={option.value}>
                  {disabled ? (
                    <span className="flex items-center gap-2.5 font-body text-ink/30">{label}</span>
                  ) : (
                    <Link
                      href={catalogHref(toggleFacet(filters, group.key, option.value))}
                      scroll={false}
                      aria-current={option.selected ? "true" : undefined}
                      className="flex items-center gap-2.5 font-body text-ink/80 hover:text-wine"
                    >
                      {label}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      ))}
    </nav>
  );
}
