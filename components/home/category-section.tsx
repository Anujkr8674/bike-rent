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
    <section className="relative overflow-hidden py-16 md:py-20">
      <div className="page-wrap relative z-10">
        {/* Header */}
        <div className="text-center mb-12 md:mb-16">
          <SectionReveal>
            <h2 className="section-title text-4xl font-extrabold tracking-tight text-white sm:text-5xl">
              Browse by Category
            </h2>
            <p className="mt-4 text-base text-zinc-400 md:text-lg flex items-center justify-center gap-1.5">
              Explore rides tailored to your style and adventure.
              <span className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-[#FF6B1A] text-white">
                <Check className="h-3 w-3 stroke-[3]" />
              </span>
            </p>
          </SectionReveal>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="flex min-h-[200px] items-center justify-center">
            <div className="flex flex-col items-center gap-3">
              <Loader2 className="h-10 w-10 animate-spin text-[#FF6B1A]" />
              <p className="text-sm font-semibold text-zinc-400">Loading categories...</p>
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
                      whileHover={{ y: -8 }}
                      className="group relative flex flex-col justify-between overflow-hidden rounded-[28px] border border-[#FF6B1A]/25 bg-[#050505] pt-4 pb-5 px-5 shadow-[0_0_30px_rgba(255,107,26,0.15),0_0_60px_rgba(255,107,26,0.08)] transition-all duration-500 hover:border-[#FF6B1A] hover:shadow-[0_0_40px_rgba(255,107,26,0.25),0_0_80px_rgba(255,107,26,0.15)] cursor-pointer animate-reveal"
                    >
                      {/* Top Section: Vehicle image scaled up to fill the container frame */}
                      <div className="relative flex h-[160px] md:h-[185px] w-full items-center justify-center overflow-visible mb-2 mt-2">
                        {/* Spotlight */}
                        <div 
                          className="absolute inset-0 pointer-events-none rounded-full opacity-90 group-hover:opacity-100 transition-opacity duration-500 scale-[1.3] md:scale-[1.5]"
                          style={{
                            background: 'radial-gradient(circle, rgba(255,107,26,0.5) 0%, rgba(255,107,26,0.15) 40%, transparent 70%)'
                          }}
                        />
                        
                        {/* Floor reflection / glow */}
                        <div className="absolute -bottom-4 w-3/4 h-12 rounded-[100%] opacity-80 group-hover:opacity-100 transition-opacity duration-500 blur-[15px]" 
                          style={{
                            background: 'radial-gradient(ellipse at center, rgba(255,107,26,0.6) 0%, rgba(255,107,26,0.2) 50%, transparent 80%)'
                          }}
                        />

                        {/* Hard Road Shadow */}
                        <div className="absolute -bottom-1 w-[70%] h-3 bg-white/60 rounded-[50%] blur-[2.5px] opacity-90 transition-transform duration-500 scale-[1.20] md:scale-[1.25] group-hover:scale-[1.25] md:group-hover:scale-[1.30] z-0" />

                        {category.imageUrl && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img
                            src={category.imageUrl}
                            alt={category.name}
                            className="h-full w-full object-contain scale-[1.52] transition-transform duration-500 group-hover:scale-[1.60] z-10 drop-shadow-[0_15px_15px_rgba(0,0,0,0.6)]"
                            onError={(e) => {
                              e.currentTarget.style.display = "none";
                            }}
                          />
                        )}
                      </div>

                      {/* Bottom Section: Details aligned exactly like mockup */}
                      <div className="mt-4 flex flex-col z-10 relative">
                        {/* Row 1 */}
                        <div className="flex items-start justify-between gap-2">
                          <h3 className="font-display text-[20px] font-bold tracking-tight text-white capitalize leading-tight drop-shadow-md">
                            {category.name}
                          </h3>

                          {/* Selector Badge */}
                          <div className="shrink-0 flex items-center justify-center rounded-full bg-[#111111] border border-[#FF6B1A]/30 w-6 h-6 mt-0.5 shadow-[0_0_10px_rgba(255,107,26,0.2)]">
                            <Check className="h-3.5 w-3.5 text-[#FF6B1A] stroke-[3]" />
                          </div>
                        </div>

                        {/* Row 2 */}
                        <div className="mt-1 flex items-center justify-between">
                          <span className="text-[13px] font-semibold text-zinc-400">
                            {stats.exampleName}
                          </span>
                          <span className="text-[20px] font-extrabold text-[#FF6B1A]">
                            {formatCurrency(stats.minPrice)}<span className="text-[11px] font-semibold text-[#FF6B1A]/80 font-sans ml-0.5">/day</span>
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
