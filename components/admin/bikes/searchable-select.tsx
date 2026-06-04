"use client";

import { useMemo, useState } from "react";
import { ChevronDown, Search } from "lucide-react";
import { cn } from "@/lib/utils";

type Option = { value: string; label: string };

type SearchableSelectProps = {
  label: string;
  required?: boolean;
  value: string;
  options: Option[];
  placeholder?: string;
  error?: string;
  onChange: (value: string) => void;
};

export function SearchableSelect({
  label,
  required,
  value,
  options,
  placeholder = "Search and select...",
  error,
  onChange,
}: SearchableSelectProps) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return options;
    return options.filter((option) => option.label.toLowerCase().includes(q));
  }, [options, query]);

  const selectedLabel = options.find((option) => option.value === value)?.label ?? value;

  return (
    <div className="relative">
      <div className="mb-1 flex items-center gap-2">
        <p className="text-sm font-semibold text-zinc-900">{label}</p>
        {required ? (
          <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF653F]">Required</span>
        ) : null}
      </div>

      <button
        type="button"
        onClick={() => setOpen((current) => !current)}
        className={cn(
          "flex w-full items-center justify-between rounded-xl border bg-white px-4 py-3 text-left text-sm outline-none transition",
          error ? "border-rose-300" : "border-zinc-200 hover:border-[#FF653F]/40",
        )}
      >
        <span className={value ? "text-zinc-900" : "text-zinc-400"}>{value ? selectedLabel : placeholder}</span>
        <ChevronDown className={cn("h-4 w-4 text-zinc-400 transition", open && "rotate-180")} />
      </button>

      {error ? <p className="mt-1 text-xs text-rose-600">{error}</p> : null}

      {open ? (
        <>
          <button type="button" className="fixed inset-0 z-40" aria-label="Close dropdown" onClick={() => setOpen(false)} />
          <div className="absolute z-50 mt-2 w-full overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-xl">
            <div className="relative border-b border-zinc-100 p-2">
              <Search className="pointer-events-none absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={query}
                onChange={(event) => setQuery(event.target.value)}
                placeholder={`Search ${label.toLowerCase()}...`}
                className="w-full rounded-lg border border-zinc-200 py-2.5 pl-10 pr-3 text-sm outline-none focus:border-[#FF653F]/50"
                autoFocus
              />
            </div>
            <ul className="max-h-52 overflow-y-auto py-1">
              {filtered.length === 0 ? (
                <li className="px-4 py-3 text-sm text-zinc-500">No matches found.</li>
              ) : (
                filtered.map((option) => (
                  <li key={option.value}>
                    <button
                      type="button"
                      className={cn(
                        "w-full px-4 py-2.5 text-left text-sm transition hover:bg-[#FF653F]/5",
                        value === option.value && "bg-[#FF653F]/10 font-semibold text-[#FF653F]",
                      )}
                      onClick={() => {
                        onChange(option.value);
                        setQuery("");
                        setOpen(false);
                      }}
                    >
                      {option.label}
                    </button>
                  </li>
                ))
              )}
            </ul>
          </div>
        </>
      ) : null}
    </div>
  );
}
