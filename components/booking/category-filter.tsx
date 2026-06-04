"use client";

import { useEffect, useRef, useState } from "react";
import { MoreHorizontal } from "lucide-react";
import { cn } from "@/lib/utils";

export type BikeCategoryOption = {
  id: string;
  name: string;
  slug: string;
};

const VISIBLE_COUNT = 5;

type CategoryFilterProps = {
  value: string;
  onChange: (value: string) => void;
  variant?: "chips" | "select";
  className?: string;
};

export function useBikeCategories() {
  const [categories, setCategories] = useState<BikeCategoryOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    fetch("/api/bike-categories", { cache: "no-store" })
      .then((res) => res.json())
      .then((data: { categories?: BikeCategoryOption[] }) => {
        if (!active) return;
        if (Array.isArray(data.categories) && data.categories.length) {
          setCategories(data.categories);
        }
      })
      .catch(() => undefined)
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { categories, loading };
}

export function CategoryFilter({ value, onChange, variant = "chips", className }: CategoryFilterProps) {
  const { categories } = useBikeCategories();
  const [moreOpen, setMoreOpen] = useState(false);
  const moreRef = useRef<HTMLDivElement>(null);

  const names = categories.map((c) => c.name);
  const visible = ["all", ...names.slice(0, VISIBLE_COUNT - 1)];
  const overflow = names.slice(VISIBLE_COUNT - 1);
  const hiddenSelected = overflow.includes(value);

  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (!moreRef.current?.contains(e.target as Node)) setMoreOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  if (variant === "select") {
    return (
      <select
        className={cn("w-full cursor-pointer border-0 bg-transparent p-0 text-sm outline-none", className)}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Bike category"
      >
        <option value="all">All categories</option>
        {names.map((name) => (
          <option key={name} value={name}>
            {name}
          </option>
        ))}
      </select>
    );
  }

  return (
    <div className={cn("flex flex-wrap gap-2", className)}>
      {visible.map((c) => (
        <button
          key={c}
          type="button"
          onClick={() => onChange(c)}
          className={cn("chip", value === c && "chip-active")}
        >
          {c === "all" ? "All" : c}
        </button>
      ))}
      {overflow.length > 0 ? (
        <div ref={moreRef} className="relative">
          <button
            type="button"
            onClick={() => setMoreOpen((v) => !v)}
            className={cn(
              "chip inline-flex items-center gap-1",
              hiddenSelected && "chip-active",
            )}
            aria-label="More categories"
          >
            <MoreHorizontal className="h-4 w-4" />
          </button>
          {moreOpen ? (
            <div className="absolute left-0 top-full z-30 mt-1 min-w-[140px] rounded-xl border border-zinc-200 bg-white p-1 shadow-lg">
              {overflow.map((name) => (
                <button
                  key={name}
                  type="button"
                  onClick={() => {
                    onChange(name);
                    setMoreOpen(false);
                  }}
                  className={cn(
                    "block w-full rounded-lg px-3 py-2 text-left text-sm font-medium text-zinc-700 hover:bg-zinc-50",
                    value === name && "bg-[#FF653F]/10 text-[#FF653F]",
                  )}
                >
                  {name}
                </button>
              ))}
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}
