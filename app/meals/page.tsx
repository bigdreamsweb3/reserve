import { ReserveCard } from "@/components/reserve-card";
import { SiteHeader } from "@/components/site-header";
import { MEAL_CATEGORY_OPTIONS, mealCategoryLabel, mealCategorySortRank } from "@/lib/meal-categories";
import { listReserveListings, type ReserveListing } from "@/lib/reserves";

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

  const grouped = new Map<string, ReserveListing[]>();
  for (const meal of meals) {
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
              Order meals and reserve dining from the Reserve restaurant.
            </h1>
            <p className="text-hero-soft mt-5 max-w-2xl text-sm leading-7 sm:text-base">
              Reserve Restaurant exists to provide satisfying, high-quality meals at affordable prices in a clean and welcoming atmosphere. Browse by category, build your cart, and check out once.
            </p>

            {categoryKeys.length > 0 ? (
              <div className="mt-8 flex flex-wrap gap-2">
                {categoryKeys.map((key) => (
                  <a
                    key={key}
                    href={`#menu-${key}`}
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
        <div className="section-shell rounded-[2rem] px-6 py-10 sm:px-8 lg:px-12">
          {meals.length === 0 ? (
            <p className="text-sm text-[#6b6259]">No meals are live yet. Check back soon.</p>
          ) : (
            <div className="space-y-14">
              {categoryKeys.map((categoryKey) => (
                <div key={categoryKey} id={`menu-${categoryKey}`} className="scroll-mt-28">
                  <div className="mb-6 flex flex-wrap items-end justify-between gap-4 border-b border-black/8 pb-4">
                    <div>
                      <p className="text-xs uppercase tracking-[0.28em] text-[#8b532b]">Menu</p>
                      <h2 className="mt-2 font-[family-name:var(--font-heading)] text-3xl text-[#111] sm:text-4xl">
                        {mealCategoryLabel(categoryKey)}
                      </h2>
                    </div>
                    <p className="max-w-md text-sm text-[#6b6259]">
                      {categoryKey === "rice-dishes"
                        ? "Fried rice, jollof, and other rice-forward plates stay together for easier browsing."
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
          Categories you can assign in admin:{" "}
          {MEAL_CATEGORY_OPTIONS.map((item) => item.label).join(" · ")}.
        </p>
      </section>
    </main>
  );
}
