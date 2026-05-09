import Image from "next/image";
import { ChevronRight, Star } from "lucide-react";

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
      className="grid min-h-[calc(100svh-92px)] items-center gap-10 px-5 py-8 md:gap-0 sm:min-h-[calc(100svh-84px)] sm:px-8 lg:grid-cols-[1.02fr_0.98fr] lg:px-10 lg:py-10"
      style={{
        backgroundImage:
          "radial-gradient(circle at 20% 20%, rgba(255,255,255,0.04), transparent 18%), radial-gradient(circle at 80% 30%, rgba(255,255,255,0.035), transparent 20%), radial-gradient(circle at 50% 80%, rgba(255,255,255,0.03), transparent 18%)",
      }}
    >
      <div className="flex flex-col justify-center gap-8 lg:py-6">
        <div>
          <p className="hero-copy-enter hero-copy-enter-1 text-sm uppercase tracking-[0.32em] text-[var(--reserve-gold-400)]">
            Reserve Food & Stay
          </p>
          <h1 className="hero-copy-enter hero-copy-enter-2 mt-5 max-w-xl text-5xl font-black leading-[0.95] tracking-[-0.05em] text-[var(--reserve-cream-100)] sm:text-6xl lg:text-7xl">
            Delicious meals and comfortable stays.
          </h1>
          <p className="hero-copy-enter hero-copy-enter-3 mt-6 max-w-md text-sm leading-7 text-[rgba(239,228,212,0.78)] sm:text-base">
            Reserve serves quality meals, drinks, and apartment stays from Awka Book
            Foundation, making it easy to order food, enjoy the atmosphere, and stay close
            to the experience.
          </p>

          <div className="hero-copy-enter hero-copy-enter-4 mt-8 flex flex-col gap-4 sm:flex-row">
            <a
              href="/meals"
              className="interactive-button inline-flex items-center justify-center rounded-full bg-[var(--reserve-gold-500)] px-6 py-3 text-sm font-semibold text-[var(--reserve-green-950)] transition hover:bg-[var(--reserve-gold-400)]"
            >
              Get Started
            </a>
            <a
              href="/apartments"
              className="interactive-button inline-flex items-center justify-center rounded-full border border-[rgba(248,242,232,0.16)] px-6 py-3 text-sm font-medium text-[rgba(248,242,232,0.84)] transition hover:border-[var(--reserve-gold-400)] hover:bg-[rgba(248,242,232,0.06)] hover:text-[var(--reserve-gold-400)]"
            >
              Explore Apartments
            </a>
          </div>

        </div>
      </div>

      <div className="relative grid min-h-[420px] grid-cols-[0.95fr_1.05fr] items-center self-center sm:min-h-[500px] sm:grid-cols-[0.82fr_1.18fr] lg:min-h-[560px]">
        <div className="relative flex min-h-[340px] w-full items-center justify-start sm:min-h-[420px] lg:min-h-[500px]">
          <HeroCurveNav />
        </div>
        <div className="relative min-h-[340px] self-center sm:min-h-[440px] lg:min-h-[520px] translate-x-[6%] lg:translate-x-[10%] xl:translate-x-[14%]">
          <div className="hero-copy-enter hero-copy-enter-3 absolute left-[0%] top-1 z-10 px-2 py-2 text-center text-xs font-semibold text-[rgba(248,242,232,0.88)] sm:top-2 sm:px-3">
            <div className="flex items-center justify-center gap-1 text-[var(--reserve-gold-500)]">
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
              <Star className="h-3.5 w-3.5 fill-current" />
            </div>
            <p className="mt-1 max-w-[180px] text-[10px] leading-4 text-[rgba(239,228,212,0.8)] sm:max-w-[210px] sm:text-[11px]">
              Quality meals without the stress
            </p>
          </div>

          <div className="hero-visual-enter absolute right-[-10%] top-[16%] h-[340px] w-[340px] sm:right-[2%] sm:top-[14%] sm:h-[460px] sm:w-[460px] lg:right-[0%] lg:h-[520px] lg:w-[520px]">
            <Image
              src="/reserve-dish.png"
              alt="Reserve signature dish"
              fill
              priority
              loading="eager"
              sizes="(min-width: 640px) 360px, 280px"
              className="hero-float object-contain object-center drop-shadow-[0_25px_20px_rgba(17,17,17,0.34)]"
              style={{ borderRadius: "26% 26% 24% 24% / 18% 18% 22% 22%" }}
            />
          </div>



          <div className="hero-copy-enter hero-copy-enter-4 absolute bottom-1 right-1 sm:bottom-5 sm:right-6">
            <button
              type="button"
              className="interactive-button flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(248,242,232,0.14)] bg-[rgba(248,242,232,0.06)] text-[rgba(248,242,232,0.84)] backdrop-blur transition hover:border-[var(--reserve-gold-400)] hover:bg-[rgba(243,203,101,0.1)] hover:text-[var(--reserve-gold-400)]"
              aria-label="Scroll to top picks"
            >
              <ChevronRight className="h-5 w-5 rotate-90" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
