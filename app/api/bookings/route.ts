import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { nanoid } from "nanoid";

export async function GET() {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const bookings = await db.booking.findMany({
    where: { userId: session.userId },
    include: { bike: true, payment: true, city: true },
    orderBy: { createdAt: "desc" },
  });
  return NextResponse.json({ bookings });
}

export async function POST(req: Request) {
  const session = await getSession();
  if (!session) return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  const { bikeId, cityId, pickupDate, dropDate } = await req.json();

  const bike = await db.bike.findUnique({ where: { id: bikeId } });
  if (!bike) return NextResponse.json({ message: "Bike not found" }, { status: 404 });

  const days = Math.max(1, Math.ceil((new Date(dropDate).getTime() - new Date(pickupDate).getTime()) / 86400000));
  const amount = Number(bike.pricePerDay) * days;
  const advanceAmount = Math.round(amount * 0.3);

  const booking = await db.booking.create({
    data: {
      bookingRef: `NBR-${nanoid(8).toUpperCase()}`,
      userId: session.userId,
      bikeId,
      cityId,
      pickupDate: new Date(pickupDate),
      dropDate: new Date(dropDate),
      totalDays: days,
      amount,
      advanceAmount,
      securityDeposit: Number(bike.securityDeposit),
    },
  });
  return NextResponse.json({ booking });
}
