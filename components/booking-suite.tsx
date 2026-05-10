"use client";

import { useState, useTransition } from "react";

type ReservationForm = {
  guestName: string;
  email: string;
  phone: string;
  guestCount: string;
  reservationDate: string;
  occasion: string;
  notes: string;
};

type ContactForm = {
  fullName: string;
  email: string;
  subject: string;
  message: string;
};

const initialReservation: ReservationForm = {
  guestName: "",
  email: "",
  phone: "",
  guestCount: "2",
  reservationDate: "",
  occasion: "",
  notes: "",
};

const initialContact: ContactForm = {
  fullName: "",
  email: "",
  subject: "",
  message: "",
};

async function postJson(url: string, payload: Record<string, string>) {
  const response = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json()) as { message?: string };

  if (!response.ok) {
    throw new Error(data.message ?? "Something went wrong.");
  }

  return data;
}

export function BookingSuite() {
  const [reservation, setReservation] = useState(initialReservation);
  const [contact, setContact] = useState(initialContact);
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [reservationMessage, setReservationMessage] = useState("");
  const [contactMessage, setContactMessage] = useState("");
  const [newsletterMessage, setNewsletterMessage] = useState("");
  const [isReservationPending, startReservationTransition] = useTransition();
  const [isContactPending, startContactTransition] = useTransition();
  const [isNewsletterPending, startNewsletterTransition] = useTransition();

  return (
    <div className="grid gap-8 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <p className="eyebrow">Reservations & services</p>
        <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-white">
          Tell us what you are planning
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-relaxed text-[var(--muted)]">
          Apartment holds, table times, meal deliveries, and bespoke requests all start here. Complete each block in
          order — it helps the team respond faster with accurate options.
        </p>

        <form
          className="mt-8 space-y-10"
          onSubmit={(event) => {
            event.preventDefault();
            setReservationMessage("");

            startReservationTransition(async () => {
              try {
                await postJson("/api/reservations", {
                  ...reservation,
                  reservationDate: new Date(reservation.reservationDate).toISOString(),
                });
                setReservation(initialReservation);
                setReservationMessage("Request received. The Reserve team will confirm shortly.");
              } catch (error) {
                setReservationMessage(
                  error instanceof Error ? error.message : "Unable to send reservation request.",
                );
              }
            });
          }}
        >
          <div className="space-y-4 border-b border-[var(--line)] pb-8">
            <p className="booking-step-label">Step 1 · Who we are welcoming</p>
            <p className="text-sm text-[var(--muted)]">Primary guest and best contact for follow-up.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                value={reservation.guestName}
                onChange={(event) =>
                  setReservation((current) => ({ ...current, guestName: event.target.value }))
                }
                placeholder="Guest name"
                className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
              />
              <input
                required
                type="email"
                value={reservation.email}
                onChange={(event) =>
                  setReservation((current) => ({ ...current, email: event.target.value }))
                }
                placeholder="Email address"
                className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
              />
              <input
                required
                value={reservation.phone}
                onChange={(event) =>
                  setReservation((current) => ({ ...current, phone: event.target.value }))
                }
                placeholder="Phone (WhatsApp preferred)"
                className="brand-input rounded-2xl px-4 py-3 text-sm outline-none sm:col-span-2"
              />
            </div>
          </div>

          <div className="space-y-4 border-b border-[var(--line)] pb-8">
            <p className="booking-step-label">Step 2 · Timing & party size</p>
            <p className="text-sm text-[var(--muted)]">Even approximate timing helps us check kitchens and housekeeping.</p>
            <div className="grid gap-4 sm:grid-cols-2">
              <input
                required
                min="1"
                max="20"
                type="number"
                value={reservation.guestCount}
                onChange={(event) =>
                  setReservation((current) => ({ ...current, guestCount: event.target.value }))
                }
                placeholder="Guests or seats"
                className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
              />
              <input
                required
                type="datetime-local"
                value={reservation.reservationDate}
                onChange={(event) =>
                  setReservation((current) => ({ ...current, reservationDate: event.target.value }))
                }
                className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <p className="booking-step-label">Step 3 · Request type & notes</p>
            <p className="text-sm text-[var(--muted)]">
              Mention stays, in-room dining, celebrations, or delivery preferences in your own words.
            </p>
            <input
              value={reservation.occasion}
              onChange={(event) =>
                setReservation((current) => ({ ...current, occasion: event.target.value }))
              }
              placeholder="e.g. Apartment weekend · Business lunch · Family dinner delivery"
              className="brand-input w-full rounded-2xl px-4 py-3 text-sm outline-none"
            />
            <textarea
              value={reservation.notes}
              onChange={(event) =>
                setReservation((current) => ({ ...current, notes: event.target.value }))
              }
              placeholder="Anything else the concierge should know"
              rows={5}
              className="brand-input w-full rounded-2xl px-4 py-3 text-sm outline-none"
            />
          </div>

          <div className="flex flex-col gap-3 pt-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isReservationPending}
              className="accent-button rounded-full px-6 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isReservationPending ? "Sending..." : "Send request to Reserve"}
            </button>
            <p className="text-sm text-[var(--muted)]">{reservationMessage}</p>
          </div>
        </form>
      </section>

      <div className="grid gap-6">
        <section className="panel rounded-[2rem] p-6 sm:p-8">
          <p className="eyebrow">Direct message</p>
          <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-white">
            Prefer email first?
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Use this for partnerships, press, or questions that do not fit the reservation form.
          </p>
          <form
            className="mt-6 grid gap-4"
            onSubmit={(event) => {
              event.preventDefault();
              setContactMessage("");

              startContactTransition(async () => {
                try {
                  await postJson("/api/contact", contact);
                  setContact(initialContact);
                  setContactMessage("Message sent. The Reserve team will reply soon.");
                } catch (error) {
                  setContactMessage(
                    error instanceof Error ? error.message : "Unable to send your message.",
                  );
                }
              });
            }}
          >
            <input
              required
              value={contact.fullName}
              onChange={(event) =>
                setContact((current) => ({ ...current, fullName: event.target.value }))
              }
              placeholder="Full name"
              className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
            />
            <input
              required
              type="email"
              value={contact.email}
              onChange={(event) =>
                setContact((current) => ({ ...current, email: event.target.value }))
              }
              placeholder="Email"
              className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
            />
            <input
              required
              value={contact.subject}
              onChange={(event) =>
                setContact((current) => ({ ...current, subject: event.target.value }))
              }
              placeholder="Subject"
              className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
            />
            <textarea
              required
              rows={4}
              value={contact.message}
              onChange={(event) =>
                setContact((current) => ({ ...current, message: event.target.value }))
              }
              placeholder="Your message"
              className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={isContactPending}
              className="ghost-button rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isContactPending ? "Sending..." : "Send message"}
            </button>
            <p className="text-sm text-[var(--muted)]">{contactMessage}</p>
          </form>
        </section>

        <section className="panel rounded-[2rem] p-6 sm:p-8">
          <p className="eyebrow">Guest list</p>
          <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-white">
            Occasional updates
          </h3>
          <p className="mt-3 text-sm leading-relaxed text-[var(--muted)]">
            Apartment availability, menu features, and Reserve happenings — opt in anytime.
          </p>
          <form
            className="mt-6 flex flex-col gap-4 sm:flex-row"
            onSubmit={(event) => {
              event.preventDefault();
              setNewsletterMessage("");

              startNewsletterTransition(async () => {
                try {
                  await postJson("/api/newsletter", { email: newsletterEmail });
                  setNewsletterEmail("");
                  setNewsletterMessage("You are on the Reserve list.");
                } catch (error) {
                  setNewsletterMessage(
                    error instanceof Error ? error.message : "Unable to subscribe right now.",
                  );
                }
              });
            }}
          >
            <input
              required
              type="email"
              value={newsletterEmail}
              onChange={(event) => setNewsletterEmail(event.target.value)}
              placeholder="Your email address"
              className="brand-input min-w-0 flex-1 rounded-full px-4 py-3 text-sm outline-none"
            />
            <button
              type="submit"
              disabled={isNewsletterPending}
              className="newsletter-button rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isNewsletterPending ? "Joining..." : "Join now"}
            </button>
          </form>
          <p className="mt-4 text-sm text-[var(--muted)]">{newsletterMessage}</p>
        </section>
      </div>
    </div>
  );
}
