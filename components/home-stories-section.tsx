import { Quote } from "lucide-react";

import { HeroStories } from "@/components/hero-stories";
import { heroQuote, heroStories } from "@/lib/content";

export function HomeStoriesSection() {
  return (
    <section id="stories" className="mt-16 max-w-[1500px] px-6 sm:px-8 lg:px-12">
      <div className="grid gap-6 lg:grid-cols-[0.78fr_1.22fr]">
        <div className="reserve-pattern-bg reserve-pattern-light overflow-hidden rounded-[2.5rem] bg-[var(--reserve-green-800)] p-7 text-white shadow-[0_30px_80px_rgba(23,61,47,0.16)] sm:p-8">
          <p className="text-sm uppercase tracking-[0.32em] text-[var(--reserve-gold-400)]">
            Reserve Stories
          </p>
          <h2 className="mt-4 max-w-md text-4xl font-black tracking-[-0.04em] sm:text-5xl">
            Moments from the kitchen, the table, and the stay.
          </h2>
          <p className="mt-5 max-w-md text-sm leading-7 text-white/76">
            The story viewer stays on the homepage, but outside the hero. It can expand
            fullscreen, support more images later, and grow into videos and multiple story
            views.
          </p>

          <div className="mt-8 rounded-[1.8rem] bg-white/8 p-5 ring-1 ring-white/12">
            <Quote className="h-5 w-5 text-[var(--reserve-gold-400)]" />
            <p className="mt-4 text-sm leading-7 text-white/76">{heroQuote.quote}</p>
            <p className="mt-4 text-sm font-semibold text-white">{heroQuote.author}</p>
          </div>
        </div>

        <HeroStories stories={heroStories} />
      </div>
    </section>
  );
}
