import { NextResponse } from "next/server";
import bcrypt from "bcryptjs";
import { db } from "@/lib/db";
import { signSessionToken } from "@/lib/jwt";

export async function POST(req: Request) {
  const { username, password } = await req.json();
  const envUser = process.env.ADMIN_USERNAME;
  const envPass = process.env.ADMIN_PASSWORD;
  const adminEmail = process.env.ADMIN_EMAIL || "admin@nextgenbike.ranchi";
  const identifier = String(username || "").trim().toLowerCase();

  if (!envUser || !envPass) {
    return NextResponse.json({ message: "Admin credentials not configured." }, { status: 500 });
  }

  const bootstrapMatch = identifier === envUser.toLowerCase() && String(password) === envPass;

  let admin = null;
  if (!bootstrapMatch) {
    // Query Admin table directly
    admin = await db.admin.findFirst({
      where: {
        OR: [{ email: identifier }, { fullName: identifier }],
        isActive: true,
      },
    });

    if (!admin?.passwordHash) {
      return NextResponse.json({ message: "Invalid admin credentials." }, { status: 401 });
    }

    const valid = await bcrypt.compare(String(password), admin.passwordHash);
    if (!valid) {
      return NextResponse.json({ message: "Invalid admin credentials." }, { status: 401 });
    }
  }

  // Bootstrap: create/update admin in Admin table
  if (!admin) {
    const passwordHash = await bcrypt.hash(envPass, 10);
    admin = await db.admin.upsert({
      where: { email: adminEmail },
      update: { passwordHash, isActive: true, title: "Super Admin" },
      create: {
        email: adminEmail,
        fullName: "Admin",
        passwordHash,
        title: "Super Admin",
        isActive: true,
      },
    });
  }

  const token = signSessionToken({ adminId: admin.id, email: admin.email, role: "ADMIN" });
  const res = NextResponse.json({ success: true, admin: { id: admin.id, email: admin.email, fullName: admin.fullName } });
  res.cookies.set("nb_session", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 60 * 60 * 24 * 7,
  });

  // Log activity
  await db.activityLog.create({
    data: {
      adminId: admin.id,
      action: "LOGIN",
      entityType: "admin_session",
      entityId: admin.id,
      meta: { email: admin.email },
    },
  });

  return res;
}
