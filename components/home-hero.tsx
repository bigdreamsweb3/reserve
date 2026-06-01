import Image from "next/image";
import Link from "next/link";
import { ChevronRight } from "lucide-react";

import { HeroCurveNav } from "@/components/hero-curve-nav";
import type { ReserveListing } from "@/lib/reserves";

type HomeHeroProps = {
  featuredMeal: ReserveListing | null;
  mealCount: number;
  apartmentCount: number;
};

export function HomeHero({ featuredMeal, mealCount, apartmentCount }: HomeHeroProps) {
  return (
    <div
      id="home"
      className="grid min-h-[calc(100svh-92px)] items-center gap-10 px-5 py-8 sm:min-h-[calc(100svh-84px)] sm:px-8 lg:grid-cols-[0.9fr_1.1fr] lg:gap-12 lg:px-10 lg:py-12"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.04), transparent 18%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.035), transparent 20%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.03), transparent 18%)",
      }}
    >
      <div className="flex flex-col justify-center gap-8 lg:py-6">
        <div>
          <p className="hero-copy-enter hero-copy-enter-1 text-sm uppercase tracking-[0.32em] text-[var(--reserve-gold-400)]">
            Reserve - Awka
          </p>
          <h1 className="hero-copy-enter hero-copy-enter-2 mt-5 max-w-xl font-[family-name:var(--font-heading)] text-4xl font-semibold leading-[1.02] tracking-[-0.04em] text-[var(--reserve-cream-100)] sm:text-5xl lg:text-6xl">
            A calm place to stay, dine, and plan what comes next.
          </h1>
          <p className="hero-copy-enter hero-copy-enter-3 mt-6 max-w-md text-sm leading-relaxed text-[rgba(239,228,212,0.78)] sm:text-base">
            Book prepared apartments, order home-style meals, and reach the team for deliveries or special requests -
            one modern hospitality flow, built for real life in Anambra State.
          </p>

          <div className="hero-copy-enter hero-copy-enter-4 mt-6 flex flex-wrap gap-3 text-xs text-[rgba(239,228,212,0.72)]">
            <span className="rounded-full border border-[rgba(248,242,232,0.14)] px-3 py-1">
              {apartmentCount} stay{apartmentCount === 1 ? "" : "s"} live
            </span>
            <span className="rounded-full border border-[rgba(248,242,232,0.14)] px-3 py-1">
              {mealCount} menu item{mealCount === 1 ? "" : "s"}
            </span>
            {featuredMeal ? (
              <span className="rounded-full border border-[rgba(248,242,232,0.14)] px-3 py-1">
                Spotlight: {featuredMeal.title}
              </span>
            ) : null}
          </div>

          <div className="hero-copy-enter hero-copy-enter-4 mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            <Link
              href="/apartments"
              className="interactive-button inline-flex items-center justify-center rounded-full bg-[var(--reserve-gold-500)] px-6 py-3 text-sm font-semibold text-[var(--reserve-green-950)] transition hover:bg-[var(--reserve-gold-400)]"
            >
              Book a stay
            </Link>
            <Link
              href="/meals"
              className="interactive-button inline-flex items-center justify-center rounded-full border border-[rgba(248,242,232,0.16)] px-6 py-3 text-sm font-medium text-[rgba(248,242,232,0.84)] transition hover:border-[var(--reserve-gold-400)] hover:bg-[rgba(248,242,232,0.06)] hover:text-[var(--reserve-gold-400)]"
            >
              Explore the menu
            </Link>
            <Link
              href="/cart"
              className="interactive-button inline-flex items-center justify-center gap-1 rounded-full border border-transparent px-6 py-3 text-sm font-medium text-[var(--reserve-gold-400)] underline-offset-4 transition hover:underline"
            >
              Meal cart
              <ChevronRight className="h-4 w-4" aria-hidden />
            </Link>
          </div>
        </div>
      </div>

      <div className="relative min-h-[430px] self-center sm:min-h-[520px] lg:min-h-[590px]">
        <figure className="hero-visual-enter relative h-[430px] overflow-hidden rounded-[2rem] border border-[rgba(248,242,232,0.14)] bg-[var(--reserve-ink-green-900)] shadow-[0_34px_96px_rgba(0,0,0,0.36)] sm:h-[520px] lg:h-[590px]">
          <Image
            src="/celebrity_flex/blord-paying-counter.jpeg"
            alt="B-Lord at the Reserve counter"
            fill
            priority
            loading="eager"
            sizes="(min-width: 1024px) 58vw, 100vw"
            className="object-cover object-[58%_50%]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,rgba(17,17,17,0.56)_0%,rgba(17,17,17,0.16)_34%,transparent_70%),linear-gradient(180deg,transparent_48%,rgba(17,17,17,0.46)_100%)]" />
        </figure>

        <div className="absolute inset-x-4 bottom-4 z-20 sm:inset-x-auto sm:bottom-5 sm:left-5">
          <HeroCurveNav />
        </div>

        <div className="hero-copy-enter hero-copy-enter-4 absolute bottom-4 right-4 z-20 sm:bottom-5 sm:right-5">
          <a
            href="#menu"
            className="interactive-button hidden h-12 w-12 items-center justify-center rounded-full border border-[rgba(248,242,232,0.18)] bg-[rgba(17,17,17,0.58)] text-[rgba(248,242,232,0.9)] shadow-[0_14px_34px_rgba(0,0,0,0.24)] backdrop-blur transition hover:border-[var(--reserve-gold-400)] hover:bg-[rgba(17,17,17,0.72)] hover:text-[var(--reserve-gold-400)] sm:flex"
            aria-label="Scroll to curated picks"
          >
            <ChevronRight className="h-5 w-5 rotate-90" aria-hidden />
          </a>
        </div>
      </div>
    </div>
  );
}
