import { BookingSuite } from "@/components/booking-suite";
import { HomeAboutSection } from "@/components/home-about-section";
import { HomeHero } from "@/components/home-hero";
import { HomePromoGrid } from "@/components/home-promo-grid";
import { HomeQuickActions } from "@/components/home-quick-actions";
import { HomeStoriesSection } from "@/components/home-stories-section";
import { HomeTopPicks } from "@/components/home-top-picks";
import { MotionReveal } from "@/components/motion-reveal";
import { SiteHeader } from "@/components/site-header";
import { listReserveListings } from "@/lib/reserves";

export default async function HomePage() {
  const listings = await listReserveListings();
  const meals = listings.filter((listing) => listing.type === "meal");
  const apartments = listings.filter((listing) => listing.type === "apartment");

  const featuredMeal = meals[0] ?? null;
  const secondMeal = meals[1] ?? null;
  const featuredApartment = apartments[0] ?? null;

  const staysFeatured = apartments.filter((listing) => listing.featured);
  const mealsFeatured = meals.filter((listing) => listing.featured);
  const stayPicks = (staysFeatured.length > 0 ? staysFeatured : apartments).slice(0, 2);
  const mealPicks = (mealsFeatured.length > 0 ? mealsFeatured : meals).slice(0, 3);

  const mealCount = meals.length;
  const apartmentCount = apartments.length;
  const availableMealCount = meals.filter((listing) => listing.status !== "unavailable").length;

  return (
    <main className="grain pb-20 text-[var(--ink)]">
      <section>
        <div className="reserve-pattern-bg reserve-pattern-light mx-auto max-w-[1500px] overflow-hidden bg-[var(--reserve-ink-green-700)] hero-shell text-white">
          <div className="absolute inset-0 bg-[rgba(7,14,10,0.48)] backdrop-blur-sm" />
          <SiteHeader availableMealCount={availableMealCount} />
          <HomeHero featuredMeal={featuredMeal} mealCount={mealCount} apartmentCount={apartmentCount} />
        </div>
      </section>

      <MotionReveal delay={40}>
        <HomePromoGrid
          featuredMeal={featuredMeal}
          secondMeal={secondMeal}
          featuredApartment={featuredApartment}
        />
      </MotionReveal>

      <MotionReveal delay={55}>
        <HomeQuickActions />
      </MotionReveal>

      <MotionReveal delay={70}>
        <HomeTopPicks stayListings={stayPicks} mealListings={mealPicks} />
      </MotionReveal>

      <MotionReveal delay={90}>
        <HomeStoriesSection />
      </MotionReveal>

      <MotionReveal delay={110}>
        <HomeAboutSection />
      </MotionReveal>

      <MotionReveal delay={130}>
        <section id="reserve" className="mt-16 max-w-[1500px] px-6 sm:px-8 lg:px-12">
          <div className="reserve-pattern-bg reserve-pattern-light overflow-hidden rounded-[2.5rem] bg-[var(--reserve-ink-green-800)] px-5 py-10 text-white shadow-[0_30px_80px_rgba(17,17,17,0.2)] sm:px-8 lg:px-10">
            <div className="max-w-3xl">
              <p className="text-sm uppercase tracking-[0.32em] text-[var(--reserve-gold-400)]">Plan with Reserve</p>
              <h2 className="mt-4 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.03em] sm:text-4xl md:text-5xl">
                Reservations, deliveries, and direct messages — one guided flow
              </h2>
              <p className="mt-5 text-sm leading-relaxed text-white/76 sm:text-base">
                Share what you need in three short steps. The team confirms availability, timing, and next actions for
                stays, dining, and special requests.
              </p>
            </div>

            <div className="mt-10">
              <BookingSuite />
            </div>
          </div>
        </section>
      </MotionReveal>
    </main>
  );
}
