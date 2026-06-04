import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

export function FormSection({
  title,
  description,
  children,
  className,
}: {
  title: string;
  description?: string;
  children: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn("rounded-2xl border border-zinc-200 bg-white p-5 shadow-sm", className)}>
      <div className="mb-4 border-b border-zinc-100 pb-3">
        <h3 className="text-base font-bold text-zinc-900">{title}</h3>
        {description ? <p className="mt-1 text-sm text-zinc-500">{description}</p> : null}
      </div>
      {children}
    </section>
  );
}

export function FieldLabel({ label, required }: { label: string; required?: boolean }) {
  return (
    <div className="mb-1 flex items-center gap-2">
      <p className="text-sm font-semibold text-zinc-900">{label}</p>
      {required ? (
        <span className="text-[10px] font-bold uppercase tracking-[0.3em] text-[#FF653F]">Required</span>
      ) : null}
    </div>
  );
}
