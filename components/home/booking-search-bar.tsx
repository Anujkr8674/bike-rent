"use client";

import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Bike, MapPin, Search, type LucideIcon } from "lucide-react";
import { DateTimePickerField } from "@/components/booking/datetime-picker-field";
import { CategoryFilter } from "@/components/booking/category-filter";
import { useDefaultPickupDrop } from "@/hooks/use-rental-window";
import { buildRentalSearchParams, calcRentalDuration } from "@/lib/pricing";
import { isDropBeforePickup, minDropDateTime, todayDateString } from "@/lib/rental-datetime";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

type BookingSearchBarProps = {
  className?: string;
  dense?: boolean;
  variant?: "default" | "hero";
  /** When true, syncs pickup/drop/category from URL (bikes page sidebar) */
  syncFromUrl?: boolean;
  onPickupChange?: (value: string) => void;
  onDropChange?: (value: string) => void;
  onCategoryChange?: (value: string) => void;
};

function HeroField({
  icon: Icon,
  children,
  className,
}: {
  icon?: LucideIcon;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex min-h-[52px] items-center gap-4 rounded-xl border border-zinc-200/90 bg-white px-4 py-2.5 shadow-sm",
        "transition focus-within:border-[#FF653F]/70 focus-within:ring-4 focus-within:ring-[#FF653F]/12",
        className,
      )}
    >
      {Icon ? <Icon className="h-[18px] w-[18px] shrink-0 text-[#FF653F]" aria-hidden /> : null}
      <div className="min-w-0 flex-1">{children}</div>
    </div>
  );
}

export function BookingSearchBar({
  className,
  dense = false,
  variant = "default",
  syncFromUrl = false,
  onPickupChange,
  onDropChange,
  onCategoryChange,
}: BookingSearchBarProps) {
  const params = useSearchParams();
  const defaults = useDefaultPickupDrop();
  const [pickup, setPickup] = useState(defaults.pickup);
  const [drop, setDrop] = useState(defaults.drop);
  const [category, setCategory] = useState("all");

  useEffect(() => {
    if (!syncFromUrl) return;
    const urlPickup = params.get("pickup");
    const urlDrop = params.get("drop");
    const urlCategory = params.get("category");
    if (urlPickup) setPickup(urlPickup);
    if (urlDrop) setDrop(urlDrop);
    if (urlCategory) setCategory(urlCategory);
  }, [syncFromUrl, params]);

  const setPickupValue = (value: string) => {
    setPickup(value);
    onPickupChange?.(value);
    if (drop && isDropBeforePickup(value, drop)) {
      const fixed = minDropDateTime(value);
      setDrop(fixed);
      onDropChange?.(fixed);
    }
  };

  const setDropValue = (value: string) => {
    setDrop(value);
    onDropChange?.(value);
  };

  const setCategoryValue = (value: string) => {
    setCategory(value);
    onCategoryChange?.(value);
  };

  const duration = useMemo(() => calcRentalDuration(pickup, drop), [pickup, drop]);
  const isHero = variant === "hero";
  const minDrop = pickup ? minDropDateTime(pickup) : undefined;

  const qs = buildRentalSearchParams({ pickup, drop, category });
  const searchHref = `/bikes?${qs.toString()}`;

  const summaryText = duration ? (
    <>
      <span className="font-bold text-[#FF653F]">{duration.label}</span> rental · prices update on bike cards
    </>
  ) : (
    "Select pickup & drop-off to see dynamic rent totals"
  );

  if (isHero) {
    return (
      <div
        className={cn(
          "rounded-2xl border border-[#FF653F]/25 bg-white/95 p-4 shadow-2xl shadow-black/20 backdrop-blur-md sm:p-5 md:p-6",
          className,
        )}
      >
        <div className="grid grid-cols-1 gap-3.5 sm:grid-cols-2 md:grid-cols-4 md:gap-4">
          <DateTimePickerField label="Pickup" value={pickup} onChange={setPickupValue} minDate={todayDateString()} />
          <DateTimePickerField
            label="Drop off"
            value={drop}
            onChange={setDropValue}
            minDate={pickup ? pickup.split("T")[0] : todayDateString()}
            minDateTime={minDrop}
          />
          <HeroField icon={Bike}>
            <CategoryFilter value={category} onChange={setCategoryValue} variant="select" />
          </HeroField>
          <HeroField icon={MapPin}>
            <input readOnly value="Ranchi, Jharkhand" className="w-full border-0 bg-transparent p-0 text-sm outline-none" aria-label="Location" />
          </HeroField>
        </div>
        <div className="mt-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <p className="text-xs font-medium text-zinc-600 sm:text-sm">{summaryText}</p>
          {!syncFromUrl ? (
            <Link href={searchHref} className="w-full sm:w-auto sm:shrink-0">
              <Button className="w-full sm:w-auto">
                <Search className="h-4 w-4" />
                Search Bikes
              </Button>
            </Link>
          ) : null}
        </div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "glass-strong gradient-border rounded-2xl shadow-2xl shadow-[#FF653F]/10",
        dense ? "p-3 sm:p-4" : "p-4 sm:p-5 md:p-6",
        className,
      )}
    >
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 md:grid-cols-4 md:gap-3">
        <DateTimePickerField label="Pickup" value={pickup} onChange={setPickupValue} minDate={todayDateString()} compact={dense} />
        <DateTimePickerField
          label="Drop off"
          value={drop}
          onChange={setDropValue}
          minDate={pickup ? pickup.split("T")[0] : todayDateString()}
          minDateTime={minDrop}
          compact={dense}
        />
        <div className="relative sm:col-span-2 md:col-span-1">
          <div className="input-field flex min-h-[48px] items-center py-2 pl-4 pr-4">
            <CategoryFilter value={category} onChange={setCategoryValue} variant="select" />
          </div>
        </div>
        <div className="relative sm:col-span-2 md:col-span-1">
          <MapPin className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-[#FF653F]" aria-hidden />
          <input readOnly value="Ranchi, Jharkhand" className="input-field w-full py-3 pl-10 pr-4 text-sm" aria-label="Location" />
        </div>
      </div>
      <div className="mt-3 flex flex-col gap-2.5 sm:flex-row sm:items-center sm:justify-between">
        <p className="text-xs font-medium text-zinc-600 sm:text-sm">{summaryText}</p>
        {!syncFromUrl ? (
          <Link href={searchHref} className="w-full sm:w-auto sm:shrink-0">
            <Button className="w-full sm:w-auto">
              <Search className="h-4 w-4" />
              Search Bikes
            </Button>
          </Link>
        ) : null}
      </div>
    </div>
  );
}
