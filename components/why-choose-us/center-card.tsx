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
  const { image, imageAlt } = whyChooseCenter;

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
          "transition-shadow duration-500 group-hover:shadow-[0_28px_72px_rgba(255,101,63,0.18)]",
        ].join(" ")}
      >
        <div className="relative aspect-[4/5] overflow-hidden rounded-[1.75rem]">
          <Image
            src={image}
            alt={imageAlt}
            fill
            priority
            sizes="272px"
            className="object-cover object-center transition-transform duration-700 ease-out group-hover:scale-108"
          />

          {/* Premium color overlay tint on hover */}
          <div className="absolute inset-0 bg-[#FF653F]/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        </div>
      </div>
    </motion.div>
  );
}
