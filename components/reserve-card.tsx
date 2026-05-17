import Image from "next/image";
import Link from "next/link";
import { ChevronRight, Clock3, House, ShoppingBag } from "lucide-react";

import { mealCategoryLabel, mealPackageLabel } from "@/lib/meal-categories";
import { formatNaira, type ReserveListing } from "@/lib/reserves";
import {
  getAvailabilityClass,
  getAvailabilityLabel,
  getListingVisualClass,
  getMealStatusLabel,
} from "@/lib/listing-presentation";

export function ReserveCard({ listing }: { listing: ReserveListing }) {
  const isUnavailable = listing.status === "unavailable";
  const isStay = listing.type === "apartment";
  const detailHref = `/reserves/${listing.slug}` as any;
  const primaryHref = (isStay ? `${detailHref}#book` : `${detailHref}#order`) as any;

  return (
    <article
      className={`group overflow-hidden rounded-[1.9rem] border border-black/5 bg-[var(--reserve-cream-100)] transition duration-300 hover:-translate-y-0.5 ${isStay ? "listing-card-stay" : "listing-card-meal"
        }`}
    >
      <div
        className={`relative h-60 overflow-hidden bg-[var(--reserve-cream-200)] ${isStay ? "listing-card-media-stay" : "listing-card-media-meal"
          }`}
      >
        {listing.imageUrl ? (
          <Image
            src={listing.imageUrl}
            alt={listing.title}
            fill
            sizes="(max-width: 768px) 100vw, 50vw"
            className="object-cover transition duration-500 group-hover:scale-[1.03]"
          />
        ) : (
          <div className={getListingVisualClass(listing.imageTone)} />
        )}
        <div className="absolute left-4 top-4 flex flex-wrap items-center gap-2">
          <span
            className={`rounded-full px-3 py-1 text-[10px] font-semibold uppercase tracking-[0.16em] ${isStay
                ? "bg-[var(--reserve-green-800)] text-[var(--reserve-cream-100)]"
                : "bg-[var(--reserve-brown-700)] text-[var(--reserve-cream-100)]"
              }`}
          >
            {isStay ? "Stay" : "Menu"}
          </span>
          <span
            className={`rounded-full px-3 py-1 text-xs font-medium ${getAvailabilityClass(listing.status)}`}
          >
            {getAvailabilityLabel(listing)}
          </span>
        </div>
      </div>

      <div className="px-5 pb-6 pt-5">
        <div className="min-h-[4.5rem]">
          {!isStay && listing.mealCategory ? (
            <p className="mb-1 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--reserve-brown-600)]">
              {mealCategoryLabel(listing.mealCategory)}
              {listing.mealPackage ? ` / ${mealPackageLabel(listing.mealPackage)}` : ""}
            </p>
          ) : null}
          <h3 className="font-[family-name:var(--font-heading)] text-xl font-semibold text-[var(--ink)]">
            {listing.title}
          </h3>
          <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-[var(--ink-soft)]">
            {listing.shortDescription}
          </p>
        </div>

        <div className="mt-4 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs text-[var(--ink-soft)]">
          <span className="inline-flex items-center gap-1.5">
            <Clock3 className="h-3.5 w-3.5 shrink-0 opacity-80" />
            {isStay ? "Flexible check-in" : getMealStatusLabel(listing.status)}
          </span>
          <span className="inline-flex items-center gap-1.5">
            {isStay ? (
              <House className="h-3.5 w-3.5 shrink-0 opacity-80" />
            ) : (
              <ShoppingBag className="h-3.5 w-3.5 shrink-0 opacity-80" />
            )}
            <span className="capitalize">{listing.billingPeriod}</span>
          </span>
        </div>

        <div className="mt-5 border-t border-black/5 pt-5">
          <div className="flex items-baseline justify-between gap-3">
            <div>
              <p className="font-[family-name:var(--font-heading)] text-2xl font-semibold text-[var(--ink)]">
                {formatNaira(listing.priceNgn)}
              </p>
              <p className="mt-0.5 text-[10px] font-semibold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                {isStay ? "Per night · taxes as quoted" : "Per portion · add-ons at checkout"}
              </p>
            </div>
          </div>

          <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-3">
            {isUnavailable ? (
              <span className="surface-chip rounded-full px-4 py-2.5 text-center text-sm font-semibold">
                Unavailable
              </span>
            ) : (
              <>
                <Link
                  href={primaryHref}
                  className={`interactive-button inline-flex flex-1 items-center justify-center rounded-full px-4 py-2.5 text-center text-sm font-semibold transition ${isStay
                      ? "bg-[var(--reserve-green-800)] text-white hover:bg-[var(--reserve-green-700)]"
                      : "bg-[var(--reserve-gold-500)] text-[var(--reserve-green-950)] hover:bg-[var(--reserve-gold-400)]"
                    }`}
                >
                  {isStay ? "Book this stay" : "Order now"}
                </Link>
                <Link
                  href={detailHref}
                  className="inline-flex flex-1 items-center justify-center gap-1 rounded-full border border-black/10 bg-white/80 px-4 py-2.5 text-sm font-semibold text-[var(--ink)] transition hover:border-[var(--reserve-green-800)] hover:text-[var(--reserve-green-800)]"
                >
                  {isStay ? "See details" : "View meal"}
                  <ChevronRight className="h-4 w-4 opacity-70" aria-hidden />
                </Link>
              </>
            )}
          </div>
        </div>
      </div>
    </article>
  );
}
