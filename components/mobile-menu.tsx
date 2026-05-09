"use client";

import { Menu, X } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { createPortal } from "react-dom";

type NavLink = {
  label: string;
  href: string;
};

type MobileMenuProps = {
  navLinks: NavLink[];
  dashboardHref?: string;
  dashboardLabel?: string;
  isAuthenticated: boolean;
};

export function MobileMenu({
  navLinks,
  dashboardHref,
  dashboardLabel,
  isAuthenticated,
}: MobileMenuProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!isOpen) {
      document.body.style.removeProperty("overflow");
      return;
    }

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.removeProperty("overflow");
    };
  }, [isOpen]);

  const overlay = (
    <div
      className={`mobile-menu-screen fixed inset-0 z-[140] ${isOpen ? "mobile-menu-screen-open pointer-events-auto" : "pointer-events-none"}`}
      aria-hidden={!isOpen}
    >
      <div
        className="absolute inset-0 bg-[rgba(7,14,10,0.72)] backdrop-blur-md"
        onClick={() => setIsOpen(false)}
      />

      <div className={`mobile-menu-panel fixed inset-0 ${isOpen ? "mobile-menu-panel-open" : ""}`}>
        <div className="reserve-pattern-bg reserve-pattern-light flex min-h-screen w-screen flex-col bg-[linear-gradient(160deg,var(--ink)_0%,var(--reserve-ink-green-900)_42%,var(--reserve-ink-green-800)_100%)] px-6 pb-8 pt-6 text-[var(--foreground)]">
          <div className="flex items-center justify-between gap-4">
            <div>
              <p className="text-xs uppercase tracking-[0.34em] text-[var(--reserve-gold-400)]">
                Reserve
              </p>
              <p className="mt-2 text-sm text-[rgba(248,242,232,0.72)]">
                Food, drinks, and stays
              </p>
            </div>

            <button
              type="button"
              aria-label="Close menu"
              className="mobile-menu-trigger inline-flex h-12 w-12 items-center justify-center rounded-full border border-[rgba(248,242,232,0.16)] bg-[rgba(248,242,232,0.08)] text-[rgba(248,242,232,0.94)] shadow-[0_10px_28px_rgba(12,22,17,0.18)] ring-1 ring-[rgba(243,203,101,0.08)] transition hover:text-[var(--reserve-gold-400)]"
              onClick={() => setIsOpen(false)}
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          <nav id="mobile-navigation" className="mt-14 flex-1">
            <div className="flex flex-col gap-2">
              {navLinks.map((link, index) => (
                <a
                  key={link.href}
                  href={link.href}
                  className={`mobile-menu-link ${isOpen ? "mobile-menu-link-open" : ""} block rounded-[1.6rem] border border-[rgba(248,242,232,0.08)] bg-[rgba(248,242,232,0.04)] px-5 py-4 text-2xl font-semibold tracking-[-0.03em] text-[rgba(248,242,232,0.92)] transition hover:border-[rgba(243,203,101,0.32)] hover:bg-[rgba(248,242,232,0.08)] hover:text-[var(--reserve-gold-400)]`}
                  style={{ transitionDelay: `${90 + index * 55}ms` }}
                  onClick={() => setIsOpen(false)}
                >
                  {link.label}
                </a>
              ))}
            </div>
          </nav>

          <div className="mobile-menu-actions mt-8 grid gap-3">
            {isAuthenticated && dashboardHref && dashboardLabel ? (
              <>
                <a
                  href={dashboardHref}
                  className="interactive-button inline-flex justify-center rounded-full bg-[var(--reserve-gold-500)] px-5 py-3.5 text-sm font-semibold text-[var(--reserve-green-950)] transition hover:bg-[var(--reserve-gold-400)]"
                  onClick={() => setIsOpen(false)}
                >
                  {dashboardLabel}
                </a>
                <button
                  type="button"
                  className="interactive-button rounded-full border border-[rgba(248,242,232,0.16)] bg-white/8 px-5 py-3.5 text-sm font-medium text-[rgba(248,242,232,0.94)] transition hover:border-[var(--reserve-gold-400)] hover:text-[var(--reserve-gold-400)]"
                  onClick={async () => {
                    await fetch("/api/auth/logout", { method: "POST" });
                    setIsOpen(false);
                    window.location.href = "/";
                  }}
                >
                  Logout
                </button>
              </>
            ) : (
              <a
                href="/login"
                className="interactive-button inline-flex justify-center rounded-full bg-[var(--reserve-gold-500)] px-5 py-3.5 text-sm font-semibold text-[var(--reserve-green-950)] transition hover:bg-[var(--reserve-gold-400)]"
                onClick={() => setIsOpen(false)}
              >
                Login
              </a>
            )}
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="relative z-[120] md:hidden">
      <button
        type="button"
        aria-expanded={isOpen}
        aria-controls="mobile-navigation"
        aria-label={isOpen ? "Close menu" : "Open menu"}
        className="mobile-menu-trigger inline-flex h-11 w-11 items-center justify-center border border-[var(--reserve-gold-500)] rounded-full  text-[rgba(248,242,232,0.94)] transition hover:text-[var(--reserve-gold-400)]"
        onClick={() => setIsOpen((current) => !current)}
      >
        {isOpen ? (
          <X className="h-6 w-6" />
        ) : (
          <Image
            src="/reserve-menu-icon.png"
            alt="menu icon"
            width={24}
            height={24}
            className="h-6 w-auto"
          />
        )}
      </button>
      {isMounted ? createPortal(overlay, document.body) : null}
    </div>
  );
}
