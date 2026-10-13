"use client";

import { useState } from "react";
import { useSearchParams } from "next/navigation";
import { SERVICE_CATEGORIES } from "@/lib/services-data";
import BookingButton from "@/components/booking-button";

/** Lee ?cat= de la URL. Debe ir dentro de <Suspense>; su fallback es <ServiceTabs />. */
export function ServiceTabsFromUrl() {
  const cat = useSearchParams().get("cat");
  return <ServiceTabs key={cat} initialSlug={cat} />;
}

export default function ServiceTabs({ initialSlug }: { initialSlug?: string | null }) {
  const [activeIndex, setActiveIndex] = useState(() =>
    Math.max(0, SERVICE_CATEGORIES.findIndex((c) => c.slug === initialSlug))
  );
  const active = SERVICE_CATEGORIES[activeIndex];

  return (
    <>
      <nav className="flex flex-wrap justify-center gap-8 border-b border-ink/10 bg-cream px-6 py-6 md:gap-16">
        {SERVICE_CATEGORIES.map((cat, i) => (
          <button
            key={cat.slug}
            type="button"
            onClick={() => setActiveIndex(i)}
            aria-pressed={i === activeIndex}
            className={`relative pb-1 font-display text-lg uppercase tracking-wide transition-all md:text-xl ${
              i === activeIndex
                ? "font-bold text-wine after:absolute after:inset-x-0 after:-bottom-1 after:h-0.5 after:rounded-full after:bg-wine"
                : "font-medium text-ink/50 hover:text-ink"
            }`}
          >
            {cat.label}
          </button>
        ))}
      </nav>

      <div className="bg-wine-dark px-4 py-14 md:px-10 md:py-20">
        <div className="mx-auto max-w-4xl rounded-2xl border border-white/10 bg-white/10 p-6 backdrop-blur-sm md:p-10">
          <dl className="flex flex-col divide-y divide-white/15">
            {active.items.map((item) => (
              <div
                key={item.name}
                className={`flex items-baseline justify-between gap-6 py-2.5 ${
                  item.isHeading ? "pt-4 text-white" : "text-white/90"
                } ${item.indent ? "pl-4" : ""}`}
              >
                <dt
                  className={`font-body ${
                    item.isHeading ? "text-lg font-semibold" : "text-base md:text-lg"
                  }`}
                >
                  {item.name}
                </dt>
                {!item.isHeading && (
                  <dd className="whitespace-nowrap font-body text-base md:text-lg">
                    {item.price}
                  </dd>
                )}
              </div>
            ))}
          </dl>
        </div>

        <div className="mt-10 flex justify-center">
          <BookingButton variant="outline" />
        </div>
      </div>
    </>
  );
}
