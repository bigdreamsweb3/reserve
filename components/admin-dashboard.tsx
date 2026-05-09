"use client";

import Image from "next/image";
import { useEffect, useMemo, useState, useTransition } from "react";

import type { ReserveBooking, ReserveListing, ReserveType } from "@/lib/reserves";
import { formatNaira } from "@/lib/reserves";

type AdminView = "apartments" | "meals" | "bookings";

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

export function AdminDashboard() {
  const [adminKey, setAdminKey] = useState("");
  const [listings, setListings] = useState<ReserveListing[]>([]);
  const [bookings, setBookings] = useState<ReserveBooking[]>([]);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [activeView, setActiveView] = useState<AdminView>("apartments");
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
  const mealListings = useMemo(
    () => listings.filter((listing) => listing.type === "meal"),
    [listings],
  );
  const apartmentBookings = useMemo(
    () => bookings.filter((booking) => booking.listingType === "apartment"),
    [bookings],
  );

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
    });
  }, [selectedListing]);

  function resetForm(type: ReserveType) {
    setSelectedId(null);
    setForm(createEmptyForm(type));
  }

  function buildPayload() {
    const normalizedStatus =
      form.type === "meal" && form.status !== "unavailable" ? "available" : form.status;

    return {
      ...form,
      status: normalizedStatus,
      priceNgn: Number(form.priceNgn),
      capacity: Number(form.capacity),
      amenities: form.amenities
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean),
    };
  }

  function validateForm(): string | null {
    // Validate required text fields
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

    // Validate amenities
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

    // Validate numbers
    const priceNum = Number(form.priceNgn);
    if (isNaN(priceNum) || priceNum < 0) {
      return "Price must be a valid number 0 or higher.";
    }

    const capacityNum = Number(form.capacity);
    if (isNaN(capacityNum) || capacityNum < 1 || capacityNum > 50) {
      return "Capacity must be a number between 1 and 50.";
    }

    return null;
  }

  const listingPanel =
    activeView === "apartments"
      ? {
          title: "Apartments",
          subtitle: "Manage apartment inventory and availability.",
          listings: apartmentListings,
          type: "apartment" as const,
          newLabel: "New apartment",
        }
      : activeView === "meals"
        ? {
            title: "Meals",
            subtitle: "Manage menu items, drinks, and meal availability.",
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

  return (
    <div className="admin-shell min-h-screen px-5 py-10 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="mb-8 flex flex-col gap-3">
          <p className="eyebrow">Reserve Admin</p>
          <h1 className="font-[family-name:var(--font-heading)] text-5xl text-[var(--ink)]">
            Manage apartments, meals, and orders
          </h1>
          <p className="max-w-3xl text-sm leading-7 text-[var(--ink-soft)]">
            Keep apartments and meals in separate workflows, update meal availability professionally, and manage apartment bookings from one admin space.
          </p>
        </div>

        <div className="mb-6 admin-panel rounded-[2rem] p-6">
          <input
            value={adminKey}
            onChange={(event) => setAdminKey(event.target.value)}
            placeholder="Admin access key"
            className="admin-input w-full rounded-2xl px-4 py-3 text-sm outline-none"
          />
        </div>

        <div className="mb-6 flex flex-wrap gap-3">
          {[
            { id: "apartments", label: "Apartments" },
            { id: "meals", label: "Meals" },
            { id: "bookings", label: "Apartment bookings" },
          ].map((item) => {
            const isActive = activeView === item.id;

            return (
              <button
                key={item.id}
                type="button"
                className={
                  isActive
                    ? "accent-button rounded-full px-5 py-3 text-sm font-semibold transition"
                    : "surface-chip rounded-full px-5 py-3 text-sm font-semibold transition"
                }
                onClick={() => {
                  setActiveView(item.id as AdminView);
                  setSelectedId(null);
                  if (item.id === "apartments") {
                    setForm(createEmptyForm("apartment"));
                  } else if (item.id === "meals") {
                    setForm(createEmptyForm("meal"));
                  }
                }}
              >
                {item.label}
              </button>
            );
          })}
        </div>

        <div className="grid gap-6 xl:grid-cols-[0.82fr_1.18fr]">
          <section className="space-y-6">
            {listingPanel ? (
              <div className="admin-panel rounded-[2rem] p-6">
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <h2 className="font-[family-name:var(--font-heading)] text-3xl text-[var(--ink)]">
                      {listingPanel.title}
                    </h2>
                    <p className="mt-2 text-sm text-[var(--ink-soft)]">{listingPanel.subtitle}</p>
                  </div>
                  <button
                    type="button"
                    className="surface-chip rounded-full px-4 py-2 text-sm"
                    onClick={() => resetForm(listingPanel.type)}
                  >
                    {listingPanel.newLabel}
                  </button>
                </div>

                <div className="mt-5 space-y-3">
                  {listingPanel.listings.length === 0 ? (
                    <p className="text-sm text-[var(--ink-soft)]">
                      No {listingPanel.title.toLowerCase()} created yet.
                    </p>
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
                          </div>
                          <span
                            className={`rounded-full px-3 py-1 text-xs font-medium capitalize ${getListingBadgeClass(listing.status)}`}
                          >
                            {listing.status}
                          </span>
                        </button>
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
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
            ) : (
              <div className="admin-panel rounded-[2rem] p-6">
                <h2 className="font-[family-name:var(--font-heading)] text-3xl text-[var(--ink)]">
                  Apartment bookings
                </h2>
                <p className="mt-2 text-sm text-[var(--ink-soft)]">
                  Meals are handled as menu inventory. This queue is for apartment booking requests only.
                </p>

                <div className="mt-5 space-y-3">
                  {apartmentBookings.length === 0 ? (
                    <p className="text-sm text-[var(--ink-soft)]">No apartment bookings yet.</p>
                  ) : (
                    apartmentBookings.map((booking) => (
                      <div
                        key={booking.id}
                        className="rounded-[1.4rem] border border-[rgba(17,17,17,0.08)] bg-[var(--surface-soft)] p-4"
                      >
                        <div className="flex items-start justify-between gap-4">
                          <div>
                            <p className="text-sm font-semibold text-[var(--ink)]">{booking.fullName}</p>
                            <p className="mt-1 text-sm text-[var(--ink-soft)]">
                              {booking.listingTitle} • {booking.email}
                            </p>
                            <p className="mt-1 text-xs text-[var(--ink-soft)]">
                              {booking.guests} guests • starts {new Date(booking.startDate).toLocaleString()}
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
                                    error instanceof Error
                                      ? error.message
                                      : "Unable to update booking status.",
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
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}
          </section>

          <section className="admin-panel rounded-[2rem] p-6 sm:p-8">
            <div className="mb-6">
              <p className="eyebrow">
                {form.type === "meal" ? "Meal Editor" : "Apartment Editor"}
              </p>
              <h2 className="mt-3 font-[family-name:var(--font-heading)] text-3xl text-[var(--ink)]">
                {selectedId
                  ? form.type === "meal"
                    ? "Edit meal"
                    : "Edit apartment"
                  : form.type === "meal"
                    ? "Create new meal"
                    : "Create new apartment"}
              </h2>
              <p className="mt-2 text-sm text-[var(--ink-soft)]">
                {form.type === "meal"
                  ? "Meals behave like menu items. Keep them available by default and only mark them unavailable when the kitchen cannot serve them."
                  : "Apartments keep their own reservation-style availability and stay separate from the menu workflow."}
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
                placeholder="Uploaded image URL"
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
                        setMessage("Image uploaded successfully.");
                      } catch (error) {
                        setMessage(
                          error instanceof Error ? error.message : "Unable to upload image.",
                        );
                      }
                    });
                  }}
                />
                {isUploading ? "Uploading image..." : "Upload listing image"}
              </label>
              <input
                value={form.shortDescription}
                onChange={(event) =>
                  setForm((current) => ({ ...current, shortDescription: event.target.value }))
                }
                placeholder={
                  form.type === "meal"
                    ? "Short menu description"
                    : "Short apartment description"
                }
                className="admin-input rounded-2xl px-4 py-3 text-sm outline-none sm:col-span-2"
              />
              <textarea
                value={form.description}
                onChange={(event) =>
                  setForm((current) => ({ ...current, description: event.target.value }))
                }
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
                    ? "Sides, drink options, spice level, add-ons"
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
                <p className="mb-3 text-sm text-[var(--ink-soft)]">Image preview</p>
                <div className="relative h-52 overflow-hidden rounded-[1.5rem] border border-[rgba(17,17,17,0.08)] bg-[var(--surface-soft)]">
                  {form.imageUrl ? (
                    <Image src={form.imageUrl} alt={form.title || "Listing preview"} fill sizes="(max-width: 768px) 100vw, 50vw" className="object-cover" />
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
                  
                  // Validate form before submission
                  const validationError = validateForm();
                  if (validationError) {
                    setMessage(validationError);
                    return;
                  }

                  startTransition(async () => {
                    try {
                      const endpoint = selectedId ? `/api/admin/reserves/${selectedId}` : "/api/admin/reserves";
                      const method = selectedId ? "PATCH" : "POST";
                      const response = await fetch(endpoint, {
                        method,
                        headers: {
                          "Content-Type": "application/json",
                          "x-admin-key": adminKey,
                        },
                        body: JSON.stringify(buildPayload()),
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
                    ? form.type === "meal"
                      ? "Update meal"
                      : "Update apartment"
                    : form.type === "meal"
                      ? "Create meal"
                      : "Create apartment"}
              </button>
              <p className="text-sm text-[var(--ink-soft)]">{message}</p>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
}
