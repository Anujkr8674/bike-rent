"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

export type AccordionItem = { id: string; question: string; answer: string };

export function PremiumAccordion({ items, className }: { items: AccordionItem[]; className?: string }) {
  const [openId, setOpenId] = useState<string | null>(items[0]?.id ?? null);

  return (
    <div className={cn("space-y-3", className)}>
      {items.map((item) => {
        const isOpen = openId === item.id;
        return (
          <div
            key={item.id}
            className={cn(
              "overflow-hidden rounded-2xl border backdrop-blur-xl transition-all duration-300",
              isOpen
                ? "border-[#FF6B1A]/50 bg-[#0A0A0A]/90 shadow-lg shadow-[#FF6B1A]/20"
                : "border-white/10 bg-[#0A0A0A]/60 hover:border-[#FF6B1A]/30 hover:bg-[#0A0A0A]/80 hover:shadow-md hover:shadow-[#FF6B1A]/10"
            )}
          >
            <button
              type="button"
              onClick={() => setOpenId(item.id)}
              className="flex w-full items-start justify-between gap-4 p-5 text-left"
            >
              <span className="min-w-0 flex-1 break-words font-semibold text-white">{item.question}</span>
              <motion.span
                animate={{ rotate: isOpen ? 180 : 0 }}
                transition={{ duration: 0.25 }}
                className="mt-0.5 shrink-0 rounded-full bg-[#FF6B1A]/10 p-1"
              >
                <ChevronDown className="h-5 w-5 text-[#FF6B1A]" />
              </motion.span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                  className="overflow-hidden"
                >
                  <p className="break-words px-5 pb-5 text-sm leading-relaxed text-zinc-400">{item.answer}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
}
