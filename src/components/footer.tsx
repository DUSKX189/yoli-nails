import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-cream/10 bg-wine-dark text-cream">
      <div className="mx-auto flex max-w-6xl flex-col gap-10 px-6 py-14 md:flex-row md:justify-between">
        <div className="flex flex-col gap-4">
          <Image
            src="/logo/yn-logo-white.svg"
            alt="YOLI NAILS"
            width={40}
            height={40}
            className="h-10 w-10"
          />
          <p className="max-w-xs font-body text-sm text-cream/70">
            Manicura, pedicura, pestañas y depilación realizadas por
            especialistas que cuidan cada detalle.
          </p>
        </div>

        <div className="flex flex-wrap gap-12">
          <div className="flex flex-col gap-3">
            <p className="font-display text-lg">Navegación</p>
            <Link href="/servicios" className="font-body text-cream/70 hover:text-cream">
              Servicios
            </Link>
            <Link href="/tienda" className="font-body text-cream/70 hover:text-cream">
              Tienda
            </Link>
            <Link href="/contacto" className="font-body text-cream/70 hover:text-cream">
              Contacto
            </Link>
          </div>

          <div className="flex flex-col gap-3">
            <p className="font-display text-lg">Contacto</p>
            <a href="tel:+34664112092" className="font-body text-cream/70 hover:text-cream">
              +34 664 11 20 92
            </a>
            <a
              href="mailto:hola@yolinails.com"
              className="font-body text-cream/70 hover:text-cream"
            >
              hola@yolinails.com
            </a>
            <p className="font-body text-cream/70">
              Calle de Núñez de Balboa, 95, Salamanca, 28006 Madrid
            </p>
          </div>
        </div>
      </div>

      <div className="border-t border-cream/10 px-6 py-5 text-center font-body text-xs text-cream/50">
        © {new Date().getFullYear()} YOLI NAILS. Todos los derechos reservados.
      </div>
    </footer>
  );
}
