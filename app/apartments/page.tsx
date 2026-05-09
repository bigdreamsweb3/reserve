import { ReserveCard } from "@/components/reserve-card";
import { SiteHeader } from "@/components/site-header";
import { listReserveListings } from "@/lib/reserves";

export default async function ApartmentsPage() {
  const listings = await listReserveListings();
  const apartments = listings.filter((listing) => listing.type === "apartment");

  return (
    <main className="grain pb-24">
      <section className="pt-0">
        <div className="hero-shell overflow-hidden">
          <SiteHeader />
          <div className="mx-auto px-6 pb-12 pt-6 lg:px-10">
            <p className="eyebrow">Reserve Apartments</p>
            <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-5xl leading-none sm:text-6xl">
              Book serviced apartments inside the Reserve building.
            </h1>
            <p className="text-hero-soft mt-5 max-w-2xl text-sm leading-7 sm:text-base">
              Explore apartment stays designed for short visits, longer bookings, and guests who want comfort with restaurant access close by.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 px-5 lg:px-8">
        <div className="section-shell rounded-[2rem] px-6 py-10 sm:px-8 lg:px-12">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {apartments.map((listing) => (
              <ReserveCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
