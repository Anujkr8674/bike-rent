import { createHmac } from "crypto";
import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export async function POST(req: Request) {
  const { bookingId, razorpay_order_id, razorpay_payment_id, razorpay_signature } = await req.json();
  const secret = process.env.RAZORPAY_KEY_SECRET;
  if (!secret) return NextResponse.json({ message: "Missing key secret." }, { status: 500 });

  const generated = createHmac("sha256", secret)
    .update(`${razorpay_order_id}|${razorpay_payment_id}`)
    .digest("hex");

  if (generated !== razorpay_signature) {
    return NextResponse.json({ message: "Invalid payment signature." }, { status: 400 });
  }

  await db.payment.update({
    where: { bookingId },
    data: {
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      status: "PAID",
    },
  });
  await db.booking.update({ where: { id: bookingId }, data: { status: "CONFIRMED" } });

  return NextResponse.json({ success: true });
}
