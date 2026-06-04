import { NextResponse } from "next/server";
import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ user: null });

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, email: true, fullName: true, role: true, phone: true, isVerified: true },
  });

  if (!user) return NextResponse.json({ user: null });
  return NextResponse.json({ user });
}
