import Link from "next/link";

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
  return (
    <section className="mx-auto mt-16 max-w-[1500px] px-6 sm:px-8 lg:px-12">
      <div className="grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="grid gap-4 lg:order-1">
          {featuredApartment ? (
            <article className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,var(--reserve-green-900)_0%,var(--reserve-green-800)_58%,var(--reserve-green-700)_100%)] p-6 text-white shadow-[0_25px_60px_rgba(23,61,47,0.18)]">
              <div className="max-w-[56%]">
                <p className="text-sm uppercase tracking-[0.26em] text-[var(--reserve-gold-400)]">
                  Reserve Apartments
                </p>
                <h3 className="mt-4 text-4xl font-black leading-none">
                  {featuredApartment.title}
                </h3>
                <p className="mt-4 text-sm leading-7 text-white/76">
                  {featuredApartment.shortDescription}
                </p>
                <Link
                  href={`/reserves/${featuredApartment.slug}`}
                  className="mt-6 inline-flex rounded-full bg-white px-4 py-2 text-sm font-semibold text-[var(--reserve-green-900)]"
                >
                  View Apartment
                </Link>
              </div>
              <div className="absolute bottom-[-16px] right-4 h-44 w-44 rounded-full bg-[radial-gradient(circle_at_50%_30%,var(--reserve-cream-100)_0%,var(--reserve-gold-500)_38%,var(--reserve-brown-700)_100%)]" />
              <div className="absolute right-6 top-6 rounded-full bg-[var(--reserve-gold-400)] px-5 py-4 text-center text-[var(--reserve-green-900)]">
                <p className="text-sm font-medium">From</p>
                <p className="text-2xl font-black leading-none">
                  {formatNaira(featuredApartment.priceNgn)}
                </p>
              </div>
            </article>
          ) : null}

          {secondMeal ? (
            <article className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,var(--reserve-brown-600)_0%,var(--reserve-brown-700)_38%,var(--reserve-green-900)_100%)] p-6 text-white shadow-[0_30px_80px_rgba(109,63,34,0.18)]">
              <div className="max-w-[64%]">
                <p className="text-sm uppercase tracking-[0.26em] text-white/72">
                  Reserve Favorites
                </p>
                <h3 className="mt-4 text-4xl font-black leading-[0.95]">{secondMeal.title}</h3>
                <p className="mt-4 max-w-sm text-sm leading-7 text-white/78">
                  {secondMeal.description}
                </p>
              </div>

              <div className="absolute bottom-8 left-6 rounded-full bg-[var(--reserve-gold-500)] px-5 py-3 text-sm font-semibold text-[var(--reserve-green-950)]">
                {getMealStatusLabel(secondMeal.status)}
              </div>
            </article>
          ) : null}
        </div>

        <div className="grid gap-4 lg:order-2">
          {featuredMeal ? (
            <article className="relative overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(242,49,32,0.86)_0%,rgba(139,83,43,0.92)_46%,var(--ink)_100%)] p-6 text-[var(--reserve-cream-100)] shadow-[0_25px_60px_rgba(70,26,15,0.24)]">
              <div className="max-w-[56%]">
                <p className="text-sm font-medium text-[var(--reserve-cream-100)]/84">
                  {featuredMeal.title}
                </p>
                <h3 className="mt-4 text-3xl font-black leading-none">
                  {featuredMeal.shortDescription}
                </h3>
                <p className="mt-4 text-sm text-[var(--reserve-cream-100)]/76">
                  {featuredMeal.description}
                </p>
                <Link
                  href={`/reserves/${featuredMeal.slug}`}
                  className="mt-6 inline-flex rounded-full bg-[var(--reserve-cream-100)] px-4 py-2 text-sm font-semibold text-[var(--ink)]"
                >
                  Order Now
                </Link>
              </div>
              <div className="absolute bottom-0 right-0 flex h-full w-[44%] items-end justify-center bg-[radial-gradient(circle_at_30%_30%,rgba(255,255,255,0.16),transparent_20%)]">
                <div className="mb-5 h-40 w-40 rounded-full bg-[radial-gradient(circle_at_40%_30%,var(--reserve-cream-100)_0%,rgba(242,49,32,0.7)_42%,var(--reserve-brown-600)_100%)] shadow-2xl" />
              </div>
              <div className="absolute right-5 top-5 rounded-[1.4rem] bg-white/12 px-4 py-3 text-right backdrop-blur">
                <p className="text-sm font-medium text-[var(--reserve-cream-100)]/78">From</p>
                <p className="text-4xl font-black leading-none">
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
