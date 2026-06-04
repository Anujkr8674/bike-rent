import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { hashResetToken } from "@/lib/security";

export async function POST(req: Request) {
  const { email, token, password } = await req.json();
  const emailLower = String(email || "").toLowerCase();
  if (!emailLower || !token || !password) return NextResponse.json({ message: "Invalid payload." }, { status: 400 });

  const user = await db.user.findUnique({ where: { email: emailLower } });
  if (!user?.resetTokenHash || !user.resetTokenExp) {
    return NextResponse.json({ message: "Invalid token." }, { status: 400 });
  }

  const tokenHash = hashResetToken(String(token));
  if (tokenHash !== user.resetTokenHash || user.resetTokenExp < new Date()) {
    return NextResponse.json({ message: "Token expired/invalid." }, { status: 400 });
  }

  await db.user.update({
    where: { id: user.id },
    data: {
      passwordHash: await bcrypt.hash(String(password), 10),
      resetTokenHash: null,
      resetTokenExp: null,
    },
  });
  return NextResponse.json({ success: true });
}
