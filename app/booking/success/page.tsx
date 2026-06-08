"use client";

import { Suspense } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { CheckCircle2 } from "lucide-react";
import { DocumentUploadForm } from "@/components/booking/document-upload-form";
import { Button } from "@/components/ui/button";

function SuccessContent() {
  const params = useSearchParams();
  const tracking = params.get("tracking") || "";
  const email = params.get("email") || "";
  const showUpload = params.get("upload") === "1";

  if (!tracking || !email) {
    return (
      <div className="page-wrap py-20 text-center">
        <p className="text-lg font-semibold text-zinc-800">Invalid success link</p>
        <Link href="/track-booking" className="mt-4 inline-block text-[#FF653F]">
          Track booking
        </Link>
      </div>
    );
  }

  return (
    <div className="mesh-bg min-h-screen py-12 md:py-20">
      <div className="page-wrap max-w-2xl">
        <div className="glass-strong gradient-border rounded-3xl p-8 text-center md:p-10">
          <CheckCircle2 className="mx-auto h-16 w-16 text-emerald-500" />
          <h1 className="mt-4 text-3xl font-bold text-white">Payment successful</h1>
          <p className="mt-2 text-zinc-300">Your booking is confirmed. Save your tracking ID.</p>
          <p className="mt-6 rounded-2xl bg-[#FF653F]/10 px-6 py-4 text-2xl font-black tracking-wide text-[#FF653F]">
            {tracking}
          </p>
          <p className="mt-2 text-sm text-zinc-400">Confirmation sent to {email}</p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Link href={`/booking/success?tracking=${encodeURIComponent(tracking)}&email=${encodeURIComponent(email)}&upload=1`}>
              <Button className="w-full sm:w-auto">Upload documents now</Button>
            </Link>
            <Link href="/track-booking">
              <Button variant="outline" className="w-full sm:w-auto">
                Upload documents later
              </Button>
            </Link>
          </div>
        </div>

        {showUpload ? (
          <div className="mt-8 glass-strong gradient-border rounded-2xl p-6 md:p-8">
            <h2 className="text-xl font-bold text-white">Upload verification documents</h2>
            <p className="mt-1 text-sm text-zinc-400">Driving license and Aadhaar (front & back)</p>
            <div className="mt-6">
              <DocumentUploadForm trackingId={tracking} email={email} />
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}

export default function BookingSuccessPage() {
  return (
    <Suspense fallback={<div className="page-wrap py-20 text-zinc-400">Loading…</div>}>
      <SuccessContent />
    </Suspense>
  );
}
