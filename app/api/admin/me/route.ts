import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN" || !session.adminId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const admin = await db.admin.findUnique({
    where: { id: session.adminId },
    select: { id: true, email: true, fullName: true, title: true, isActive: true },
  });

  return NextResponse.json({ admin });
}
