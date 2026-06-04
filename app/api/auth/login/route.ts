import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signSessionToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { email, password } = await req.json();
  const emailLower = String(email || "").toLowerCase();
  if (!emailLower || !password) return NextResponse.json({ message: "Invalid payload." }, { status: 400 });

  const user = await db.user.findUnique({ where: { email: emailLower } });
  if (!user?.passwordHash) return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });
  const valid = await bcrypt.compare(String(password), user.passwordHash);
  if (!valid) return NextResponse.json({ message: "Invalid credentials." }, { status: 401 });

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
