"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";

import { useMealCart } from "@/components/cart-context";
import { formatNaira } from "@/lib/reserves";
import { getListingVisualClass } from "@/lib/listing-presentation";

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  startDate: "",
  notes: "",
};

export function CartCheckoutClient() {
  const { lines, subtotalNgn, updateLineQuantity, removeLine, clearCart } = useMealCart();
  const [form, setForm] = useState(initialForm);
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();

  if (lines.length === 0) {
    return (
      <section className="mx-auto mt-10 max-w-4xl px-5 lg:px-8">
        <div className="surface-card rounded-[2rem] p-10 text-center">
          <p className="text-lg font-semibold text-[#111]">Your cart is empty</p>
          <p className="mt-2 text-sm text-[#6b6259]">Browse the menu and use “Add to cart” on each meal.</p>
          <Link
            href="/meals"
            className="mt-6 inline-flex rounded-full bg-[var(--reserve-green-800)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--reserve-green-700)]"
          >
            Browse meals
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto mt-10 max-w-4xl px-5 lg:px-8">
      <div className="space-y-8">
        <div className="space-y-4">
          {lines.map((line) => (
            <div
              key={line.lineId}
              className="surface-card flex flex-col gap-4 rounded-[1.75rem] border border-black/5 p-5 sm:flex-row sm:items-center"
            >
              <div className="relative h-28 w-full shrink-0 overflow-hidden rounded-2xl sm:h-24 sm:w-32">
                {line.imageUrl ? (
                  <Image src={line.imageUrl} alt="" fill sizes="128px" className="object-cover" />
                ) : (
                  <div className={`h-full w-full ${getListingVisualClass(line.imageTone)}`} />
                )}
              </div>
              <div className="min-w-0 flex-1">
                <p className="font-semibold text-[#111]">{line.title}</p>
                <p className="mt-1 text-xs text-[#6b6259]">
                  {formatNaira(line.unitPriceNgn)} per {line.billingPeriod}
                  {line.addonSelections.length > 0
                    ? ` · add-ons: ${line.addonSelections.map((addon) => addon.label).join(", ")}`
                    : ""}
                </p>
                <div className="mt-3 flex flex-wrap items-center gap-3">
                  <label className="flex items-center gap-2 text-sm text-[#405149]">
                    Qty
                    <input
                      type="number"
                      min={1}
                      max={40}
                      value={line.quantity}
                      onChange={(event) => updateLineQuantity(line.lineId, Number(event.target.value))}
                      className="w-16 rounded-xl border border-black/10 px-2 py-1 text-sm outline-none"
                    />
                  </label>
                  <button
                    type="button"
                    className="text-sm font-semibold text-red-700 hover:underline"
                    onClick={() => removeLine(line.lineId)}
                  >
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right">
                <p className="text-xl font-black text-[#0f0f0f]">
                  {formatNaira(
                    (line.unitPriceNgn + line.addonSelections.reduce((s, addon) => s + addon.priceNgn, 0)) *
                      line.quantity,
                  )}
                </p>
              </div>
            </div>
          ))}
        </div>

        <div className="surface-card rounded-[2rem] p-6 sm:p-8">
          <div className="flex items-center justify-between gap-4 border-b border-black/8 pb-4">
            <p className="text-sm font-semibold text-[#111]">Subtotal</p>
            <p className="text-2xl font-black text-[#0f0f0f]">{formatNaira(subtotalNgn)}</p>
          </div>

          <form
            className="mt-6 grid gap-4 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault();
              setMessage("");

              startTransition(async () => {
                try {
                  const response = await fetch("/api/meal-orders", {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                      fullName: form.fullName,
                      email: form.email,
                      phone: form.phone,
                      startDate: new Date(form.startDate).toISOString(),
                      endDate: null,
                      notes: form.notes,
                      items: lines.map((line) => ({
                        listingId: line.listingId,
                        quantity: line.quantity,
                        addonSelections: line.addonSelections,
                      })),
                    }),
                  });

                  const data = (await response.json()) as { message?: string; whatsappUrl?: string | null };

                  if (!response.ok) {
                    throw new Error(data.message ?? "Unable to submit order.");
                  }

                  setMessage(data.message ?? "Order received.");
                  clearCart();
                  setForm(initialForm);

                  if (data.whatsappUrl && typeof window !== "undefined") {
                    window.open(data.whatsappUrl, "_blank", "noopener,noreferrer");
                  }
                } catch (error) {
                  setMessage(error instanceof Error ? error.message : "Unable to submit order.");
                }
              });
            }}
          >
            <input
              required
              value={form.fullName}
              onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
              placeholder="Full name"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="Email"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              required
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Phone (WhatsApp preferred)"
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
            />
            <input
              required
              type="datetime-local"
              value={form.startDate}
              onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none"
            />
            <textarea
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              placeholder="Special instructions (optional)"
              rows={4}
              className="rounded-2xl border border-black/10 bg-white px-4 py-3 text-sm outline-none sm:col-span-2"
            />
            <div className="sm:col-span-2">
              <button
                type="submit"
                disabled={isPending}
                className="rounded-full bg-[var(--reserve-green-800)] px-6 py-3 text-sm font-semibold text-white transition hover:bg-[var(--reserve-green-700)] disabled:cursor-not-allowed disabled:opacity-70"
              >
                {isPending ? "Submitting..." : "Submit meal order"}
              </button>
              <p className="mt-3 text-xs text-[#6b6259]">
                Configure <span className="font-mono">NEXT_PUBLIC_RESERVE_WHATSAPP</span> (digits only, with country
                code) to open WhatsApp with this order for the Reserve team.
              </p>
              {message ? <p className="mt-4 text-sm text-[#295227]">{message}</p> : null}
            </div>
          </form>
        </div>
      </div>
    </section>
  );
}
