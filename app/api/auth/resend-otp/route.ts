import { NextRequest, NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateOtp, hashOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`resend:${ip}`, 5, 60_000);
  if (!rl.allowed) return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const { email, purpose = "SIGNUP" } = await req.json();
  const emailLower = String(email || "").toLowerCase();
  if (!emailLower) return NextResponse.json({ message: "Email required." }, { status: 400 });

  const latest = await db.otpVerification.findFirst({
    where: { email: emailLower, purpose },
    orderBy: { createdAt: "desc" },
  });

  const otp = generateOtp();
  await db.otpVerification.create({
    data: {
      email: emailLower,
      fullName: latest?.fullName,
      phone: latest?.phone,
      passwordHash: latest?.passwordHash,
      purpose,
      otpHash: await hashOtp(otp),
      expiresAt: new Date(Date.now() + 10 * 60_000),
    },
  });
  await sendOtpEmail(emailLower, otp);
  return NextResponse.json({ success: true });
}
