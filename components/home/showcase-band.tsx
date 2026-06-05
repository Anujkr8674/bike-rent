"use client";

import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { useCatalogBikes } from "@/components/bikes/use-catalog-bikes";
import { formatCurrency } from "@/lib/utils";
import { SectionReveal } from "@/components/ui/section-reveal";

export function ShowcaseBand() {
  const showcase = useCatalogBikes(4);
  return (
    <section className="relative overflow-hidden py-16 md:py-10">
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-blue-50/80 via-white to-violet-50/50" />
      <div className="pointer-events-none absolute -left-20 top-1/2 h-64 w-64 -translate-y-1/2 rounded-full bg-cyan-400/20 blur-3xl" />
      <div className="pointer-events-none absolute -right-20 top-1/3 h-80 w-80 rounded-full bg-violet-400/15 blur-3xl" />

      <div className="page-wrap relative z-10">
        <SectionReveal className="flex flex-col gap-4 md:flex-row md:items-end md:justify-between">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">Featured fleet</p>
            <h2 className="section-title mt-2 text-balance">Premium bikes, cinematic rides</h2>
            <p className="section-subtitle mt-2 max-w-xl text-pretty">
              Hand-picked motorcycles and scooters — serviced, documented, and ready for Ranchi roads.
            </p>
          </div>
          <Link href="/bikes" className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
            View all bikes <ArrowRight className="h-4 w-4" />
          </Link>
        </SectionReveal>

        <div className="mt-10 grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {showcase.map((bike, i) => (
            <SectionReveal key={bike.id} delay={i * 0.08}>
              <Link href={`/bikes/${bike.id}`}>
                <motion.div
                  whileHover={{ y: -10 }}
                  className="group relative overflow-hidden rounded-3xl border border-zinc-200/80 bg-white shadow-lg shadow-blue-500/5"
                >
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={bike.image}
                      alt={bike.name}
                      fill
                      className="object-cover transition duration-700 group-hover:scale-110"
                      sizes="(max-width:768px) 100vw, 25vw"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-zinc-900/80 via-zinc-900/20 to-transparent" />
                    <div className="absolute bottom-4 left-4 right-4">
                      <p className="font-display text-lg font-bold text-white">{bike.name}</p>
                      <p className="text-sm text-zinc-200">
                        from {formatCurrency(bike.pricePerDay)}/day
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center justify-between p-4">
                    <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                      {bike.category}
                    </span>
                    <span className="text-xs font-medium text-zinc-500">{bike.cc}cc · {bike.fuelType}</span>
                  </div>
                </motion.div>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}
