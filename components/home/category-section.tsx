"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Check, ArrowRight, Loader2 } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { formatCurrency } from "@/lib/utils";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

interface BikeItem {
  id: string;
  name: string;
  category: string;
  pricePerDay: number;
}

const CuratedDefaults: Record<string, { minPrice: number; exampleName: string }> = {
  sports: { minPrice: 799, exampleName: "Apache RTR" },
  commuter: { minPrice: 699, exampleName: "Pulsar 150" },
  scooter: { minPrice: 499, exampleName: "Activa 6G" },
  naked: { minPrice: 1099, exampleName: "MT-15" },
  cruiser: { minPrice: 1399, exampleName: "Hunter 350" },
  adventure: { minPrice: 1499, exampleName: "Himalayan" },
};

export function CategorySection() {
  const [categories, setCategories] = useState<CategoryItem[]>([]);
  const [bikeStats, setBikeStats] = useState<Record<string, { minPrice: number; exampleName: string }>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    Promise.all([
      fetch("/api/bike-categories", { cache: "no-store" }).then((res) => res.json()),
      fetch("/api/bikes", { cache: "no-store" }).then((res) => res.json()),
    ])
      .then(([catData, bikeData]) => {
        if (!active) return;

        if (catData && Array.isArray(catData.categories) && catData.categories.length) {
          setCategories(catData.categories);
        }

        if (bikeData && Array.isArray(bikeData.bikes)) {
          const stats: Record<string, { minPrice: number; exampleName: string }> = {};

          bikeData.bikes.forEach((bike: BikeItem) => {
            const catKey = bike.category.toLowerCase().trim();
            if (!stats[catKey]) {
              stats[catKey] = {
                minPrice: bike.pricePerDay,
                exampleName: bike.name,
              };
            } else {
              if (bike.pricePerDay < stats[catKey].minPrice) {
                stats[catKey].minPrice = bike.pricePerDay;
              }
            }
          });

          setBikeStats(stats);
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

  return (
    <section className="relative overflow-hidden bg-zinc-50/30 py-16 md:py-20">
      <div className="page-wrap relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <SectionReveal>
            <h2 className="section-title text-4xl font-extrabold tracking-tight text-zinc-950 sm:text-5xl">
              Browse by Category
            </h2>
            <p className="mt-4 text-base text-zinc-500 md:text-lg flex items-center justify-center gap-1.5">
              Explore rides tailored to your style and adventure.
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FF653F] text-white">
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
            </p>
          </SectionReveal>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-[#FF653F]" />
              <p className="text-sm font-semibold text-zinc-500">Loading categories...</p>
            </div>
          </div>
        ) : (
          /* Categories Grid - md:grid-cols-3 makes it 3 columns on tablets/laptops and above */
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 md:grid-cols-3">
            {categories.map((category, idx) => {
              const catKey = category.slug.toLowerCase().trim();
              const stats = bikeStats[catKey] || CuratedDefaults[catKey] || { minPrice: 499, exampleName: "Available Now" };

              return (
                <SectionReveal key={category.id} delay={idx * 0.05}>
                  <Link href={`/bikes?category=${category.slug}`}>
                    <motion.div
                      whileHover={{ y: -4 }}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-3xl border-2 border-zinc-100 bg-white pt-4 pb-5 px-5 shadow-[0_8px_30px_rgba(0,0,0,0.02)] transition-all duration-300 hover:border-[#FF653F] hover:shadow-[0_15px_35px_rgba(255,101,63,0.1)] cursor-pointer animate-reveal"
                    >
                      {/* Top Section: Vehicle image scaled up to fill the container frame */}
                      <div className="relative flex h-[160px] md:h-[185px] w-full items-center justify-center overflow-visible">
                        {category.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="h-full w-full object-contain scale-[1.52] transition-transform duration-500 group-hover:scale-[1.60]"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                      </div>

                      {/* Bottom Section: Details aligned exactly like mockup */}
                      <div className="mt-4 flex flex-col">
                        {/* Row 1 */}
                        <div className="flex items-center justify-between">
                          <h3 className="font-display text-2xl font-bold tracking-tight text-zinc-950 capitalize group-hover:text-[#FF653F] transition-colors duration-200">
                            {category.name}
                          </h3>

                          {/* Selector Badge */}
                          <div className="relative h-6 w-6">
                            {/* Checkmark badge */}
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#FF653F]/12 text-[#FF653F] transition-all duration-300 group-hover:opacity-0 group-hover:scale-50">
                              <Check className="h-3.5 w-3.5 stroke-[3.5]" />
                            </div>

                            {/* Arrow right */}
                            <div className="absolute inset-0 flex items-center justify-center rounded-full bg-[#FF653F] text-white shadow-sm opacity-0 scale-50 transition-all duration-300 group-hover:opacity-100 group-hover:scale-100">
                              <ArrowRight className="h-3.5 w-3.5 stroke-[3]" />
                            </div>
                          </div>
                        </div>

                        {/* Row 2 */}
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-sm font-semibold text-zinc-500">
                            {stats.exampleName}
                          </span>
                          <span className="text-base font-extrabold text-zinc-950 group-hover:text-[#FF653F] transition-colors duration-200">
                            {formatCurrency(stats.minPrice)}<span className="text-xs font-semibold text-zinc-400 font-sans">/day</span>
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  </Link>
                </SectionReveal>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
