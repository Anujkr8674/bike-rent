import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

function clearSessionCookie(res: NextResponse) {
  res.cookies.set("nb_session", "", {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    path: "/",
    maxAge: 0,
    expires: new Date(0),
  });
}

export async function POST() {
  const res = NextResponse.json({ success: true, message: "Logged out completely." });
  const session = await getSession();
  if (session?.role === "ADMIN" && session.adminId) {
    const adminId = session.adminId;
    await db.activityLog.create({
      data: {
        adminId,
        action: "LOGOUT",
        entityType: "admin_session",
        entityId: adminId,
        meta: { email: session.email },
      },
    });
  }
  clearSessionCookie(res);
  return res;
}

export async function GET() {
  const res = NextResponse.redirect(new URL("/", process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"));
  clearSessionCookie(res);
  return res;
}
