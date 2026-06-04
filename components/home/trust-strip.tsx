"use client";

import { motion } from "framer-motion";
import { Shield, Star, Users, Zap } from "lucide-react";

const badges = [
  { icon: Shield, label: "Secure payments" },
  { icon: Star, label: "4.9 rider rating" },
  { icon: Users, label: "20K+ bookings" },
  { icon: Zap, label: "10 min pickup" },
  { icon: Shield, label: "Verified fleet" },
  { icon: Star, label: "Ranchi trusted" },
];

export function TrustStrip() {
  return (
    <section className="relative overflow-hidden border-y border-zinc-200/80 bg-white py-6">
      <div className="animate-marquee flex gap-12 whitespace-nowrap">
        {[...badges, ...badges].map((b, i) => {
          const Icon = b.icon;
          return (
            <span key={i} className="inline-flex items-center gap-2 text-sm font-semibold text-zinc-600">
              <Icon className="h-4 w-4 text-[#FF653F]" />
              {b.label}
            </span>
          );
        })}
      </div>
    </section>
  );
}
