import Image from "next/image";
import { ChevronRight, Clock3, House, Plus, ShoppingBag, Star } from "lucide-react";

import { MotionReveal } from "@/components/motion-reveal";
import { formatNaira, type ReserveListing } from "@/lib/reserves";
import { getListingVisualClass, getMealStatusLabel } from "@/lib/listing-presentation";

export function HomeTopPicks({ listings }: { listings: ReserveListing[] }) {
  return (
    <section id="menu" className="mt-16 max-w-[1500px] px-6 sm:px-8 lg:px-12">
      <div className="py-10">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--reserve-gold-500)]">
              Our Top Picks
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] text-[#101010] sm:text-5xl">
              Reserve favorites for meals and stays
            </h2>
          </div>
          <a
            href="/meals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--reserve-green-800)]"
          >
            View all picks
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {listings.map((listing, index) => (
            <MotionReveal key={listing.id} delay={index * 70}>
              <article className="premium-card overflow-hidden rounded-[1.9rem] border border-black/5 bg-[var(--reserve-cream-100)] shadow-[0_18px_42px_rgba(30,22,14,0.06)]">
                <div className="relative h-60 overflow-hidden bg-[var(--reserve-cream-200)]">
                  {listing.imageUrl ? (
                    <Image
                      src={listing.imageUrl}
                      alt={listing.title}
                      fill
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      className="premium-image object-cover"
                    />
                  ) : (
                    <div className={getListingVisualClass(listing.imageTone)} />
                  )}
                  <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1a1a1a] shadow-sm">
                    <Star className="h-3.5 w-3.5 fill-[var(--reserve-gold-500)] text-[var(--reserve-gold-500)]" />
                    4.8
                  </div>
                </div>

                <div className="px-5 py-5">
                  <h3 className="text-xl font-semibold text-[#101010]">{listing.title}</h3>
                  <p className="mt-1 text-sm text-[#6b6259]">{listing.shortDescription}</p>

                  <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#6b6259]">
                    <span className="inline-flex items-center gap-1">
                      <Clock3 className="h-3.5 w-3.5" />
                      {listing.type === "meal"
                        ? getMealStatusLabel(listing.status)
                        : "Stay request"}
                    </span>
                    <span className="inline-flex items-center gap-1">
                      {listing.type === "meal" ? (
                        <ShoppingBag className="h-3.5 w-3.5" />
                      ) : (
                        <House className="h-3.5 w-3.5" />
                      )}
                      {listing.billingPeriod}
                    </span>
                  </div>

                  <div className="mt-5 flex items-center justify-between gap-4">
                    <div>
                      <p className="text-2xl font-black text-[#0f0f0f]">
                        {formatNaira(listing.priceNgn)}
                      </p>
                      <p className="text-xs uppercase tracking-[0.2em] text-[#7a7269]">
                        {listing.type === "meal" ? "Per order" : "Per night"}
                      </p>
                    </div>

                    <a
                      href={`/reserves/${listing.slug}`}
                      className="interactive-button flex h-11 w-11 items-center justify-center rounded-full bg-[var(--reserve-green-800)] text-white transition hover:bg-[var(--reserve-green-700)]"
                    >
                      <Plus className="h-4 w-4" />
                    </a>
                  </div>
                </div>
              </article>
            </MotionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
