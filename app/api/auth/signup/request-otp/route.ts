import { NextRequest, NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { generateOtp, hashOtp } from "@/lib/otp";
import { sendOtpEmail } from "@/lib/mail";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: NextRequest) {
  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`signup:${ip}`, 5, 60_000);
  if (!rl.allowed) return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const { fullName, email, phone, password } = await req.json();
  if (!email || !password || !fullName || !phone) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }

  const emailLower = String(email).toLowerCase();
  const existing = await db.user.findUnique({ where: { email: emailLower } });
  if (existing) return NextResponse.json({ message: "User already exists." }, { status: 409 });

  const otp = generateOtp();
  await db.otpVerification.create({
    data: {
      email: emailLower,
      fullName,
      phone,
      passwordHash: await bcrypt.hash(String(password), 10),
      purpose: "SIGNUP",
      otpHash: await hashOtp(otp),
      expiresAt: new Date(Date.now() + 10 * 60_000),
    },
  });
  await sendOtpEmail(emailLower, otp);
  return NextResponse.json({ success: true });
}
