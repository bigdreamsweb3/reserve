"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import { useMealCart } from "@/components/cart-context";
import type { MealAddon, ReserveListing } from "@/lib/reserves";
import { formatNaira } from "@/lib/reserves";
import { mealCategoryLabel, mealPackageLabel } from "@/lib/meal-categories";

type MealOrderSectionProps = {
  listing: ReserveListing;
  canOrder: boolean;
};

export function MealOrderSection({ listing, canOrder }: MealOrderSectionProps) {
  const { addMealLine } = useMealCart();
  const [quantity, setQuantity] = useState(1);
  const [selected, setSelected] = useState<Record<string, boolean>>({});
  const [message, setMessage] = useState("");

  const addons = listing.mealAddons;

  const selectedAddons = useMemo(() => {
    return addons.filter((addon) => selected[addonKey(addon)]);
  }, [addons, selected]);

  const unitExtras = selectedAddons.reduce((sum, addon) => sum + addon.priceNgn, 0);
  const linePreview = (listing.priceNgn + unitExtras) * quantity;

  if (!canOrder) {
    return null;
  }

  return (
    <div id="order" className="panel scroll-mt-24 rounded-[2rem] p-6 sm:p-8">
      <p className="eyebrow">Order this meal</p>
      <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-white">Build your plate</h3>
      <p className="mt-2 text-sm leading-7 text-[var(--muted)]">
        Choose quantity, add any extras the kitchen offers, then send everything to your cart for one checkout.
        {listing.mealCategory ? (
          <>
            {" "}
            Category: <span className="text-[var(--brand-soft)]">{mealCategoryLabel(listing.mealCategory)}</span>
          </>
        ) : null}
        {listing.mealPackage ? (
          <>
            {" "}
            Package: <span className="text-[var(--brand-soft)]">{mealPackageLabel(listing.mealPackage)}</span>
          </>
        ) : null}
      </p>

      <div className="mt-6 flex flex-wrap items-center gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Quantity</p>
          <div className="mt-2 flex items-center gap-2">
            <button
              type="button"
              className="rounded-full border border-[var(--line)] px-4 py-2 text-lg text-white transition hover:bg-[rgba(246,241,234,0.08)]"
              onClick={() => setQuantity((value) => Math.max(1, value - 1))}
              aria-label="Decrease quantity"
            >
              −
            </button>
            <span className="min-w-[2ch] text-center text-xl font-semibold text-white">{quantity}</span>
            <button
              type="button"
              className="rounded-full border border-[var(--line)] px-4 py-2 text-lg text-white transition hover:bg-[rgba(246,241,234,0.08)]"
              onClick={() => setQuantity((value) => Math.min(40, value + 1))}
              aria-label="Increase quantity"
            >
              +
            </button>
          </div>
        </div>
        <div className="rounded-2xl border border-[var(--line)] bg-[rgba(246,241,234,0.06)] px-5 py-4">
          <p className="text-xs uppercase tracking-[0.2em] text-[var(--muted)]">Line total</p>
          <p className="mt-1 font-[family-name:var(--font-heading)] text-3xl text-white">{formatNaira(linePreview)}</p>
        </div>
      </div>

      {addons.length > 0 ? (
        <div className="mt-6 space-y-3">
          <p className="text-sm font-semibold text-white">Add-ons</p>
          <div className="grid gap-3 sm:grid-cols-2">
            {addons.map((addon) => {
              const key = addonKey(addon);
              const checked = Boolean(selected[key]);

              return (
                <label
                  key={key}
                  className={`flex cursor-pointer items-start gap-3 rounded-2xl border px-4 py-3 text-sm transition ${
                    checked ? "border-[var(--reserve-gold-500)] bg-[rgba(238,187,42,0.12)]" : "border-[var(--line)] hover:border-[rgba(238,187,42,0.45)]"
                  }`}
                >
                  <input
                    type="checkbox"
                    className="mt-1"
                    checked={checked}
                    onChange={(event) =>
                      setSelected((current) => ({
                        ...current,
                        [key]: event.target.checked,
                      }))
                    }
                  />
                  <span className="text-[var(--foreground)]">
                    <span className="font-medium text-white">{addon.label}</span>
                    <span className="mt-1 block text-xs text-[var(--muted)]">
                      {addon.priceNgn === 0 ? "No extra charge" : `+ ${formatNaira(addon.priceNgn)} each`}
                    </span>
                  </span>
                </label>
              );
            })}
          </div>
        </div>
      ) : null}

      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="button"
          className="accent-button rounded-full px-5 py-3 text-sm font-semibold transition"
          onClick={() => {
            setMessage("");
            addMealLine({
              listingId: listing.id,
              slug: listing.slug,
              title: listing.title,
              imageUrl: listing.imageUrl,
              imageTone: listing.imageTone,
              billingPeriod: listing.billingPeriod,
              unitPriceNgn: listing.priceNgn,
              quantity,
              addonSelections: selectedAddons.map((addon) => ({ label: addon.label, priceNgn: addon.priceNgn })),
              availableAddons: addons,
            });
            setMessage("Added to cart. Continue browsing or open your cart to checkout.");
          }}
        >
          Add to cart
        </button>
        <Link href="/cart" className="text-center text-sm font-semibold text-[var(--reserve-gold-400)] hover:underline sm:text-left">
          View meal cart →
        </Link>
      </div>
      {message ? <p className="mt-4 text-sm text-[var(--muted)]">{message}</p> : null}
    </div>
  );
}

function addonKey(addon: MealAddon) {
  return `${addon.label}:${addon.priceNgn}`;
}
