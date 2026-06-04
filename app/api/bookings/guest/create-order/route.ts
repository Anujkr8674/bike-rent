import { NextResponse } from "next/server";
import { z } from "zod";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { guestBookingSchema } from "@/lib/booking/schemas";
import { computeGuestBookingAmounts } from "@/lib/booking/amounts";
import { isTestPaymentAllowed } from "@/lib/booking/dev-payment";

const createOrderBodySchema = guestBookingSchema.extend({
  testCheckoutOnly: z.boolean().optional(),
});

export async function POST(req: Request) {
  try {
    const body = createOrderBodySchema.parse(await req.json());
    const testPaymentAvailable = isTestPaymentAllowed();

    const bike = await db.bike.findFirst({
      where: { slug: body.bikeSlug, isAvailable: true },
      include: { city: true },
    });
    if (!bike) {
      return NextResponse.json({ message: "Bike not found or unavailable." }, { status: 404 });
    }

    const amounts = computeGuestBookingAmounts(
      Number(bike.pricePerDay),
      bike.hourlyCharge ? Number(bike.hourlyCharge) : Math.max(75, Math.round(Number(bike.pricePerDay) / 8)),
      Number(bike.securityDeposit),
      body.pickupDate,
      body.pickupTime,
      body.returnDate,
      body.returnTime,
    );

    const expiresAt = new Date(Date.now() + 30 * 60 * 1000);

    const checkout = await db.guestCheckout.create({
      data: {
        bikeId: bike.id,
        bikeSlug: bike.slug,
        bikeName: bike.name,
        bikeNumber: bike.bikeNo,
        bikeColor: bike.color,
        customerName: body.fullName.trim(),
        customerEmail: body.email.trim().toLowerCase(),
        customerPhone: body.phone.trim(),
        pickupDate: body.pickupDate,
        pickupTime: body.pickupTime,
        returnDate: body.returnDate,
        returnTime: body.returnTime,
        rentalDays: amounts.rentalDays,
        rentalHours: amounts.rentalHours,
        rentalAmount: amounts.rentalAmount,
        securityDeposit: amounts.securityDeposit,
        totalAmount: amounts.totalAmount,
        expiresAt,
      },
    });

    if (body.testCheckoutOnly) {
      if (!testPaymentAvailable) {
        return NextResponse.json({ message: "Test checkout is not enabled." }, { status: 403 });
      }
      return NextResponse.json({
        checkoutId: checkout.id,
        testPaymentAvailable: true,
        amount: amounts.totalAmount,
        summary: {
          bikeName: checkout.bikeName,
          rentalLabel: amounts.duration.label,
          totalAmount: amounts.totalAmount,
        },
      });
    }

    if (!razorpay) {
      return NextResponse.json(
        {
          message: "Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to .env",
          checkoutId: checkout.id,
          demoMode: true,
          testPaymentAvailable,
          summary: {
            rentalLabel: amounts.duration.label,
            rentalAmount: amounts.rentalAmount,
            securityDeposit: amounts.securityDeposit,
            totalAmount: amounts.totalAmount,
          },
        },
        { status: 503 },
      );
    }

    const order = await razorpay.orders.create({
      amount: Math.round(amounts.totalAmount * 100),
      currency: "INR",
      receipt: checkout.id.slice(0, 32),
      notes: {
        checkoutId: checkout.id,
        bikeSlug: bike.slug,
        customerEmail: checkout.customerEmail,
      },
    });

    await db.guestCheckout.update({
      where: { id: checkout.id },
      data: { razorpayOrderId: order.id },
    });

    return NextResponse.json({
      checkoutId: checkout.id,
      orderId: order.id,
      testPaymentAvailable,
      amount: amounts.totalAmount,
      currency: "INR",
      keyId: process.env.RAZORPAY_KEY_ID,
      customer: {
        name: checkout.customerName,
        email: checkout.customerEmail,
        contact: checkout.customerPhone,
      },
      summary: {
        bikeName: checkout.bikeName,
        rentalLabel: amounts.duration.label,
        rentalDays: amounts.rentalDays,
        rentalHours: amounts.rentalHours,
        rentalAmount: amounts.rentalAmount,
        securityDeposit: amounts.securityDeposit,
        totalAmount: amounts.totalAmount,
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to create order";
    return NextResponse.json({ message }, { status: 400 });
  }
}
