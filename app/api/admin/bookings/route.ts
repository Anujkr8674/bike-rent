import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

async function assertAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

export async function GET(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const status = url.searchParams.get("status") || "all";
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(5, Number(url.searchParams.get("limit") || "15")));
  const skip = (page - 1) * limit;

  const where = {
    trackingId: { not: null },
    ...(status !== "all" ? { status: status as never } : {}),
    ...(q
      ? {
          OR: [
            { trackingId: { contains: q, mode: "insensitive" as const } },
            { bookingRef: { contains: q, mode: "insensitive" as const } },
            { customerName: { contains: q, mode: "insensitive" as const } },
            { customerEmail: { contains: q, mode: "insensitive" as const } },
            { customerPhone: { contains: q, mode: "insensitive" as const } },
            { bikeName: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const bikeStatus = url.searchParams.get("bikeStatus") || "all";

  const { getBulkBikeAvailability } = await import("@/lib/availability");
  const bulkStatus = await getBulkBikeAvailability();

  const bikeStatusCounts = {
    AVAILABLE: 0,
    RESERVED: 0,
    ON_RENT: 0,
    MAINTENANCE: 0,
  };

  Object.values(bulkStatus).forEach(info => {
    if (info.availabilityStatus in bikeStatusCounts) {
      bikeStatusCounts[info.availabilityStatus as keyof typeof bikeStatusCounts]++;
    }
  });

  if (bikeStatus !== "all") {
    const matchingBikeIds = Object.entries(bulkStatus)
      .filter(([id, info]) => info.availabilityStatus === bikeStatus)
      .map(([id]) => id);
    
    (where as any).bikeId = { in: matchingBikeIds };
  }

  const guestWhere = { trackingId: { not: null } };

  const [total, bookings, totalAll, paidCount, awaitingDocs, verificationPending, confirmedCount, activeCount, revenueRows] =
    await Promise.all([
    db.booking.count({ where }),
    db.booking.findMany({
      where,
      orderBy: { createdAt: "desc" },
      skip,
      take: limit,
      include: { documents: true, payment: true, bike: { select: { slug: true } } },
    }),
    db.booking.count({ where: guestWhere }),
    db.booking.count({ where: { ...guestWhere, paymentStatus: "PAID" } }),
    db.booking.count({ where: { ...guestWhere, status: "AWAITING_DOCUMENTS" } }),
    db.booking.count({ where: { ...guestWhere, status: "VERIFICATION_PENDING" } }),
    db.booking.count({ where: { ...guestWhere, status: "CONFIRMED" } }),
    db.booking.count({ where: { ...guestWhere, status: "ACTIVE" } }),
    db.payment.findMany({
      where: { status: "PAID", booking: { trackingId: { not: null } } },
      select: { amount: true },
    }),
  ]);

  const bookingsWithAvailability = bookings.map((b) => {
    const statusInfo = bulkStatus[b.bikeId];
    return { ...b, bikeAvailabilityStatus: statusInfo?.availabilityStatus || "UNKNOWN" };
  });

  const revenue = revenueRows.reduce((sum, row) => sum + Number(row.amount), 0);

  return NextResponse.json({
    bookings: bookingsWithAvailability,
    stats: {
      ...bikeStatusCounts,
      total: totalAll,
      paidCount,
      awaitingDocs,
      verificationPending,
      confirmedCount,
      activeCount,
      revenue,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}
