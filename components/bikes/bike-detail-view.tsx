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
import { AvailabilityChecker } from "@/components/bikes/availability-checker";
import { cn } from "@/lib/utils";
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
            <div className={cn(
              "group relative flex flex-col justify-center items-center aspect-[16/10] overflow-hidden transition-all duration-500",
              "rounded-[28px] border border-white/10",
              "shadow-[0_0_30px_rgba(255,107,26,0.15),0_0_60px_rgba(255,107,26,0.08)]",
              "hover:shadow-[0_0_40px_rgba(255,107,26,0.25),0_0_80px_rgba(255,107,26,0.12)]",
              "hover:border-[#FF6B1A]/30"
            )}
            style={{
              background: 'radial-gradient(circle at center, rgba(35,15,5,1) 0%, rgba(5,5,5,1) 70%)'
            }}>
              {/* Spotlight */}
              <div 
                className="absolute inset-0 pointer-events-none rounded-full opacity-100 transition-opacity duration-500 scale-[1.5] md:scale-[1.8]"
                style={{
                  background: 'radial-gradient(circle, rgba(255,107,26,0.15) 0%, transparent 60%)',
                  transform: 'translateY(0%) scaleY(0.9)'
                }}
              />

              {/* Ambient Floor Glow */}
              <div className="absolute -bottom-10 w-[120%] h-32 bg-[#FF6B1A]/10 blur-3xl opacity-100 rounded-[50%] transition-opacity duration-500" />
              
              {/* Hard Road Shadow */}
              <div className="absolute bottom-[12%] w-[45%] h-3 bg-white/40 rounded-[50%] blur-[4px] opacity-80 transition-transform duration-500 scale-[1.20] md:scale-[1.25] z-0" />

              {/* Bike Image Area */}
              <div className="relative z-10 w-[95%] h-[95%] transition-transform duration-500 group-hover:scale-105 group-hover:-translate-y-2">
                <BikeMediaImage 
                  src={gallery[activeImage] ?? bike.image} 
                  alt={bike.name} 
                  fill 
                  priority
                  className="object-contain drop-shadow-[0_20px_20px_rgba(0,0,0,0.8)]" 
                />
              </div>
            </div>
            {gallery.length > 1 ? (
              <div className="mt-4 flex gap-3 overflow-x-auto pb-1">
                {gallery.map((img, i) => (
                  <button
                    key={`${img}-${i}`}
                    type="button"
                    onClick={() => setActiveImage(i)}
                    className={cn(
                      "relative h-20 w-28 shrink-0 overflow-hidden rounded-xl border-2 transition",
                      activeImage === i 
                        ? "border-[#FF6B1A] shadow-[0_0_15px_rgba(255,107,26,0.3)] bg-[#111111]" 
                        : "border-white/10 opacity-60 hover:opacity-100 bg-[#0A0A0A]"
                    )}
                  >
                    <BikeMediaImage src={img} alt="" fill className="object-contain p-2" />
                  </button>
                ))}
              </div>
            ) : null}
          </SectionReveal>

          <SectionReveal>
            <h2 className="font-display text-2xl font-bold text-white">Bike details</h2>
            <div className="mt-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              {detailSpecs.map((s) => (
                <div 
                  key={s.label} 
                  className={cn(
                    "rounded-xl border border-white/10 bg-[#0A0A0A]/80 p-4 transition-all duration-300",
                    "hover:-translate-y-1 hover:scale-[1.02] hover:border-[#FF6B1A] hover:shadow-[0_8px_24px_rgba(255,107,26,0.15)] hover:bg-[#111111]"
                  )}
                >
                  <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{s.label}</p>
                  <p className="mt-1 font-semibold text-white">{s.value}</p>
                </div>
              ))}
            </div>
          </SectionReveal>

          {bike.shortDescription ? (
            <SectionReveal>
              <p className="text-lg text-zinc-400">{bike.shortDescription}</p>
            </SectionReveal>
          ) : null}

          <SectionReveal>
            <h2 className="font-display text-2xl font-bold text-white">Description</h2>
            {bike.descriptionHtml ? (
              <RichHtmlContent html={bike.descriptionHtml} className="mt-4 text-zinc-400" />
            ) : (
              <p className="mt-4 leading-relaxed text-zinc-400">
                Rent the {bike.name} in Ranchi — {bike.brand} {bike.cc}cc.
              </p>
            )}
          </SectionReveal>

          {activeFeatures.length > 0 ? (
            <SectionReveal>
              <h2 className="font-display text-2xl font-bold text-white">Features</h2>
              <div className="mt-4 flex flex-wrap gap-2">
                {activeFeatures.map((feature) => (
                  <span
                    key={feature.key}
                    className="rounded-full border border-[#FF6B1A]/30 bg-[#FF6B1A]/10 px-4 py-2 text-sm font-medium text-white"
                  >
                    {feature.label}
                  </span>
                ))}
              </div>
            </SectionReveal>
          ) : null}

          <SectionReveal>
            <h2 className="font-display text-2xl font-bold text-white">Rental terms</h2>
            {bike.rentalTermsHtml ? (
              <RichHtmlContent html={bike.rentalTermsHtml} className="mt-4 text-zinc-400" />
            ) : (
              <ul className="mt-4 space-y-3">
                {[
                  bike.minimumBookingHours
                    ? `Minimum ${bike.minimumBookingHours} hours for hourly rental`
                    : "Minimum 2 hours for hourly rental",
                  `Security deposit ${formatCurrency(bike.securityDepositAmount)} refundable after inspection`,
                  bike.includedKmPerDay ? `${bike.includedKmPerDay} km included per day` : "Standard mileage limits apply",
                ].map((t) => (
                  <li key={t} className="flex gap-3 text-sm text-zinc-400">
                    <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-[#FF6B1A]" />
                    <span>{t}</span>
                  </li>
                ))}
              </ul>
            )}
          </SectionReveal>

          <SectionReveal>
            <h2 className="font-display text-2xl font-bold text-white">FAQ</h2>
            <div className="mt-6">
              <PremiumAccordion items={bikeFaqs} />
            </div>
          </SectionReveal>
        </div>        <div className="lg:sticky lg:top-24 lg:self-start">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={cn(
              "rounded-[24px] bg-[#0A0A0A]/80 shadow-[0_8px_30px_rgba(0,0,0,0.4)] backdrop-blur-md",
              "border border-[#FF6B1A]/30 transition-all duration-300",
              "hover:border-[#FF6B1A] hover:shadow-[0_0_30px_rgba(255,107,26,0.15)]",
              "max-h-[calc(100vh-8rem)] overflow-y-auto overflow-x-hidden"
            )}
          >
            <div className="border-b border-white/10 p-6">
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 fill-[#FF6B1A] text-[#FF6B1A]" />
                <span className="font-bold text-white">{bike.rating}</span>
                <span className="text-zinc-500">·</span>
                <span className="text-sm text-zinc-400">{bike.brand}</span>
              </div>
              <h1 className="font-display mt-2 break-words text-2xl font-bold text-white">{bike.name}</h1>
              {bike.bikeNo ? <p className="mt-1 text-sm text-zinc-500">#{bike.bikeNo}</p> : null}
              <div className="mt-3 flex flex-wrap gap-2">
                <span className="flex items-center gap-1 rounded-lg bg-[#111111] border border-white/10 px-2 py-1 text-xs text-zinc-300">
                  <Gauge className="h-3.5 w-3.5 text-[#FF6B1A]" />
                  {bike.cc}cc
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-[#111111] border border-white/10 px-2 py-1 text-xs text-zinc-300">
                  <Fuel className="h-3.5 w-3.5 text-[#FF6B1A]" />
                  {bike.fuelType}
                </span>
                <span className="flex items-center gap-1 rounded-lg bg-[#111111] border border-white/10 px-2 py-1 text-xs text-zinc-300">
                  <Zap className="h-3.5 w-3.5 text-[#FF6B1A]" />
                  {bike.mileage} kmpl
                </span>
              </div>
            </div>

            <div className="space-y-4 p-6">
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">Pricing</p>
                <p className="text-3xl font-bold text-white">{formatCurrency(bike.pricePerDay)}/day</p>
                <p className="text-sm text-[#FF6B1A]">{formatCurrency(bike.pricePerHour)}/hour</p>
                {pickup && drop ? (
                  <p className="mt-2 text-sm font-semibold text-[#FF6B1A]">
                    {quote.label} · {formatCurrency(quote.total)} estimated total
                  </p>
                ) : null}
              </div>

              {/* Current Availability Section */}
              <div className="rounded-xl border border-white/5 bg-[#111111]/30 p-3">
                <div className="flex items-center gap-2 mb-1">
                  <span className={cn(
                    "w-2 h-2 rounded-full",
                    bike.isAvailableObj?.isAvailable ? "bg-emerald-400" : "bg-rose-400"
                  )}></span>
                  <span className="text-sm font-semibold text-white">
                    {bike.isAvailableObj?.isAvailable ? "Available Now" : "Currently Booked"}
                  </span>
                </div>
                {!bike.isAvailableObj?.isAvailable && (
                  <p className="text-xs text-rose-400/90 ml-4">
                    {bike.isAvailableObj?.availabilityMessage}
                  </p>
                )}
              </div>

              <AvailabilityChecker slug={bike.id} />

              <ul className="space-y-2 text-sm text-zinc-400">
                <li className="flex items-center gap-2">
                  <Shield className="h-4 w-4 text-[#FF6B1A]" />
                  Deposit {formatCurrency(bike.securityDepositAmount)}
                </li>
                {bike.features.helmet_included ? (
                  <li className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-[#FF6B1A]" />
                    Helmet included
                  </li>
                ) : null}
                <li className="flex items-center gap-2">
                  <CheckCircle2 className="h-4 w-4 text-[#FF6B1A]" />
                  Pay first · documents after
                </li>
              </ul>

              <Link href={`/book?${bookQs.toString()}`} className="block">
                <Button className="w-full bg-gradient-to-br from-[#FF6B1A] to-[#FF8A3D] text-white hover:scale-[1.02] shadow-[0_0_20px_rgba(255,107,26,0.3)] transition-all border-0" size="lg">
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
