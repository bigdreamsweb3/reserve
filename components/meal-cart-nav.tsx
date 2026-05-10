"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useMealCart } from "@/components/cart-context";

export function MealCartNav() {
  const { itemCount } = useMealCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex items-center justify-center rounded-full border border-[rgba(248,242,232,0.16)] p-2.5 text-[rgba(239,228,212,0.82)] transition hover:border-[var(--reserve-gold-400)] hover:text-[var(--reserve-gold-400)] md:px-4 md:py-2"
      aria-label={`Meal cart, ${itemCount} items`}
    >
      <ShoppingBag className="h-5 w-5 md:hidden" />
      <span className="hidden text-sm font-medium md:inline">Cart</span>
      {itemCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--reserve-gold-500)] px-1 text-[11px] font-bold text-[#1a1208]">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}
