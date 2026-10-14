import Image from "next/image";
import type { SizeGuide, SizeGuideRow } from "@/lib/shopify/types";

const COLUMNS: { key: Exclude<keyof SizeGuideRow, "talla">; label: string }[] = [
  { key: "cintura", label: "Cintura" },
  { key: "cadera", label: "Cadera" },
  { key: "busto_superior", label: "Busto superior" },
  { key: "bajo_pecho", label: "Bajo pecho" },
  { key: "largo_manga_3_4", label: "Manga 3/4" },
  { key: "largo_manga_larga", label: "Manga larga" },
];

export default function SizeGuideTable({ guide }: { guide: SizeGuide }) {
  // Solo las columnas con algún dato (p. ej. un modelo sin manga).
  const columns = COLUMNS.filter((c) => guide.filas.some((row) => row[c.key]));

  return (
    <section id="guia-tallas" className="scroll-mt-28 bg-wine-dark px-4 py-14 md:px-10 md:py-20">
      <div className="mx-auto max-w-5xl">
        <h2 className="text-center font-display text-4xl font-medium tracking-wide text-white">
          Guía de tallas
        </h2>
        <p className="mt-3 text-center font-body text-lg text-white/60">
          Todas las medidas en centímetros (cm)
        </p>

        <div className="mt-8 overflow-x-auto rounded-2xl border border-white/10 bg-white/10">
          <table className="w-full min-w-[640px] border-collapse text-center font-body text-white">
            <thead>
              <tr className="border-b border-white/15">
                <th scope="col" className="px-4 py-3 text-sm font-semibold uppercase tracking-wide">
                  Talla
                </th>
                {columns.map((c) => (
                  <th
                    key={c.key}
                    scope="col"
                    className="px-4 py-3 text-sm font-semibold uppercase tracking-wide"
                  >
                    {c.label}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {guide.filas.map((row, i) => (
                <tr
                  key={row.talla}
                  className={`border-b border-white/10 last:border-0 ${i % 2 === 1 ? "bg-white/5" : ""}`}
                >
                  <th scope="row" className="px-4 py-3 font-display font-semibold">
                    {row.talla}
                  </th>
                  {columns.map((c) => (
                    <td key={c.key} className="px-4 py-3 text-base text-white/85">
                      {row[c.key] ?? "—"}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {(guide.comoMedir || guide.imagen) && (
          <div className="mt-10 grid items-center gap-8 md:grid-cols-[1fr_280px]">
            {guide.comoMedir && (
              <div>
                <h3 className="font-display text-2xl font-medium text-white">Cómo medirte</h3>
                <p className="mt-3 whitespace-pre-line font-body text-lg leading-relaxed text-white/75">
                  {guide.comoMedir}
                </p>
              </div>
            )}
            {guide.imagen && (
              <div className="relative aspect-3/4 overflow-hidden rounded-xl bg-white/10">
                <Image
                  src={guide.imagen.url}
                  alt={guide.imagen.altText || "Cómo tomar las medidas"}
                  fill
                  sizes="280px"
                  className="object-contain"
                />
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
