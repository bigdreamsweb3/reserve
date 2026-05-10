"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";

import { MEAL_CATEGORY_OPTIONS } from "@/lib/meal-categories";
import type { ReserveBooking, ReserveListing, ReserveType } from "@/lib/reserves";
import { formatNaira } from "@/lib/reserves";

type AdminView = "overview" | "apartments" | "meals" | "orders";

type MealAddonFormRow = {
  label: string;
  priceNgn: string;
};

type FormState = {
  slug: string;
  title: string;
  type: ReserveListing["type"];
  location: string;
  shortDescription: string;
  description: string;
  priceNgn: string;
  billingPeriod: string;
  capacity: string;
  status: ReserveListing["status"];
  featured: boolean;
  imageTone: string;
  imageUrl: string;
  amenities: string;
  mealCategory: string;
  galleryUrls: string[];
  mealAddons: MealAddonFormRow[];
};

const defaultLocation = "Awka Book Foundation, Anambra State, Nigeria";

function createEmptyForm(type: ReserveType): FormState {
  if (type === "meal") {
    return {
      slug: "",
      title: "",
      type: "meal",
      location: "Reserve Restaurant, Awka Book Foundation, Anambra State, Nigeria",
      shortDescription: "",
      description: "",
      priceNgn: "0",
      billingPeriod: "plate",
      capacity: "1",
      status: "available",
      featured: false,
      imageTone: "dish-tone-fire",
      imageUrl: "",
      amenities: "Freshly made, Restaurant pickup",
      mealCategory: "rice-dishes",
      galleryUrls: [],
      mealAddons: [],
    };
  }

  return {
    slug: "",
    title: "",
    type: "apartment",
    location: defaultLocation,
    shortDescription: "",
    description: "",
    priceNgn: "0",
    billingPeriod: "night",
    capacity: "2",
    status: "available",
    featured: false,
    imageTone: "dish-tone-night",
    imageUrl: "",
    amenities: "Wi-Fi, Housekeeping",
    mealCategory: "",
    galleryUrls: [],
    mealAddons: [],
  };
}

function getListingBadgeClass(status: ReserveListing["status"]) {
  switch (status) {
    case "available":
      return "availability-available";
    case "limited":
      return "availability-limited";
    case "unavailable":
      return "availability-unavailable";
    default:
      return "availability-booked";
  }
}

function buildPayload(form: FormState) {
  const amenities = form.amenities
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);

  const normalizedStatus =
    form.type === "meal" && form.status !== "unavailable" ? "available" : form.status;

  const mealAddons =
    form.type === "meal"
      ? form.mealAddons
          .filter((row) => row.label.trim())
          .map((row) => ({
            label: row.label.trim(),
            priceNgn: Math.max(0, Math.trunc(Number(row.priceNgn) || 0)),
          }))
      : [];

  const galleryUrls = form.type === "apartment" ? form.galleryUrls.map((url) => url.trim()).filter(Boolean) : [];

  const mealCategory =
    form.type === "meal" && form.mealCategory.trim() ? form.mealCategory.trim() : null;

  return {
    slug: form.slug.trim(),
    title: form.title.trim(),
    type: form.type,
    location: form.location.trim(),
    shortDescription: form.shortDescription.trim(),
    description: form.description.trim(),
    priceNgn: Number(form.priceNgn),
    billingPeriod: form.billingPeriod.trim(),
    capacity: Number(form.capacity),
    status: normalizedStatus,
    featured: form.featured,
    imageTone: form.imageTone.trim(),
    imageUrl: form.imageUrl.trim() || null,
    amenities,
    mealCategory,
    galleryUrls,
    mealAddons,
  };
}

export function AdminDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [listings, setListings] = useState<ReserveListing[]>([]);
  const [bookings, setBookings] = useState<ReserveBooking[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<AdminView>("overview");
  const [form, setForm] = useState<FormState>(createEmptyForm("apartment"));
  const [message, setMessage] = useState("");
  const [isPending, startTransition] = useTransition();
  const [isUploading, startUploadTransition] = useTransition();

  async function fetchAdminData(key: string) {
    const headers = key ? { "x-admin-key": key } : undefined;
    const [listingResponse, bookingResponse] = await Promise.all([
      fetch("/api/admin/reserves", { headers }),
      fetch("/api/admin/bookings", { headers }),
    ]);

    const listingData = (await listingResponse.json()) as { listings: ReserveListing[] };
    setListings(listingData.listings);

    if (bookingResponse.ok) {
      const bookingData = (await bookingResponse.json()) as { bookings: ReserveBooking[] };
      setBookings(bookingData.bookings);
    } else {
      setBookings([]);
    }
  }

  useEffect(() => {
    fetchAdminData(adminKey).catch(() => setMessage("Unable to load admin data."));
  }, [adminKey]);

  const apartmentListings = useMemo(
    () => listings.filter((listing) => listing.type === "apartment"),
    [listings],
  );
  const mealListings = useMemo(() => listings.filter((listing) => listing.type === "meal"), [listings]);

  const selectedListing = useMemo(
    () => listings.find((listing) => listing.id === selectedId) ?? null,
    [listings, selectedId],
  );

  useEffect(() => {
    if (!selectedListing) {
      return;
    }

    setActiveView(selectedListing.type === "meal" ? "meals" : "apartments");
    setForm({
      slug: selectedListing.slug,
      title: selectedListing.title,
      type: selectedListing.type,
      location: selectedListing.location,
      shortDescription: selectedListing.shortDescription,
      description: selectedListing.description,
      priceNgn: String(selectedListing.priceNgn),
      billingPeriod: selectedListing.billingPeriod,
      capacity: String(selectedListing.capacity),
      status: selectedListing.status,
      featured: selectedListing.featured,
      imageTone: selectedListing.imageTone,
      imageUrl: selectedListing.imageUrl ?? "",
      amenities: selectedListing.amenities.join(", "),
      mealCategory: selectedListing.mealCategory ?? "other",
      galleryUrls: [...selectedListing.galleryUrls],
      mealAddons: selectedListing.mealAddons.map((addon) => ({
        label: addon.label,
        priceNgn: String(addon.priceNgn),
      })),
    });
  }, [selectedListing]);

  function resetForm(type: ReserveType) {
    setSelectedId(null);
    setForm(createEmptyForm(type));
  }

  function validateForm(): string | null {
    if (!form.title || form.title.length < 3 || form.title.length > 160) {
      return "Title must be between 3 and 160 characters.";
    }

    if (!form.slug || form.slug.length < 3 || form.slug.length > 120) {
      return "Slug must be between 3 and 120 characters.";
    }

    if (!form.location || form.location.length < 2 || form.location.length > 160) {
      return "Location must be between 2 and 160 characters.";
    }

    if (!form.shortDescription || form.shortDescription.length < 10 || form.shortDescription.length > 220) {
      return "Short description must be between 10 and 220 characters.";
    }

    if (!form.description || form.description.length < 20 || form.description.length > 2000) {
      return "Description must be between 20 and 2000 characters.";
    }

    if (!form.billingPeriod || form.billingPeriod.length < 2 || form.billingPeriod.length > 60) {
      return "Billing period must be between 2 and 60 characters.";
    }

    if (!form.imageTone || form.imageTone.length < 3 || form.imageTone.length > 80) {
      return "Image tone must be between 3 and 80 characters.";
    }

    const amenitiesList = form.amenities
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);

    if (amenitiesList.length === 0 || amenitiesList.length > 12) {
      return "Please provide between 1 and 12 amenities separated by commas.";
    }

    for (const amenity of amenitiesList) {
      if (amenity.length > 80) {
        return "Each amenity must be 80 characters or less.";
      }
    }

    const priceNum = Number(form.priceNgn);
    if (Number.isNaN(priceNum) || priceNum < 0) {
      return "Price must be a valid number 0 or higher.";
    }

    const capacityNum = Number(form.capacity);
    if (Number.isNaN(capacityNum) || capacityNum < 1 || capacityNum > 50) {
      return "Capacity must be a number between 1 and 50.";
    }

    if (form.type === "meal") {
      if (form.mealAddons.length > 24) {
        return "A meal can have at most 24 add-on rows.";
      }

      for (const row of form.mealAddons) {
        if (row.label.trim() && row.label.length > 120) {
          return "Each add-on label must be 120 characters or less.";
        }

        if (row.label.trim() && Number.isNaN(Number(row.priceNgn))) {
          return "Each add-on needs a valid price in naira.";
        }
      }
    }

    if (form.type === "apartment" && form.galleryUrls.length > 16) {
      return "You can attach at most 16 gallery images for an apartment.";
    }

    return null;
  }

  const listingPanel =
    activeView === "apartments"
      ? {
          title: "Apartments",
          subtitle: "Inventory, hero imagery, and multi-angle room photos.",
          listings: apartmentListings,
          type: "apartment" as const,
          newLabel: "New apartment",
        }
      : activeView === "meals"
        ? {
            title: "Meals",
            subtitle: "Menu categories, optional add-ons, and availability.",
            listings: mealListings,
            type: "meal" as const,
            newLabel: "New meal",
          }
        : null;

  const statusOptions =
    form.type === "meal"
      ? [
          { value: "available", label: "Available" },
          { value: "unavailable", label: "Unavailable" },
        ]
      : [
          { value: "available", label: "Available" },
          { value: "limited", label: "Limited" },
          { value: "booked", label: "Booked" },
        ];

  const pendingOrders = useMemo(() => bookings.filter((booking) => booking.status === "pending").length, [bookings]);

  const navItems: { id: AdminView; label: string; hint: string }[] = [
    { id: "overview", label: "Overview", hint: "Snapshot" },
    { id: "apartments", label: "Apartments", hint: `${apartmentListings.length} live` },
    { id: "meals", label: "Meals & menu", hint: `${mealListings.length} items` },
    { id: "orders", label: "Orders", hint: `${pendingOrders} pending` },
  ];

  return (
    <div className="admin-app min-h-screen">
      <div className="admin-shell flex min-h-screen flex-col lg:flex-row">
        <aside className="admin-sidebar border-b border-[rgba(17,17,17,0.08)] bg-[rgba(255,255,255,0.94)] px-5 py-8 lg:w-72 lg:shrink-0 lg:border-b-0 lg:border-r">
          <div>
            <p className="text-[10px] font-semibold uppercase tracking-[0.35em] text-[#295227]">Reserve</p>
            <h1 className="mt-2 font-[family-name:var(--font-heading)] text-2xl text-[var(--ink)]">Operations</h1>
            <p className="mt-2 text-xs leading-6 text-[var(--ink-soft)]">
              Awka · Anambra State · Restaurant & apartments
            </p>
          </div>

          <nav className="mt-8 space-y-1">
            {navItems.map((item) => {
              const active = activeView === item.id;

              return (
                <button
                  key={item.id}
                  type="button"
                  onClick={() => {
                    setActiveView(item.id);
                    setSelectedId(null);
                    if (item.id === "apartments") {
                      setForm(createEmptyForm("apartment"));
                    } else if (item.id === "meals") {
                      setForm(createEmptyForm("meal"));
                    }
                  }}
                  className={`flex w-full flex-col rounded-2xl px-4 py-3 text-left transition ${
                    active ? "bg-[#295227] text-white shadow-md" : "hover:bg-[rgba(41,82,39,0.08)]"
                  }`}
                >
                  <span className="text-sm font-semibold">{item.label}</span>
                  <span className={`text-xs ${active ? "text-white/80" : "text-[var(--ink-soft)]"}`}>{item.hint}</span>
                </button>
              );
            })}
          </nav>

          <div className="mt-8 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[var(--surface-soft)] p-4">
            <p className="text-xs font-semibold text-[var(--ink)]">Access</p>
            <input
              value={adminKey}
              onChange={(event) => setAdminKey(event.target.value)}
              placeholder="Admin key (optional)"
              className="admin-input mt-3 w-full rounded-xl px-3 py-2 text-xs outline-none"
            />
            <p className="mt-2 text-[11px] leading-5 text-[var(--ink-soft)]">
              Logged-in admins can skip the key. Use it for automation or emergency edits.
            </p>
          </div>
        </aside>

        <div className="flex-1 px-5 py-8 lg:px-10">
          {activeView === "overview" ? (
            <div className="mx-auto max-w-5xl space-y-8">
              <header>
                <p className="eyebrow">Today</p>
                <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl text-[var(--ink)]">
                  Reserve control center
                </h2>
                <p className="mt-3 max-w-2xl text-sm leading-7 text-[var(--ink-soft)]">
                  Manage the apartment gallery experience, keep the menu categorized for Nigerian guests, configure paid
                  add-ons per plate, and monitor every booking or multi-item meal order from one calm workspace.
                </p>
              </header>

              <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
                {[
                  { label: "Apartments", value: apartmentListings.length, tone: "text-[#295227]" },
                  { label: "Meals", value: mealListings.length, tone: "text-[#8b532b]" },
                  { label: "Open orders", value: bookings.length, tone: "text-[#111]" },
                  { label: "Pending review", value: pendingOrders, tone: "text-[#f05223]" },
                ].map((card) => (
                  <div key={card.label} className="admin-panel rounded-2xl p-5">
                    <p className="text-xs uppercase tracking-[0.2em] text-[var(--ink-soft)]">{card.label}</p>
                    <p className={`mt-3 font-[family-name:var(--font-heading)] text-4xl ${card.tone}`}>{card.value}</p>
                  </div>
                ))}
              </div>

              <div className="grid gap-6 lg:grid-cols-2">
                <div className="admin-panel rounded-[1.75rem] p-6">
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl text-[var(--ink)]">Apartments</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                    Upload a hero image plus additional angles so guests can swipe through the room before they book.
                  </p>
                  <button
                    type="button"
                    className="accent-button mt-5 rounded-full px-5 py-2.5 text-sm font-semibold"
                    onClick={() => {
                      setActiveView("apartments");
                      resetForm("apartment");
                    }}
                  >
                    Go to apartments
                  </button>
                </div>
                <div className="admin-panel rounded-[1.75rem] p-6">
                  <h3 className="font-[family-name:var(--font-heading)] text-2xl text-[var(--ink)]">Meals & cart</h3>
                  <p className="mt-3 text-sm leading-7 text-[var(--ink-soft)]">
                    Group fried rice with jollof, expose drinks separately, and attach optional extras like “extra
                    pepper” with prices.
                  </p>
                  <button
                    type="button"
                    className="accent-button mt-5 rounded-full px-5 py-2.5 text-sm font-semibold"
                    onClick={() => {
                      setActiveView("meals");
                      resetForm("meal");
                    }}
                  >
                    Go to meals
                  </button>
                </div>
              </div>
            </div>
          ) : null}

          {activeView === "orders" ? (
            <div className="mx-auto max-w-4xl space-y-6">
              <header>
                <p className="eyebrow">Fulfillment</p>
                <h2 className="mt-2 font-[family-name:var(--font-heading)] text-4xl text-[var(--ink)]">Orders</h2>
                <p className="mt-3 text-sm text-[var(--ink-soft)]">
                  Apartment holds and meal carts land here. Multi-item meals include a structured breakdown.
                </p>
              </header>

              <div className="space-y-4">
                {bookings.length === 0 ? (
                  <div className="admin-panel rounded-2xl p-8 text-sm text-[var(--ink-soft)]">No orders yet.</div>
                ) : (
                  bookings.map((booking) => (
                    <div key={booking.id} className="admin-panel rounded-2xl p-6">
                      <div className="flex flex-wrap items-start justify-between gap-4">
                        <div>
                          <p className="text-sm font-semibold text-[var(--ink)]">{booking.fullName}</p>
                          <p className="mt-1 text-sm text-[var(--ink-soft)]">
                            {booking.email} · {booking.phone}
                          </p>
                          <p className="mt-2 text-xs text-[var(--ink-soft)]">
                            {booking.listingType === "meal" ? "Meal" : "Apartment"} · requested{" "}
                            {new Date(booking.startDate).toLocaleString()}
                          </p>
                        </div>
                        <select
                          value={booking.status}
                          className="admin-input rounded-full px-3 py-2 text-xs outline-none"
                          onChange={(event) => {
                            const nextStatus = event.target.value as ReserveBooking["status"];

                            startTransition(async () => {
                              try {
                                const response = await fetch(`/api/admin/bookings/${booking.id}`, {
                                  method: "PATCH",
                                  headers: {
                                    "Content-Type": "application/json",
                                    "x-admin-key": adminKey,
                                  },
                                  body: JSON.stringify({ status: nextStatus }),
                                });

                                const data = (await response.json()) as { message?: string };

                                if (!response.ok) {
                                  throw new Error(data.message ?? "Unable to update booking status.");
                                }

                                setBookings((current) =>
                                  current.map((item) =>
                                    item.id === booking.id ? { ...item, status: nextStatus } : item,
                                  ),
                                );
                                setMessage("Booking status updated.");
                              } catch (error) {
                                setMessage(
                                  error instanceof Error ? error.message : "Unable to update booking status.",
                                );
                              }
                            });
                          }}
                        >
                          <option value="pending">Pending</option>
                          <option value="confirmed">Confirmed</option>
                          <option value="cancelled">Cancelled</option>
                          <option value="completed">Completed</option>
                        </select>
                      </div>

                      {booking.mealOrderPayload ? (
                        <div className="mt-4 rounded-2xl border border-[rgba(17,17,17,0.08)] bg-[var(--surface-soft)] p-4">
                          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--ink-soft)]">
                            Meal cart
                          </p>
                          <ul className="mt-3 space-y-2 text-sm text-[var(--ink)]">
                            {booking.mealOrderPayload.items.map((item, itemIndex) => (
                              <li key={`${item.listingId}-${itemIndex}`} className="flex justify-between gap-4">
                                <span>
                                  {item.quantity}× {item.title}
                                  {item.addons.length > 0
                                    ? ` (+ ${item.addons.map((addon) => addon.label).join(", ")})`
                                    : ""}
                                </span>
                                <span className="shrink-0 font-semibold">{formatNaira(item.lineTotalNgn)}</span>
                              </li>
                            ))}
                          </ul>
                          <p className="mt-3 text-sm font-semibold text-[var(--ink)]">
                            Subtotal {formatNaira(booking.mealOrderPayload.subtotalNgn)}
                          </p>
                        </div>
                      ) : (
                        <p className="mt-4 text-sm text-[var(--ink-soft)]">
                          Listing: <span className="font-medium text-[var(--ink)]">{booking.listingTitle}</span> ·{" "}
                          {booking.guests} guests
                        </p>
                      )}

                      {booking.notes ? (
                        <p className="mt-3 text-sm text-[var(--ink-soft)]">Notes: {booking.notes}</p>
                      ) : null}
                    </div>
                  ))
                )}
              </div>
            </div>
          ) : null}

          {listingPanel ? (
            <div className="mx-auto grid max-w-6xl gap-8 xl:grid-cols-[0.95fr_1.25fr]">
              <section className="space-y-4">
                <div className="admin-panel rounded-[1.75rem] p-6">
                  <div className="flex items-center justify-between gap-4">
                    <div>
                      <h2 className="font-[family-name:var(--font-heading)] text-3xl text-[var(--ink)]">
                        {listingPanel.title}
                      </h2>
                      <p className="mt-2 text-sm text-[var(--ink-soft)]">{listingPanel.subtitle}</p>
                    </div>
                    <button
                      type="button"
                      className="surface-chip rounded-full px-4 py-2 text-sm font-semibold"
                      onClick={() => resetForm(listingPanel.type)}
                    >
                      {listingPanel.newLabel}
                    </button>
                  </div>

                  <div className="mt-5 space-y-3">
                    {listingPanel.listings.length === 0 ? (
                      <p className="text-sm text-[var(--ink-soft)]">Nothing here yet.</p>
                    ) : (
                      listingPanel.listings.map((listing) => (
                        <div
                          key={listing.id}
                          className="flex items-start justify-between gap-3 rounded-[1.4rem] border border-[rgba(17,17,17,0.08)] bg-[var(--surface-soft)] px-4 py-4"
                        >
                          <button
                            type="button"
                            onClick={() => setSelectedId(listing.id)}
                            className="flex flex-1 items-start justify-between text-left"
                          >
                            <div>
                              <p className="text-sm font-semibold text-[var(--ink)]">{listing.title}</p>
                              <p className="mt-1 text-sm text-[var(--ink-soft)]">
                                {formatNaira(listing.priceNgn)} • {listing.location}
                              </p>
                              {listing.type === "meal" && listing.mealCategory ? (
                                <p className="mt-1 text-xs text-[#8b532b]">{listing.mealCategory}</p>
                              ) : null}
                            </div>
                            <span
                              className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getListingBadgeClass(listing.status)}`}
                            >
                              {listing.status}
                            </span>
                          </button>
                          <button
                            type="button"
                            onClick={(event) => {
                              event.stopPropagation();
                              if (!window.confirm(`Delete "${listing.title}"? This cannot be undone.`)) {
                                return;
                              }

                              startTransition(async () => {
                                try {
                                  const response = await fetch(`/api/admin/reserves/${listing.id}`, {
                                    method: "DELETE",
                                    headers: {
                                      "x-admin-key": adminKey,
                                    },
                                  });

                                  if (!response.ok) {
                                    const data = (await response.json()) as { message?: string };
                                    throw new Error(data.message ?? "Failed to delete listing.");
                                  }

                                  await fetchAdminData(adminKey);
                                  setMessage("Listing deleted successfully.");
                                } catch (error) {
                                  setMessage(
                                    error instanceof Error ? error.message : "Unable to delete listing.",
                                  );
                                }
                              });
                            }}
                            className="rounded-full bg-red-100 px-3 py-2 text-xs font-semibold text-red-700 transition hover:bg-red-200"
                          >
                            Delete
                          </button>
                        </div>
                      ))
                    )}
                  </div>
                </div>
              </section>

              <section className="admin-panel rounded-[1.75rem] p-6 sm:p-8">
                <div className="mb-6">
                  <p className="eyebrow">{form.type === "meal" ? "Meal editor" : "Apartment editor"}</p>
                  <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-[var(--ink)]">
                    {selectedId
                      ? form.type === "meal"
                        ? "Update meal"
                        : "Update apartment"
                      : form.type === "meal"
                        ? "Create meal"
                        : "Create apartment"}
                  </h2>
                  <p className="mt-2 text-sm text-[var(--ink-soft)]">
                    {form.type === "meal"
                      ? "Pick a menu category, define priced add-ons, and keep the kitchen availability honest."
                      : "Lead with a hero photo, then add supporting angles for the listing gallery."}
                  </p>
                </div>

                <div className="grid gap-4 sm:grid-cols-2">
                  <input
                    value={form.title}
                    onChange={(event) => setForm((current) => ({ ...current, title: event.target.value }))}
                    placeholder={form.type === "meal" ? "Meal name" : "Apartment title"}
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
                  />
                  <input
                    value={form.slug}
                    onChange={(event) => setForm((current) => ({ ...current, slug: event.target.value }))}
                    placeholder="Slug"
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
                  />
                  <select
                    value={form.type}
                    onChange={(event) => {
                      const nextType = event.target.value as ReserveType;
                      setSelectedId(null);
                      setForm(createEmptyForm(nextType));
                    }}
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
                  >
                    <option value="apartment">Apartment</option>
                    <option value="meal">Meal</option>
                  </select>
                  <input
                    value={form.location}
                    onChange={(event) => setForm((current) => ({ ...current, location: event.target.value }))}
                    placeholder="Location"
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
                  />

                  {form.type === "meal" ? (
                    <select
                      value={form.mealCategory}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, mealCategory: event.target.value }))
                      }
                      className="admin-input rounded-2xl px-4 py-3 text-sm outline-none sm:col-span-2"
                    >
                      {MEAL_CATEGORY_OPTIONS.map((option) => (
                        <option key={option.value} value={option.value}>
                          {option.label}
                        </option>
                      ))}
                    </select>
                  ) : null}

                  <input
                    value={form.priceNgn}
                    onChange={(event) => setForm((current) => ({ ...current, priceNgn: event.target.value }))}
                    placeholder="Price in naira"
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
                  />
                  <input
                    value={form.billingPeriod}
                    onChange={(event) => setForm((current) => ({ ...current, billingPeriod: event.target.value }))}
                    placeholder={form.type === "meal" ? "plate, bowl, bottle..." : "night"}
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
                  />
                  <input
                    value={form.capacity}
                    onChange={(event) => setForm((current) => ({ ...current, capacity: event.target.value }))}
                    placeholder={form.type === "meal" ? "Portions or serving size" : "Guest capacity"}
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
                  />
                  <select
                    value={form.type === "meal" && form.status !== "unavailable" ? "available" : form.status}
                    onChange={(event) =>
                      setForm((current) => ({
                        ...current,
                        status: event.target.value as ReserveListing["status"],
                      }))
                    }
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
                  >
                    {statusOptions.map((option) => (
                      <option key={option.value} value={option.value}>
                        {option.label}
                      </option>
                    ))}
                  </select>
                  <input
                    value={form.imageTone}
                    onChange={(event) => setForm((current) => ({ ...current, imageTone: event.target.value }))}
                    placeholder="Image tone class"
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
                  />
                  <input
                    value={form.imageUrl}
                    onChange={(event) => setForm((current) => ({ ...current, imageUrl: event.target.value }))}
                    placeholder="Hero image URL"
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none"
                  />
                  <label className="admin-input flex cursor-pointer items-center justify-center rounded-2xl px-4 py-3 text-sm outline-none">
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(event) => {
                        const file = event.target.files?.[0];
                        if (!file) {
                          return;
                        }

                        startUploadTransition(async () => {
                          try {
                            const body = new FormData();
                            body.append("file", file);

                            const response = await fetch("/api/admin/uploads", {
                              method: "POST",
                              headers: {
                                "x-admin-key": adminKey,
                              },
                              body,
                            });

                            const data = (await response.json()) as { message?: string; url?: string };

                            if (!response.ok || !data.url) {
                              throw new Error(data.message ?? "Unable to upload image.");
                            }

                            setForm((current) => ({ ...current, imageUrl: data.url ?? "" }));
                            setMessage("Hero image uploaded.");
                          } catch (error) {
                            setMessage(error instanceof Error ? error.message : "Unable to upload image.");
                          }
                        });
                      }}
                    />
                    {isUploading ? "Uploading..." : "Upload hero image"}
                  </label>

                  {form.type === "apartment" ? (
                    <div className="space-y-3 sm:col-span-2">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-medium text-[var(--ink)]">Room gallery (extra angles)</p>
                        <label className="surface-chip cursor-pointer rounded-full px-4 py-2 text-xs font-semibold">
                          <input
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={(event) => {
                              const file = event.target.files?.[0];
                              if (!file) {
                                return;
                              }

                              startUploadTransition(async () => {
                                try {
                                  const body = new FormData();
                                  body.append("file", file);

                                  const response = await fetch("/api/admin/uploads", {
                                    method: "POST",
                                    headers: { "x-admin-key": adminKey },
                                    body,
                                  });

                                  const data = (await response.json()) as { message?: string; url?: string };

                                  if (!response.ok || !data.url) {
                                    throw new Error(data.message ?? "Unable to upload image.");
                                  }

                                  setForm((current) => ({
                                    ...current,
                                    galleryUrls: [...current.galleryUrls, data.url ?? ""].slice(0, 16),
                                  }));
                                  setMessage("Gallery image added.");
                                } catch (error) {
                                  setMessage(error instanceof Error ? error.message : "Unable to upload image.");
                                }
                              });
                            }}
                          />
                          Add gallery photo
                        </label>
                      </div>
                      {form.galleryUrls.length === 0 ? (
                        <p className="text-xs text-[var(--ink-soft)]">No extra angles yet.</p>
                      ) : (
                        <ul className="space-y-2">
                          {form.galleryUrls.map((url, index) => (
                            <li
                              key={`${url}-${index}`}
                              className="flex items-center justify-between gap-3 rounded-xl border border-[rgba(17,17,17,0.08)] bg-[var(--surface-soft)] px-3 py-2 text-xs"
                            >
                              <span className="truncate text-[var(--ink)]">{url}</span>
                              <button
                                type="button"
                                className="shrink-0 text-red-600"
                                onClick={() =>
                                  setForm((current) => ({
                                    ...current,
                                    galleryUrls: current.galleryUrls.filter((_, itemIndex) => itemIndex !== index),
                                  }))
                                }
                              >
                                Remove
                              </button>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  ) : null}

                  {form.type === "meal" ? (
                    <div className="space-y-3 sm:col-span-2">
                      <div className="flex flex-wrap items-center justify-between gap-3">
                        <p className="text-sm font-medium text-[var(--ink)]">Paid or free add-ons</p>
                        <button
                          type="button"
                          className="surface-chip rounded-full px-4 py-2 text-xs font-semibold"
                          onClick={() =>
                            setForm((current) => ({
                              ...current,
                              mealAddons: [...current.mealAddons, { label: "", priceNgn: "0" }],
                            }))
                          }
                        >
                          Add row
                        </button>
                      </div>
                      {form.mealAddons.length === 0 ? (
                        <p className="text-xs text-[var(--ink-soft)]">
                          Optional. Example: “Extra pepper” at ₦0.
                        </p>
                      ) : (
                        <div className="space-y-2">
                          {form.mealAddons.map((row, index) => (
                            <div key={index} className="flex flex-wrap gap-2">
                              <input
                                value={row.label}
                                onChange={(event) =>
                                  setForm((current) => ({
                                    ...current,
                                    mealAddons: current.mealAddons.map((addon, addonIndex) =>
                                      addonIndex === index ? { ...addon, label: event.target.value } : addon,
                                    ),
                                  }))
                                }
                                placeholder="Label (e.g. Extra soya sauce)"
                                className="admin-input min-w-[200px] flex-1 rounded-xl px-3 py-2 text-sm outline-none"
                              />
                              <input
                                value={row.priceNgn}
                                onChange={(event) =>
                                  setForm((current) => ({
                                    ...current,
                                    mealAddons: current.mealAddons.map((addon, addonIndex) =>
                                      addonIndex === index ? { ...addon, priceNgn: event.target.value } : addon,
                                    ),
                                  }))
                                }
                                placeholder="₦"
                                className="admin-input w-28 rounded-xl px-3 py-2 text-sm outline-none"
                              />
                              <button
                                type="button"
                                className="rounded-full px-3 text-sm text-red-600"
                                onClick={() =>
                                  setForm((current) => ({
                                    ...current,
                                    mealAddons: current.mealAddons.filter((_, addonIndex) => addonIndex !== index),
                                  }))
                                }
                              >
                                Remove
                              </button>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : null}

                  <input
                    value={form.shortDescription}
                    onChange={(event) =>
                      setForm((current) => ({ ...current, shortDescription: event.target.value }))
                    }
                    placeholder={form.type === "meal" ? "Short menu description" : "Short apartment description"}
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none sm:col-span-2"
                  />
                  <textarea
                    value={form.description}
                    onChange={(event) => setForm((current) => ({ ...current, description: event.target.value }))}
                    rows={5}
                    placeholder={
                      form.type === "meal"
                        ? "Describe the meal, portions, sides, and preparation style"
                        : "Describe the apartment, comfort, and stay details"
                    }
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none sm:col-span-2"
                  />
                  <input
                    value={form.amenities}
                    onChange={(event) => setForm((current) => ({ ...current, amenities: event.target.value }))}
                    placeholder={
                      form.type === "meal"
                        ? "Highlights separated by commas"
                        : "Amenities separated by commas"
                    }
                    className="admin-input rounded-2xl px-4 py-3 text-sm outline-none sm:col-span-2"
                  />
                  <label className="flex items-center gap-3 text-sm text-[var(--ink-soft)] sm:col-span-2">
                    <input
                      type="checkbox"
                      checked={form.featured}
                      onChange={(event) =>
                        setForm((current) => ({ ...current, featured: event.target.checked }))
                      }
                    />
                    Featured on homepage
                  </label>
                  <div className="sm:col-span-2">
                    <p className="mb-3 text-sm text-[var(--ink-soft)]">Hero preview</p>
                    <div className="relative h-52 overflow-hidden rounded-[1.5rem] border border-[rgba(17,17,17,0.08)] bg-[var(--surface-soft)]">
                      {form.imageUrl ? (
                        <Image
                          src={form.imageUrl}
                          alt={form.title || "Listing preview"}
                          fill
                          sizes="(max-width: 768px) 100vw, 50vw"
                          className="object-cover"
                        />
                      ) : (
                        <div className={`h-full w-full ${form.imageTone}`} />
                      )}
                    </div>
                  </div>
                </div>

                <div className="mt-6 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                  <button
                    type="button"
                    className="accent-button rounded-full px-5 py-3 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-70"
                    disabled={isPending}
                    onClick={() => {
                      setMessage("");
                      const validationError = validateForm();
                      if (validationError) {
                        setMessage(validationError);
                        return;
                      }

                      startTransition(async () => {
                        try {
                          const payload = buildPayload(form);
                          const endpoint = selectedId ? `/api/admin/reserves/${selectedId}` : "/api/admin/reserves";
                          const method = selectedId ? "PATCH" : "POST";
                          const response = await fetch(endpoint, {
                            method,
                            headers: {
                              "Content-Type": "application/json",
                              "x-admin-key": adminKey,
                            },
                            body: JSON.stringify(payload),
                          });

                          const data = (await response.json()) as { message?: string };

                          if (!response.ok) {
                            throw new Error(data.message ?? "Unable to save listing.");
                          }

                          await fetchAdminData(adminKey);
                          setMessage(selectedId ? "Listing updated successfully." : "Listing created successfully.");
                          if (!selectedId) {
                            resetForm(form.type);
                          }
                        } catch (error) {
                          setMessage(error instanceof Error ? error.message : "Unable to save listing.");
                        }
                      });
                    }}
                  >
                    {isPending
                      ? "Saving..."
                      : selectedId
                        ? "Save changes"
                        : form.type === "meal"
                          ? "Publish meal"
                          : "Publish apartment"}
                  </button>
                  <p className="text-sm text-[var(--ink-soft)]">{message}</p>
                </div>
              </section>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
}
