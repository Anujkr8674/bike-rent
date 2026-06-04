import { z } from "zod";

export const guestBookingSchema = z.object({
  bikeSlug: z.string().min(1),
  fullName: z.string().min(2, "Full name is required"),
  email: z.string().email("Valid email required"),
  phone: z
    .string()
    .min(10, "Valid mobile number required")
    .max(15)
    .regex(/^[0-9+\-\s]+$/, "Invalid phone number"),
  pickupDate: z.string().min(1),
  pickupTime: z.string().regex(/^\d{2}:\d{2}$/),
  returnDate: z.string().min(1),
  returnTime: z.string().regex(/^\d{2}:\d{2}$/),
});

export const trackBookingSchema = z.object({
  trackingId: z.string().min(4),
  email: z.string().email(),
});

export const verifyPaymentSchema = z.object({
  checkoutId: z.string().min(1),
  razorpay_order_id: z.string().min(1),
  razorpay_payment_id: z.string().min(1),
  razorpay_signature: z.string().min(1),
});

export const documentUploadSchema = z.object({
  trackingId: z.string().min(4),
  email: z.string().email(),
  dlNumber: z.string().min(5, "Driving license number required"),
  aadhaarNumber: z.string().min(12, "Aadhaar number required").max(12),
});

export type GuestBookingInput = z.infer<typeof guestBookingSchema>;
