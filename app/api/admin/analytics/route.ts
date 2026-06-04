import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export async function GET() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN" || !session.adminId) {
    return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  }

  const [
    totalUsers,
    totalBookings,
    totalBikes,
    availableBikes,
    unavailableBikes,
    totalContacts,
    paidPayments,
    recentActivities,
    recentContacts,
  ] =
    await Promise.all([
    db.user.count(),
    db.booking.count(),
    db.bike.count(),
    db.bike.count({ where: { isAvailable: true } }),
    db.bike.count({ where: { isAvailable: false } }),
    db.contact.count(),
    db.payment.findMany({ where: { status: "PAID" } }),
    db.activityLog.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      include: { admin: { select: { fullName: true, email: true } } },
    }),
    db.contact.findMany({
      orderBy: { createdAt: "desc" },
      take: 5,
      select: { id: true, fullName: true, email: true, status: true, createdAt: true, subject: true },
    }),
  ]);

  const revenue = paidPayments.reduce((acc, p) => acc + Number(p.amount), 0);
  return NextResponse.json({
    totalUsers,
    totalBookings,
    totalBikes,
    availableBikes,
    unavailableBikes,
    totalContacts,
    revenue,
    recentActivities,
    recentContacts,
  });
}
