import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const FALLBACK = [
  { id: "sports", name: "Sports", slug: "sports" },
  { id: "cruiser", name: "Cruiser", slug: "cruiser" },
  { id: "scooter", name: "Scooter", slug: "scooter" },
  { id: "commuter", name: "Commuter", slug: "commuter" },
];

export async function GET() {
  try {
    const categories = await db.bikeCategory.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true },
    });
    if (categories.length) {
      return NextResponse.json({ categories });
    }
  } catch {
    // fall through
  }
  return NextResponse.json({ categories: FALLBACK });
}
