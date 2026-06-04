import { NextResponse } from "next/server";
import { getCatalogBikes } from "@/lib/bike-catalog";

export const dynamic = "force-dynamic";

export async function GET() {
  const bikes = await getCatalogBikes();
  return NextResponse.json({ bikes });
}
