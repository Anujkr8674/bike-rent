"use client";

import { motion } from "framer-motion";
import { MapPin, Navigation } from "lucide-react";
import { coveredCities } from "@/lib/constants";
import { SectionReveal } from "@/components/ui/section-reveal";

export function CityCoverageSection() {
  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-gradient-to-b from-zinc-50 via-white to-blue-50/30" />
      <div className="pointer-events-none absolute left-1/2 top-1/2 h-[500px] w-[500px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-blue-500/5 blur-3xl" />

      <div className="page-wrap relative z-10">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <SectionReveal>
            <div className="relative overflow-hidden rounded-3xl border border-zinc-200 bg-gradient-to-br from-blue-600 to-violet-700 p-8 text-white shadow-2xl shadow-indigo-500/20 md:p-10">
              <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-white/10 blur-2xl" />
              <div className="absolute -bottom-10 -left-10 h-32 w-32 rounded-full bg-cyan-400/20 blur-2xl" />
              <Navigation className="relative h-10 w-10 text-cyan-200" />
              <h2 className="relative mt-6 font-display text-3xl font-bold leading-tight text-balance md:text-4xl">
                Serving Ranchi &amp; nearby
              </h2>
              <p className="relative mt-4 max-w-md text-pretty text-sm leading-relaxed text-blue-100 md:text-base">
                Jharkhand-focused service — expanding carefully across trusted pickup zones, not nationwide.
              </p>
              <div className="relative mt-8 flex items-center gap-2 rounded-xl bg-white/10 px-4 py-3 backdrop-blur">
                <MapPin className="h-5 w-5 shrink-0 text-cyan-300" />
                <span className="break-words text-sm font-medium">Head office: Ranchi, Jharkhand</span>
              </div>
              {/* Decorative map dots */}
              <div className="relative mt-8 grid grid-cols-3 gap-3 opacity-80">
                {coveredCities.slice(0, 6).map((city, i) => (
                  <motion.div
                    key={city}
                    initial={{ opacity: 0, scale: 0.8 }}
                    whileInView={{ opacity: 1, scale: 1 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.08 }}
                    className="rounded-lg bg-white/10 px-2 py-2 text-center text-xs font-medium backdrop-blur"
                  >
                    {city}
                  </motion.div>
                ))}
              </div>
            </div>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">Pickup zones</p>
            <p className="mt-2 text-lg text-zinc-600 text-pretty">
              Fast handover at major Ranchi locations. Select your zone at booking.
            </p>
            <div className="mt-8 grid grid-cols-2 gap-3 sm:grid-cols-3">
              {coveredCities.map((city, i) => (
                <motion.div
                  key={city}
                  whileHover={{ scale: 1.05, y: -2 }}
                  className="flex min-h-[52px] items-center justify-center rounded-xl border border-zinc-200 bg-white px-3 py-3 text-center shadow-sm transition hover:border-blue-300 hover:shadow-md hover:shadow-blue-500/10"
                >
                  <span className="break-words text-sm font-semibold text-zinc-800">{city}</span>
                </motion.div>
              ))}
            </div>
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
