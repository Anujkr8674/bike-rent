import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const session = await getSession();
    if (!session || session.role !== "ADMIN") {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { currentPassword, newPassword } = await req.json();

    if (!currentPassword || !newPassword) {
      return NextResponse.json({ message: "Missing fields" }, { status: 400 });
    }

    const admin = await db.admin.findUnique({
      where: { email: session.email },
    });

    if (!admin || !admin.passwordHash) {
      return NextResponse.json({ message: "Admin not found or invalid" }, { status: 404 });
    }

    const valid = await bcrypt.compare(String(currentPassword), admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: "Incorrect current password" }, { status: 401 });
    }

    const newHash = await bcrypt.hash(String(newPassword), 10);

    await db.admin.update({
      where: { id: admin.id },
      data: { passwordHash: newHash },
    });

    // Log activity
    await db.activityLog.create({
      data: {
        adminId: admin.id,
        action: "PASSWORD_CHANGE",
        entityType: "admin",
        entityId: admin.id,
        meta: { email: admin.email },
      },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Change password error:", error);
    return NextResponse.json({ message: "Internal server error" }, { status: 500 });
  }
}
