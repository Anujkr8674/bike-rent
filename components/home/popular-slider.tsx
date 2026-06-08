"use client";

import { useEffect, useRef, useState } from "react";
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
  const [isPaused, setIsPaused] = useState(false);

  const allBikes = [...bikes, ...bikes];

  const scroll = (dir: number) => {
    if (!scrollRef.current) return;
    const el = scrollRef.current;
    
    // Smooth scroll by one card width
    el.scrollBy({ left: dir * 340, behavior: "smooth" });
  };

  // Auto carousel effect with seamless infinite loop
  useEffect(() => {
    if (isPaused) return;
    const el = scrollRef.current;
    if (!el) return;

    const interval = setInterval(() => {
      // If we've scrolled past the first set, instantly jump back to start for seamless loop
      if (el.scrollLeft >= el.scrollWidth / 2) {
        el.style.scrollBehavior = "auto";
        el.scrollLeft -= el.scrollWidth / 2;
        // Force reflow
        void el.offsetWidth;
        el.style.scrollBehavior = "smooth";
      }
      el.scrollBy({ left: 340, behavior: "smooth" });
    }, 3500);

    return () => clearInterval(interval);
  }, [isPaused]);

  // Convert vertical wheel to horizontal scroll, and release at edges
  useEffect(() => {
    const el = scrollRef.current;
    if (!el) return;

    const handleWheel = (e: WheelEvent) => {
      const atLeft = el.scrollLeft <= 0;
      const atRight = el.scrollLeft >= el.scrollWidth - el.clientWidth - 1;

      // If they are scrolling up and already at the start, let the page scroll up
      if (e.deltaY < 0 && atLeft) return;
      // If they are scrolling down and already at the absolute end, let the page scroll down
      if (e.deltaY > 0 && atRight) return;

      // Otherwise, convert vertical scroll to horizontal scroll
      if (Math.abs(e.deltaY) > Math.abs(e.deltaX)) {
        e.preventDefault();
        el.scrollBy({ left: e.deltaY, behavior: "auto" });
      }
    };

    el.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      el.removeEventListener("wheel", handleWheel);
    };
  }, []);

  return (
    <section className="py-20 md:py-10">
      <div className="page-wrap">
        <SectionReveal className="mb-10 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-sm font-semibold uppercase tracking-widest text-[#FF6B1A] drop-shadow-[0_0_10px_rgba(255,107,26,0.5)]">Popular picks</p>
            <h2 className="section-title mt-2 text-white">Most booked in Ranchi</h2>
            <p className="section-subtitle text-zinc-400">Swipe through our highest-rated rides.</p>
          </div>
          <div className="flex gap-2.5">
            <button type="button" onClick={() => scroll(-1)} className="rounded-full border border-white/10 bg-[#0A0A0A] p-3 text-white shadow-sm hover:border-[#FF6B1A] hover:text-[#FF6B1A] hover:shadow-[0_0_15px_rgba(255,107,26,0.3)] transition-all">
              <ChevronLeft className="h-5 w-5" />
            </button>
            <button type="button" onClick={() => scroll(1)} className="rounded-full border border-white/10 bg-[#0A0A0A] p-3 text-white shadow-sm hover:border-[#FF6B1A] hover:text-[#FF6B1A] hover:shadow-[0_0_15px_rgba(255,107,26,0.3)] transition-all">
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </SectionReveal>

        <div 
          ref={scrollRef} 
          className="scrollbar-hide -mx-4 flex gap-5 overflow-x-auto px-4 pb-4 snap-x snap-mandatory md:-mx-0 md:px-0 scroll-smooth"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          {allBikes.map((bike, i) => (
            <motion.div key={`${bike.id}-${i}`} className="w-[min(100%,300px)] shrink-0 snap-center md:w-[320px]">
              <BikeCard bike={bike} days={days} pickup={pickup} drop={drop} index={i} />
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
