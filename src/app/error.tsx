"use client";

import Link from "next/link";
import { useEffect } from "react";

export default function Error({
  error,
  retry,
}: {
  error: Error & { digest?: string };
  retry: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <>
      <div className="bg-wine-dark pb-6 pt-32 md:pt-36" />
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-medium">Algo no ha ido bien</h1>
        <p className="mt-4 font-body text-xl text-ink/70">
          No hemos podido cargar esta página. Vuelve a intentarlo en unos segundos.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <button
            type="button"
            onClick={() => retry()}
            className="rounded-md bg-wine px-7 py-3.5 font-body text-sm font-semibold tracking-wide text-white"
          >
            Reintentar
          </button>
          <Link
            href="/"
            className="rounded-md border border-wine px-7 py-3.5 font-body text-sm font-semibold tracking-wide text-wine"
          >
            Ir al inicio
          </Link>
        </div>
      </section>
    </>
  );
}
