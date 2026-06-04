import { db } from "@/lib/db";
import { nanoid } from "nanoid";

export async function generateTrackingId(): Promise<string> {
  const year = new Date().getFullYear();
  const prefix = `BR${year}`;

  for (let attempt = 0; attempt < 8; attempt++) {
    const count = await db.booking.count({
      where: { trackingId: { startsWith: prefix } },
    });
    const sequential = `${prefix}${String(count + 1 + attempt).padStart(5, "0")}`;
    const exists = await db.booking.findUnique({ where: { trackingId: sequential } });
    if (!exists) return sequential;
  }

  return `RB-${nanoid(6).toUpperCase()}`;
}

export function generateBookingRef() {
  return `NBR-${nanoid(8).toUpperCase()}`;
}
