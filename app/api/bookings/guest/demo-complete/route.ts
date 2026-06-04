import { NextResponse } from "next/server";
import { completeGuestCheckout } from "@/lib/booking/complete-guest-checkout";
import { isTestPaymentAllowed } from "@/lib/booking/dev-payment";

/** Skip Razorpay — local/staging test bookings only */
export async function POST(req: Request) {
  if (!isTestPaymentAllowed()) {
    return NextResponse.json({ message: "Test payments are disabled." }, { status: 403 });
  }

  const { checkoutId } = (await req.json()) as { checkoutId?: string };
  if (!checkoutId) {
    return NextResponse.json({ message: "checkoutId required" }, { status: 400 });
  }

  const result = await completeGuestCheckout(checkoutId);
  if (!result.ok) {
    return NextResponse.json({ message: result.message }, { status: result.status });
  }

  return NextResponse.json({
    trackingId: result.trackingId,
    bookingRef: result.bookingRef,
    email: result.email,
  });
}
