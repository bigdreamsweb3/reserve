import { ReserveCard } from "@/components/reserve-card";
import { SiteHeader } from "@/components/site-header";
import { listReserveListings } from "@/lib/reserves";

export default async function MealsPage() {
  const listings = await listReserveListings();
  const meals = listings
    .filter((listing) => listing.type === "meal")
    .sort((left, right) => {
      if (left.status === right.status) {
        return Number(right.featured) - Number(left.featured);
      }

      if (left.status === "available") {
        return -1;
      }

      if (right.status === "available") {
        return 1;
      }

      return 0;
    });

  return (
    <main className="grain pb-24">
      <section className="pt-0">
        <div className="hero-shell overflow-hidden">
          <SiteHeader />
          <div className="mx-auto px-6 pb-12 pt-6 lg:px-10">
            <p className="eyebrow">Reserve Meals</p>
            <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-5xl leading-none sm:text-6xl">
              Order meals and reserve dining from the Reserve restaurant.
            </h1>
            <p className="text-hero-soft mt-5 max-w-2xl text-sm leading-7 sm:text-base">
              Reserve Restaurant exists to provide satisfying, high-quality meals at affordable prices in a clean and welcoming atmosphere. Browse the food catalog and order what is available today.
            </p>
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 px-5 lg:px-8">
        <div className="section-shell rounded-[2rem] px-6 py-10 sm:px-8 lg:px-12">
          <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
            {meals.map((listing) => (
              <ReserveCard key={listing.id} listing={listing} />
            ))}
          </div>
        </div>
      </section>
    </main>
  );
}
