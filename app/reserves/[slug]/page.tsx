import Image from "next/image";
import { notFound } from "next/navigation";

import { ListingBookingForm } from "@/components/listing-booking-form";
import { SiteHeader } from "@/components/site-header";
import { formatNaira, getReserveListingBySlug } from "@/lib/reserves";

export default async function ReserveDetailPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const listing = await getReserveListingBySlug(slug);

  if (!listing) {
    notFound();
  }

  const backHref = listing.type === "meal" ? "/meals" : "/apartments";
  const backLabel = listing.type === "meal" ? "Back to meals" : "Back to apartments";
  const capacityLabel = listing.type === "meal" ? "seating capacity" : "guest capacity";
  const canSubmitOrder = listing.status !== "unavailable";

  return (
    <main className="grain pb-24">
      <section className="pt-0">
        <div className="hero-shell overflow-hidden">
          <SiteHeader />
          <div className="mx-auto grid gap-10 px-6 pb-12 pt-6 lg:grid-cols-[1.05fr_0.95fr] lg:px-10">
            <div>
              <a href={backHref} className="text-hero-soft text-sm">
                {"<-"} {backLabel}
              </a>
              <p className="eyebrow mt-6 capitalize">{listing.type}</p>
              <h1 className="mt-4 max-w-2xl font-[family-name:var(--font-heading)] text-6xl leading-none">
                {listing.title}
              </h1>
              <p className="text-hero-soft mt-5 max-w-2xl text-base leading-8">
                {listing.description}
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                {listing.amenities.map((amenity) => (
                  <span key={amenity} className="dark-card rounded-full px-4 py-2 text-sm">
                    {amenity}
                  </span>
                ))}
              </div>

              <div className="mt-10 grid gap-4 sm:grid-cols-3">
                <div className="stat-card rounded-[1.35rem] px-4 py-5">
                  <div className="font-[family-name:var(--font-heading)] text-4xl">
                    {formatNaira(listing.priceNgn)}
                  </div>
                  <p className="text-hero-muted mt-2 text-xs leading-5">per {listing.billingPeriod}</p>
                </div>
                <div className="stat-card rounded-[1.35rem] px-4 py-5">
                  <div className="font-[family-name:var(--font-heading)] text-4xl">{listing.capacity}</div>
                  <p className="text-hero-muted mt-2 text-xs leading-5">{capacityLabel}</p>
                </div>
                <div className="stat-card rounded-[1.35rem] px-4 py-5">
                  <div className="font-[family-name:var(--font-heading)] text-3xl capitalize">
                    {listing.status}
                  </div>
                  <p className="text-hero-muted mt-2 text-xs leading-5">current availability</p>
                </div>
              </div>
            </div>

            <div className="grid gap-6">
              <div className="relative h-[420px] overflow-hidden rounded-[2rem]">
                {listing.imageUrl ? (
                  <Image src={listing.imageUrl} alt={listing.title} fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" />
                ) : (
                  <div className={`h-full w-full ${listing.imageTone}`} />
                )}
              </div>
              {canSubmitOrder ? (
                <ListingBookingForm
                  listingId={listing.id}
                  listingTitle={listing.title}
                  listingType={listing.type}
                  defaultGuests={Math.min(listing.capacity, 2)}
                />
              ) : (
                <div className="panel rounded-[2rem] p-6 sm:p-8">
                  <p className="eyebrow">Not Available</p>
                  <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-white">
                    This item is currently unavailable
                  </h3>
                  <p className="mt-4 text-sm leading-7 text-[var(--muted)]">
                    The Reserve team has marked this {listing.type} as unavailable for now. Please check back later or contact the team for alternatives.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
