import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { documentUploadSchema } from "@/lib/booking/schemas";
import { uploadBookingDocument } from "@/lib/storage";

export async function POST(req: Request) {
  try {
    const form = await req.formData();
    const parsed = documentUploadSchema.parse({
      trackingId: String(form.get("trackingId") || ""),
      email: String(form.get("email") || ""),
      dlNumber: String(form.get("dlNumber") || ""),
      aadhaarNumber: String(form.get("aadhaarNumber") || ""),
    });

    const booking = await db.booking.findFirst({
      where: {
        trackingId: parsed.trackingId.trim(),
        customerEmail: parsed.email.trim().toLowerCase(),
        paymentStatus: "PAID",
      },
    });

    if (!booking) {
      return NextResponse.json({ message: "Booking not found or payment pending." }, { status: 404 });
    }

    const dlFront = form.get("dlFront");
    const dlBack = form.get("dlBack");
    const aadhaarFront = form.get("aadhaarFront");
    const aadhaarBack = form.get("aadhaarBack");

    if (
      !(dlFront instanceof File) ||
      !(dlBack instanceof File) ||
      !(aadhaarFront instanceof File) ||
      !(aadhaarBack instanceof File)
    ) {
      return NextResponse.json({ message: "All document images are required." }, { status: 400 });
    }

    const [dlFrontUp, dlBackUp, aFrontUp, aBackUp] = await Promise.all([
      uploadBookingDocument(booking.id, dlFront, `dl-front-${Date.now()}.jpg`),
      uploadBookingDocument(booking.id, dlBack, `dl-back-${Date.now()}.jpg`),
      uploadBookingDocument(booking.id, aadhaarFront, `aadhaar-front-${Date.now()}.jpg`),
      uploadBookingDocument(booking.id, aadhaarBack, `aadhaar-back-${Date.now()}.jpg`),
    ]);

    const doc = await db.bookingDocument.upsert({
      where: { bookingId: booking.id },
      create: {
        bookingId: booking.id,
        dlNumber: parsed.dlNumber,
        dlFrontUrl: dlFrontUp.url,
        dlBackUrl: dlBackUp.url,
        aadhaarNumber: parsed.aadhaarNumber,
        aadhaarFrontUrl: aFrontUp.url,
        aadhaarBackUrl: aBackUp.url,
        verificationStatus: "UPLOADED",
      },
      update: {
        dlNumber: parsed.dlNumber,
        dlFrontUrl: dlFrontUp.url,
        dlBackUrl: dlBackUp.url,
        aadhaarNumber: parsed.aadhaarNumber,
        aadhaarFrontUrl: aFrontUp.url,
        aadhaarBackUrl: aBackUp.url,
        verificationStatus: "UPLOADED",
        verifiedAt: null,
      },
    });

    await db.booking.update({
      where: { id: booking.id },
      data: {
        documentStatus: "UPLOADED",
        status: booking.status === "AWAITING_DOCUMENTS" ? "VERIFICATION_PENDING" : booking.status,
      },
    });

    return NextResponse.json({ success: true, documents: doc });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Upload failed";
    return NextResponse.json({ message }, { status: 400 });
  }
}
