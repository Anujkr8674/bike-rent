"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import type { BikeDetailItem } from "@/lib/bike-catalog";
import { guestBookingSchema, type GuestBookingInput } from "@/lib/booking/schemas";
import { DateTimePickerField } from "@/components/booking/datetime-picker-field";
import { useDefaultPickupDrop } from "@/hooks/use-rental-window";
import { computeGuestBookingAmounts } from "@/lib/booking/amounts";
import { splitDateTime, todayDateString, minDropDateTime, isDropBeforePickup } from "@/lib/rental-datetime";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { RazorpayTestHint } from "@/components/booking/razorpay-test-hint";
import { Loader2 } from "lucide-react";

const showDevTestPay =
  process.env.NODE_ENV !== "production" || process.env.NEXT_PUBLIC_ALLOW_TEST_PAYMENTS === "true";

declare global {
  interface Window {
    Razorpay?: new (options: Record<string, unknown>) => { open: () => void };
  }
}

type Props = {
  bike: BikeDetailItem;
  initialPickup?: string;
  initialDrop?: string;
};

export function GuestBookingForm({ bike, initialPickup, initialDrop }: Props) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const defaults = useDefaultPickupDrop();
  const [pickup, setPickup] = useState(initialPickup || searchParams.get("pickup") || defaults.pickup);
  const [drop, setDrop] = useState(initialDrop || searchParams.get("drop") || defaults.drop);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { date: pickupDate, time: pickupTime } = splitDateTime(pickup);
  const { date: returnDate, time: returnTime } = splitDateTime(drop);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<GuestBookingInput>({
    resolver: zodResolver(guestBookingSchema),
    defaultValues: {
      bikeSlug: bike.id,
      fullName: "",
      email: "",
      phone: "",
      pickupDate: pickupDate || todayDateString(),
      pickupTime: pickupTime || "09:00",
      returnDate: returnDate || todayDateString(),
      returnTime: returnTime || "18:00",
    },
  });

  const summary = useMemo(() => {
    try {
      if (!pickupDate || !returnDate || !pickupTime || !returnTime) return null;
      return computeGuestBookingAmounts(
        bike.pricePerDay,
        bike.pricePerHour,
        bike.securityDepositAmount,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
      );
    } catch {
      return null;
    }
  }, [bike, pickupDate, returnDate, pickupTime, returnTime]);

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    document.body.appendChild(script);
    return () => {
      document.body.removeChild(script);
    };
  }, []);

  async function finishTestCheckout(checkoutId: string, email: string) {
    const demo = await fetch("/api/bookings/guest/demo-complete", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ checkoutId }),
    });
    const demoJson = (await demo.json()) as { trackingId?: string; email?: string; message?: string };
    if (!demo.ok) throw new Error(demoJson.message || "Test booking failed");
    router.push(
      `/booking/success?tracking=${encodeURIComponent(demoJson.trackingId || "")}&email=${encodeURIComponent(demoJson.email || email)}`,
    );
  }

  const onTestPay = handleSubmit(async (data) => {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        ...data,
        bikeSlug: bike.id,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
        testCheckoutOnly: true,
      };
      const res = await fetch("/api/bookings/guest/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { checkoutId?: string; message?: string };
      if (!res.ok || !json.checkoutId) {
        throw new Error(json.message || "Failed to start test booking");
      }
      await finishTestCheckout(json.checkoutId, data.email);
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Test booking failed");
    } finally {
      setBusy(false);
    }
  });

  const onSubmit = handleSubmit(async (data) => {
    setBusy(true);
    setError(null);
    try {
      const payload = {
        ...data,
        bikeSlug: bike.id,
        pickupDate,
        pickupTime,
        returnDate,
        returnTime,
      };

      const res = await fetch("/api/bookings/guest/create-order", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as {
        message?: string;
        checkoutId?: string;
        orderId?: string;
        keyId?: string;
        amount?: number;
        customer?: { name: string; email: string; contact: string };
        demoMode?: boolean;
      };

      if (!res.ok) {
        if (json.demoMode && json.checkoutId) {
          const demo = await fetch("/api/bookings/guest/demo-complete", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ checkoutId: json.checkoutId }),
          });
          const demoJson = (await demo.json()) as { trackingId?: string; email?: string; message?: string };
          if (!demo.ok) throw new Error(demoJson.message || "Demo booking failed");
          router.push(
            `/booking/success?tracking=${encodeURIComponent(demoJson.trackingId || "")}&email=${encodeURIComponent(demoJson.email || data.email)}`,
          );
          return;
        }
        throw new Error(json.message || "Failed to start payment");
      }

      if (!json.orderId || !json.keyId || !json.checkoutId) {
        throw new Error("Invalid payment response");
      }

      if (!window.Razorpay) {
        throw new Error("Razorpay failed to load. Please refresh and try again.");
      }

      const rzp = new window.Razorpay({
        key: json.keyId,
        amount: Math.round((json.amount || 0) * 100),
        currency: "INR",
        name: "Nextgen Bike Rent",
        description: `${bike.name} rental`,
        order_id: json.orderId,
        prefill: json.customer,
        theme: { color: "#FF653F" },
        handler: async (response: {
          razorpay_order_id: string;
          razorpay_payment_id: string;
          razorpay_signature: string;
        }) => {
          setBusy(true);
          try {
            const verify = await fetch("/api/bookings/guest/verify-payment", {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                checkoutId: json.checkoutId,
                razorpay_order_id: response.razorpay_order_id,
                razorpay_payment_id: response.razorpay_payment_id,
                razorpay_signature: response.razorpay_signature,
              }),
            });
            const verifyJson = (await verify.json()) as {
              trackingId?: string;
              email?: string;
              message?: string;
            };
            if (!verify.ok) throw new Error(verifyJson.message || "Verification failed");
            router.push(
              `/booking/success?tracking=${encodeURIComponent(verifyJson.trackingId || "")}&email=${encodeURIComponent(verifyJson.email || data.email)}`,
            );
          } catch (verifyError) {
            setError(verifyError instanceof Error ? verifyError.message : "Verification failed");
            setBusy(false);
          }
        },
        modal: {
          ondismiss: () => setBusy(false),
        },
      });
      rzp.open();
    } catch (submitError) {
      setError(submitError instanceof Error ? submitError.message : "Booking failed");
    } finally {
      setBusy(false);
    }
  });

  return (
    <form onSubmit={onSubmit} className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium text-zinc-800">Full name *</label>
          <input {...register("fullName")} className="input-field mt-1 w-full" placeholder="Your name" />
          {errors.fullName ? <p className="mt-1 text-xs text-rose-600">{errors.fullName.message}</p> : null}
        </div>
        <div>
          <label className="text-sm font-medium text-zinc-800">Email *</label>
          <input type="email" {...register("email")} className="input-field mt-1 w-full" />
          {errors.email ? <p className="mt-1 text-xs text-rose-600">{errors.email.message}</p> : null}
        </div>
        <div className="sm:col-span-2">
          <label className="text-sm font-medium text-zinc-800">Mobile number *</label>
          <input {...register("phone")} className="input-field mt-1 w-full" placeholder="10-digit mobile" />
          {errors.phone ? <p className="mt-1 text-xs text-rose-600">{errors.phone.message}</p> : null}
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <DateTimePickerField
          label="Pickup"
          value={pickup}
          onChange={(v) => {
            setPickup(v);
            if (drop && isDropBeforePickup(v, drop)) setDrop(minDropDateTime(v));
          }}
          minDate={todayDateString()}
        />
        <DateTimePickerField
          label="Drop off"
          value={drop}
          onChange={setDrop}
          minDate={pickup ? pickup.split("T")[0] : todayDateString()}
          minDateTime={pickup ? minDropDateTime(pickup) : undefined}
        />
      </div>

      {summary ? (
        <div className="rounded-2xl border border-[#FF653F]/20 bg-[#FF653F]/5 p-5">
          <p className="text-xs font-semibold uppercase tracking-wider text-[#FF653F]">Booking summary</p>
          <div className="mt-3 space-y-2 text-sm text-zinc-700">
            <div className="flex justify-between">
              <span>{summary.duration.label} rental</span>
              <span className="font-semibold">{formatCurrency(summary.rentalAmount)}</span>
            </div>
            <div className="flex justify-between">
              <span>Security deposit</span>
              <span className="font-semibold">{formatCurrency(summary.securityDeposit)}</span>
            </div>
            <div className="flex justify-between border-t border-[#FF653F]/20 pt-2 text-base font-bold text-zinc-900">
              <span>Grand total</span>
              <span className="text-[#FF653F]">{formatCurrency(summary.totalAmount)}</span>
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            Documents (DL & Aadhaar) are collected after payment — not before.
          </p>
        </div>
      ) : (
        <p className="text-sm text-rose-600">Please select valid pickup and drop-off times.</p>
      )}

      {error ? <p className="rounded-lg bg-rose-50 px-3 py-2 text-sm text-rose-700">{error}</p> : null}

      <RazorpayTestHint showTestPayNote={showDevTestPay} />

      <Button type="submit" className="w-full" size="lg" disabled={busy || !summary}>
        {busy ? (
          <>
            <Loader2 className="h-4 w-4 animate-spin" /> Processing…
          </>
        ) : (
          `Pay ${summary ? formatCurrency(summary.totalAmount) : ""} & Book`
        )}
      </Button>

      {showDevTestPay ? (
        <Button
          type="button"
          variant="outline"
          className="w-full border-dashed border-amber-300 text-amber-900 hover:bg-amber-50"
          size="lg"
          disabled={busy || !summary}
          onClick={onTestPay}
        >
          {busy ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" /> Processing…
            </>
          ) : (
            "Test pay (skip Razorpay) — unlimited local bookings"
          )}
        </Button>
      ) : null}
    </form>
  );
}
