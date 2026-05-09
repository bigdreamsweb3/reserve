import Image from "next/image";
import { ChevronRight, Star } from "lucide-react";

import { formatNaira, type ReserveListing } from "@/lib/reserves";
import { getListingVisualClass } from "@/lib/listing-presentation";

export function HomeFlashDeals({ listings }: { listings: ReserveListing[] }) {
  return (
    <section id="deals" className="mt-16 max-w-[1500px] px-6 sm:px-8 lg:px-12">
      <div className="">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--reserve-gold-500)]">
              Flash Deals
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Reserve deals worth grabbing now
            </h2>
          </div>
          <a
            href="/meals"
            className="inline-flex items-center gap-2 text-sm font-semibold text-[var(--reserve-green-800)]"
          >
            Order from menu
            <ChevronRight className="h-4 w-4" />
          </a>
        </div>

        <div className="mt-8 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {listings.map((listing, index) => (
            <article
              key={listing.id}
              className="rounded-[1.9rem] border border-black/5 bg-[var(--reserve-cream-100)] p-5 shadow-[0_18px_42px_rgba(30,22,14,0.06)]"
            >
              <div className="mb-4 inline-flex rounded-full bg-[var(--reserve-gold-400)] px-2.5 py-1 text-[11px] font-semibold text-[var(--reserve-brown-700)]">
                {listing.status === "unavailable" ? "Sold out" : `${70 - index * 5}% off`}
              </div>

              <div className="relative h-36 overflow-hidden rounded-[1.5rem] bg-[var(--reserve-cream-200)]">
                {listing.imageUrl ? (
                  <Image src={listing.imageUrl} alt={listing.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
                ) : (
                  <div className={getListingVisualClass(listing.imageTone)} />
                )}
              </div>

              <h3 className="mt-4 text-lg font-semibold text-[#111]">{listing.title}</h3>
              <div className="mt-2 flex items-center gap-2 text-sm text-[#666]">
                <Star className="h-3.5 w-3.5 fill-[var(--reserve-gold-500)] text-[var(--reserve-gold-500)]" />
                4.{8 - (index % 2)}
              </div>

              <div className="mt-4 flex items-center justify-between">
                <div>
                  <p className="text-xl font-black">{formatNaira(listing.priceNgn)}</p>
                  <p className="text-xs text-[#837b73] line-through">
                    {formatNaira(listing.priceNgn + 3500)}
                  </p>
                </div>

                <div className="flex items-center gap-2 rounded-full border border-[var(--reserve-cream-200)] px-3 py-2 text-sm text-[#333]">
                  <span>-</span>
                  <span>1</span>
                  <span>+</span>
                </div>
              </div>

              <a
                href={`/reserves/${listing.slug}`}
                className="mt-5 inline-flex w-full items-center justify-center rounded-full bg-[var(--reserve-green-800)] px-4 py-3 text-sm font-semibold text-white transition hover:bg-[var(--reserve-green-700)]"
              >
                {listing.status === "unavailable" ? "View item" : "Add to cart"}
              </a>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
