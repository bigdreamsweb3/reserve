import Link from "next/link";

import { CartCheckoutClient } from "@/components/cart-checkout-client";
import { SiteHeader } from "@/components/site-header";

export default function CartPage() {
  return (
    <main className="grain min-h-screen pb-24">
      <section className="pt-0">
        <div className="hero-shell overflow-hidden">
          <SiteHeader />
          <div className="mx-auto max-w-4xl px-6 pb-12 pt-6 lg:px-10">
            <Link href="/meals" className="text-hero-soft text-sm">
              ← Back to meals
            </Link>
            <p className="eyebrow mt-6">Meal cart</p>
            <h1 className="mt-4 font-[family-name:var(--font-heading)] text-5xl leading-none sm:text-6xl">
              Review your order
            </h1>
            <p className="text-hero-soft mt-4 max-w-2xl text-sm leading-7 sm:text-base">
              One checkout for every plate in your cart. Tell us when you would like the kitchen to have it ready.
            </p>
          </div>
        </div>
      </section>

      <CartCheckoutClient />
    </main>
  );
}
