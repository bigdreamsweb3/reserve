import { redirect } from "next/navigation";

import { LogoutButton } from "@/components/logout-button";
import { getSessionUser } from "@/lib/auth";
import { formatNaira, getReserveListingById, listReserveBookingsForUser } from "@/lib/reserves";

export default async function DashboardPage() {
  const user = await getSessionUser();

  if (!user) {
    redirect("/login");
  }

  const bookings = await listReserveBookingsForUser(user.id);
  const upcoming = bookings.slice(0, 6);
  const spotlight = upcoming[0] ? await getReserveListingById(upcoming[0].listingId) : null;

  return (
    <main className="admin-shell min-h-screen px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="eyebrow">Your Account</p>
            <h1 className="mt-3 font-[family-name:var(--font-heading)] text-5xl text-[var(--ink)]">
              Welcome back, {user.fullName}
            </h1>
            <p className="mt-4 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
              Track your bookings, follow upcoming stays and meals, and keep a simple record of your Reserve activity.
            </p>
          </div>
          <LogoutButton />
        </div>

        <div className="grid gap-6 lg:grid-cols-[0.9fr_1.1fr]">
          <section className="admin-panel rounded-[2rem] p-6">
            <p className="eyebrow">Overview</p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-[var(--ink)]">
              Activity summary
            </h2>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              <div className="surface-card rounded-[1.5rem] p-5">
                <p className="text-sm text-[var(--ink-soft)]">Total bookings</p>
                <p className="mt-2 font-[family-name:var(--font-heading)] text-4xl text-[var(--ink)]">
                  {bookings.length}
                </p>
              </div>
              <div className="surface-card rounded-[1.5rem] p-5">
                <p className="text-sm text-[var(--ink-soft)]">Upcoming reserve</p>
                <p className="mt-2 font-[family-name:var(--font-heading)] text-4xl text-[var(--ink)]">
                  {spotlight ? formatNaira(spotlight.priceNgn) : "None"}
                </p>
              </div>
            </div>
            {spotlight ? (
              <div className="mt-6 rounded-[1.5rem] bg-[var(--surface-soft)] p-5">
                <p className="text-sm font-semibold text-[var(--ink)]">{spotlight.title}</p>
                <p className="mt-2 text-sm leading-7 text-[var(--ink-soft)]">{spotlight.shortDescription}</p>
              </div>
            ) : null}
          </section>

          <section className="admin-panel rounded-[2rem] p-6">
            <p className="eyebrow">Bookings</p>
            <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-[var(--ink)]">
              Recent activity
            </h2>
            <div className="mt-6 space-y-3">
              {upcoming.length === 0 ? (
                <p className="text-sm text-[var(--ink-soft)]">
                  You have no tracked bookings yet. Once you book a reserve while signed in, it will appear here.
                </p>
              ) : (
                upcoming.map((booking) => (
                  <div
                    key={booking.id}
                    className="rounded-[1.4rem] border border-[rgba(17,17,17,0.08)] bg-[var(--surface-soft)] p-4"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="text-sm font-semibold text-[var(--ink)]">{booking.listingTitle}</p>
                        <p className="mt-1 text-sm text-[var(--ink-soft)]">
                          {booking.listingType} • {new Date(booking.startDate).toLocaleString()}
                        </p>
                        {booking.mealOrderPayload ? (
                          <p className="mt-2 text-xs text-[var(--ink-soft)]">
                            Meal cart · {booking.mealOrderPayload.items.length} line
                            {booking.mealOrderPayload.items.length === 1 ? "" : "s"} ·{" "}
                            {formatNaira(booking.mealOrderPayload.subtotalNgn)}
                          </p>
                        ) : null}
                      </div>
                      <span className="surface-pill rounded-full px-3 py-1 text-xs capitalize">
                        {booking.status}
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      </div>
    </main>
  );
}
