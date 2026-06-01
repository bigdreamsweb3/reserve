"use client";

import Link from "next/link";
import { ShoppingBag } from "lucide-react";

import { useMealCart } from "@/components/cart-context";

export function MealCartNav() {
  const { itemCount } = useMealCart();

  return (
    <Link
      href="/cart"
      className="relative inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(248,242,232,0.16)] bg-[rgba(10,13,11,0.38)] text-[var(--reserve-gold-400)] shadow-[0_12px_30px_rgba(0,0,0,0.18)] backdrop-blur transition hover:border-[var(--reserve-gold-400)] hover:bg-[rgba(243,203,101,0.12)] hover:text-[var(--reserve-gold-400)]"
      aria-label={`Meal cart, ${itemCount} items`}
    >
      <ShoppingBag className="h-5 w-5" aria-hidden />
      {itemCount > 0 ? (
        <span className="absolute -right-1 -top-1 flex h-5 min-w-5 items-center justify-center rounded-full bg-[var(--reserve-gold-500)] px-1 text-[11px] font-bold text-[#1a1208]">
          {itemCount > 99 ? "99+" : itemCount}
        </span>
      ) : null}
    </Link>
  );
}
