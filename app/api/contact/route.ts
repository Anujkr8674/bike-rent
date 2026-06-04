import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { rateLimit } from "@/lib/rate-limit";

export async function POST(req: Request) {
  const body = await req.json();
  const fullName = String(body.fullName || "").trim();
  const email = String(body.email || "").trim().toLowerCase();
  const phone = String(body.phone || "").trim();
  const subject = String(body.subject || "").trim();
  const message = String(body.message || "").trim();

  if (!fullName || !email || !subject || !message) {
    return NextResponse.json({ message: "Missing required fields." }, { status: 400 });
  }

  const ip = req.headers.get("x-forwarded-for") ?? "local";
  const rl = rateLimit(`contact:${ip}`, 5, 60_000);
  if (!rl.allowed) return NextResponse.json({ message: "Too many requests." }, { status: 429 });

  const contact = await db.contact.create({
    data: {
      fullName,
      email,
      phone: phone || null,
      subject,
      message,
      source: "contact_form",
    },
  });

  return NextResponse.json({ success: true, contact });
}
