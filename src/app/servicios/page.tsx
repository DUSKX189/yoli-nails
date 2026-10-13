import Image from "next/image";
import { Suspense } from "react";
import ServiceTabs, { ServiceTabsFromUrl } from "@/components/service-tabs";

export const metadata = {
  title: "Servicios",
};

export default function ServiciosPage() {
  return (
    <>
      <section className="relative flex min-h-[440px] items-end overflow-hidden">
        <Image
          src="/images/hero-servicios.jpg"
          alt="Manicura profesional en proceso"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/45 via-ink/10 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-32">
          <h1 className="font-display text-5xl font-bold text-white md:text-6xl">
            Nuestros servicios
          </h1>
        </div>
      </section>

      {/* El fallback (primera pestaña) va en el HTML estático; luego se aplica ?cat= */}
      <Suspense fallback={<ServiceTabs />}>
        <ServiceTabsFromUrl />
      </Suspense>
    </>
  );
}
