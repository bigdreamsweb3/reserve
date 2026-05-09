import { z } from "zod";

export const reservationSchema = z.object({
  guestName: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().min(7).max(30),
  guestCount: z.coerce.number().int().min(1).max(20),
  reservationDate: z.iso.datetime(),
  occasion: z.string().max(120).optional().default(""),
  notes: z.string().max(500).optional().default(""),
});

export const contactSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.email(),
  subject: z.string().min(3).max(160),
  message: z.string().min(10).max(1000),
});

export const newsletterSchema = z.object({
  email: z.email(),
});

export const signUpSchema = z.object({
  fullName: z.string().min(2).max(120),
  email: z.email(),
  password: z.string().min(8).max(120),
});

export const loginSchema = z.object({
  email: z.email(),
  password: z.string().min(8).max(120),
});

export const reserveListingSchema = z.object({
  slug: z.string().min(3).max(120),
  title: z.string().min(3).max(160),
  type: z.enum(["apartment", "meal"]),
  location: z.string().min(2).max(160),
  shortDescription: z.string().min(10).max(220),
  description: z.string().min(20).max(2000),
  priceNgn: z.coerce.number().int().min(0),
  billingPeriod: z.string().min(2).max(60),
  capacity: z.coerce.number().int().min(1).max(50),
  status: z.enum(["available", "limited", "booked", "unavailable"]),
  featured: z.coerce.boolean().optional().default(false),
  imageTone: z.string().min(3).max(80),
  imageUrl: z.union([z.string().max(500), z.literal(""), z.null()]).optional().transform((value) => value || null),
  amenities: z.array(z.string().min(1).max(80)).min(1).max(12),
});

export const reserveBookingSchema = z.object({
  listingId: z.string().min(2),
  fullName: z.string().min(2).max(120),
  email: z.email(),
  phone: z.string().min(7).max(30),
  guests: z.coerce.number().int().min(1).max(20),
  startDate: z.iso.datetime(),
  endDate: z.union([z.iso.datetime(), z.literal(""), z.null()]).optional().transform((value) => {
    if (!value) {
      return null;
    }

    return value;
  }),
  notes: z.string().max(600).optional().default(""),
});

export const bookingStatusSchema = z.object({
  status: z.enum(["pending", "confirmed", "cancelled", "completed"]),
});

export type ReservationInput = z.infer<typeof reservationSchema>;
export type ContactInput = z.infer<typeof contactSchema>;
export type NewsletterInput = z.infer<typeof newsletterSchema>;
export type ReserveListingInput = z.infer<typeof reserveListingSchema>;
export type ReserveBookingInput = z.infer<typeof reserveBookingSchema>;
export type SignUpInput = z.infer<typeof signUpSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
