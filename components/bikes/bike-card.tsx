"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BikeMediaImage } from "@/components/bikes/bike-media-image";
import { motion } from "framer-motion";
import { Fuel, Gauge, Heart, Star, Zap, Check, Mountain } from "lucide-react";
import type { BikeItem } from "@/lib/bikes";
import { quoteForBike } from "@/hooks/use-rental-window";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";

type Props = {
  bike: BikeItem;
  days?: number;
  pickup?: string;
  drop?: string;
  queryString?: string;
  index?: number;
};

export function BikeCard({ bike, days = 1, pickup = "", drop = "", queryString = "", index = 0 }: Props) {
  const quote = useMemo(
    () => quoteForBike(bike.pricePerDay, bike.pricePerHour, pickup, drop, days),
    [bike.pricePerDay, bike.pricePerHour, pickup, drop, days],
  );

  const detailQs = queryString ? `?${queryString}` : days > 1 ? `?days=${days}` : "";
  const detailHref = `/bikes/${bike.id}${detailQs}`;
  const hasWindow = Boolean(pickup && drop && quote.total > 0);

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-[#FF6B1A]/25 bg-[#050505] pt-4 pb-5 px-5 shadow-[0_0_30px_rgba(255,107,26,0.15),0_0_60px_rgba(255,107,26,0.08)] transition-all duration-500 hover:border-[#FF6B1A] hover:shadow-[0_0_40px_rgba(255,107,26,0.25),0_0_80px_rgba(255,107,26,0.15)] hover:-translate-y-[10px] cursor-pointer"
    >
      <Link href={detailHref} className="relative flex h-[160px] md:h-[185px] w-full items-center justify-center overflow-visible mt-2 mb-2">
        {/* Spotlight */}
        <div
          className="absolute inset-0 pointer-events-none rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-500 scale-[1.3] md:scale-[1.5]"
          style={{
            background: 'radial-gradient(circle, rgba(255,107,26,0.5) 0%, rgba(255,107,26,0.15) 40%, transparent 70%)'
          }}
        />

        {/* Floor reflection / glow */}
        <div className="absolute -bottom-4 w-3/4 h-12 rounded-[100%] opacity-80 group-hover:opacity-100 transition-opacity duration-500 blur-[15px]"
          style={{
            background: 'radial-gradient(ellipse at center, rgba(255,107,26,0.6) 0%, rgba(255,107,26,0.2) 50%, transparent 80%)'
          }}
        />

        {/* Hard Road Shadow */}
        <div className="absolute -bottom-1 w-[70%] h-3 bg-white/60 rounded-[50%] blur-[2.5px] opacity-90 transition-transform duration-500 scale-[1.20] md:scale-[1.25] group-hover:scale-[1.25] md:group-hover:scale-[1.30] z-0" />

        <BikeMediaImage
          src={bike.image}
          alt={bike.name}
          fill
          className="object-contain scale-[1.20] md:scale-[1.25] transition-transform duration-500 group-hover:scale-[1.25] md:group-hover:scale-[1.30] z-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
        />

        <span className="absolute left-1 top-1 rounded-full bg-[#050505]/90 border border-[#FF6B1A] px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur-md z-20 shadow-[0_0_15px_rgba(255,107,26,0.2)] flex items-center gap-1">
          <Mountain className="w-3.5 h-3.5 text-[#FF6B1A]" />
          {bike.category}
        </span>
        {/* 
        <button
          type="button"
          className="absolute right-1 top-1 rounded-full bg-[#050505]/90 border border-[#FF6B1A] backdrop-blur-md p-2 text-[#FF6B1A] transition-all hover:bg-[#FF6B1A] hover:text-white hover:shadow-[0_0_20px_rgba(255,107,26,0.4)] z-20"
          aria-label="Save bike"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4" />
        </button> */}
      </Link>

      <div className="mt-4 flex flex-col z-10 relative">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="text-[20px] font-bold tracking-tight text-white capitalize drop-shadow-md leading-tight">
              {bike.name}
            </h3>
            <p className="text-[13px] text-zinc-400 font-medium mt-0.5">{bike.brand}</p>
          </div>

          <div className="shrink-0 flex items-center justify-center rounded-full bg-[#111111] border border-[#FF6B1A]/30 w-6 h-6 mt-0.5 shadow-[0_0_10px_rgba(255,107,26,0.2)]">
            <Check className="h-3.5 w-3.5 text-[#FF6B1A] stroke-[3]" />
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mt-4">
          <span className="flex items-center gap-1.5 rounded-[10px] bg-[#111111]/80 border border-white/10 px-2.5 py-1 text-[12px] font-medium text-zinc-300 hover:border-[#FF6B1A]/40 hover:bg-[#FF6B1A]/10 transition-colors">
            <Star className="h-3.5 w-3.5 fill-[#FF6B1A] text-[#FF6B1A]" />
            {bike.rating}
          </span>
          {/* <span className="flex items-center gap-1.5 rounded-[10px] bg-[#111111]/80 border border-white/10 px-2.5 py-1 text-[12px] font-medium text-zinc-300 hover:border-[#FF6B1A]/40 hover:bg-[#FF6B1A]/10 transition-colors">
            <Gauge className="h-3.5 w-3.5 text-[#FF6B1A]" />
            {bike.cc}cc
          </span> */}
          <span className="flex items-center gap-1.5 rounded-[10px] bg-[#111111]/80 border border-white/10 px-2.5 py-1 text-[12px] font-medium text-zinc-300 hover:border-[#FF6B1A]/40 hover:bg-[#FF6B1A]/10 transition-colors">
            <Fuel className="h-3.5 w-3.5 text-[#FF6B1A]" />
            {bike.fuelType}
          </span>
          <span className="flex items-center gap-1.5 rounded-[10px] bg-[#111111]/80 border border-white/10 px-2.5 py-1 text-[12px] font-medium text-zinc-300 hover:border-[#FF6B1A]/40 hover:bg-[#FF6B1A]/10 transition-colors">
            <Zap className="h-3.5 w-3.5 text-[#FF6B1A]" />
            {bike.mileage} kmpl
          </span>
        </div>

        <div className="h-px w-full bg-white/[0.08] my-4" />

        <div className="flex items-end justify-between">
          <div>
            <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-500 mb-0.5">
              {quote.isHourly ? "RENT / HOUR" : "RENT / DAY"}
            </p>
            <p className="text-[26px] leading-none font-extrabold text-[#FF6B1A]">
              {formatCurrency(quote.isHourly ? bike.pricePerHour : bike.pricePerDay)}
            </p>
            {hasWindow ? (
              <p className="mt-1.5 text-xs font-semibold text-[#FF6B1A]/80">
                {quote.label} · {formatCurrency(quote.total)} total
              </p>
            ) : days > 1 ? (
              <p className="mt-1.5 text-xs font-semibold text-[#FF8A3D]/80">
                {days} days · {formatCurrency(bike.pricePerDay * days)} total
              </p>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Link href={detailHref}>
              <Button variant="outline" className="h-10 rounded-[10px] px-4 text-[13px] font-semibold bg-[#0A0A0A] border-[#FF6B1A]/40 text-white hover:bg-[#111111] hover:border-[#FF6B1A] hover:text-[#FF6B1A] transition-all duration-300">
                Details
              </Button>
            </Link>
            <Link
              href={`/book?bike=${bike.id}${queryString ? `&${queryString}` : days > 1 ? `&days=${days}` : ""}`}
            >
              <Button className="h-10 rounded-[10px] px-5 text-[13px] font-semibold bg-gradient-to-br from-[#FF6B1A] to-[#FF8A3D] text-white border-0 shadow-[0_0_20px_rgba(255,107,26,0.4)] group-hover:shadow-[0_0_30px_rgba(255,107,26,0.6)] transition-all duration-300 hover:scale-[1.03]">
                Rent
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
