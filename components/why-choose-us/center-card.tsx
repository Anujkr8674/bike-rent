"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { whyChooseCenter } from "@/lib/content/why-choose-features";
import { cn } from "@/lib/utils";

type CenterCardProps = {
  className?: string;
};

export function CenterCard({ className }: CenterCardProps) {
  const prefersReducedMotion = useReducedMotion();
  const { image, imageAlt, heading, tagline, highlight } = whyChooseCenter;

  return (
    <motion.div
      initial={prefersReducedMotion ? false : { opacity: 0, y: 28 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
      className={cn("group relative w-[272px]", className)}
    >
      <div
        className={[
          "relative overflow-hidden rounded-[1.75rem] border border-zinc-200/80 bg-white",
          "shadow-[0_20px_60px_rgba(15,23,42,0.12)]",
          "transition-shadow duration-500 group-hover:shadow-[0_28px_72px_rgba(249,115,22,0.15)]",
        ].join(" ")}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="272px"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105"
          />

          <div
            className="absolute inset-0 bg-gradient-to-b from-white/95 via-white/50 to-transparent"
            aria-hidden
          />
          <div
            className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/90 to-transparent"
            aria-hidden
          />

          <div className="relative z-10 px-5 pt-6 text-center sm:px-6 sm:pt-7">
            <h3 className="font-display text-[1.05rem] font-bold leading-snug text-slate-900 sm:text-lg">
              {heading}
            </h3>
            <p className="mt-2 text-[0.8rem] leading-relaxed text-slate-600 sm:text-sm">
              {tagline}{" "}
              <span className="font-semibold text-[#FF653F]">{highlight}</span>
            </p>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
