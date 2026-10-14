"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { useCart } from "@/components/cart-context";
import CartDrawer from "@/components/cart-drawer";

const NAV_LINKS = [
  { href: "/servicios", label: "Servicios" },
  { href: "/tienda", label: "Cuidado Facial" },
  { href: "/fajas-charlotte", label: "Fajas Charlotte" },
  { href: "/contacto", label: "Contacto" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const { cart, openCart } = useCart();
  const totalCount = cart?.totalQuantity ?? 0;

  return (
    <>
      <header className="fixed top-0 z-50 w-full px-3 pt-3 md:px-6 md:pt-5">
        <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 rounded-2xl border border-white/15 bg-ink/25 px-6 py-4 text-white shadow-lg shadow-ink/10 backdrop-blur-md md:px-10 md:py-5">
          <Link href="/" className="flex items-center gap-2 shrink-0">
            <Image
              src="/logo/yn-logo-white.svg"
              alt="YOLI NAILS — Inicio"
              width={56}
              height={56}
              className="h-12 w-12 md:h-14 md:w-14"
              priority
            />
          </Link>

          <nav className="hidden items-center gap-10 whitespace-nowrap font-body text-xl font-medium tracking-wide lg:flex">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="relative after:absolute after:-bottom-1 after:left-0 after:h-px after:w-0 after:bg-current after:transition-all after:duration-300 after:content-[''] hover:after:w-full"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          <div className="flex items-center gap-5">
            <button
              type="button"
              onClick={openCart}
              aria-label={
                totalCount > 0 ? `Abrir carrito (${totalCount} artículos)` : "Abrir carrito"
              }
              className="relative flex h-11 w-11 items-center justify-center"
            >
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.3"
                className="h-8 w-8"
              >
                <path d="M3 4h2l2.2 11.4a2 2 0 0 0 2 1.6h7.6a2 2 0 0 0 2-1.6L20.5 8H6" />
                <circle cx="9.5" cy="20" r="1.2" fill="currentColor" stroke="none" />
                <circle cx="17.5" cy="20" r="1.2" fill="currentColor" stroke="none" />
              </svg>
              {totalCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-wine px-1 text-xs font-semibold text-white">
                  {totalCount}
                </span>
              )}
            </button>

            <button
              type="button"
              onClick={() => setMenuOpen((v) => !v)}
              aria-label={menuOpen ? "Cerrar menú" : "Abrir menú"}
              aria-expanded={menuOpen}
              aria-controls="mobile-nav"
              className="flex h-11 w-11 flex-col items-center justify-center gap-2 lg:hidden"
            >
              <span className="h-0.5 w-6 bg-white" />
              <span className="h-0.5 w-6 bg-white" />
            </button>
          </div>
        </div>

        {menuOpen && (
          <nav id="mobile-nav" className="mx-auto mt-2 flex max-w-6xl flex-col gap-1 rounded-2xl border border-white/15 bg-ink/70 px-6 py-4 font-body text-white backdrop-blur-md lg:hidden">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMenuOpen(false)}
                className="py-2 text-lg"
              >
                {link.label}
              </Link>
            ))}
          </nav>
        )}
      </header>

      <CartDrawer />
    </>
  );
}
