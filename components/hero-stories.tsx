"use client";

import Image from "next/image";
import { Expand, X } from "lucide-react";
import { useEffect, useState } from "react";

type HeroStory = {
  src: string;
  alt: string;
  label: string;
  title: string;
  body: string;
};

type HeroStoriesProps = {
  stories: HeroStory[];
};

const STORY_DURATION_MS = 4500;

export function HeroStories({ stories }: HeroStoriesProps) {
  const [activeIndex, setActiveIndex] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (stories.length <= 1) {
      return;
    }

    const timer = window.setInterval(() => {
      setActiveIndex((current) => (current + 1) % stories.length);
    }, STORY_DURATION_MS);

    return () => window.clearInterval(timer);
  }, [stories.length, isFullscreen]);

  useEffect(() => {
    if (!isFullscreen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setIsFullscreen(false);
      }

      if (event.key === "ArrowRight") {
        setActiveIndex((current) => (current + 1) % stories.length);
      }

      if (event.key === "ArrowLeft") {
        setActiveIndex((current) => (current - 1 + stories.length) % stories.length);
      }
    };

    window.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.removeProperty("overflow");
      window.removeEventListener("keydown", onKeyDown);
    };
  }, [isFullscreen, stories.length]);

  const activeStory = stories[activeIndex];
  const frameClassName = isFullscreen
    ? "fixed inset-0 z-[80] m-0 rounded-none hero-story-shell"
    : "hero-visual relative min-h-[460px] max-h-[660px] overflow-hidden rounded-[2rem] mb-3";

  return (
    <>
      {isFullscreen ? (
        <button
          type="button"
          aria-label="Close fullscreen story"
          className="fixed inset-0 z-[70] bg-[rgba(8,8,8,0.82)] backdrop-blur-md"
          onClick={() => setIsFullscreen(false)}
        />
      ) : null}

      <div
        className={frameClassName}
        role="button"
        tabIndex={0}
        aria-label="Open Reserve story"
        onClick={() => setIsFullscreen(true)}
        onKeyDown={(event) => {
          if (event.key === "Enter" || event.key === " ") {
            event.preventDefault();
            setIsFullscreen(true);
          }
        }}
      >
        <Image
          key={activeStory.src}
          src={activeStory.src}
          alt={activeStory.alt}
          fill
          priority
          sizes="(max-width: 640px) 100vw, 80vw"
          className="object-cover"
        />

        <div className="hero-story-overlay absolute inset-0" />

        <div className="absolute inset-x-0 top-0 z-10 p-5">
          <div className="flex gap-2">
            {stories.map((story, index) => {
              const isActive = index === activeIndex;

              return (
                <button
                  key={story.src}
                  type="button"
                  aria-label={`Show story ${index + 1}`}
                  className="hero-story-track relative h-1.5 flex-1 overflow-hidden rounded-full"
                  onClick={(event) => {
                    event.stopPropagation();
                    setActiveIndex(index);
                  }}
                >
                  <span
                    className={`hero-story-fill absolute inset-y-0 left-0 rounded-full ${isActive ? "hero-story-fill-active" : index < activeIndex ? "w-full" : "w-0"}`}
                    style={isActive ? { animationDuration: `${STORY_DURATION_MS}ms` } : undefined}
                  />
                </button>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(246,241,234,0.24)] bg-[rgba(17,17,17,0.28)] text-xs uppercase tracking-[0.32em] text-[var(--brand-soft)]">
                R
              </div>
              <div>
                <p className="text-sm font-semibold text-white">{activeStory.label}</p>
                <p className="text-hero-faint text-xs">Reserve story</p>
              </div>
            </div>

            <div className="flex items-center gap-2">
              {!isFullscreen ? (
                <button
                  type="button"
                  aria-label="Open fullscreen story"
                  className="hero-story-icon flex h-10 w-10 items-center justify-center rounded-full"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsFullscreen(true);
                  }}
                >
                  <Expand className="h-4 w-4" />
                </button>
              ) : null}

              {isFullscreen ? (
                <button
                  type="button"
                  aria-label="Close fullscreen story"
                  className="hero-story-icon flex h-10 w-10 items-center justify-center rounded-full"
                  onClick={(event) => {
                    event.stopPropagation();
                    setIsFullscreen(false);
                  }}
                >
                  <X className="h-4 w-4" />
                </button>
              ) : null}
            </div>
          </div>
        </div>

        <div className="absolute inset-x-0 bottom-0 z-10 p-5 sm:p-6">
          <div className="hero-overlay-card rounded-[1.5rem] p-5 sm:p-6">
            <p className="text-[11px] uppercase tracking-[0.28em] text-[var(--brand-soft)]">
              Featured Moment
            </p>
            <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl leading-none text-white sm:text-4xl">
              {activeStory.title}
            </h3>
            <p className="text-hero-soft mt-3 max-w-md text-sm leading-7">
              {activeStory.body}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}
