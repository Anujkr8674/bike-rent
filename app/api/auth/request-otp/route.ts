import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOtp, hashOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`otp:${ip}`, 5, 60_000);
  if (!rl.allowed) return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const { email } = await req.json();
  if (!email) return NextResponse.json({ message: "Email required." }, { status: 400 });

  const otp = generateOtp();
  await db.otpVerification.create({
    data: {
      email: String(email).toLowerCase(),
      otpHash: await hashOtp(otp),
      expiresAt: new Date(Date.now() + 10 * 60_000),
    },
  });
  await sendOtpEmail(email, otp);
  return NextResponse.json({ success: true });
}
