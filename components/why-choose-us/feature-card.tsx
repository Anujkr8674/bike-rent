"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type FeatureCardProps = {
  icon: LucideIcon;
  title: string;
  description: string;
  index: number;
  className?: string;
  variant?: "orbit" | "mobile";
  isActive?: boolean;
  onClick?: () => void;
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
  className,
  variant = "orbit",
  isActive = false,
  onClick,
}: FeatureCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      aria-label={`${title}: ${description}`}
      onClick={onClick}
      initial={prefersReducedMotion ? false : { opacity: 0, scale: 0.92 }}
      whileInView={prefersReducedMotion ? undefined : { opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-30px" }}
      transition={{
        duration: 0.4,
        delay: 0.08 + index * 0.055,
        ease: [0.22, 1, 0.36, 1],
      }}
      whileHover={
        prefersReducedMotion
          ? undefined
          : { scale: 1.05, transition: { duration: 0.25 } }
      }
      className={cn(
        "group flex flex-col items-center text-center cursor-pointer select-none",
        // Increase width on mobile orbit to w-[200px] to counteract scale and provide text wrapping space
        variant === "orbit" && "w-[200px] md:w-[148px]",
        variant === "mobile" && "w-full",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full transition-all duration-300",
          // Scale icon container on mobile to counteract container scaling
          variant === "orbit" && "h-[92px] w-[92px] md:h-[72px] md:w-[72px]",
          variant === "mobile" && "h-14 w-14 sm:h-16 sm:w-16",
          isActive
            ? "bg-[#FF653F] text-white shadow-[0_10px_30px_rgba(255,101,63,0.35)] ring-2 ring-[#FF653F] scale-110"
            : "bg-gradient-to-br from-[#FF653F]/15 via-[#FF653F]/5 to-white text-[#FF653F] shadow-[0_8px_28px_rgba(255,101,63,0.14)] ring-1 ring-[#FF653F]/20 group-hover:shadow-[0_14px_40px_rgba(255,101,63,0.22)] group-hover:ring-[#FF653F]/40 group-hover:scale-105",
        )}
      >
        <Icon
          className={cn(
            "stroke-[1.8] transition-colors duration-300",
            isActive ? "text-white" : "text-[#FF653F]",
            variant === "orbit" && "h-10 w-10 md:h-8 md:w-8",
            variant === "mobile" && "h-6 w-6 sm:h-7 sm:w-7",
          )}
          aria-hidden
        />
        
        {/* Pulsing ring behind active icon */}
        {isActive && (
          <span className="absolute inset-0 rounded-full ring-4 ring-[#FF653F]/35 animate-ping opacity-75" />
        )}
      </div>

      <h3
        className={cn(
          "mt-2 font-bold leading-snug text-slate-900 transition-colors duration-200",
          // Use scaled larger text for mobile orbit layout to preserve legibility when scaled down
          variant === "orbit" && "mt-3 text-[22px] md:text-sm group-hover:text-[#FF653F]",
          variant === "mobile" && "text-xs sm:text-sm",
          isActive && "text-[#FF653F] md:text-[#FF653F]",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-1 leading-relaxed text-zinc-500",
          // Use scaled larger text for mobile orbit layout to preserve legibility when scaled down
          variant === "orbit" && "mt-1.5 text-[17px] md:text-xs",
          variant === "mobile" && "text-[0.7rem] sm:text-xs",
        )}
      >
        {description}
      </p>
    </motion.article>
  );
}
