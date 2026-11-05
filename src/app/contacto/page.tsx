import Image from "next/image";
import MapEmbed from "@/components/map-embed";
import { BOOKING_LINKS } from "@/lib/booking-links";

export const metadata = {
  title: "Contacto",
};

export default function ContactoPage() {
  return (
    <>
      <section className="relative flex min-h-[360px] items-end overflow-hidden">
        <Image
          src="/images/hero-contacto.jpg"
          alt="Manicura de precisión"
          fill
          priority
          className="object-cover"
        />
        <div className="absolute inset-0 bg-linear-to-t from-ink/45 via-ink/10 to-transparent" />
        <div className="relative mx-auto w-full max-w-6xl px-6 pb-14 pt-32">
          <h1 className="font-display text-5xl font-bold text-white md:text-6xl">
            Contacto
          </h1>
        </div>
      </section>

      <section className="mx-auto grid max-w-6xl grid-cols-1 gap-14 px-6 py-16 md:grid-cols-2 md:py-24">
        <div>
          <h2 className="font-display text-3xl font-medium">Reserva tu cita</h2>
          <p className="mt-3 max-w-md font-body text-ink/70">
            Gestionamos las citas a través de Treatwell y Booksy. Elige la
            plataforma que prefieras para ver disponibilidad y reservar al
            momento.
          </p>
          <div className="mt-6 flex flex-wrap gap-4">
            {BOOKING_LINKS.map((link) => (
              <a
                key={link.href}
                href={link.href}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-md bg-wine px-7 py-3.5 font-body text-sm font-semibold tracking-wide text-white transition-transform hover:scale-[1.02]"
              >
                {link.label}
              </a>
            ))}
          </div>

          <h2 className="mt-14 font-display text-3xl font-medium">
            Contacto directo
          </h2>
          <p className="mt-3 max-w-md font-body text-ink/70">
            Escríbenos por WhatsApp y te respondemos lo antes posible.
          </p>
          <div className="mt-6">
            <a
              href="https://wa.me/34664112092"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md bg-wine px-7 py-3.5 font-body text-sm font-semibold tracking-wide text-white transition-transform hover:scale-[1.02]"
            >
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                className="h-5 w-5"
              >
                <path d="M12.01 2C6.48 2 2 6.48 2 12.01c0 1.99.58 3.85 1.58 5.42L2 22l4.7-1.53a9.94 9.94 0 0 0 5.3 1.53h.01c5.53 0 10.01-4.48 10.01-10.01C22.02 6.48 17.54 2 12.01 2Zm5.87 14.33c-.25.7-1.24 1.28-2.02 1.45-.54.11-1.24.2-3.6-.77-3.02-1.25-4.96-4.31-5.11-4.51-.15-.2-1.22-1.62-1.22-3.09 0-1.47.77-2.19 1.04-2.49.27-.3.6-.37.8-.37.2 0 .4 0 .58.01.19.01.44-.07.68.52.25.6.85 2.07.92 2.22.07.15.12.32.02.52-.1.2-.15.32-.3.49-.15.17-.31.38-.44.51-.15.15-.3.31-.13.6.17.3.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.36 1.46.3.15.48.13.65-.08.17-.2.74-.87.94-1.17.2-.3.4-.25.68-.15.27.1 1.75.83 2.05.98.3.15.5.22.57.35.07.13.07.75-.18 1.45Z" />
              </svg>
              +34 664 11 20 92
            </a>
          </div>
        </div>

        <div className="flex flex-col gap-8">
          <MapEmbed />

          <div className="flex flex-col gap-4 font-body">
            <div>
              <p className="text-sm uppercase tracking-wide text-ink/60">
                Dirección
              </p>
              <p className="text-lg">
                Calle de Núñez de Balboa, 95, Salamanca, 28006 Madrid
              </p>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-ink/60">
                Teléfono
              </p>
              <a href="tel:+34664112092" className="text-lg">
                +34 664 11 20 92
              </a>
            </div>
            <div>
              <p className="text-sm uppercase tracking-wide text-ink/60">
                Horario
              </p>
              <p className="text-lg">Lunes a Viernes, 10:00 – 20:30</p>
              <p className="text-lg">Sábado, 10:00 – 14:00</p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
