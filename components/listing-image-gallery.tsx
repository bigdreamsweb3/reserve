"use client";

import Image from "next/image";
import { useMemo, useState } from "react";

import { getListingVisualClass } from "@/lib/listing-presentation";

type ListingImageGalleryProps = {
  title: string;
  primaryImageUrl: string | null;
  galleryUrls: string[];
  imageTone: string;
};

export function ListingImageGallery({
  title,
  primaryImageUrl,
  galleryUrls,
  imageTone,
}: ListingImageGalleryProps) {
  const slides = useMemo(() => {
    const urls = [primaryImageUrl, ...galleryUrls].filter((url): url is string => Boolean(url && url.trim()));
    return urls.length > 0 ? urls : null;
  }, [primaryImageUrl, galleryUrls]);

  const [active, setActive] = useState(0);

  if (!slides) {
    return (
      <div className="relative h-[420px] overflow-hidden rounded-[2rem]">
        <div className={getListingVisualClass(imageTone)} />
      </div>
    );
  }

  const safeIndex = Math.min(active, slides.length - 1);
  const current = slides[safeIndex] ?? slides[0];

  return (
    <div className="space-y-4">
      <div className="relative h-[420px] overflow-hidden rounded-[2rem] bg-black/20">
        <Image src={current} alt={`${title} view ${safeIndex + 1}`} fill sizes="(max-width: 768px) 100vw, 60vw" className="object-cover" priority={safeIndex === 0} />
        {slides.length > 1 ? (
          <>
            <button
              type="button"
              aria-label="Previous photo"
              className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/55"
              onClick={() => setActive((index) => (index - 1 + slides.length) % slides.length)}
            >
              ‹
            </button>
            <button
              type="button"
              aria-label="Next photo"
              className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-black/45 px-3 py-2 text-sm font-medium text-white backdrop-blur-sm transition hover:bg-black/55"
              onClick={() => setActive((index) => (index + 1) % slides.length)}
            >
              ›
            </button>
            <p className="absolute bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1 text-xs text-white/90 backdrop-blur-sm">
              {safeIndex + 1} / {slides.length}
            </p>
          </>
        ) : null}
      </div>

      {slides.length > 1 ? (
        <div className="flex gap-2 overflow-x-auto pb-1">
          {slides.map((url, index) => (
            <button
              key={`${url}-${index}`}
              type="button"
              onClick={() => setActive(index)}
              className={`relative h-16 w-24 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                index === safeIndex ? "border-[var(--reserve-gold-500)]" : "border-transparent opacity-80 hover:opacity-100"
              }`}
            >
              <Image src={url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      ) : null}
    </div>
  );
}
