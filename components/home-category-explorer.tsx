import { House, Sparkles } from "lucide-react";

import type { ReserveListing } from "@/lib/reserves";

export function HomeCategoryExplorer({ listings }: { listings: ReserveListing[] }) {
  const positions = [
    { top: "16%", left: "12%" },
    { top: "8%", right: "16%" },
    { top: "58%", left: "10%" },
    { top: "64%", right: "14%" },
    { bottom: "8%", left: "36%" },
  ] as const;

  return (
    <section id="explore" className="mt-16 max-w-[1500px] px-6 sm:px-8 lg:px-12">
      <div className="overflow-hidden rounded-[2.5rem] bg-[linear-gradient(135deg,var(--reserve-cream-100)_0%,var(--reserve-gold-300)_48%,var(--reserve-cream-200)_100%)] px-5 py-10 shadow-[0_30px_80px_rgba(232,182,60,0.12)] sm:px-8 lg:px-10">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--reserve-green-800)]">
              Explore Reserve
            </p>
            <h2 className="mt-3 max-w-lg text-4xl font-black tracking-[-0.04em] text-[#111] sm:text-5xl">
              Explore Reserve offerings by live listings
            </h2>
            <p className="mt-5 max-w-md text-sm leading-7 text-[#405149]">
              Every card in this section is generated from the current database listings, so
              the homepage stays in sync with your real Reserve menu items and apartment
              inventory.
            </p>
          </div>

          <div className="relative min-h-[520px]">
            <div className="absolute left-1/2 top-1/2 h-[340px] w-[340px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-[radial-gradient(circle_at_50%_34%,var(--reserve-cream-100)_0%,var(--reserve-gold-500)_30%,var(--reserve-brown-700)_100%)] shadow-[0_35px_90px_rgba(109,63,34,0.18)]" />

            {listings.map((listing, index) => (
              <div
                key={listing.id}
                className="absolute w-[160px] rounded-[1.7rem] bg-white px-5 py-5 text-center shadow-[0_18px_42px_rgba(20,20,20,0.08)]"
                style={positions[index]}
              >
                <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-[var(--reserve-cream-100)] text-[var(--reserve-green-800)]">
                  {listing.type === "apartment" ? (
                    <House className="h-5 w-5" />
                  ) : (
                    <Sparkles className="h-5 w-5" />
                  )}
                </div>
                <p className="mt-4 text-base font-semibold text-[#121212]">{listing.title}</p>
                <p className="mt-1 text-xs text-[#6e665d]">{listing.billingPeriod}</p>
              </div>
            ))}

            <a
              href="/meals"
              className="absolute bottom-4 right-4 inline-flex rounded-full bg-[var(--reserve-green-800)] px-5 py-3 text-sm font-semibold text-white transition hover:bg-[var(--reserve-green-700)]"
            >
              View Categories
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
