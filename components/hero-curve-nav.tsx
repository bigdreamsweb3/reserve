"use client";

import type { LucideIcon } from "lucide-react";
import { House, Phone, ShoppingBag, Utensils } from "lucide-react";
import { useEffect, useMemo, useState } from "react";

type NavItem = {
  label: string;
  href: string;
  icon: LucideIcon;
};

const navItems: NavItem[] = [
  { label: "Stays", href: "/apartments", icon: House },
  { label: "Menu", href: "/meals", icon: Utensils },
  { label: "Cart", href: "/cart", icon: ShoppingBag },
  { label: "Concierge", href: "#reserve", icon: Phone },
];

export function HeroCurveNav() {
  const anchorItems = useMemo(
    () => navItems.filter((item) => item.href.startsWith("#")),
    [],
  );
  const [activeHref, setActiveHref] = useState("");

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

  return (
    <nav className="hero-action-rail hero-visual-enter" aria-label="Reserve quick navigation">
      {navItems.map((item) => {
        const Icon = item.icon;
        const isActive = item.href === activeHref;

        return (
          <a
            key={item.href}
            href={item.href}
            className={`hero-action-link ${isActive ? "hero-action-link-active" : ""}`}
          >
            <span className="hero-action-icon">
              <Icon className="h-4 w-4" />
            </span>
            <span className="hero-action-label">{item.label}</span>
          </a>
        );
      })}
    </nav>
  );
}
