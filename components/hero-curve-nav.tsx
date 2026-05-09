"use client";

import Image from "next/image";
import { Home, House, Phone, Utensils } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: typeof Home;
};

const navItems: NavItem[] = [
  // { label: "Home", href: "#home", icon: Home },
  { label: "Apartments", href: "/apartments", icon: House },
  { label: "Meals", href: "/meals", icon: Utensils },
  { label: "Contact", href: "#reserve", icon: Phone },
];

export function HeroCurveNav() {
  const anchorItems = useMemo(
    () => navItems.filter((item) => item.href.startsWith("#")),
    [],
  );
  const [activeHref, setActiveHref] = useState("#home");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const itemRefs = useRef<Record<string, HTMLAnchorElement | null>>({});

  useEffect(() => {
    const sections = anchorItems
      .map((item) => {
        const element = document.querySelector(item.href);
        return element ? { href: item.href, element } : null;
      })
      .filter(Boolean) as { href: string; element: Element }[];

    if (!sections.length) {
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        const visibleEntries = entries
          .filter((entry) => entry.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio);

        if (visibleEntries[0]) {
          const match = sections.find((section) => section.element === visibleEntries[0].target);
          if (match) {
            setActiveHref(match.href);
          }
        }
      },
      {
        threshold: [0.2, 0.4, 0.6],
        rootMargin: "-10% 0px -50% 0px",
      },
    );

    sections.forEach((section) => observer.observe(section.element));

    return () => observer.disconnect();
  }, [anchorItems]);

  useEffect(() => {
    const activeItem = itemRefs.current[activeHref];
    const scrollContainer = scrollRef.current;

    if (!activeItem || !scrollContainer) {
      return;
    }

    const itemTop = activeItem.offsetTop;
    const itemHeight = activeItem.offsetHeight;
    const targetScrollTop =
      itemTop - scrollContainer.clientHeight / 2 + itemHeight / 2;

    scrollContainer.scrollTo({
      top: Math.max(0, targetScrollTop),
      behavior: "smooth",
    });
  }, [activeHref]);

  return (
    <div className="hero-curve-shell hero-visual-enter relative z-10 h-[300px] w-[180px] overflow-hidden">
      <Image
        src="/open-reserve-top.png"
        alt=""
        aria-hidden="true"
        width={110}
        height={34}
        className="hero-open-mark hero-open-mark-top"
      />

      <Image
        src="/open-reserve-bottom.png"
        alt=""
        aria-hidden="true"
        width={106}
        height={30}
        className="hero-open-mark hero-open-mark-bottom"
      />

      <div className="hero-curve-rail" />
      {/* <div className="hero-curve-dots" /> */}
      <div className="hero-curve-fade-top" />
      <div className="hero-curve-fade-bottom" />

      <div className="hero-curve-clip flex items-center justify-center">
        <div ref={scrollRef} className="hero-curve-scroll mt-6">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.href === activeHref;

            return (
              <a
                key={item.href}
                ref={(node) => {
                  itemRefs.current[item.href] = node;
                }}
                href={item.href}
                className={`hero-curve-chip ${isActive ? "" : ""}`}
              >
                <span className="hero-curve-chip-icon">
                  <Icon className="h-4 w-4" />
                </span>
                <span>{item.label}</span>
              </a>
            );
          })}
        </div>
      </div>
    </div>
  );
}
