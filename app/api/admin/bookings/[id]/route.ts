import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { sendMail } from "@/lib/email/mailer";

async function assertAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") return null;
  return session;
}

type Params = { params: Promise<{ id: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const booking = await db.booking.findUnique({
    where: { id },
    include: { documents: true, payment: true, bike: true, city: true },
  });
  if (!booking) return NextResponse.json({ message: "Not found" }, { status: 404 });
  return NextResponse.json({ booking });
}

export async function PATCH(req: Request, { params }: Params) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const { id } = await params;
  const body = (await req.json()) as {
    action?: string;
    bookingStatus?: string;
    documentStatus?: string;
    note?: string;
  };

  const booking = await db.booking.findUnique({
    where: { id },
    include: { documents: true },
  });
  if (!booking) return NextResponse.json({ message: "Not found" }, { status: 404 });

  switch (body.action) {
    case "approve_documents": {
      if (!booking.documents) {
        return NextResponse.json({ message: "No documents uploaded." }, { status: 400 });
      }
      await db.$transaction([
        db.bookingDocument.update({
          where: { bookingId: id },
          data: { verificationStatus: "APPROVED", verifiedAt: new Date() },
        }),
        db.booking.update({
          where: { id },
          data: { documentStatus: "APPROVED", status: "CONFIRMED" },
        }),
      ]);
      break;
    }
    case "reject_documents": {
      await db.$transaction([
        booking.documents
          ? db.bookingDocument.update({
              where: { bookingId: id },
              data: { verificationStatus: "REJECTED" },
            })
          : db.bookingDocument.create({
              data: { bookingId: id, verificationStatus: "REJECTED" },
            }),
        db.booking.update({
          where: { id },
          data: { documentStatus: "REJECTED", status: "AWAITING_DOCUMENTS" },
        }),
      ]);
      break;
    }
    case "confirm_booking":
      await db.booking.update({ where: { id }, data: { status: "CONFIRMED" } });
      break;
    case "cancel_booking":
      await db.booking.update({ where: { id }, data: { status: "CANCELLED" } });
      break;
    case "set_booking_status": {
      const allowed = [
        "AWAITING_DOCUMENTS",
        "VERIFICATION_PENDING",
        "CONFIRMED",
        "ACTIVE",
        "RETURNED",
        "COMPLETED",
        "CANCELLED",
      ] as const;
      if (!body.bookingStatus || !allowed.includes(body.bookingStatus as (typeof allowed)[number])) {
        return NextResponse.json({ message: "Invalid booking status." }, { status: 400 });
      }
      
      const updateData: any = { status: body.bookingStatus as (typeof allowed)[number] };
      if (body.bookingStatus === "RETURNED" && body.note) {
        updateData.returnNote = body.note;
      }
      
      await db.booking.update({
        where: { id },
        data: updateData,
      });

      // Send email notification to user
      if (booking.customerEmail) {
        let emailHtml = `<p>Hi ${booking.customerName || "Customer"},</p>
          <p>The status of your bike booking (<strong>${booking.bikeName || "Bike"}</strong>) has been updated to: <strong>${body.bookingStatus}</strong>.</p>`;
        
        if (body.bookingStatus === "RETURNED" && body.note) {
          emailHtml += `<p><strong>Return Note from Admin:</strong><br/>${body.note}</p>`;
        }
        
        emailHtml += `<p>Tracking ID: <strong>${booking.trackingId || "N/A"}</strong></p>
          <p>Thank you for choosing Nextgen Bike Rent!</p>`;
          
        await sendMail({
          to: booking.customerEmail,
          subject: `Booking Status Update: ${body.bookingStatus} - ${booking.trackingId || ""}`,
          html: emailHtml,
        }).catch((err) => {
          console.error("Failed to send status update email:", err);
        });
      }
      break;
    }
    case "send_email":
      if (booking.customerEmail) {
        await sendMail({
          to: booking.customerEmail,
          subject: `Update on booking ${booking.trackingId}`,
          html: `<p>Hi ${booking.customerName},</p><p>${body.note || "We have an update on your bike booking."}</p><p>Tracking ID: ${booking.trackingId}</p>`,
        });
      }
      break;
    default:
      return NextResponse.json({ message: "Unknown action" }, { status: 400 });
  }

  const updated = await db.booking.findUnique({
    where: { id },
    include: { documents: true, payment: true },
  });
  return NextResponse.json({ booking: updated });
}
