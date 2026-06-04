"use client";

import { motion, AnimatePresence } from "framer-motion";
import { SlidersHorizontal, X } from "lucide-react";
import { DateTimePickerField } from "@/components/booking/datetime-picker-field";
import { CategoryFilter } from "@/components/booking/category-filter";
import { todayDateString, minDropDateTime, isDropBeforePickup } from "@/lib/rental-datetime";
import { cn } from "@/lib/utils";

export type FilterState = {
  category: string;
  fuelType: string;
  transmission: string;
  maxPrice: number;
  minCc: number;
  availableOnly: boolean;
};

export const defaultFilters: FilterState = {
  category: "all",
  fuelType: "all",
  transmission: "all",
  maxPrice: 15000,
  minCc: 0,
  availableOnly: true,
};

type Props = {
  filters: FilterState;
  onChange: (f: FilterState) => void;
  mobileOpen: boolean;
  onMobileClose: () => void;
  pickup: string;
  drop: string;
  onPickupChange: (value: string) => void;
  onDropChange: (value: string) => void;
};

export function BikeFilters({
  filters,
  onChange,
  mobileOpen,
  onMobileClose,
  pickup,
  drop,
  onPickupChange,
  onDropChange,
}: Props) {
  const handlePickup = (value: string) => {
    onPickupChange(value);
    if (drop && isDropBeforePickup(value, drop)) {
      onDropChange(minDropDateTime(value));
    }
  };

  const minDrop = pickup ? minDropDateTime(pickup) : undefined;

  const panel = (
    <div className="space-y-6">
      <div className="space-y-3 rounded-xl border border-[#FF653F]/15 bg-[#FF653F]/5 p-3">
        <p className="text-xs font-semibold uppercase tracking-wider text-[#FF653F]">Rental period</p>
        <DateTimePickerField
          label="Pickup"
          value={pickup}
          onChange={handlePickup}
          minDate={todayDateString()}
          compact
        />
        <DateTimePickerField
          label="Drop off"
          value={drop}
          onChange={onDropChange}
          minDate={pickup ? pickup.split("T")[0] : todayDateString()}
          minDateTime={minDrop}
          compact
        />
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Category</p>
        <CategoryFilter
          value={filters.category}
          onChange={(category) => onChange({ ...filters, category })}
        />
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Max price / day</p>
        <input
          type="range"
          min={300}
          max={15000}
          step={50}
          value={filters.maxPrice}
          onChange={(e) => onChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-blue-600"
        />
        <p className="mt-1 text-sm font-semibold text-zinc-700">Up to ₹{filters.maxPrice}</p>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Min CC</p>
        <input
          type="range"
          min={0}
          max={350}
          step={10}
          value={filters.minCc}
          onChange={(e) => onChange({ ...filters, minCc: Number(e.target.value) })}
          className="w-full accent-indigo-600"
        />
        <p className="mt-1 text-sm font-semibold text-zinc-700">{filters.minCc}+ cc</p>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Fuel type</p>
        <select
          className="input-field"
          value={filters.fuelType}
          onChange={(e) => onChange({ ...filters, fuelType: e.target.value })}
        >
          <option value="all">All</option>
          <option value="Petrol">Petrol</option>
          <option value="Electric">Electric</option>
        </select>
      </div>

      <div>
        <p className="mb-3 text-xs font-semibold uppercase tracking-wider text-zinc-400">Transmission</p>
        <select
          className="input-field"
          value={filters.transmission}
          onChange={(e) => onChange({ ...filters, transmission: e.target.value })}
        >
          <option value="all">All</option>
          <option value="Manual">Manual</option>
          <option value="Automatic">Automatic</option>
        </select>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-xl border border-zinc-200 bg-zinc-50/50 px-4 py-3">
        <input
          type="checkbox"
          checked={filters.availableOnly}
          onChange={(e) => onChange({ ...filters, availableOnly: e.target.checked })}
          className="h-4 w-4 rounded accent-blue-600"
        />
        <span className="text-sm font-medium text-zinc-700">Available only</span>
      </label>
    </div>
  );

  return (
    <>
      <aside className="sticky top-[5.25rem] z-20 hidden max-h-[calc(100dvh-5.25rem)] w-72 shrink-0 self-start overflow-y-auto lg:block">
        <div className="glass-strong gradient-border rounded-2xl p-6">
          <div className="mb-6 flex items-center gap-2">
            <SlidersHorizontal className="h-5 w-5 text-[#FF653F]" />
            <h2 className="font-semibold text-zinc-900">Filters</h2>
          </div>
          {panel}
        </div>
      </aside>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-50 bg-zinc-900/40 backdrop-blur-sm lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 300 }}
              className="fixed right-0 top-0 z-50 flex h-full w-[min(100%,320px)] flex-col bg-white shadow-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 p-4">
                <span className="font-semibold text-zinc-900">Filters</span>
                <button type="button" onClick={onMobileClose} className="rounded-lg p-2 hover:bg-zinc-100">
                  <X className="h-5 w-5" />
                </button>
              </div>
              <div className="flex-1 overflow-y-auto p-4">{panel}</div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
