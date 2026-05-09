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
    <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
      <section className="panel rounded-[2rem] p-6 sm:p-8">
        <p className="eyebrow">Reservations</p>
        <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-white">
          Book an apartment or reserve a meal
        </h3>
        <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--muted)]">
          Send a request for an apartment stay, table reservation, meal order, or custom hospitality plan inside Reserve. Reservation requests are stored in Neon once your database is connected.
        </p>

        <form
          className="mt-8 grid gap-4 sm:grid-cols-2"
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
            placeholder="Phone number"
            className="brand-input rounded-2xl px-4 py-3 text-sm outline-none"
          />
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
            className="brand-input rounded-2xl px-4 py-3 text-sm outline-none sm:col-span-2"
          />
          <input
            value={reservation.occasion}
            onChange={(event) =>
              setReservation((current) => ({ ...current, occasion: event.target.value }))
            }
            placeholder="Apartment stay, lunch, dinner, birthday..."
            className="brand-input rounded-2xl px-4 py-3 text-sm outline-none sm:col-span-2"
          />
          <textarea
            value={reservation.notes}
            onChange={(event) =>
              setReservation((current) => ({ ...current, notes: event.target.value }))
            }
            placeholder="Tell Reserve what you need"
            rows={5}
            className="brand-input rounded-2xl px-4 py-3 text-sm outline-none sm:col-span-2"
          />
          <div className="flex flex-col gap-3 sm:col-span-2 sm:flex-row sm:items-center sm:justify-between">
            <button
              type="submit"
              disabled={isReservationPending}
              className="accent-button rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
            >
              {isReservationPending ? "Sending..." : "Send request"}
            </button>
            <p className="text-sm text-[var(--muted)]">{reservationMessage}</p>
          </div>
        </form>
      </section>

      <div className="grid gap-6">
        <section className="panel rounded-[2rem] p-6 sm:p-8">
          <p className="eyebrow">Contact Reserve</p>
          <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-white">
            Talk to the team
          </h3>
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
              placeholder="Tell us if you need an apartment, meal order, or dining arrangement"
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
          <p className="eyebrow">The List</p>
          <h3 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-white">
            Join the guestbook
          </h3>
          <p className="mt-3 text-sm leading-7 text-[var(--muted)]">
            Get apartment updates, menu drops, and special Reserve announcements.
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
