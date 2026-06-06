"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BikeMediaImage } from "@/components/bikes/bike-media-image";
import { motion } from "framer-motion";
import { Fuel, Gauge, Heart, Star, Zap, Check, ArrowRight } from "lucide-react";
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
      whileHover={{ y: -6 }}
      viewport={{ once: true }}
      transition={{ delay: index * 0.06, duration: 0.5 }}
      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-zinc-100 bg-white pt-4 pb-5 px-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-[#FF653F] hover:shadow-[0_15px_35px_rgba(255,101,63,0.1)] cursor-pointer"
    >
      <Link href={detailHref} className="relative block aspect-[4/3] overflow-hidden rounded-2xl">
        <BikeMediaImage
          src={bike.image}
          alt={bike.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-105"
        />
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full glass p-2.5 text-zinc-700 transition hover:scale-110 hover:text-violet-600 z-10"
          aria-label="Save bike"
          onClick={(e) => {
            e.preventDefault();
            e.stopPropagation();
          }}
        >
          <Heart className="h-4 w-4" />
        </button>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur z-10">
          {bike.category}
        </span>
        {bike.color ? (
          <span className="absolute left-3 top-12 rounded-full bg-zinc-900/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur z-10">
            {bike.color}
          </span>
        ) : null}
      </Link>

      <div className="mt-4 flex flex-col">
        {/* Row 1: Title & Selector Badge */}
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-display text-xl font-bold tracking-tight text-zinc-950 capitalize group-hover:text-[#FF653F] transition-colors duration-200">
              {bike.name}
            </h3>
            <p className="text-xs text-zinc-500 font-medium mt-0.5">{bike.brand}</p>
          </div>

          {/* Selector Badge */}
          <div className="relative h-6 w-6 shrink-0 mt-1">
            {/* Checkmark badge */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#FF653F]/12 text-[#FF653F] transition-all duration-300 group-hover:opacity-0 group-hover:scale-50">
              <Check className="h-3.5 w-3.5 stroke-[3.5]" />
            </div>

            {/* Arrow right */}
            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#FF653F] text-white shadow-sm opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
              <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
            </div>
          </div>
        </div>

        {/* Row 2: Specifications list including rating */}
        <div className="flex flex-wrap gap-2 text-xs text-zinc-500 mt-4">
          <span className="flex items-center gap-1 rounded-lg bg-zinc-50 px-2 py-1">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {bike.rating}
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-zinc-50 px-2 py-1">
            <Gauge className="h-3.5 w-3.5 text-blue-500" />
            {bike.cc}cc
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-zinc-50 px-2 py-1">
            <Fuel className="h-3.5 w-3.5 text-violet-500" />
            {bike.fuelType}
          </span>
          <span className="flex items-center gap-1 rounded-lg bg-zinc-50 px-2 py-1">
            <Zap className="h-3.5 w-3.5 text-cyan-500" />
            {bike.mileage} kmpl
          </span>
        </div>

        {/* Row 3: Pricing & Action Buttons */}
        <div className="flex items-end justify-between border-t border-zinc-100 pt-4 mt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              {quote.isHourly ? "Rent / hour" : "Rent / day"}
            </p>
            <p className="text-2xl font-bold text-zinc-900 transition-colors duration-200 group-hover:text-[#FF653F]">
              {formatCurrency(quote.isHourly ? bike.pricePerHour : bike.pricePerDay)}
            </p>
            {hasWindow ? (
              <p className="mt-0.5 text-xs font-semibold text-[#FF653F]">
                {quote.label} · {formatCurrency(quote.total)} total
              </p>
            ) : days > 1 ? (
              <p className="mt-0.5 text-xs font-semibold text-blue-600">
                {days} days · {formatCurrency(bike.pricePerDay * days)} total
              </p>
            ) : null}
          </div>
          <div className="flex gap-1.5">
            <Link href={detailHref}>
              <Button variant="outline" size="sm" className="h-8 text-xs">
                Details
              </Button>
            </Link>
            <Link
              href={`/book?bike=${bike.id}${queryString ? `&${queryString}` : days > 1 ? `&days=${days}` : ""}`}
            >
              <Button size="sm" className="h-8 text-xs bg-[#FF653F] hover:bg-[#e05432] text-white border-0">Rent</Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
