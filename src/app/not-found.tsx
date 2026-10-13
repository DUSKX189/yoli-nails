import Link from "next/link";

export default function NotFound() {
  return (
    <>
      <div className="bg-wine-dark pb-6 pt-32 md:pt-36" />
      <section className="mx-auto max-w-2xl px-6 py-24 text-center">
        <h1 className="font-display text-4xl font-medium">Página no encontrada</h1>
        <p className="mt-4 font-body text-xl text-ink/70">
          Lo que buscas no existe o ya no está disponible.
        </p>
        <div className="mt-8 flex justify-center gap-4">
          <Link
            href="/tienda"
            className="rounded-md bg-wine px-7 py-3.5 font-body text-sm font-semibold tracking-wide text-white"
          >
            Ver la tienda
          </Link>
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
