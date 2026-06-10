import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";

export const dynamic = "force-dynamic";

export async function GET(req: Request) {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const startParam = url.searchParams.get("start");
  const endParam = url.searchParams.get("end");

  if (!startParam || !endParam) {
    return NextResponse.json({ message: "Start and end dates are required" }, { status: 400 });
  }

  const startDate = new Date(startParam);
  const endDate = new Date(endParam);

  // Fetch everything concurrently to avoid sequential latency penalties
  const [bikes, bookings, setting] = await Promise.all([
    db.bike.findMany({
      orderBy: { name: "asc" },
      select: { id: true, name: true, bikeNo: true, isAvailable: true }
    }),
    db.booking.findMany({
      where: {
        status: { in: ["AWAITING_DOCUMENTS", "VERIFICATION_PENDING", "CONFIRMED", "ACTIVE", "RETURNED"] },
        dropDate: { gte: startDate },
        pickupDate: { lte: endDate }
      },
      select: {
        id: true,
        bikeId: true,
        pickupDate: true,
        pickupTime: true,
        dropDate: true,
        returnTime: true,
        customerName: true,
        status: true,
        bookingRef: true
      }
    }),
    db.siteSetting.findUnique({ where: { key: "rental_buffer_time" } })
  ]);
  const bufferMinutes = setting?.value ? parseInt(String(setting.value), 10) : 30;

  return NextResponse.json({ bikes, bookings, bufferMinutes });
}
