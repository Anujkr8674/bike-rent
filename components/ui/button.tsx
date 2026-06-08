import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 rounded-xl font-semibold transition-all duration-300 disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "bg-gradient-to-r from-[#FF653F] via-[#FF4F2E] to-[#FF653F] text-white shadow-lg shadow-[#FF653F]/25 hover:scale-[1.02] hover:shadow-xl hover:shadow-[#FF653F]/30 active:scale-[0.98]",
        outline:
          "border border-white/10 bg-[#111111]/80 text-white backdrop-blur hover:border-[#FF653F]/60 hover:bg-[#FF653F]/5 hover:text-[#FF653F]",
        ghost: "text-zinc-400 hover:bg-white/5 hover:text-white",
        glass:
          "glass border border-white/10 text-white hover:border-[#FF653F]/25 hover:shadow-md hover:shadow-[#FF653F]/10",
      },
      size: {
        default: "h-12 px-7 text-sm",
        sm: "h-10 px-5 text-sm",
        lg: "h-14 px-8 text-base",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size, className }))} {...props} />;
}
