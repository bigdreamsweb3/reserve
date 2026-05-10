import { Building2, CalendarDays, ShoppingBag, Utensils } from "lucide-react";

const actions = [
  {
    href: "/apartments",
    label: "Prepared stays",
    body: "Serviced apartments with the Reserve standard of comfort.",
    icon: Building2,
  },
  {
    href: "/meals",
    label: "Home-style meals",
    body: "Kitchen-led plates, drinks, and add-ons for dine-in or pickup.",
    icon: Utensils,
  },
  {
    href: "/cart",
    label: "Meal checkout",
    body: "Review your cart and send one order to the team.",
    icon: ShoppingBag,
  },
  {
    href: "#reserve",
    label: "Services & plans",
    body: "Reservations, deliveries, and special requests in one form.",
    icon: CalendarDays,
  },
] as const;

export function HomeQuickActions() {
  return (
    <section className="mx-auto mt-12 max-w-[1500px] px-6 sm:px-8 lg:px-12">
      <div className="mb-8 max-w-2xl">
        <p className="text-sm uppercase tracking-[0.28em] text-[var(--reserve-gold-500)]">How can we help</p>
        <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.03em] text-[var(--ink)] sm:text-4xl">
          Stays, dining, and requests — clearly separated
        </h2>
        <p className="mt-3 text-sm leading-relaxed text-[var(--ink-soft)] sm:text-base">
          Choose a path that matches what you need. Each destination uses the same trusted Reserve experience.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {actions.map((item) => {
          const Icon = item.icon;
          return (
            <a
              key={item.href}
              href={item.href}
              className="quick-action-tile flex flex-col rounded-[1.5rem] p-5 no-underline"
            >
              <span className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[var(--reserve-cream-200)] text-[var(--reserve-green-800)]">
                <Icon className="h-5 w-5" strokeWidth={1.75} aria-hidden />
              </span>
              <span className="mt-4 font-[family-name:var(--font-heading)] text-lg font-semibold text-[var(--ink)]">
                {item.label}
              </span>
              <span className="mt-2 text-sm leading-relaxed text-[var(--ink-soft)]">{item.body}</span>
              <span className="mt-4 text-sm font-semibold text-[var(--reserve-green-800)]">Continue</span>
            </a>
          );
        })}
      </div>
    </section>
  );
}
