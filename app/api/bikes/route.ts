import { NextResponse } from "next/server";
import { getCatalogBikes } from "@/lib/bike-catalog";

export const dynamic = "force-dynamic";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const pickupDateStr = searchParams.get("pickupDate");
  const returnDateStr = searchParams.get("returnDate");

  let pickupDate: Date | undefined;
  let returnDate: Date | undefined;

  if (pickupDateStr && returnDateStr) {
    pickupDate = new Date(pickupDateStr);
    returnDate = new Date(returnDateStr);
  }

  const bikes = await getCatalogBikes(pickupDate, returnDate);
  return NextResponse.json({ bikes });
}
