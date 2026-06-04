import { sendMail, siteUrl } from "@/lib/email/mailer";
import { formatCurrency } from "@/lib/utils";

type BookingEmailPayload = {
  trackingId: string;
  bookingRef: string;
  customerName: string;
  customerEmail: string;
  customerPhone: string;
  bikeName: string;
  bikeNumber?: string | null;
  bikeColor?: string | null;
  pickupDate: string;
  pickupTime?: string | null;
  returnDate: string;
  returnTime?: string | null;
  totalAmount: number;
};

function formatWhen(date: Date, time?: string | null) {
  const d = new Intl.DateTimeFormat("en-IN", { dateStyle: "medium" }).format(date);
  return time ? `${d}, ${time}` : d;
}

export async function sendBookingConfirmationEmails(booking: BookingEmailPayload) {
  const base = siteUrl();
  const trackUrl = `${base}/track-booking`;
  const uploadUrl = `${base}/booking/success?tracking=${encodeURIComponent(booking.trackingId)}&email=${encodeURIComponent(booking.customerEmail)}`;

  const customerHtml = `
    <h2>Booking confirmed</h2>
    <p>Hi ${booking.customerName},</p>
    <p>Thank you for booking with Nextgen Bike Rent.</p>
    <p><strong>Tracking ID:</strong> ${booking.trackingId}</p>
    <p><strong>Booking #:</strong> ${booking.bookingRef}</p>
    <p><strong>Bike:</strong> ${booking.bikeName}${booking.bikeNumber ? ` (${booking.bikeNumber})` : ""}${booking.bikeColor ? ` · ${booking.bikeColor}` : ""}</p>
    <p><strong>Pickup:</strong> ${formatWhen(new Date(booking.pickupDate), booking.pickupTime)}</p>
    <p><strong>Return:</strong> ${formatWhen(new Date(booking.returnDate), booking.returnTime)}</p>
    <p><strong>Amount paid:</strong> ${formatCurrency(booking.totalAmount)}</p>
    <p><a href="${trackUrl}">Track your booking</a></p>
    <p>Please upload your driving license and Aadhaar when ready: <a href="${uploadUrl}">Upload documents</a></p>
  `;

  await sendMail({
    to: booking.customerEmail,
    subject: `Booking Confirmation · ${booking.trackingId}`,
    html: customerHtml,
    text: `Tracking ID: ${booking.trackingId}. Track: ${trackUrl}`,
  });

  const adminEmail = process.env.ADMIN_EMAIL;
  if (adminEmail) {
    const adminHtml = `
      <h2>New bike booking received</h2>
      <p><strong>Tracking ID:</strong> ${booking.trackingId}</p>
      <p><strong>Customer:</strong> ${booking.customerName} · ${booking.customerPhone} · ${booking.customerEmail}</p>
      <p><strong>Bike:</strong> ${booking.bikeName} · ${booking.bikeNumber || "—"} · ${booking.bikeColor || "—"}</p>
      <p><strong>Pickup:</strong> ${formatWhen(new Date(booking.pickupDate), booking.pickupTime)}</p>
      <p><strong>Return:</strong> ${formatWhen(new Date(booking.returnDate), booking.returnTime)}</p>
      <p><strong>Amount paid:</strong> ${formatCurrency(booking.totalAmount)}</p>
    `;
    await sendMail({
      to: adminEmail,
      subject: `New Bike Booking · ${booking.trackingId}`,
      html: adminHtml,
    });
  }
}
