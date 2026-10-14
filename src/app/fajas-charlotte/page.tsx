import type { Metadata } from "next";
import Image from "next/image";
import FajasContact from "@/components/fajas/fajas-contact";
import FajaCard from "@/components/fajas/faja-card";
import { getFajas } from "@/lib/shopify/products";

export const metadata: Metadata = {
  title: "Fajas Charlotte",
  description:
    "Fajas Charlotte de alta compresión para uso diario, postparto y postquirúrgico. Diseñadas para abrazar tus curvas con comodidad y discreción.",
  alternates: { canonical: "/fajas-charlotte" },
};

export default async function FajasPage() {
  const fajas = await getFajas();

  return (
    <>
      <section className="relative flex min-h-[440px] items-end overflow-hidden">
        <Image
          src="/images/hero-fajas.jpg"
          alt="Colección de fajas Charlotte"
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/60 via-ink/15 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-32">
          <h1 className="font-display text-5xl font-bold text-white md:text-6xl">
            Fajas Charlotte
          </h1>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pt-14 text-center">
        <p className="font-display text-4xl uppercase leading-tight text-wine md:text-5xl">
          La clave de tu figura perfecta
        </p>
        <p className="mt-4 font-body text-2xl font-semibold leading-relaxed text-ink/75">
          Fajas diseñadas para abrazar tus curvas con comodidad y discreción. Uso diario, post
          quirúrgico o post parto.
        </p>
      </section>

      {fajas.length === 0 ? (
        <section className="mx-auto max-w-6xl px-6 py-20 text-center">
          <p className="font-body text-xl text-ink/60">
            Estamos preparando la colección. Vuelve muy pronto.
          </p>
        </section>
      ) : (
        <section className="mx-auto max-w-6xl px-6 py-14 md:py-20">
          <p className="mb-10 text-center font-body text-sm uppercase tracking-widest text-ink/60">
            {fajas.length} {fajas.length === 1 ? "modelo" : "modelos"}
          </p>
          {/* Flex en lugar de grid para centrar la última fila cuando no se completa. */}
          <div className="flex flex-wrap justify-center gap-x-6 gap-y-14 lg:gap-x-12">
            {fajas.map((faja, i) => (
              <FajaCard
                key={faja.id}
                faja={faja}
                priority={i < 3}
                className="w-[calc(50%-0.75rem)] lg:w-[calc((100%-6rem)/3)]"
              />
            ))}
          </div>
        </section>
      )}

      <FajasContact />
    </>
  );
}
