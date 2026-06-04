import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { compareOtp } from "@/lib/otp";
import { signSessionToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, otp, fullName } = await req.json();
  if (!email || !otp) return NextResponse.json({ message: "Invalid payload." }, { status: 400 });

  const latest = await db.otpVerification.findFirst({
    where: {
      email: String(email).toLowerCase(),
      consumedAt: null,
      expiresAt: { gt: new Date() },
    },
    orderBy: { createdAt: "desc" },
  });

  if (!latest || !(await compareOtp(String(otp), latest.otpHash))) {
    return NextResponse.json({ message: "Invalid OTP." }, { status: 401 });
  }

  const user = await db.user.upsert({
    where: { email: String(email).toLowerCase() },
    update: { isVerified: true, fullName: fullName || undefined },
    create: {
      email: String(email).toLowerCase(),
      fullName,
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
    maxAge: 60 * 60 * 24 * 7,
    path: "/",
  });
  return res;
}
