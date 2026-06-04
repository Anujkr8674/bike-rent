import { Suspense } from "react";
import { notFound } from "next/navigation";
import Link from "next/link";
import { getCatalogBikeBySlug } from "@/lib/bike-catalog";
import { GuestBookingForm } from "@/components/booking/guest-booking-form";
import { SectionReveal } from "@/components/ui/section-reveal";
import { BikeMediaImage } from "@/components/bikes/bike-media-image";
import { formatCurrency } from "@/lib/utils";

type Props = { searchParams: Promise<{ bike?: string; pickup?: string; drop?: string }> };

export const metadata = { title: "Book Your Ride" };

async function BookContent({ searchParams }: Props) {
  const params = await searchParams;
  const slug = params.bike?.trim();
  if (!slug) {
    return (
      <div className="page-wrap py-16 text-center">
        <p className="text-lg font-semibold text-zinc-800">Select a bike to continue</p>
        <Link href="/bikes" className="mt-4 inline-block text-[#FF653F] font-semibold hover:underline">
          Browse fleet →
        </Link>
      </div>
    );
  }

  const bike = await getCatalogBikeBySlug(slug);
  if (!bike) notFound();

  return (
    <div className="mesh-bg min-h-screen py-10 md:py-16">
      <div className="page-wrap max-w-5xl">
        <SectionReveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF653F]">Guest booking</p>
          <h1 className="section-title mt-2">Book {bike.name}</h1>
          <p className="section-subtitle">No account required · Pay securely · Upload documents after payment</p>
        </SectionReveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[1fr_1.1fr]">
          <div className="glass-strong gradient-border overflow-hidden rounded-2xl">
            <div className="relative aspect-[4/3]">
              <BikeMediaImage src={bike.image} alt={bike.name} fill className="object-cover" />
            </div>
            <div className="p-5">
              <h2 className="text-xl font-bold text-zinc-900">{bike.name}</h2>
              <p className="text-sm text-zinc-500">{bike.brand} · {bike.category}</p>
              <p className="mt-2 text-2xl font-bold text-zinc-900">{formatCurrency(bike.pricePerDay)}/day</p>
              <p className="text-sm text-zinc-500">{formatCurrency(bike.pricePerHour)}/hour</p>
            </div>
          </div>

          <div className="glass-strong gradient-border rounded-2xl p-6 md:p-8">
            <GuestBookingForm
              bike={bike}
              initialPickup={params.pickup}
              initialDrop={params.drop}
            />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function BookPage(props: Props) {
  return (
    <Suspense fallback={<div className="page-wrap py-20 text-zinc-400">Loading booking…</div>}>
      <BookContent searchParams={props.searchParams} />
    </Suspense>
  );
}
