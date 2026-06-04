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
};

export function FeatureCard({
  icon: Icon,
  title,
  description,
  index,
  className,
  variant = "orbit",
}: FeatureCardProps) {
  const prefersReducedMotion = useReducedMotion();

  return (
    <motion.article
      aria-label={`${title}: ${description}`}
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
          : { scale: 1.05, transition: { duration: 0.35 } }
      }
      className={cn(
        "group flex flex-col items-center text-center",
        variant === "orbit" && "w-[148px]",
        variant === "mobile" && "w-full",
        className,
      )}
    >
      <div
        className={cn(
          "relative flex items-center justify-center rounded-full",
          variant === "orbit" && "h-[72px] w-[72px]",
          variant === "mobile" && "h-14 w-14 sm:h-16 sm:w-16",
          "bg-gradient-to-br from-[#FF653F]/15 via-[#FF653F]/5 to-white",
          "shadow-[0_8px_28px_rgba(255,101,63,0.14)]",
          "ring-1 ring-[#FF653F]/20",
          "transition-all duration-[400ms] ease-out",
          "group-hover:shadow-[0_14px_40px_rgba(255,101,63,0.22)]",
          "group-hover:ring-[#FF653F]/40",
        )}
      >
        <Icon
          className={cn(
            "text-[#FF653F] stroke-[1.5]",
            variant === "orbit" && "h-8 w-8",
            variant === "mobile" && "h-6 w-6 sm:h-7 sm:w-7",
          )}
          aria-hidden
        />
      </div>

      <h3
        className={cn(
          "mt-2 font-bold leading-snug text-slate-900",
          variant === "orbit" && "mt-3 text-sm",
          variant === "mobile" && "text-xs sm:text-sm",
        )}
      >
        {title}
      </h3>
      <p
        className={cn(
          "mt-1 leading-relaxed text-zinc-500",
          variant === "orbit" && "mt-1.5 text-xs",
          variant === "mobile" && "text-[0.7rem] sm:text-xs",
        )}
      >
        {description}
      </p>
    </motion.article>
  );
}
