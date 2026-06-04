"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import { useSearchParams } from "next/navigation";
import { motion } from "framer-motion";
import type { BikeDetailItem } from "@/lib/bike-catalog";
import { formatCurrency } from "@/lib/utils";
import { quoteForBike } from "@/hooks/use-rental-window";
import { Button } from "@/components/ui/button";
import { BikeMediaImage, getBikeGallery } from "@/components/bikes/bike-media-image";
import { PremiumAccordion } from "@/components/faq/premium-accordion";
import { RichHtmlContent } from "@/components/ui/rich-html-content";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Star, Fuel, Gauge, Zap, Shield, CheckCircle2, Users } from "lucide-react";
import { bikeFeatureOptions } from "@/lib/bike-json";

type Props = { bike: BikeDetailItem; days: number };

const bikeFaqs = [
  {
    id: "b1",
    question: "When do I upload documents?",
    answer: "After payment only. Upload driving license and Aadhaar from the success page or Track Booking.",
  },
  { id: "b2", question: "Is fuel included?", answer: "Fuel is not included. Return with similar fuel level to avoid refuel charges." },
  { id: "b3", question: "What is the security deposit?", answer: "Security deposit is refundable after vehicle inspection." },
];

function spec(label: string, value: string | number | undefined | null) {
  if (value === undefined || value === null || value === "" || value === "—") return null;
  return { label, value: String(value) };
}

export function BikeDetailView({ bike, days }: Props) {
  const searchParams = useSearchParams();
  const pickup = searchParams.get("pickup") || "";
  const drop = searchParams.get("drop") || "";
  const [activeImage, setActiveImage] = useState(0);
  const gallery = getBikeGallery(bike.image, bike.gallery);
  const activeFeatures = bikeFeatureOptions.filter((f) => bike.features[f.key]);

  const quote = useMemo(
    () => quoteForBike(bike.pricePerDay, bike.pricePerHour, pickup, drop, days),
    [bike, pickup, drop, days],
  );

  const bookQs = new URLSearchParams();
  bookQs.set("bike", bike.id);
  if (pickup) bookQs.set("pickup", pickup);
  if (drop) bookQs.set("drop", drop);

  const detailSpecs = [
    spec("Bike number", bike.bikeNo),
    spec("Color", bike.color),
    spec("Brand", bike.brand),
    spec("Category", bike.category),
    spec("Model year", bike.modelYear),
    spec("Engine CC", `${bike.cc} cc`),
    spec("Mileage", `${bike.mileage} kmpl`),
    spec("Top speed", bike.topSpeed ? `${bike.topSpeed} km/h` : null),
    spec("Power", bike.power),
    spec("Torque", bike.torque),
    spec("Fuel tank", bike.fuelTank),
    spec("Weight", bike.weight),
    spec("Seat height", bike.seatHeight),
    spec("Engine type", bike.engineType),
    spec("Fuel type", bike.fuelType),
    spec("Transmission", bike.transmission),
    spec("Hourly price", formatCurrency(bike.pricePerHour)),
    spec("Daily price", formatCurrency(bike.pricePerDay)),
    spec("Security deposit", formatCurrency(bike.securityDepositAmount)),
    spec("Included KM / day", bike.includedKmPerDay),
    spec("Extra KM charge", bike.extraKmCharge ? formatCurrency(bike.extraKmCharge) : null),
  ].filter(Boolean) as { label: string; value: string }[];

  return (
    <div className="page-wrap py-10 md:py-14">
      <div className="grid gap-10 lg:grid-cols-[1fr_380px] lg:gap-12">
        <div className="min-w-0 space-y-10">
          <SectionReveal>
            <div className="relative aspect-[16/10] overflow-hidden rounded-3xl border border-zinc-200 shadow-xl">
              <BikeMediaImage src={gallery[activeImage] ?? bike.image} alt={bike.name} fill priority />
            </div>
            {gallery.length > 1 ? (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {gallery.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={`relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition ${
                      activeImage === i ? "border-[#FF5722]" : "border-zinc-200"
                    }`}
                  >
                    <BikeMediaImage src={img} alt="" fill className="object-cover" />
                  </button>
                ))}
              </div>
            ) : null}
          </SectionReveal>

          <SectionReveal>
            <h2 className="font-display text-2xl font-bold text-zinc-900">Bike details</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {detailSpecs.map((s) => (
                <div key={s.label} className="glass rounded-xl p-4">
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">{s.label}</p>
                  <p className="mt-1 font-semibold text-zinc-900">{s.value}</p>
                </div>
              ))}
            </div>
          </SectionReveal>

          {bike.shortDescription ? (
            <SectionReveal>
              <p className="text-lg text-zinc-600">{bike.shortDescription}</p>
            </SectionReveal>
          ) : null}

          <SectionReveal>
            <h2 className="font-display text-2xl font-bold text-zinc-900">Description</h2>
            {bike.descriptionHtml ? (
              <RichHtmlContent html={bike.descriptionHtml} className="mt-4" />
            ) : (
              <p className="mt-4 leading-relaxed text-zinc-600">
                Rent the {bike.name} in Ranchi — {bike.brand} {bike.cc}cc.
              </p>
            )}
          </SectionReveal>

          {activeFeatures.length > 0 ? (
            <SectionReveal>
              <h2 className="font-display text-2xl font-bold text-zinc-900">Features</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeFeatures.map((feature) => (
                  <span
                    key={feature.key}
                    className="rounded-full border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm font-medium text-emerald-800"
                  >
                    {feature.label}
                  </span>
                ))}
              </div>
            </SectionReveal>
          ) : null}

          <SectionReveal>
            <h2 className="font-display text-2xl font-bold text-zinc-900">Rental terms</h2>
            {bike.rentalTermsHtml ? (
              <RichHtmlContent html={bike.rentalTermsHtml} className="mt-4" />
            ) : (
              <ul className="mt-4 space-y-3">
                {[
                  bike.minimumBookingHours
                    ? `Minimum ${bike.minimumBookingHours} hours for hourly rental`
                    : "Minimum 2 hours for hourly rental",
                  `Security deposit ${formatCurrency(bike.securityDepositAmount)} refundable after inspection`,
                  bike.includedKmPerDay ? `${bike.includedKmPerDay} km included per day` : "Standard mileage limits apply",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-sm text-zinc-600">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            )}
          </SectionReveal>

          <SectionReveal>
            <h2 className="font-display text-2xl font-bold text-zinc-900">FAQ</h2>
            <div className="mt-6">
              <PremiumAccordion items={bikeFaqs} />
            </div>
          </SectionReveal>
        </div>

        <div className="lg:sticky lg:top-24 lg:self-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="glass-strong gradient-border overflow-hidden rounded-3xl shadow-2xl shadow-blue-500/10"
          >
            <div className="border-b border-zinc-100 p-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-amber-400 text-amber-400" />
                <span className="font-bold text-zinc-900">{bike.rating}</span>
                <span className="text-zinc-400">·</span>
                <span className="text-sm text-zinc-500">{bike.brand}</span>
              </div>
              <h1 className="font-display mt-2 break-words text-2xl font-bold text-zinc-900">{bike.name}</h1>
              {bike.bikeNo ? <p className="mt-1 text-sm text-zinc-500">#{bike.bikeNo}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs">
                  <Gauge className="h-3.5 w-3.5 text-blue-600" />
                  {bike.cc}cc
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs">
                  <Fuel className="h-3.5 w-3.5 text-violet-600" />
                  {bike.fuelType}
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-zinc-100 px-2 py-1 text-xs">
                  <Zap className="h-3.5 w-3.5 text-cyan-500" />
                  {bike.mileage} kmpl
                </span>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-400">Pricing</p>
                <p className="text-3xl font-bold text-zinc-900">{formatCurrency(bike.pricePerDay)}/day</p>
                <p className="text-sm text-[#FF653F]">{formatCurrency(bike.pricePerHour)}/hour</p>
                {pickup && drop ? (
                  <p className="mt-2 text-sm font-semibold text-emerald-700">
                    {quote.label} · {formatCurrency(quote.total)} estimated total
                  </p>
                ) : null}
              </div>

              <ul className="space-y-2 text-sm text-zinc-600">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-blue-500" />
                  Deposit {formatCurrency(bike.securityDepositAmount)}
                </li>
                {bike.features.helmet_included ? (
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-violet-500" />
                    Helmet included
                  </li>
                ) : null}
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                  Pay first · documents after
                </li>
              </ul>

              <Link href={`/book?${bookQs.toString()}`} className="block">
                <Button className="w-full" size="lg">
                  Rent now
                </Button>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
