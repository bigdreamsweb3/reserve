import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { MotionReveal } from "@/components/motion-reveal";
import { ReserveCard } from "@/components/reserve-card";
import type { ReserveListing } from "@/lib/reserves";

type HomeTopPicksProps = {
  stayListings: ReserveListing[];
  mealListings: ReserveListing[];
};

export function HomeTopPicks({ stayListings, mealListings }: HomeTopPicksProps) {
  const hasStays = stayListings.length > 0;
  const hasMeals = mealListings.length > 0;

  if (!hasStays && !hasMeals) {
    return null;
  }

  return (
    <section id="menu" className="mt-12 max-w-[1500px] px-6 sm:px-8 lg:px-12">
      <div className="py-10">
        <div className="max-w-2xl">
          <p className="text-sm uppercase tracking-[0.28em] text-[var(--reserve-gold-500)]">Curated for you</p>
          <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)] sm:text-4xl md:text-5xl">
            Hand-picked stays and plates from Reserve
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
            Apartments and meals are presented separately so you always know what you are booking. No identical tiles,
            no mystery taps — just clear next steps.
          </p>
        </div>

        {hasStays ? (
          <div className="mt-12">
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="booking-step-label">Featured apartments</p>
                <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold text-[var(--ink)]">
                  Prepared spaces for short or longer visits
                </h3>
              </div>
              <Link
                href="/apartments"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--reserve-green-800)] transition hover:gap-2"
              >
                View all stays
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2">
              {stayListings.map((listing, index) => (
                <MotionReveal key={listing.id} delay={index * 60}>
                  <ReserveCard listing={listing} />
                </MotionReveal>
              ))}
            </div>
          </div>
        ) : null}

        {hasMeals ? (
          <div className={hasStays ? "mt-16" : "mt-10"}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
              <div>
                <p className="booking-step-label">Kitchen favorites</p>
                <h3 className="mt-2 font-[family-name:var(--font-heading)] text-2xl font-semibold text-[var(--ink)]">
                  Meals you can order now or build in your cart
                </h3>
              </div>
              <Link
                href="/meals"
                className="inline-flex items-center gap-1 text-sm font-semibold text-[var(--reserve-green-800)] transition hover:gap-2"
              >
                Full menu
                <ChevronRight className="h-4 w-4" aria-hidden />
              </Link>
            </div>
            <div className="mt-6 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
              {mealListings.map((listing, index) => (
                <MotionReveal key={listing.id} delay={index * 55}>
                  <ReserveCard listing={listing} />
                </MotionReveal>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </section>
  );
}
