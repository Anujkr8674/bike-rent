import { db } from "@/lib/db";
import type { Booking, BookingStatus } from "@prisma/client";

// Statuses that block a bike from being rented
export const BLOCKING_STATUSES: BookingStatus[] = [
  "AWAITING_DOCUMENTS",
  "VERIFICATION_PENDING",
  "CONFIRMED",
  "ACTIVE",
];

export type BikeAvailabilityStatus = "AVAILABLE" | "RESERVED" | "ON_RENT" | "MAINTENANCE";

export interface AvailabilityInfo {
  isAvailable: boolean;
  availabilityStatus: BikeAvailabilityStatus;
  nextAvailableAt: Date | null;
  bufferMinutes: number;
  availabilityMessage: string;
  currentBooking?: Booking | null;
}

/**
 * Gets the configured rental buffer time in minutes from the database.
 * Falls back to 30 minutes if not configured.
 */
export async function getRentalBufferMinutes(): Promise<number> {
  try {
    const setting = await db.siteSetting.findUnique({
      where: { key: "rental_buffer_time" },
    });
    
    if (setting && setting.value && typeof setting.value === "object" && "minutes" in setting.value) {
      const minutes = Number((setting.value as any).minutes);
      if (!isNaN(minutes)) return minutes;
    }
  } catch (error) {
    console.error("Error fetching rental buffer minutes:", error);
  }
  return 30; // Default buffer time
}

/**
 * Calculates the exact Next Available Date for a given booking and buffer.
 */
export function calculateNextAvailableAt(dropDate: Date | string, returnTime: string | null, bufferMinutes: number): Date {
  // If dropDate already includes time, we can just add buffer
  const dateObj = new Date(dropDate);
  const nextAvailable = new Date(dateObj.getTime() + bufferMinutes * 60000);
  return nextAvailable;
}

/**
 * Pure function to compute availability status given a list of bookings and the buffer time.
 */
export function computeAvailabilityFromBookings(
  bookings: Booking[],
  bufferMinutes: number,
  targetPickupDate?: Date,
  targetReturnDate?: Date
): AvailabilityInfo {
  const now = new Date();
  
  // Filter out cancelled, returned (if past buffer) and completed bookings
  const relevantBookings = bookings.filter((b) => {
    if (b.status === "CANCELLED" || b.status === "COMPLETED") return false;
    
    if (b.status === "RETURNED") {
      const nextAvail = calculateNextAvailableAt(b.dropDate, b.returnTime, bufferMinutes);
      // If we are past the next available time, it's no longer relevant
      if (nextAvail < now) return false;
      return true; // Still in buffer period
    }
    
    return true; // AWAITING_DOCUMENTS, VERIFICATION_PENDING, CONFIRMED, ACTIVE
  });

  // Sort by pickup date
  relevantBookings.sort((a, b) => new Date(a.pickupDate).getTime() - new Date(b.pickupDate).getTime());

  // 1. Target Time Range Check (if target dates provided)
  if (targetPickupDate && targetReturnDate) {
    for (const booking of relevantBookings) {
      const bookingEndWithBuffer = calculateNextAvailableAt(booking.dropDate, booking.returnTime, bufferMinutes);
      const bookingStart = new Date(booking.pickupDate);
      
      // Overlap formula: existing.pickupDateTime < requested.returnDateTime AND existing.returnDateTime(+buffer) > requested.pickupDateTime
      if (bookingStart < targetReturnDate && bookingEndWithBuffer > targetPickupDate) {
        return {
          isAvailable: false,
          availabilityStatus: booking.status === "ACTIVE" ? "ON_RENT" : "RESERVED",
          nextAvailableAt: bookingEndWithBuffer,
          bufferMinutes,
          availabilityMessage: `Already Booked During Selected Dates`,
          currentBooking: booking
        };
      }
    }
    
    return {
      isAvailable: true,
      availabilityStatus: "AVAILABLE",
      nextAvailableAt: null,
      bufferMinutes,
      availabilityMessage: "Available For Selected Dates",
    };
  }

  // 2. Current Status Check (no target dates provided)
  // Find currently active booking or the next upcoming one
  const currentOrNextBooking = relevantBookings.find(b => {
    const bookingEndWithBuffer = calculateNextAvailableAt(b.dropDate, b.returnTime, bufferMinutes);
    return bookingEndWithBuffer > now;
  });

  if (!currentOrNextBooking) {
    return {
      isAvailable: true,
      availabilityStatus: "AVAILABLE",
      nextAvailableAt: null,
      bufferMinutes,
      availabilityMessage: "Available Now",
    };
  }

  const bookingStart = new Date(currentOrNextBooking.pickupDate);
  const nextAvail = calculateNextAvailableAt(currentOrNextBooking.dropDate, currentOrNextBooking.returnTime, bufferMinutes);
  
  if (bookingStart <= now) {
    // Booking is currently ongoing or in buffer
    let status: BikeAvailabilityStatus = "RESERVED";
    if (currentOrNextBooking.status === "ACTIVE") status = "ON_RENT";
    if (currentOrNextBooking.status === "RETURNED") status = "MAINTENANCE"; // Buffer period
    
    const formatter = new Intl.DateTimeFormat("en-IN", {
      day: "2-digit", month: "short", year: "numeric", hour: "2-digit", minute: "2-digit", hour12: true
    });
    
    return {
      isAvailable: false,
      availabilityStatus: status,
      nextAvailableAt: nextAvail,
      bufferMinutes,
      availabilityMessage: `Available From ${formatter.format(nextAvail)}`,
      currentBooking: currentOrNextBooking
    };
  } else {
    // Next booking is in the future. Technically available right now, but we should let user know it's booked later.
    // However, the prompt says: "A bike should only be visible to customers if it is genuinely available for the selected pickup and return date/time."
    // If no dates are selected, it's available NOW.
    return {
      isAvailable: true,
      availabilityStatus: "AVAILABLE",
      nextAvailableAt: null,
      bufferMinutes,
      availabilityMessage: "Available Now",
      // We don't block it now, but it will be blocked during checkout if dates overlap
    };
  }
}

/**
 * Checks if a bike is available for a specific time window.
 */
export async function checkBikeAvailability(
  bikeId: string,
  targetPickupDate: Date,
  targetReturnDate: Date
): Promise<{ isAvailable: boolean; reason?: string }> {
  const bufferMinutes = await getRentalBufferMinutes();
  
  // We only need bookings that overlap with the target range
  const bookings = await db.booking.findMany({
    where: {
      bikeId,
      status: {
        in: [...BLOCKING_STATUSES, "RETURNED"],
      },
      // Basic optimization: only bookings where dropDate >= pickupDate (we add buffer in code)
      dropDate: {
        gte: targetPickupDate // Need to be careful with timezone differences, filtering in JS is safer
      }
    },
    orderBy: { pickupDate: 'asc' }
  });

  const info = computeAvailabilityFromBookings(bookings, bufferMinutes, targetPickupDate, targetReturnDate);
  
  return {
    isAvailable: info.isAvailable,
    reason: info.availabilityMessage,
  };
}

/**
 * Gets the current real-time status of a bike.
 */
export async function getBikeCurrentStatus(bikeId: string): Promise<AvailabilityInfo> {
  const bufferMinutes = await getRentalBufferMinutes();
  
  const bookings = await db.booking.findMany({
    where: {
      bikeId,
      status: {
        in: [...BLOCKING_STATUSES, "RETURNED"],
      },
    },
    orderBy: { pickupDate: 'asc' }
  });

  return computeAvailabilityFromBookings(bookings, bufferMinutes);
}

/**
 * Gets the current real-time status of all bikes in bulk.
 */
export async function getBulkBikeAvailability(): Promise<Record<string, AvailabilityInfo>> {
  const bufferMinutes = await getRentalBufferMinutes();
  
  const bookings = await db.booking.findMany({
    where: {
      status: {
        in: [...BLOCKING_STATUSES, "RETURNED"],
      },
    },
    orderBy: { pickupDate: 'asc' }
  });

  const byBike = bookings.reduce((acc, b) => {
    if (!acc[b.bikeId]) acc[b.bikeId] = [];
    acc[b.bikeId].push(b);
    return acc;
  }, {} as Record<string, Booking[]>);

  const bikes = await db.bike.findMany({ select: { id: true } });
  
  const result: Record<string, AvailabilityInfo> = {};
  for (const bike of bikes) {
    result[bike.id] = computeAvailabilityFromBookings(byBike[bike.id] || [], bufferMinutes);
  }
  return result;
}
