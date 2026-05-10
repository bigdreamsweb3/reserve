"use client";

import { useState, useTransition } from "react";

type ListingBookingFormProps = {
  listingId: string;
  listingTitle: string;
  listingType: "apartment" | "meal";
  defaultGuests?: number;
};

const initialForm = {
  fullName: "",
  email: "",
  phone: "",
  guests: "1",
  startDate: "",
  endDate: "",
  notes: "",
};

export function ListingBookingForm({
  listingId,
  listingTitle,
  listingType,
  defaultGuests = 1,
}: ListingBookingFormProps) {
  const [form, setForm] = useState({ ...initialForm, guests: String(defaultGuests) });
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const eyebrow = listingType === "meal" ? "Reserve This Meal" : "Request your stay";
  const heading =
    listingType === "meal" ? "Send your meal request" : "Tell us who is arriving and when";
  const notesPlaceholder =
    listingType === "meal" ? "Tell us your food or dining request" : "Tell us what you need for your stay";
  const submitLabel = listingType === "meal" ? "Reserve meal" : "Submit stay request";

  return (
    <form
      id="book"
      className="panel scroll-mt-24 rounded-[2rem] p-6 sm:p-8"
      onSubmit={(event) => {
        event.preventDefault();
        setMessage("");

        startTransition(async () => {
          try {
            const response = await fetch("/api/bookings", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                listingId,
                fullName: form.fullName,
                email: form.email,
                phone: form.phone,
                guests: form.guests,
                startDate: new Date(form.startDate).toISOString(),
                endDate: form.endDate ? new Date(form.endDate).toISOString() : "",
                notes: form.notes,
              }),
            });

            const data = (await response.json()) as { message?: string };

            if (!response.ok) {
              throw new Error(data.message ?? "Unable to complete booking request.");
            }

            setForm({ ...initialForm, guests: String(defaultGuests) });
            setMessage(data.message ?? `Booking request sent for ${listingTitle}.`);
          } catch (error) {
            setMessage(error instanceof Error ? error.message : "Unable to complete booking request.");
          }
        });
      }}
    >
      <p className="eyebrow">{eyebrow}</p>
      <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-white">
        {heading}
      </h3>
      <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
        {listingType === "apartment"
          ? "We review every request personally. You will receive confirmation from Reserve once dates and details are confirmed."
          : null}
      </p>

      {listingType === "apartment" ? (
        <ol className="mt-8 grid gap-6 border-b border-[var(--line)] pb-8">
          <li className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="booking-step-label">Step 1 · Guest details</p>
              <p className="mt-1 text-sm text-[var(--muted)]">How we reach you about this stay.</p>
            </div>
            <input
              required
              value={form.fullName}
              onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
              placeholder="Full name"
              className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
            />
            <input
              required
              type="email"
              value={form.email}
              onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
              placeholder="Email address"
              className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
            />
            <input
              required
              value={form.phone}
              onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
              placeholder="Phone (WhatsApp preferred)"
              className="brand-input rounded-2xl px-4 py-3 text-sm outline-none sm:col-span-2"
            />
          </li>
          <li className="grid gap-4 sm:grid-cols-2">
            <div className="sm:col-span-2">
              <p className="booking-step-label">Step 2 · Stay window</p>
              <p className="mt-1 text-sm text-[var(--muted)]">Approximate arrival and departure help us hold the right nights.</p>
            </div>
            <input
              required
              min="1"
              type="number"
              value={form.guests}
              onChange={(event) => setForm((current) => ({ ...current, guests: event.target.value }))}
              placeholder="Guests"
              className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
            />
            <div className="hidden sm:block" aria-hidden />
            <input
              required
              type="datetime-local"
              value={form.startDate}
              onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
              className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
            />
            <input
              type="datetime-local"
              value={form.endDate}
              onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
              className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
            />
          </li>
          <li>
            <p className="booking-step-label">Step 3 · Anything else</p>
            <p className="mt-1 text-sm text-[var(--muted)]">Special occasions, airport pickup, or dietary needs for in-room dining.</p>
            <textarea
              value={form.notes}
              onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
              rows={5}
              placeholder={notesPlaceholder}
              className="brand-input mt-4 w-full rounded-2xl px-4 py-3 text-sm outline-none"
            />
          </li>
        </ol>
      ) : null}

      {listingType === "meal" ? (
        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <input
            required
            value={form.fullName}
            onChange={(event) => setForm((current) => ({ ...current, fullName: event.target.value }))}
            placeholder="Full name"
            className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
          />
          <input
            required
            type="email"
            value={form.email}
            onChange={(event) => setForm((current) => ({ ...current, email: event.target.value }))}
            placeholder="Email address"
            className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
          />
          <input
            required
            value={form.phone}
            onChange={(event) => setForm((current) => ({ ...current, phone: event.target.value }))}
            placeholder="Phone number"
            className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
          />
          <input
            required
            min="1"
            type="number"
            value={form.guests}
            onChange={(event) => setForm((current) => ({ ...current, guests: event.target.value }))}
            placeholder="Guests"
            className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
          />
          <input
            required
            type="datetime-local"
            value={form.startDate}
            onChange={(event) => setForm((current) => ({ ...current, startDate: event.target.value }))}
            className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
          />
          <input
            type="datetime-local"
            value={form.endDate}
            onChange={(event) => setForm((current) => ({ ...current, endDate: event.target.value }))}
            className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
          />
          <textarea
            value={form.notes}
            onChange={(event) => setForm((current) => ({ ...current, notes: event.target.value }))}
            rows={5}
            placeholder={notesPlaceholder}
            className="brand-input rounded-2xl px-4 py-3 text-sm outline-none sm:col-span-2"
          />
        </div>
      ) : null}
      <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <button
          type="submit"
          disabled={isPending}
          className="accent-button rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
        >
          {isPending ? "Sending..." : submitLabel}
        </button>
        <p className="text-sm text-[var(--muted)]">{message}</p>
      </div>
    </form>
  );
}
