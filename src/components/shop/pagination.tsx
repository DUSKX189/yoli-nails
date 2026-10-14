import Link from "next/link";
import { catalogHref, type CatalogFilters } from "@/lib/catalog/filters";

type PaginationProps = {
  filters: CatalogFilters;
  page: number;
  totalPages: number;
};

/** Números a mostrar: primera, última y vecinas de la actual; null marca un salto (…). */
function pageList(page: number, totalPages: number): (number | null)[] {
  const pages: (number | null)[] = [];
  for (let n = 1; n <= totalPages; n++) {
    if (n === 1 || n === totalPages || Math.abs(n - page) <= 1) pages.push(n);
    else if (pages.at(-1) !== null) pages.push(null);
  }
  return pages;
}

// Enlaces normales, como los filtros: sin JavaScript en el cliente y cada página indexable.
export default function Pagination({ filters, page, totalPages }: PaginationProps) {
  if (totalPages <= 1) return null;

  const href = (pagina: number) => catalogHref({ ...filters, pagina });
  const arrow = "rounded-full px-4 py-2 font-body text-sm font-semibold";

  return (
    <nav aria-label="Paginación" className="mt-14 flex flex-col items-center gap-4">
      <div className="flex items-center gap-2">
        {page > 1 ? (
          <Link href={href(page - 1)} className={`${arrow} text-wine hover:bg-wine/10`}>
            ← Anterior
          </Link>
        ) : (
          <span className={`${arrow} text-ink/30`}>← Anterior</span>
        )}

        <ul className="hidden items-center gap-1 sm:flex">
          {pageList(page, totalPages).map((n, i) =>
            n === null ? (
              <li key={`gap-${i}`} className="px-1 font-body text-ink/60">
                …
              </li>
            ) : (
              <li key={n}>
                <Link
                  href={href(n)}
                  aria-current={n === page ? "page" : undefined}
                  aria-label={`Página ${n}`}
                  className={`flex h-9 w-9 items-center justify-center rounded-full font-body text-sm ${
                    n === page ? "bg-wine font-semibold text-white" : "text-ink/70 hover:bg-wine/10"
                  }`}
                >
                  {n}
                </Link>
              </li>
            )
          )}
        </ul>

        {page < totalPages ? (
          <Link href={href(page + 1)} className={`${arrow} text-wine hover:bg-wine/10`}>
            Siguiente →
          </Link>
        ) : (
          <span className={`${arrow} text-ink/30`}>Siguiente →</span>
        )}
      </div>

      <p className="font-body text-sm text-ink/60">
        Página {page} de {totalPages}
      </p>
    </nav>
  );
}
