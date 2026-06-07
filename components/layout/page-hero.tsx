"use client";

import { motion } from "framer-motion";
import { BikeMediaImage } from "@/components/bikes/bike-media-image";
import { siteAssets } from "@/lib/site-assets";

type Props = {
  title: string;
  subtitle?: string;
  badge?: string;
  backgroundImage?: string;
  /** @deprecated Breadcrumbs removed from UI */
  breadcrumbs?: { label: string; href?: string }[];
  /** @deprecated All page heroes use the same dark overlay style */
  variant?: "default" | "dark";
};

export function PageHero({
  title,
  subtitle,
  badge,
  backgroundImage = siteAssets.pageHeroes.bikes,
}: Props) {
  return (
    <section className="page-hero-banner relative -mt-[4.5rem] min-h-[300px] overflow-hidden pt-[4.5rem] md:min-h-[340px]">
      <BikeMediaImage src={backgroundImage} alt="" fill priority className="object-cover" />
      <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/45 to-black/65" />
      <div className="absolute inset-0 bg-[#FF653F]/10 mix-blend-overlay" />

      <div className="page-wrap relative z-10 flex min-h-[300px] flex-col items-center justify-center px-4 pt-24 pb-12 text-center md:min-h-[340px] md:pt-28 md:pb-14">
        {badge && (
          <motion.span
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex rounded-full border border-white/25 bg-white/15 px-4 py-1 text-xs font-semibold uppercase tracking-wider text-white backdrop-blur-md"
          >
            {badge}
          </motion.span>
        )}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1, duration: 0.6 }}
          className="font-display mt-4 max-w-4xl text-balance text-3xl font-bold tracking-tight text-white sm:text-4xl md:text-5xl"
        >
          {title}
        </motion.h1>
        {subtitle && (
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.25 }}
            className="mx-auto mt-3 max-w-2xl text-pretty text-sm leading-relaxed text-white/85 sm:text-base md:text-lg"
          >
            {subtitle}
          </motion.p>
        )}
      </div>
    </section>
  );
}
