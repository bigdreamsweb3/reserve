import { Bike, House, MapPin } from "lucide-react";

import { MotionReveal } from "@/components/motion-reveal";

export function HomeAboutSection() {
  return (
    <section id="about" className="mt-16 max-w-[1500px] px-6 sm:px-8 lg:px-12">
      <div className="reserve-pattern-bg reserve-pattern-dark overflow-hidden ">
        <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr]">
          <div>
            <p className="text-sm uppercase tracking-[0.32em] text-[var(--reserve-gold-500)]">
              About Reserve
            </p>
            <h2 className="mt-3 text-4xl font-black tracking-[-0.04em] sm:text-5xl">
              Food-first hospitality with apartments built into the brand.
            </h2>
            <p className="mt-5 max-w-xl text-sm leading-7 text-[var(--ink-soft)]">
              Reserve Restaurant was founded to provide satisfying, high-quality meals at
              fair prices in a clean and welcoming atmosphere. That same dependable service
              now extends into the Reserve apartments, so guests can order, dine, and stay
              in one connected destination.
            </p>
          </div>

          <div className="grid gap-5 md:grid-cols-3">
            <MotionReveal delay={40}>
              <div className="premium-card rounded-[1.8rem] bg-[var(--reserve-cream-100)] p-6">
                <MapPin className="h-5 w-5 text-[var(--reserve-green-800)]" />
                <h3 className="mt-4 text-2xl font-bold">Awka Book Foundation</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                  Reserve serves guests, families, students, and professionals from Anambra
                  State, Nigeria.
                </p>
              </div>
            </MotionReveal>
            <MotionReveal delay={110}>
              <div className="premium-card rounded-[1.8rem] bg-[var(--reserve-cream-100)] p-6">
                <Bike className="h-5 w-5 text-[var(--reserve-green-800)]" />
                <h3 className="mt-4 text-2xl font-bold">Quick Ordering</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                  Meals, drinks, and quick bites are easy to browse and order from the Reserve
                  kitchen.
                </p>
              </div>
            </MotionReveal>
            <MotionReveal delay={180}>
              <div className="premium-card rounded-[1.8rem] bg-[var(--reserve-cream-100)] p-6">
                <House className="h-5 w-5 text-[var(--reserve-green-800)]" />
                <h3 className="mt-4 text-2xl font-bold">Comfortable Stays</h3>
                <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                  Apartments remain part of the Reserve experience for guests who want
                  hospitality beyond the table.
                </p>
              </div>
            </MotionReveal>
          </div>
        </div>
      </div>
    </section>
  );
}
