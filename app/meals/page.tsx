import { ReserveCard } from "@/components/reserve-card";
import { SiteHeader } from "@/components/site-header";
import {
  MEAL_CATEGORY_OPTIONS,
  MEAL_PACKAGE_OPTIONS,
  mealCategoryLabel,
  mealCategorySortRank,
  mealPackageLabel,
} from "@/lib/meal-categories";
import { listReserveListings, type ReserveListing } from "@/lib/reserves";

export default async function MealsPage({
  searchParams,
}: {
  searchParams?: Promise<{ package?: string }>;
}) {
  const params = searchParams ? await searchParams : {};
  const requestedPackage = params.package;
  const selectedPackage = MEAL_PACKAGE_OPTIONS.some((item) => item.value === requestedPackage)
    ? requestedPackage!
    : "flexi";

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

  const hasPackagedMeals = meals.some((meal) => meal.mealPackage);
  const visibleMeals = meals.filter((meal) => {
    if (!hasPackagedMeals) {
      return true;
    }

    return meal.mealPackage === selectedPackage || meal.mealCategory === "drinks";
  });

  const grouped = new Map<string, ReserveListing[]>();
  for (const meal of visibleMeals) {
    const key = meal.mealCategory?.trim() || "other";
    if (!grouped.has(key)) {
      grouped.set(key, []);
    }

    grouped.get(key)!.push(meal);
  }

  const categoryKeys = [...grouped.keys()].sort(
    (left, right) => mealCategorySortRank(left) - mealCategorySortRank(right),
  );

  return (
    <main className="grain pb-24">
      <section className="pt-0">
        <div className="hero-shell overflow-hidden">
          <SiteHeader />
          <div className="mx-auto px-6 pb-12 pt-6 lg:px-10">
            <p className="eyebrow">Reserve Meals</p>
            <h1 className="mt-4 max-w-3xl font-[family-name:var(--font-heading)] text-5xl leading-none sm:text-6xl">
              Order meals by package from the Reserve restaurant.
            </h1>
            <p className="text-hero-soft mt-5 max-w-2xl text-sm leading-7 sm:text-base">
              Browse Flexi, Standard, and Executive packages by category, then build your cart and check out once.
            </p>

            {categoryKeys.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {categoryKeys.map((key) => (
                  <a
                    key={key}
                    href={`/meals?package=${selectedPackage}#menu-${key}`}
                    className="rounded-full border border-[rgba(248,242,232,0.2)] bg-[rgba(248,242,232,0.06)] px-4 py-2 text-xs font-semibold text-[rgba(248,242,232,0.88)] transition hover:border-[var(--reserve-gold-400)] hover:text-[var(--reserve-gold-400)]"
                  >
                    {mealCategoryLabel(key)}
                  </a>
                ))}
                <a
                  href="/cart"
                  className="rounded-full bg-[var(--reserve-gold-500)] px-4 py-2 text-xs font-semibold text-[var(--reserve-green-950)] transition hover:bg-[var(--reserve-gold-400)]"
                >
                  Open cart
                </a>
              </div>
            ) : null}
          </div>
        </div>
      </section>

      <section className="mx-auto mt-10 px-5 lg:px-8">
        <div className="sticky top-0 z-20 -mx-5 border-b border-black/8 bg-[rgba(246,241,234,0.92)] px-5 py-3 backdrop-blur lg:-mx-8 lg:px-8">
          <div className="mx-auto flex max-w-7xl flex-col gap-3">
            <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Meal packages">
              {MEAL_PACKAGE_OPTIONS.map((item) => {
                const active = item.value === selectedPackage;

                return (
                  <a
                    key={item.value}
                    href={`/meals?package=${item.value}`}
                    className={`shrink-0 rounded-full px-4 py-2 text-sm font-semibold transition ${
                      active
                        ? "bg-[var(--reserve-green-800)] text-white"
                        : "border border-black/10 bg-white/70 text-[var(--ink)] hover:border-[var(--reserve-green-800)]"
                    }`}
                  >
                    {item.label}
                  </a>
                );
              })}
            </nav>
            {categoryKeys.length > 0 ? (
              <nav className="flex gap-2 overflow-x-auto pb-1" aria-label="Meal categories">
                {categoryKeys.map((key) => (
                  <a
                    key={key}
                    href={`/meals?package=${selectedPackage}#menu-${key}`}
                    className="shrink-0 rounded-full border border-black/10 bg-[var(--reserve-cream-100)] px-3 py-1.5 text-xs font-semibold text-[var(--ink-soft)] transition hover:border-[var(--reserve-brown-600)] hover:text-[var(--reserve-brown-600)]"
                  >
                    {mealCategoryLabel(key)}
                  </a>
                ))}
              </nav>
            ) : null}
          </div>
        </div>

        <div className="section-shell rounded-[2rem] px-6 py-10 sm:px-8 lg:px-12">
          {visibleMeals.length === 0 ? (
            <p className="text-sm text-[#6b6259]">
              No meals are live yet for {mealPackageLabel(selectedPackage)}. Check back soon.
            </p>
          ) : (
            <div className="space-y-14">
              {categoryKeys.map((categoryKey) => (
                <div key={categoryKey} id={`menu-${categoryKey}`} className="scroll-mt-36">
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-black/8 pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-[#8b532b]">Menu</p>
                      <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl text-[#111] sm:text-4xl">
                        {mealCategoryLabel(categoryKey)}
                      </h2>
                      <p className="mt-1 text-sm font-semibold text-[#8b532b]">
                        {categoryKey === "drinks" ? "Available with every package" : mealPackageLabel(selectedPackage)}
                      </p>
                    </div>
                    <p className="max-w-md text-sm text-[#6b6259]">
                      {categoryKey === "rice-dishes"
                        ? "White rice, ofe akwu, jellof, fried rice, and other rice-forward plates stay together for easier browsing."
                        : categoryKey === "soups-stews"
                          ? "Soups are grouped by package so guests can quickly find the right plate."
                          : "Every dish is prepared in-house at Reserve, Awka."}
                    </p>
                  </div>
                  <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
                    {(grouped.get(categoryKey) ?? []).map((listing) => (
                      <ReserveCard key={listing.id} listing={listing} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="mx-auto mt-8 max-w-3xl px-5 text-center lg:px-8">
        <p className="text-xs text-[#6b6259]">
          Categories you can assign in admin: {MEAL_CATEGORY_OPTIONS.map((item) => item.label).join(" | ")}.
        </p>
      </section>
    </main>
  );
}
