"use client";

import Link from "next/link";
import { useMemo } from "react";
import { BikeMediaImage } from "@/components/bikes/bike-media-image";
import { motion } from "framer-motion";
import { Fuel, Gauge, Heart, Star, Zap } from "lucide-react";
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
      className="card-lift group overflow-hidden rounded-2xl border border-zinc-200/80 bg-white"
    >
      <Link href={detailHref} className="relative block aspect-[4/3] overflow-hidden">
        <BikeMediaImage
          src={bike.image}
          alt={bike.name}
          fill
          className="object-cover transition duration-700 group-hover:scale-110"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/70 via-zinc-900/10 to-transparent" />
        <button
          type="button"
          className="absolute right-3 top-3 rounded-full glass p-2.5 text-zinc-700 transition hover:scale-110 hover:text-violet-600"
          aria-label="Save bike"
        >
          <Heart className="h-4 w-4" />
        </button>
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-zinc-800 backdrop-blur">
          {bike.category}
        </span>
        {bike.color ? (
          <span className="absolute left-3 top-12 rounded-full bg-zinc-900/80 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur">
            {bike.color}
          </span>
        ) : null}
        <div className="absolute bottom-3 left-3 right-3 flex items-end justify-between">
          <div>
            <p className="text-lg font-bold text-white">{bike.name}</p>
            <p className="text-xs text-zinc-300">{bike.brand}</p>
          </div>
          <div className="flex items-center gap-1 rounded-full bg-white/90 px-2 py-1 text-xs font-semibold text-zinc-900">
            <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />
            {bike.rating}
          </div>
        </div>
      </Link>

      <div className="space-y-4 p-5">
        <div className="flex flex-wrap gap-2 text-xs text-zinc-500">
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

        <div className="flex items-end justify-between border-t border-zinc-100 pt-4">
          <div>
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">
              {quote.isHourly ? "Rent / hour" : "Rent / day"}
            </p>
            <p className="text-2xl font-bold text-zinc-900">
              {formatCurrency(quote.isHourly ? bike.pricePerHour : bike.pricePerDay)}
            </p>
            {hasWindow ? (
              <p className="mt-0.5 text-sm font-semibold text-[#FF653F]">
                {quote.label} · {formatCurrency(quote.total)} total
              </p>
            ) : days > 1 ? (
              <p className="mt-0.5 text-sm font-semibold text-blue-600">
                {days} days · {formatCurrency(bike.pricePerDay * days)} total
              </p>
            ) : null}
          </div>
          <div className="flex gap-2">
            <Link href={detailHref}>
              <Button variant="outline" size="sm">
                Details
              </Button>
            </Link>
            <Link
              href={`/book?bike=${bike.id}${queryString ? `&${queryString}` : days > 1 ? `&days=${days}` : ""}`}
            >
              <Button size="sm">Rent</Button>
            </Link>
          </div>
        </div>
      </div>
    </motion.article>
  );
}
