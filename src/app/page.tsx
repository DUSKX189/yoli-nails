import Image from "next/image";
import Link from "next/link";
import BookingButton from "@/components/booking-button";

const SERVICE_GRID = [
  {
    label: "Manicura",
    href: "/servicios?cat=manos",
    image: "/images/service-manicura.jpg",
  },
  {
    label: "Pedicura",
    href: "/servicios?cat=pies",
    image: "/images/service-pedicura.jpg",
  },
  {
    label: "Pestañas",
    href: "/servicios?cat=pestanas",
    image: "/images/service-pestanas.jpg",
  },
  {
    label: "Depilación",
    href: "/servicios?cat=depilacion",
    image: "/images/service-depilacion.jpg",
  },
];

const WHY_US = [
  "Productos premium",
  "Especialistas",
  "Higiene y seguridad",
  "Atención personalizada",
];

export default function Home() {
  return (
    <>
      <section className="relative flex min-h-[640px] items-center justify-center overflow-hidden md:min-h-[720px]">
        <Image
          src="/images/hero-home.jpg"
          alt="Aplicando esmalte en una manicura"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-ink/15" />
        <div className="relative mx-auto w-full max-w-6xl px-6 text-center">
          <h1 className="font-display text-5xl leading-[1.05] text-white sm:text-6xl md:text-7xl">
            Realza tu <span className="font-bold">belleza.</span>
            <br />
            Eleva tu confianza.
          </h1>
        </div>
      </section>

      <section className="grid grid-cols-1 items-stretch gap-12 py-20 md:grid-cols-2 md:gap-0 md:py-28">
        <div className="flex flex-col justify-center px-6 md:pl-[max(1.5rem,calc((100vw-72rem)/2+1.5rem))] md:pr-16">
          <h2 className="font-display text-5xl font-medium leading-tight md:text-[3.25rem]">
            La belleza empieza con un momento para ti.
          </h2>
          <p className="mt-6 max-w-lg font-body text-xl font-normal leading-relaxed text-ink/75">
            Descubre un espacio donde cada detalle ha sido pensado para
            cuidar de ti. Manicura, pedicura, pestañas y tratamientos de
            belleza realizados por especialistas que entienden que el lujo
            está en la excelencia y en la atención personalizada.
          </p>
          <BookingButton className="mt-8 text-base" />
        </div>
        <div className="relative flex items-center justify-end overflow-hidden">
          <Image
            src="/images/gelcare-bottle.png"
            alt="Esmalte gel y manicura en tono rojo"
            width={629}
            height={493}
            className="h-[240px] w-auto -mr-4 sm:h-[340px] md:h-[440px] md:-mr-10 lg:h-[520px]"
          />
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-16 text-center">
        <h2 className="font-display text-4xl font-medium md:text-5xl">
          Nuestros servicios
        </h2>
        <p className="mt-3 font-body text-2xl text-ink/70 md:text-3xl">
          Todo lo que necesitas para realzar tu belleza.
        </p>
      </section>

      <section className="grid grid-cols-2 md:grid-cols-4">
        {SERVICE_GRID.map((item) => (
          <Link
            key={item.label}
            href={item.href}
            className="group relative block aspect-[3/4] overflow-hidden"
          >
            <Image
              src={item.image}
              alt={item.label}
              fill
              sizes="(min-width: 768px) 25vw, 50vw"
              className="object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 bg-ink/0 transition-colors group-hover:bg-ink/30" />
            <span className="absolute bottom-5 left-5 font-display text-3xl text-white opacity-0 transition-opacity after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 after:content-[''] group-hover:opacity-100 group-hover:after:w-full">
              {item.label}
            </span>
          </Link>
        ))}
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2">
        <div className="relative min-h-[460px] overflow-hidden md:min-h-[620px]">
          <div className="absolute inset-y-0 left-[-3%] w-[95%] sm:w-[90%] md:w-[82%]">
            <Image
              src="/images/hand-silhouette.png"
              alt=""
              fill
              sizes="(min-width: 768px) 42vw, 95vw"
              className="object-contain object-left"
            />
          </div>
        </div>

        <div className="flex flex-col justify-center gap-6 bg-cream px-6 py-16 md:px-16">
          <p className="text-right font-body text-2xl text-ink/60 md:text-3xl">
            ¿Por qué elegirnos?
          </p>
          <ul>
            {WHY_US.map((item) => (
              <li
                key={item}
                className="cursor-default border-b border-ink/15 py-5 text-right font-display text-3xl font-medium transition-all duration-300 hover:-translate-x-2 hover:text-wine md:text-4xl"
              >
                {item}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
