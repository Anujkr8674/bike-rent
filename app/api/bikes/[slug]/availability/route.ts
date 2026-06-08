import { NextResponse } from "next/server";
import { checkBikeAvailability } from "@/lib/availability";
import { db } from "@/lib/db";

export async function POST(request: Request, context: { params: Promise<{ slug: string }> }) {
  try {
    const params = await context.params;
    const body = await request.json();
    const { pickupDate, returnDate } = body;

    if (!pickupDate || !returnDate) {
      return NextResponse.json({ message: "pickupDate and returnDate are required" }, { status: 400 });
    }

    const bike = await db.bike.findFirst({
      where: { slug: params.slug },
    });

    if (!bike) {
      return NextResponse.json({ message: "Bike not found" }, { status: 404 });
    }

    const result = await checkBikeAvailability(bike.id, new Date(pickupDate), new Date(returnDate));
    
    return NextResponse.json(result);
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to check availability";
    return NextResponse.json({ message }, { status: 400 });
  }
}
