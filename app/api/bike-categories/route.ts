import { NextResponse } from "next/server";
import { db } from "@/lib/db";

export const dynamic = "force-dynamic";

const FALLBACK = [
  { id: "sports", name: "Sports", slug: "sports", imageUrl: null },
  { id: "cruiser", name: "Cruiser", slug: "cruiser", imageUrl: null },
  { id: "scooter", name: "Scooter", slug: "scooter", imageUrl: null },
  { id: "commuter", name: "Commuter", slug: "commuter", imageUrl: null },
];

export async function GET() {
  try {
    const categories = await db.bikeCategory.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      select: { id: true, name: true, slug: true, imageUrl: true },
    });
    if (categories.length) {
      return NextResponse.json({ categories });
    }
  } catch {
    // fall through
  }
  return NextResponse.json({ categories: FALLBACK });
}
