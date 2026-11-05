import Link from "next/link";
import type { ReactNode } from "react";
import { LEGAL, LEGAL_LINKS, type LegalField } from "@/lib/legal";

/** Muestra un dato legal, o un aviso visible si todavía falta. */
export function Field({ value, label }: { value: LegalField; label: string }) {
  if (value) return <>{value}</>;
  return (
    <span className="rounded bg-wine/10 px-1.5 py-0.5 font-semibold text-wine">
      [Pendiente: {label}]
    </span>
  );
}

export function Section({ title, children }: { title: string; children: ReactNode }) {
  return (
    <section className="mt-10">
      <h2 className="font-display text-2xl font-medium">{title}</h2>
      <div className="mt-3 flex flex-col gap-3">{children}</div>
    </section>
  );
}

export default function LegalPage({
  title,
  children,
}: {
  title: string;
  children: ReactNode;
}) {
  return (
    <>
      <div className="bg-wine-dark pb-6 pt-32 md:pt-36" />
      <article className="mx-auto max-w-3xl px-6 py-16 font-body text-lg leading-relaxed text-ink/85 md:py-20 [&_a]:text-wine [&_a]:underline [&_li]:ml-6 [&_ul]:list-disc">
        <h1 className="font-display text-4xl font-medium text-ink md:text-5xl">{title}</h1>
        <p className="mt-3 text-base text-ink/60">Última actualización: {LEGAL.lastUpdated}</p>
        {children}
        <nav className="mt-16 border-t border-ink/10 pt-6 text-base">
          <p className="text-ink/60">Otros textos legales</p>
          <ul className="mt-2 flex flex-wrap gap-x-6 gap-y-2 !list-none [&_li]:!ml-0">
            {LEGAL_LINKS.map((link) => (
              <li key={link.href}>
                <Link href={link.href}>{link.label}</Link>
              </li>
            ))}
          </ul>
        </nav>
      </article>
    </>
  );
}
