"use client";

import { useMemo } from "react";
import { useSearchParams } from "next/navigation";
import { calcRentalDuration, calcRentalQuote, calcRentalDays, type RentalQuote } from "@/lib/pricing";
import {
  combineDateAndTime,
  defaultPickupTime,
  minDropDateTime,
  todayDateString,
} from "@/lib/rental-datetime";

export function useRentalWindow() {
  const params = useSearchParams();
  const pickup = params.get("pickup") || "";
  const drop = params.get("drop") || "";

  const duration = useMemo(() => calcRentalDuration(pickup, drop), [pickup, drop]);
  const days = useMemo(() => {
    const d = params.get("days");
    if (d) return Number(d) || 1;
    return calcRentalDays(pickup, drop);
  }, [params, pickup, drop]);

  return { pickup, drop, duration, days };
}

export function useDefaultPickupDrop() {
  const today = todayDateString();
  const pickup = combineDateAndTime(today, defaultPickupTime());
  const drop = minDropDateTime(pickup) || combineDateAndTime(today, "18:00");
  return { pickup, drop };
}

export function quoteForBike(
  pricePerDay: number,
  pricePerHour: number,
  pickup: string,
  drop: string,
  fallbackDays = 1,
): RentalQuote {
  if (pickup && drop) {
    const quote = calcRentalQuote(pricePerDay, pricePerHour, pickup, drop);
    if (quote) return quote;
  }
  return {
    total: pricePerDay * fallbackDays,
    hours: 0,
    days: fallbackDays,
    label: `${fallbackDays} day${fallbackDays > 1 ? "s" : ""}`,
    isHourly: false,
    pricePerDay,
    pricePerHour,
  };
}
