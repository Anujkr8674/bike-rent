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
    if (!minDateTime || !date) return false;
    const { date: minD, time: minT } = splitDateTime(minDateTime);
    if (date > minD) return false;
    if (date < minD) return true;
    return slot < minT;
  };

  return (
    <div ref={rootRef} className={cn("relative", className)}>
      <p className="mb-1.5 text-[11px] font-semibold uppercase tracking-wider text-zinc-500">{label}</p>
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        className={cn(
          "flex w-full items-center gap-3 rounded-xl border border-zinc-200/90 bg-white text-left shadow-sm transition",
          "focus-visible:border-[#FF653F]/70 focus-visible:outline-none focus-visible:ring-4 focus-visible:ring-[#FF653F]/12",
          compact ? "min-h-[48px] px-3 py-2" : "min-h-[52px] px-4 py-2.5",
          open && "border-[#FF653F]/70 ring-4 ring-[#FF653F]/12",
        )}
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <Calendar className="h-[18px] w-[18px] shrink-0 text-[#FF653F]" aria-hidden />
        <span className={cn("min-w-0 flex-1 truncate text-sm", value ? "font-medium text-zinc-900" : "text-zinc-400")}>
          {display}
        </span>
        <ChevronDown className={cn("h-4 w-4 shrink-0 text-zinc-400 transition", open && "rotate-180")} />
      </button>

      {open ? (
        <div
          className="absolute left-0 right-0 z-50 mt-2 overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl"
          role="dialog"
          aria-label={`${label} date and time`}
        >
          <div className="border-b border-zinc-100 p-3">
            <input
              type="date"
              className="w-full rounded-lg border border-zinc-200 px-3 py-2 text-sm outline-none focus:border-[#FF653F]/50 focus:ring-2 focus:ring-[#FF653F]/10"
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
                    "flex w-full border-b border-zinc-100 px-4 py-2.5 text-left text-sm transition last:border-b-0",
                    selected && "bg-amber-100 font-semibold text-zinc-900",
                    !selected && !disabled && "hover:bg-zinc-50",
                    disabled && "cursor-not-allowed text-zinc-300",
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
