import { db } from "@/lib/db";
import { generateBookingRef, generateTrackingId } from "@/lib/booking/tracking";
import { sendBookingConfirmationEmails } from "@/lib/email/booking-emails";
import { combineDateAndTime } from "@/lib/rental-datetime";

export async function completeGuestCheckout(checkoutId: string) {
  const checkout = await db.guestCheckout.findUnique({ where: { id: checkoutId } });
  if (!checkout) {
    return { ok: false as const, status: 404, message: "Checkout not found" };
  }

  if (checkout.expiresAt < new Date()) {
    return { ok: false as const, status: 410, message: "Checkout session expired. Please try again." };
  }

  const bike = await db.bike.findUnique({ where: { id: checkout.bikeId } });
  if (!bike) {
    return { ok: false as const, status: 404, message: "Bike not found" };
  }

  const trackingId = await generateTrackingId();
  const bookingRef = generateBookingRef();

  const booking = await db.$transaction(async (tx) => {
    const created = await tx.booking.create({
      data: {
        trackingId,
        bookingRef,
        bikeId: checkout.bikeId,
        cityId: bike.cityId,
        bikeName: checkout.bikeName,
        bikeNumber: checkout.bikeNumber,
        bikeColor: checkout.bikeColor,
        customerName: checkout.customerName,
        customerEmail: checkout.customerEmail,
        customerPhone: checkout.customerPhone,
        pickupDate: new Date(combineDateAndTime(checkout.pickupDate, checkout.pickupTime)),
        pickupTime: checkout.pickupTime,
        dropDate: new Date(combineDateAndTime(checkout.returnDate, checkout.returnTime)),
        returnTime: checkout.returnTime,
        totalDays: checkout.rentalDays || 1,
        rentalHours: checkout.rentalHours,
        amount: checkout.rentalAmount,
        advanceAmount: 0,
        securityDeposit: checkout.securityDeposit,
        paymentStatus: "PAID",
        documentStatus: "NOT_UPLOADED",
        status: "AWAITING_DOCUMENTS",
        payment: {
          create: {
            status: "PAID",
            amount: checkout.totalAmount,
          },
        },
      },
    });
    await tx.guestCheckout.delete({ where: { id: checkout.id } });
    return created;
  });

  await sendBookingConfirmationEmails({
    trackingId: booking.trackingId!,
    bookingRef: booking.bookingRef,
    customerName: booking.customerName!,
    customerEmail: booking.customerEmail!,
    customerPhone: booking.customerPhone!,
    bikeName: booking.bikeName!,
    bikeNumber: booking.bikeNumber,
    bikeColor: booking.bikeColor,
    pickupDate: booking.pickupDate.toISOString(),
    pickupTime: booking.pickupTime,
    returnDate: booking.dropDate.toISOString(),
    returnTime: booking.returnTime,
    totalAmount: Number(checkout.totalAmount),
  });

  return {
    ok: true as const,
    trackingId: booking.trackingId!,
    bookingRef: booking.bookingRef,
    email: booking.customerEmail!,
  };
}
