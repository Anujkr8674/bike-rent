import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { compareOtp } from "@/lib/otp";
import { signSessionToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, otp } = await req.json();
  const emailLower = String(email || "").toLowerCase();
  if (!emailLower || !otp) return NextResponse.json({ message: "Invalid payload." }, { status: 400 });

  const latest = await db.otpVerification.findFirst({
    where: { email: emailLower, purpose: "SIGNUP", consumedAt: null, expiresAt: { gt: new Date() } },
    orderBy: { createdAt: "desc" },
  });

  if (!latest || !latest.passwordHash || !(await compareOtp(String(otp), latest.otpHash))) {
    return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
  }

  const user = await db.user.create({
    data: {
      fullName: latest.fullName || undefined,
      email: emailLower,
      phone: latest.phone || undefined,
      passwordHash: latest.passwordHash,
      isVerified: true,
    },
  });

  await db.otpVerification.update({ where: { id: latest.id }, data: { consumedAt: new Date(), userId: user.id } });
  const token = signSessionToken({ userId: user.id, email: user.email, role: user.role });
  const res = NextResponse.json({ success: true, user });
  res.cookies.set("nb_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });
  return res;
}
