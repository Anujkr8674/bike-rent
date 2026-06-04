import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN" || !session.adminId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const { currentPassword, newPassword } = await req.json();
  if (!currentPassword || !newPassword) {
    return NextResponse.json({ message: "Missing password fields." }, { status: 400 });
  }

  const admin = await db.admin.findUnique({ where: { id: session.adminId } });
  if (!admin?.passwordHash) {
    return NextResponse.json({ message: "Password not set." }, { status: 400 });
  }

  const valid = await bcrypt.compare(String(currentPassword), admin.passwordHash);
  if (!valid) {
    return NextResponse.json({ message: "Current password is incorrect." }, { status: 400 });
  }

  await db.admin.update({
    where: { id: admin.id },
    data: { passwordHash: await bcrypt.hash(String(newPassword), 10) },
  });

  await db.activityLog.create({
    data: {
      adminId: session.adminId,
      action: "PASSWORD_CHANGE",
      entityType: "admin_profile",
      entityId: session.adminId,
      meta: { changedBy: session.email },
    },
  });

  return NextResponse.json({ success: true });
}
