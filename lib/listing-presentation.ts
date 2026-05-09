import type { ReserveListing } from "@/lib/reserves";

export function getListingVisualClass(imageTone: string) {
  return `absolute inset-0 ${imageTone}`;
}

export function getMealStatusLabel(status: ReserveListing["status"]) {
  return status === "unavailable" ? "Unavailable today" : "Ready to order";
}

export function getAvailabilityClass(status: ReserveListing["status"]) {
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

export function getAvailabilityLabel(listing: ReserveListing) {
  if (listing.type === "meal") {
    return listing.status === "unavailable" ? "Unavailable" : "Available";
  }

  return listing.status.charAt(0).toUpperCase() + listing.status.slice(1);
}
