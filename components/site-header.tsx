import Link from "next/link";
import Image from "next/image";

import { getSessionUser } from "@/lib/auth";
import { MobileMenu } from "@/components/mobile-menu";
import { navLinks } from "@/lib/content";
import { LogoutButton } from "@/components/logout-button";

export async function SiteHeader({ availableMealCount }: { availableMealCount?: number } = {}) {
  const user = await getSessionUser();
  const dashboardHref = user ? (user.role === "admin" ? "/admin" : "/dashboard") : undefined;
  const dashboardLabel = user ? (user.role === "admin" ? "Admin" : "Dashboard") : undefined;

  return (
    <header className="relative z-[20] px-5 py-5 sm:px-8 lg:px-10">
      <div className="mx-auto flex items-center justify-between gap-4">
        <Link href="/" className="flex items-center gap-3">
          <div className="flex items-center justify-center">
            <Image src="/reserve-logo.png" alt="Reserve" width={177} height={48} />
          </div>
          {/* <div className="text-white">
            <p className="font-[family-name:var(--font-heading)] text-3xl font-semibold tracking-[-0.04em]">
              Reserve
            </p>
            <p className="mt-1 text-[11px] uppercase tracking-[0.28em] text-white/56">
              Restaurant & Apartments
            </p>
          </div> */}
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-[rgba(239,228,212,0.78)] lg:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="transition hover:text-[var(--reserve-gold-400)]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="flex items-center gap-3">


          <MobileMenu
            navLinks={navLinks}
            dashboardHref={dashboardHref}
            dashboardLabel={dashboardLabel}
            isAuthenticated={Boolean(user)}
          />

          {user ? (
            <>
              <a
                href={dashboardHref!}
                className="hidden rounded-full border border-[rgba(248,242,232,0.16)] px-5 py-2 text-sm font-medium text-[rgba(239,228,212,0.82)] transition hover:border-[var(--reserve-gold-400)] hover:bg-[rgba(248,242,232,0.06)] hover:text-[var(--reserve-gold-400)] md:inline-flex"
              >
                {dashboardLabel}
              </a>
              <div className="hidden md:block">
                <LogoutButton />
              </div>
            </>
          ) : (
            <>
              <a
                href="/login"
                className="hidden rounded-full border border-[rgba(248,242,232,0.16)] px-5 py-2 text-sm font-medium text-[rgba(239,228,212,0.82)] transition hover:border-[var(--reserve-gold-400)] hover:bg-[rgba(248,242,232,0.06)] hover:text-[var(--reserve-gold-400)] md:inline-flex"
              >
                Login
              </a>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
