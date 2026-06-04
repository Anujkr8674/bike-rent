import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { verifyPaymentSchema } from "@/lib/booking/schemas";
import { verifyRazorpaySignature } from "@/lib/razorpay-verify";
import { generateBookingRef, generateTrackingId } from "@/lib/booking/tracking";
import { sendBookingConfirmationEmails } from "@/lib/email/booking-emails";
import { combineDateAndTime } from "@/lib/rental-datetime";

export async function POST(req: Request) {
  try {
    const body = verifyPaymentSchema.parse(await req.json());
    const secret = process.env.RAZORPAY_KEY_SECRET;
    if (!secret) {
      return NextResponse.json({ message: "Razorpay secret not configured." }, { status: 503 });
    }

    const valid = verifyRazorpaySignature(
      body.razorpay_order_id,
      body.razorpay_payment_id,
      body.razorpay_signature,
      secret,
    );
    if (!valid) {
      return NextResponse.json({ message: "Invalid payment signature." }, { status: 400 });
    }

    const checkout = await db.guestCheckout.findUnique({
      where: { id: body.checkoutId },
    });
    if (!checkout || checkout.razorpayOrderId !== body.razorpay_order_id) {
      return NextResponse.json({ message: "Checkout session not found." }, { status: 404 });
    }
    if (checkout.expiresAt < new Date()) {
      return NextResponse.json({ message: "Checkout session expired." }, { status: 410 });
    }

    const existing = await db.booking.findFirst({
      where: { payment: { razorpayOrderId: body.razorpay_order_id } },
    });
    if (existing?.trackingId) {
      return NextResponse.json({
        trackingId: existing.trackingId,
        bookingRef: existing.bookingRef,
        email: existing.customerEmail,
      });
    }

    const bike = await db.bike.findUnique({ where: { id: checkout.bikeId }, include: { city: true } });
    if (!bike) {
      return NextResponse.json({ message: "Bike not found." }, { status: 404 });
    }

    const trackingId = await generateTrackingId();
    const bookingRef = generateBookingRef();
    const pickupDateTime = combineDateAndTime(checkout.pickupDate, checkout.pickupTime);
    const returnDateTime = combineDateAndTime(checkout.returnDate, checkout.returnTime);

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
          pickupDate: new Date(pickupDateTime),
          pickupTime: checkout.pickupTime,
          dropDate: new Date(returnDateTime),
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
              razorpayOrderId: body.razorpay_order_id,
              razorpayPaymentId: body.razorpay_payment_id,
              razorpaySignature: body.razorpay_signature,
              status: "PAID",
              amount: checkout.totalAmount,
            },
          },
        },
        include: { payment: true },
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
      totalAmount: Number(booking.payment?.amount ?? checkout.totalAmount),
    });

    return NextResponse.json({
      trackingId: booking.trackingId,
      bookingRef: booking.bookingRef,
      email: booking.customerEmail,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Payment verification failed";
    return NextResponse.json({ message }, { status: 400 });
  }
}
