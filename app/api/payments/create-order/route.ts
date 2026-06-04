import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { razorpay } from "@/lib/razorpay";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { bookingId } = await req.json();

  const booking = await db.booking.findUnique({ where: { id: bookingId } });
  if (!booking) return NextResponse.json({ message: "Booking not found" }, { status: 404 });

  if (!razorpay) return NextResponse.json({ message: "Razorpay not configured" }, { status: 500 });

  const order = await razorpay.orders.create({
    amount: Math.round(Number(booking.advanceAmount) * 100),
    currency: "INR",
    receipt: booking.bookingRef,
  });

  const payment = await db.payment.upsert({
    where: { bookingId: booking.id },
    update: { razorpayOrderId: order.id },
    create: {
      bookingId: booking.id,
      razorpayOrderId: order.id,
      amount: booking.advanceAmount,
    },
  });

  return NextResponse.json({ order, payment });
}
