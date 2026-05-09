import Image from "next/image";
import Link from "next/link";
import { Clock3, House, ShoppingBag, Star } from "lucide-react";

import { formatNaira, type ReserveListing } from "@/lib/reserves";
import {
  getAvailabilityClass,
  getAvailabilityLabel,
  getListingVisualClass,
  getMealStatusLabel,
} from "@/lib/listing-presentation";

export function ReserveCard({ listing }: { listing: ReserveListing }) {
  const isUnavailable = listing.status === "unavailable";
  const ctaLabel = isUnavailable
    ? "Not available"
    : listing.type === "meal"
      ? "View meal"
      : "View apartment";

  return (
    <article className="overflow-hidden rounded-[1.9rem] border border-black/5 bg-[var(--reserve-cream-100)] shadow-[0_18px_42px_rgba(30,22,14,0.06)] transition duration-300 hover:-translate-y-1">
      <div className="relative h-60 overflow-hidden bg-[var(--reserve-cream-200)]">
        {listing.imageUrl ? (
          <Image src={listing.imageUrl} alt={listing.title} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
        ) : (
          <div className={getListingVisualClass(listing.imageTone)} />
        )}
        <div className="absolute right-4 top-4 inline-flex items-center gap-1 rounded-full bg-white px-3 py-1 text-xs font-semibold text-[#1a1a1a] shadow-sm">
          <Star className="h-3.5 w-3.5 fill-[var(--reserve-gold-500)] text-[var(--reserve-gold-500)]" />
          4.8
        </div>
      </div>

      <div className="px-5 py-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-xl font-semibold text-[#101010]">{listing.title}</h3>
            <p className="mt-1 text-sm text-[#6b6259]">{listing.shortDescription}</p>
          </div>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getAvailabilityClass(listing.status)}`}
          >
            {getAvailabilityLabel(listing)}
          </span>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-3 text-xs text-[#6b6259]">
          <span className="inline-flex items-center gap-1">
            <Clock3 className="h-3.5 w-3.5" />
            {listing.type === "meal" ? getMealStatusLabel(listing.status) : "Stay request"}
          </span>
          <span className="inline-flex items-center gap-1">
            {listing.type === "meal" ? (
              <ShoppingBag className="h-3.5 w-3.5" />
            ) : (
              <House className="h-3.5 w-3.5" />
            )}
            {listing.billingPeriod}
          </span>
          <span className="inline-flex items-center gap-1">{listing.location}</span>
        </div>

        <div className="mt-5 flex items-center justify-between gap-4">
          <div>
            <p className="text-2xl font-black text-[#0f0f0f]">{formatNaira(listing.priceNgn)}</p>
            <p className="text-xs uppercase tracking-[0.2em] text-[#7a7269]">
              {listing.type === "meal" ? "Per order" : "Per night"}
            </p>
          </div>
          {isUnavailable ? (
            <span className="rounded-full border border-black/8 bg-white px-4 py-2 text-sm font-semibold text-[#6b6259]">
              {ctaLabel}
            </span>
          ) : (
            <Link
              href={`/reserves/${listing.slug}`}
              className="rounded-full bg-[var(--reserve-green-800)] px-4 py-2 text-sm font-semibold text-white transition hover:bg-[var(--reserve-green-700)]"
            >
              {ctaLabel}
            </Link>
          )}
        </div>
      </div>
    </article>
  );
}
