"use client";

import { useRef } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { BikeCard } from "@/components/bikes/bike-card";
import { useCatalogBikes } from "@/components/bikes/use-catalog-bikes";
import { SectionReveal } from "@/components/ui/section-reveal";

export function PopularSlider({
  days = 1,
  pickup = "",
  drop = "",
}: {
  days?: number;
  pickup?: string;
  drop?: string;
}) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const bikes = useCatalogBikes(8);

  const scroll = (dir: number) => {
    scrollRef.current?.scrollBy({ left: dir * 320, behavior: "smooth" });
  };

  return (
    <section className="py-20 md:py-28">
      <div className="page-wrap">
        <SectionReveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-blue-600">Popular picks</p>
            <h2 className="section-title mt-2">Most booked in Ranchi</h2>
            <p className="section-subtitle">Swipe through our highest-rated rides.</p>
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={() => scroll(-1)} className="rounded-full border border-zinc-200 bg-white p-3 shadow-sm hover:border-blue-300">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => scroll(1)} className="rounded-full border border-zinc-200 bg-white p-3 shadow-sm hover:border-blue-300">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </SectionReveal>

        <div ref={scrollRef} className="scrollbar-hide -mx-4 flex gap-5 overflow-x-auto px-4 pb-4 snap-x snap-mandatory md:-mx-0 md:px-0">
          {bikes.map((bike, i) => (
            <motion.div key={bike.id} className="w-[min(100%,300px)] shrink-0 snap-center md:w-[320px]">
              <BikeCard bike={bike} days={days} pickup={pickup} drop={drop} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
