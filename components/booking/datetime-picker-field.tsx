"use client";

import { useEffect, useId, useRef, useState } from "react";
import { Calendar, ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";
import {
  TIME_SLOTS,
  combineDateAndTime,
  formatDateTimeIndian,
  formatTimeIndian,
  splitDateTime,
  todayDateString,
  defaultPickupTime,
} from "@/lib/rental-datetime";

type DateTimePickerFieldProps = {
  label: string;
  value: string;
  onChange: (value: string) => void;
  minDate?: string;
  minDateTime?: string;
  className?: string;
  compact?: boolean;
};

export function DateTimePickerField({
  label,
  value,
  onChange,
  minDate,
  minDateTime,
  className,
  compact = false,
}: DateTimePickerFieldProps) {
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const [open, setOpen] = useState(false);
  const { date, time } = splitDateTime(value);
  const display = value ? formatDateTimeIndian(value) : "Select date & time";

  useEffect(() => {
    const onDoc = (event: MouseEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  useEffect(() => {
    if (!open || !time || !listRef.current) return;
    const el = listRef.current.querySelector(`[data-time="${time}"]`);
    el?.scrollIntoView({ block: "center" });
  }, [open, time]);

  const effectiveMinDate = minDate || todayDateString();
  const effectiveMinDateTime = minDateTime || combineDateAndTime(todayDateString(), defaultPickupTime());

  const pickDate = (nextDate: string) => {
    if (!nextDate) return;
    const nextTime = time || "09:00";
    onChange(combineDateAndTime(nextDate, nextTime));
  };

  const pickTime = (nextTime: string) => {
    const nextDate = date || effectiveMinDate;
    onChange(combineDateAndTime(nextDate, nextTime));
  };

  const isTimeDisabled = (slot: string) => {
    if (!date) return false;
    const { date: minD, time: minT } = splitDateTime(effectiveMinDateTime);
    if (date > minD) return false;
    if (date < minD) return true;
    return slot < minT;
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-[#FF6B1A]/50 bg-transparent text-left shadow-[0_0_15px_rgba(255,107,26,0.05)] transition",
          "focus-visible:border-[#FF6B1A] focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF6B1A]/12",
          compact ? "min-h-[48px] px-3 py-2" : "min-h-[52px] px-4 py-2.5",
          open && "border-[#FF6B1A] ring-4 ring-[#FF6B1A]/12",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Calendar className="h-[18px] w-[18px] shrink-0 text-[#FF6B1A]" aria-hidden />
        <span suppressHydrationWarning className={cn("min-w-0 flex-1 truncate text-sm", value ? "font-medium text-white" : "text-zinc-500")}>
          {display}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-zinc-500 transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-[0_8px_30px_rgba(0,0,0,0.6)]"
          role="dialog"
          aria-label={`${label} date and time`}
        >
          <div className="border-b border-white/10 p-3 bg-[#0A0A0A]">
            <input
              type="date"
              className="w-full rounded-lg border border-white/10 bg-[#111111] text-white px-3 py-2 text-sm outline-none focus:border-[#FF6B1A]/50 focus:ring-2 focus:ring-[#FF6B1A]/10"
              value={date}
              min={effectiveMinDate}
              onChange={(e) => pickDate(e.target.value)}
            />
          </div>
          <div
            ref={listRef}
            id={listId}
            className="max-h-52 overflow-y-auto"
            role="listbox"
            aria-label="Time"
          >
            {TIME_SLOTS.map((slot) => {
              const disabled = isTimeDisabled(slot);
              const selected = time === slot;
              return (
                <button
                  key={slot}
                  type="button"
                  data-time={slot}
                  disabled={disabled}
                  role="option"
                  aria-selected={selected}
                  onClick={() => {
                    pickTime(slot);
                    setOpen(false);
                  }}
                  className={cn(
                    "flex w-full border-b border-white/5 px-4 py-2.5 text-left text-sm transition last:border-b-0",
                    selected && "bg-[#FF6B1A]/20 font-semibold text-[#FF6B1A]",
                    !selected && !disabled && "hover:bg-white/5 text-zinc-300",
                    disabled && "cursor-not-allowed text-zinc-600",
                  )}
                >
                  {formatTimeIndian(slot)}
                </button>
              );
            })}
          </div>
        </div>
      ) : null}
    </div>
  );
}
