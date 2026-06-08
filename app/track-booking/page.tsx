"use client";

import { Suspense, useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { trackBookingSchema } from "@/lib/booking/schemas";
import { z } from "zod";
import { formatCurrency, cn } from "@/lib/utils";
import { formatDateTimeIndian } from "@/lib/rental-datetime";
import { DocumentUploadForm } from "@/components/booking/document-upload-form";
import { Button } from "@/components/ui/button";
import { Loader2, Search, Bike, User, Calendar, CreditCard } from "lucide-react";
import Image from "next/image";

type TrackForm = z.infer<typeof trackBookingSchema>;

type BookingData = {
  id: string;
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
  rentalAmount: number;
  securityDeposit: number;
  totalAmount: number;
  paymentStatus: string;
  documentStatus: string;
  bookingStatus: string;
  createdAt: string;
  documents?: {
    dlNumber?: string | null;
    dlFrontUrl?: string | null;
    dlBackUrl?: string | null;
    aadhaarNumber?: string | null;
    aadhaarFrontUrl?: string | null;
    aadhaarBackUrl?: string | null;
    verificationStatus: string;
  } | null;
};

function statusTone(status: string) {
  switch (status) {
    case "CONFIRMED":
    case "ACTIVE":
    case "COMPLETED":
      return "bg-emerald-50 text-emerald-700 ring-emerald-200";
    case "VERIFICATION_PENDING":
      return "bg-violet-50 text-violet-700 ring-violet-200";
    case "AWAITING_DOCUMENTS":
      return "bg-amber-50 text-amber-800 ring-amber-200";
    case "CANCELLED":
      return "bg-rose-50 text-rose-700 ring-rose-200";
    default:
      return "bg-zinc-100 text-zinc-700 ring-zinc-200";
  }
}

function TrackBookingContent() {
  const [booking, setBooking] = useState<BookingData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TrackForm>({
    resolver: zodResolver(trackBookingSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    setLoading(true);
    setError(null);
    setBooking(null);
    try {
      const res = await fetch("/api/bookings/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      const json = (await res.json()) as { booking?: BookingData; message?: string };
      if (!res.ok) throw new Error(json.message || "Not found");
      setBooking(json.booking!);
    } catch (trackError) {
      setError(trackError instanceof Error ? trackError.message : "Failed to track");
    } finally {
      setLoading(false);
    }
  });

  const showUpload =
    booking &&
    booking.paymentStatus === "PAID" &&
    (booking.documentStatus === "NOT_UPLOADED" ||
      booking.documentStatus === "REJECTED" ||
      booking.documents?.verificationStatus === "REJECTED");

  const hasDocs = booking?.documents?.dlFrontUrl;

  return (
    <div className="mesh-bg min-h-screen py-10 md:py-16">
      <div className="page-wrap max-w-5xl">
        <div className="text-center md:text-center">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#FF6B1A]">Booking tracker</p>
          <h1 className="mt-1 text-3xl font-bold text-white md:text-4xl">Track your booking</h1>
          <p className="mt-2 text-zinc-400">Enter tracking ID and the email you used when booking.</p>
        </div>

        <form
          onSubmit={onSubmit}
          className="mt-8 overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-[0_0_30px_rgba(255,107,26,0.05)]"
        >
          <div className="border-b border-white/5 bg-gradient-to-r from-[#FF6B1A]/10 to-transparent px-6 py-4">
            <p className="text-sm font-semibold text-zinc-300">Find your reservation</p>
          </div>
          <div className="grid gap-4 p-6 sm:grid-cols-2">
            <div>
              <label className="text-sm font-medium text-zinc-400">Tracking ID</label>
              <input
                {...register("trackingId")}
                className="input-field mt-1.5 w-full bg-[#111111] text-white border-white/10 focus:border-[#FF6B1A]"
                placeholder="BR202600001"
              />
              {errors.trackingId ? <p className="mt-1 text-xs text-rose-500">{errors.trackingId.message}</p> : null}
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-400">Email address</label>
              <input
                type="email"
                {...register("email")}
                className="input-field mt-1.5 w-full bg-[#111111] text-white border-white/10 focus:border-[#FF6B1A]"
              />
              {errors.email ? <p className="mt-1 text-xs text-rose-500">{errors.email.message}</p> : null}
            </div>
          </div>
          {error ? <p className="px-6 pb-2 text-sm text-rose-600">{error}</p> : null}
          <div className="border-t border-white/5 px-6 py-4 flex justify-center">
            <Button type="submit" disabled={loading} className="w-full gap-2 sm:w-auto bg-gradient-to-br from-[#FF6B1A] to-[#FF8A3D] text-white hover:scale-[1.02] shadow-[0_0_20px_rgba(255,107,26,0.3)] transition-all border-0">
              {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
              Track booking
            </Button>
          </div>
        </form>

        {booking ? (
          <div className="mt-8 space-y-6">
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] shadow-lg">
              <div className="flex flex-col gap-4 border-b border-white/5 bg-gradient-to-br from-[#FF6B1A]/10 to-[#0A0A0A] p-6 sm:flex-row sm:items-center sm:justify-between">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Tracking ID</p>
                  <p className="mt-1 text-3xl font-black tracking-tight text-[#FF6B1A]">{booking.trackingId}</p>
                  <p className="mt-1 text-sm text-zinc-500">Booking #{booking.bookingRef}</p>
                </div>
                <span
                  className={cn(
                    "inline-flex w-fit rounded-full px-4 py-1.5 text-sm font-semibold ring-1",
                    statusTone(booking.bookingStatus),
                  )}
                >
                  {booking.bookingStatus.replace(/_/g, " ")}
                </span>
              </div>

              <div className="p-6">
                <Section title="Customer details" icon={User}>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailCard label="Name" value={booking.customerName} />
                    <DetailCard label="Email" value={booking.customerEmail} />
                    <DetailCard label="Phone" value={booking.customerPhone} />
                  </div>
                </Section>

                <Section title="Bike details" icon={Bike}>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailCard label="Bike" value={booking.bikeName} highlight />
                    <DetailCard label="Bike number" value={booking.bikeNumber || "—"} />
                    <DetailCard label="Color" value={booking.bikeColor || "—"} />
                  </div>
                </Section>

                <Section title="Schedule" icon={Calendar}>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailCard
                      label="Pickup"
                      value={formatDateTimeIndian(
                        `${booking.pickupDate.split("T")[0]}T${booking.pickupTime || "09:00"}`,
                      )}
                    />
                    <DetailCard
                      label="Return"
                      value={formatDateTimeIndian(
                        `${booking.returnDate.split("T")[0]}T${booking.returnTime || "18:00"}`,
                      )}
                    />
                    <DetailCard label="Booked on" value={new Date(booking.createdAt).toLocaleString("en-IN")} />
                  </div>
                </Section>

                <Section title="Payment & status" icon={CreditCard}>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    <DetailCard label="Rental amount" value={formatCurrency(booking.rentalAmount)} />
                    <DetailCard label="Security deposit" value={formatCurrency(booking.securityDeposit)} />
                    <DetailCard label="Total paid" value={formatCurrency(booking.totalAmount)} highlight />
                    <DetailCard label="Payment" value={booking.paymentStatus} />
                    <DetailCard label="Documents" value={booking.documentStatus.replace(/_/g, " ")} />
                  </div>
                </Section>
              </div>
            </div>

            {hasDocs ? (
              <div className="rounded-2xl border border-white/10 bg-[#0A0A0A] p-6 shadow-sm">
                <h2 className="text-lg font-bold text-white">Uploaded documents</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Verification: {booking.documents?.verificationStatus.replace(/_/g, " ")}
                </p>
                <p className="mt-2 text-sm text-zinc-500">
                  DL: {booking.documents?.dlNumber} · Aadhaar: {booking.documents?.aadhaarNumber}
                </p>
                <div className="mt-4 grid grid-cols-2 gap-3 lg:grid-cols-4">
                  {booking.documents?.dlFrontUrl ? <DocPreview url={booking.documents.dlFrontUrl} alt="DL front" /> : null}
                  {booking.documents?.dlBackUrl ? <DocPreview url={booking.documents.dlBackUrl} alt="DL back" /> : null}
                  {booking.documents?.aadhaarFrontUrl ? (
                    <DocPreview url={booking.documents.aadhaarFrontUrl} alt="Aadhaar front" />
                  ) : null}
                  {booking.documents?.aadhaarBackUrl ? (
                    <DocPreview url={booking.documents.aadhaarBackUrl} alt="Aadhaar back" />
                  ) : null}
                </div>
                {(booking.documentStatus === "REJECTED" ||
                  booking.documents?.verificationStatus === "REJECTED") && (
                  <div className="mt-6 rounded-xl border border-amber-200 bg-amber-50 p-4">
                    <p className="mb-3 text-sm font-medium text-amber-900">Please re-upload your documents</p>
                    <DocumentUploadForm
                      trackingId={booking.trackingId}
                      email={booking.customerEmail}
                      onSuccess={() => window.location.reload()}
                    />
                  </div>
                )}
              </div>
            ) : null}

            {showUpload ? (
              <div className="rounded-2xl border border-[#FF6B1A]/20 bg-gradient-to-br from-[#FF6B1A]/5 to-[#0A0A0A] p-6 shadow-sm">
                <h2 className="text-lg font-bold text-white">Upload documents</h2>
                <p className="mt-1 text-sm text-zinc-400">
                  Driving license and Aadhaar (front & back) — required to confirm your ride.
                </p>
                <div className="mt-4">
                  <DocumentUploadForm
                    trackingId={booking.trackingId}
                    email={booking.customerEmail}
                    onSuccess={() => window.location.reload()}
                  />
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </div>
    </div>
  );
}

function Section({
  title,
  icon: Icon,
  children,
}: {
  title: string;
  icon: React.ComponentType<{ className?: string }>;
  children: React.ReactNode;
}) {
  return (
    <div className="mb-6 last:mb-0">
      <div className="mb-3 flex items-center gap-2">
        <span className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#FF6B1A]/10 text-[#FF6B1A]">
          <Icon className="h-4 w-4" />
        </span>
        <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-300">{title}</h3>
      </div>
      {children}
    </div>
  );
}

function DetailCard({
  label,
  value,
  highlight = false,
}: {
  label: string;
  value: string;
  highlight?: boolean;
}) {
  return (
    <div
      className={cn(
        "rounded-xl border p-3.5 transition",
        highlight ? "border-[#FF6B1A]/25 bg-[#FF6B1A]/5" : "border-white/5 bg-[#111111] hover:bg-white/5",
      )}
    >
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <p className={cn("mt-1 text-sm font-semibold break-words", highlight ? "text-[#FF6B1A]" : "text-white")}>
        {value}
      </p>
    </div>
  );
}

function DocPreview({ url, alt }: { url: string; alt: string }) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="group relative block aspect-[4/3] overflow-hidden rounded-xl border border-white/10 shadow-sm"
    >
      <Image src={url} alt={alt} fill className="object-cover transition group-hover:scale-105" unoptimized />
      <span className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent px-2 py-2 text-[10px] font-medium text-white">
        {alt}
      </span>
    </a>
  );
}

export default function TrackBookingPage() {
  return (
    <Suspense fallback={<div className="page-wrap py-20 text-zinc-400">Loading…</div>}>
      <TrackBookingContent />
    </Suspense>
  );
}
