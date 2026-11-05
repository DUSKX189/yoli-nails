"use client";

import Link from "next/link";
import { useState } from "react";

const QUERY = "Calle+de+N%C3%BA%C3%B1ez+de+Balboa+95,+28006+Madrid";

// El mapa de Google pone cookies de terceros, así que solo se carga cuando el
// visitante lo pide. Hasta entonces no se hace ninguna petición a Google.
export default function MapEmbed() {
  const [show, setShow] = useState(false);

  return (
    <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-cream-dark">
      {show ? (
        <iframe
          title="Ubicación de YOLI NAILS en el mapa"
          src={`https://www.google.com/maps?q=${QUERY}&output=embed`}
          className="absolute inset-0 h-full w-full border-0"
          loading="lazy"
          referrerPolicy="no-referrer-when-downgrade"
        />
      ) : (
        <div className="absolute inset-0 flex flex-col items-center justify-center gap-4 p-6 text-center font-body">
          <p className="max-w-xs text-ink/70">
            El mapa lo ofrece Google, que puede usar sus propias cookies.{" "}
            <Link href="/cookies" className="underline">
              Más información
            </Link>
          </p>
          <div className="flex flex-wrap justify-center gap-3">
            <button
              type="button"
              onClick={() => setShow(true)}
              className="rounded-md bg-wine px-6 py-3 text-sm font-semibold tracking-wide text-white transition-transform hover:scale-[1.02]"
            >
              Ver mapa
            </button>
            <a
              href={`https://www.google.com/maps/search/?api=1&query=${QUERY}`}
              target="_blank"
              rel="noopener noreferrer"
              className="rounded-md border border-wine px-6 py-3 text-sm font-semibold tracking-wide text-wine"
            >
              Abrir en Google Maps
            </a>
          </div>
        </div>
      )}
    </div>
  );
}
