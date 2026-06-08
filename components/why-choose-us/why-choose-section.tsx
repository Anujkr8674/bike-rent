"use client";

import { motion, useReducedMotion } from "framer-motion";
import { OrbitLayout } from "./orbit-layout";

type WhyChooseSectionProps = {
  showLink?: boolean;
};

export function WhyChooseSection({ showLink = true }: WhyChooseSectionProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <section
      aria-labelledby="why-choose-heading"
      className="relative overflow-x-hidden bg-[#050505] py-20 md:py-10"
    >
      <div
        className="pointer-events-none absolute -left-40 top-0 h-[28rem] w-[28rem] rounded-full bg-[#FF6B1A]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-0 h-[28rem] w-[28rem] rounded-full bg-[#FF6B1A]/10 blur-3xl"
        aria-hidden
      />

      <motion.div
        initial={prefersReducedMotion ? false : { opacity: 0 }}
        whileInView={prefersReducedMotion ? undefined : { opacity: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 0.6 }}
        className="page-wrap relative z-10"
      >
        <div className="text-center">
          <p className="text-sm font-semibold uppercase tracking-widest text-[#FF6B1A]">
            Why Nextgen
          </p>
          <h2 id="why-choose-heading" className="section-title mt-2 text-balance text-white">
            Why riders choose us
          </h2>
          <p className="section-subtitle mx-auto mt-3 text-pretty text-zinc-400">
            Premium Ranchi rentals with verified bikes, transparent pricing, and support that
            feels like a top-tier mobility platform.
          </p>
        </div>

        <div className="mt-14 sm:mt-16 md:mt-20">
          <OrbitLayout />
        </div>
      </motion.div>
    </section>
  );
}
