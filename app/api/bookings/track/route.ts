import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { trackBookingSchema } from "@/lib/booking/schemas";

export async function POST(req: Request) {
  try {
    const body = trackBookingSchema.parse(await req.json());

    const booking = await db.booking.findFirst({
      where: {
        trackingId: body.trackingId.trim(),
        customerEmail: body.email.trim().toLowerCase(),
      },
      include: {
        documents: true,
        payment: true,
        bike: { select: { slug: true, imageUrl: true } },
      },
    });

    if (!booking) {
      return NextResponse.json({ message: "No booking found for this tracking ID and email." }, { status: 404 });
    }

    return NextResponse.json({
      booking: {
        id: booking.id,
        trackingId: booking.trackingId,
        bookingRef: booking.bookingRef,
        customerName: booking.customerName,
        customerEmail: booking.customerEmail,
        customerPhone: booking.customerPhone,
        bikeName: booking.bikeName,
        bikeNumber: booking.bikeNumber,
        bikeColor: booking.bikeColor,
        bikeSlug: booking.bike.slug,
        pickupDate: booking.pickupDate,
        pickupTime: booking.pickupTime,
        returnDate: booking.dropDate,
        returnTime: booking.returnTime,
        rentalDays: booking.totalDays,
        rentalHours: booking.rentalHours,
        rentalAmount: Number(booking.amount),
        securityDeposit: Number(booking.securityDeposit),
        totalAmount: Number(booking.payment?.amount ?? booking.amount),
        paymentStatus: booking.paymentStatus,
        documentStatus: booking.documentStatus,
        bookingStatus: booking.status,
        createdAt: booking.createdAt,
        documents: booking.documents,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Invalid request";
    return NextResponse.json({ message }, { status: 400 });
  }
}
