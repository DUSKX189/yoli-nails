"use client";

import { useEffect, useRef, useState } from "react";
import { BOOKING_LINKS } from "@/lib/booking-links";

type BookingButtonProps = {
  className?: string;
  variant?: "solid" | "outline";
};

export default function BookingButton({
  className = "text-sm",
  variant = "solid",
}: BookingButtonProps) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    function onClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function onKey(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", onClick);
    document.addEventListener("keydown", onKey);
    return () => {
      document.removeEventListener("mousedown", onClick);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const base =
    "inline-block rounded-md px-8 py-3.5 font-body font-semibold tracking-wide transition-transform hover:scale-[1.02]";
  const style =
    variant === "outline"
      ? "bg-white text-wine"
      : "bg-wine text-white";

  return (
    <div ref={ref} className="relative inline-block">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-haspopup="menu"
        className={`${base} ${style} ${className}`}
      >
        Pide cita aquí
      </button>

      {open && (
        <div className="absolute left-1/2 top-full z-20 mt-2 w-56 -translate-x-1/2 overflow-hidden rounded-xl border border-ink/10 bg-white shadow-xl">
          {BOOKING_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              target="_blank"
              rel="noopener noreferrer"
              className="block px-5 py-3 text-left font-body text-sm text-ink hover:bg-cream"
              onClick={() => setOpen(false)}
            >
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  );
}
