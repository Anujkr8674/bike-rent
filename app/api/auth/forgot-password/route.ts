import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { generateResetToken } from "@/lib/security";
import { sendResetEmail } from "@/lib/mail";

export async function POST(req: Request) {
  const { email } = await req.json();
  const emailLower = String(email || "").toLowerCase();
  if (!emailLower) return NextResponse.json({ message: "Email required." }, { status: 400 });

  const user = await db.user.findUnique({ where: { email: emailLower } });
  if (!user) return NextResponse.json({ success: true });

  const { token, tokenHash } = generateResetToken();
  await db.user.update({
    where: { id: user.id },
    data: { resetTokenHash: tokenHash, resetTokenExp: new Date(Date.now() + 30 * 60_000) },
  });

  const base = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  await sendResetEmail(emailLower, `${base}/reset-password?token=${token}&email=${encodeURIComponent(emailLower)}`);
  return NextResponse.json({ success: true });
}
