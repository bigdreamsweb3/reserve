import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { formatNaira, type ReserveListing } from "@/lib/reserves";
import { getMealStatusLabel } from "@/lib/listing-presentation";

type HomePromoGridProps = {
  featuredMeal: ReserveListing | null;
  secondMeal: ReserveListing | null;
  featuredApartment: ReserveListing | null;
};

export function HomePromoGrid({
  featuredMeal,
  secondMeal,
  featuredApartment,
}: HomePromoGridProps) {
  if (!featuredApartment && !featuredMeal && !secondMeal) {
    return null;
  }

  return (
    <section className="mx-auto mt-14 max-w-[1500px] px-6 sm:px-8 lg:px-12">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--reserve-gold-500)]">Start here</p>
        <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)] sm:text-4xl">
          Featured stays and tonight&apos;s kitchen picks
        </h2>
      </div>

      <div className="grid gap-5 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-5 lg:order-1">
          {featuredApartment ? (
            <article className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,var(--reserve-green-900)_0%,var(--reserve-green-800)_58%,var(--reserve-green-700)_100%)] p-7 text-white shadow-[0_25px_60px_rgba(23,61,47,0.18)]">
              <div className="relative z-[1] max-w-[min(100%,420px)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--reserve-gold-400)]">
                  Apartment
                </p>
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight sm:text-4xl">
                  {featuredApartment.title}
                </h3>
                <p className="mt-4 text-sm leading-relaxed text-white/76">{featuredApartment.shortDescription}</p>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <Link
                    href={`/reserves/${featuredApartment.slug}#book`}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--reserve-cream-100)] px-5 py-2.5 text-sm font-semibold text-[var(--reserve-green-900)] transition hover:bg-[var(--reserve-gold-400)]"
                  >
                    Check availability
                  </Link>
                  <Link
                    href={`/reserves/${featuredApartment.slug}`}
                    className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-white/88 transition hover:text-[var(--reserve-gold-400)]"
                  >
                    See details
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
              <div className="absolute bottom-[-16px] right-4 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_50%_30%,var(--reserve-cream-100)_0%,var(--reserve-gold-500)_38%,var(--reserve-brown-700)_100%)]" />
              <div className="absolute right-6 top-6 rounded-2xl bg-[var(--reserve-gold-400)] px-5 py-4 text-center text-[var(--reserve-green-900)]">
                <p className="text-xs font-medium opacity-90">From</p>
                <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold leading-none">
                  {formatNaira(featuredApartment.priceNgn)}
                </p>
                <p className="mt-1 text-[10px] font-semibold uppercase tracking-[0.14em]">per night</p>
              </div>
            </article>
          ) : null}

          {secondMeal ? (
            <article className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,var(--reserve-brown-600)_0%,var(--reserve-brown-700)_38%,var(--reserve-green-900)_100%)] p-7 text-white shadow-[0_30px_80px_rgba(109,63,34,0.18)]">
              <div className="relative z-[1] max-w-[min(100%,480px)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-white/72">Menu</p>
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold leading-tight">
                  {secondMeal.title}
                </h3>
                <p className="mt-4 line-clamp-3 text-sm leading-relaxed text-white/78">{secondMeal.description}</p>
                <div className="mt-6 flex flex-wrap items-center gap-3">
                  <span className="rounded-full bg-[var(--reserve-gold-500)] px-4 py-2 text-xs font-semibold text-[var(--reserve-green-950)]">
                    {getMealStatusLabel(secondMeal.status)}
                  </span>
                  <Link
                    href={`/reserves/${secondMeal.slug}`}
                    className="inline-flex items-center gap-1 text-sm font-semibold text-white/90 transition hover:text-[var(--reserve-gold-400)]"
                  >
                    View meal
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
            </article>
          ) : null}
        </div>

        <div className="grid gap-5 lg:order-2">
          {featuredMeal ? (
            <article className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(242,49,32,0.86)_0%,rgba(139,83,43,0.92)_46%,var(--ink)_100%)] p-7 text-[var(--reserve-cream-100)] shadow-[0_25px_60px_rgba(70,26,15,0.24)]">
              <div className="relative z-[1] max-w-[min(100%,420px)]">
                <p className="text-[10px] font-semibold uppercase tracking-[0.28em] text-[var(--reserve-cream-100)]/84">
                  Chef pick
                </p>
                <h3 className="mt-4 font-[family-name:var(--font-heading)] text-2xl font-semibold leading-tight sm:text-3xl">
                  {featuredMeal.title}
                </h3>
                <p className="mt-4 line-clamp-2 text-sm text-[var(--reserve-cream-100)]/76">{featuredMeal.shortDescription}</p>
                <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
                  <Link
                    href={`/reserves/${featuredMeal.slug}#order`}
                    className="inline-flex items-center justify-center rounded-full bg-[var(--reserve-cream-100)] px-5 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:bg-[var(--reserve-gold-400)]"
                  >
                    Order now
                  </Link>
                  <Link
                    href={`/reserves/${featuredMeal.slug}`}
                    className="inline-flex items-center justify-center gap-1 text-sm font-semibold text-[var(--reserve-cream-100)]/88 transition hover:text-[var(--reserve-gold-400)]"
                  >
                    See details
                    <ChevronRight className="h-4 w-4" aria-hidden />
                  </Link>
                </div>
              </div>
              <div className="absolute bottom-0 right-0 flex h-full w-[44%] items-end justify-center bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.16),transparent_20%)]">
                <div className="mb-5 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_40%_30%,var(--reserve-cream-100)_0%,rgba(242,49,32,0.7)_42%,var(--reserve-brown-600)_100%)] shadow-2xl" />
              </div>
              <div className="absolute right-5 top-5 rounded-[1.4rem] bg-white/12 px-4 py-3 text-right backdrop-blur">
                <p className="text-xs font-medium text-[var(--reserve-cream-100)]/78">From</p>
                <p className="font-[family-name:var(--font-heading)] text-3xl font-semibold leading-none">
                  {formatNaira(featuredMeal.priceNgn)}
                </p>
              </div>
            </article>
          ) : null}
        </div>
      </div>
    </section>
  );
}
