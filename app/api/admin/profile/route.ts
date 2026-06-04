import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN" || !session.adminId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const profile = await db.admin.findUnique({
    where: { id: session.adminId },
    select: { id: true, email: true, fullName: true, title: true, isActive: true },
  });

  return NextResponse.json({ profile });
}

export async function PATCH(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN" || !session.adminId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const body = await req.json();
  const fullName = String(body.fullName || "").trim();
  const title = String(body.title || "").trim();

  const profile = await db.admin.update({
    where: { id: session.adminId },
    data: {
      fullName: fullName || null,
      title: title || null,
    },
  });

  await db.activityLog.create({
    data: {
      adminId: session.adminId,
      action: "PROFILE_UPDATE",
      entityType: "admin_profile",
      entityId: session.adminId,
      meta: { fullName, title },
    },
  });

  return NextResponse.json({ success: true, profile });
}
