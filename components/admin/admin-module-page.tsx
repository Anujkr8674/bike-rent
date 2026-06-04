"use client";

import type { ReactNode } from "react";
import { SectionReveal } from "@/components/ui/section-reveal";

type StatCard = {
  label: string;
  value: string | number;
  hint?: string;
};

type Props = {
  title: string;
  description: string;
  eyebrow?: string;
  actions?: ReactNode;
  stats?: StatCard[];
  children?: ReactNode;
};

export function AdminModulePage({ title, description, eyebrow = "Admin module", actions, stats, children }: Props) {
  return (
    <div className="space-y-8 px-5 py-6 md:px-8">
      <SectionReveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">{eyebrow}</p>
            <h1 className="font-display mt-2 text-3xl font-bold text-zinc-900 md:text-4xl">{title}</h1>
            <p className="mt-2 max-w-3xl text-sm leading-relaxed text-zinc-500">{description}</p>
          </div>
          {actions && <div className="flex flex-wrap gap-2">{actions}</div>}
        </div>
      </SectionReveal>

      {stats?.length ? (
        <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-4">
          {stats.map((stat, i) => (
            <SectionReveal key={stat.label} delay={i * 0.05}>
              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <p className="text-sm font-medium text-zinc-500">{stat.label}</p>
                <p className="mt-2 font-display text-3xl font-bold text-zinc-900">{stat.value}</p>
                {stat.hint && <p className="mt-2 text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">{stat.hint}</p>}
              </div>
            </SectionReveal>
          ))}
        </div>
      ) : null}

      {children}
    </div>
  );
}
