"use client";

import Image from "next/image";
import Link from "next/link";
import { PremiumAccordion } from "@/components/faq/premium-accordion";
import { faqCategories } from "@/lib/content/faqs";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Button } from "@/components/ui/button";
import { siteAssets } from "@/lib/site-assets";

const allItems = faqCategories.flatMap((cat, ci) =>
  cat.items.map((item, ii) => ({
    id: `faq-${ci}-${ii}`,
    question: item.q,
    answer: item.a,
  }))
);

export function FaqPageContent() {
  return (
    <div className="page-wrap py-16 md:py-24">
      <div className="grid items-start gap-10 lg:grid-cols-2 lg:gap-14">
        <SectionReveal className="lg:sticky lg:top-28">
          <div className="relative aspect-[4/5] max-h-[520px] overflow-hidden rounded-3xl border border-zinc-200 shadow-2xl shadow-blue-500/10">
            <Image
              src={siteAssets.pageHeroes.faq}
              alt="Premium bike rental support in Ranchi"
              fill
              className="object-cover"
              sizes="(max-width: 1024px) 100vw, 50vw"
              priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-indigo-900/70 via-indigo-900/20 to-transparent" />
            <div className="absolute bottom-6 left-6 right-6 rounded-2xl border border-white/20 bg-white/10 p-5 backdrop-blur-xl">
              <p className="font-display text-xl font-bold text-white">Premium support center</p>
              <p className="mt-2 text-sm text-blue-100">
                Booking, payments, cancellations, deposits — answered by our Ranchi team.
              </p>
            </div>
          </div>
          <div className="mt-6 flex flex-wrap gap-2">
            {faqCategories.map((c) => (
              <span key={c.title} className="rounded-full border border-blue-100 bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {c.title}
              </span>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal delay={0.1} className="min-w-0">
          <PremiumAccordion items={allItems} />
        </SectionReveal>
      </div>

      <SectionReveal className="mt-16 overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 p-8 text-center text-white md:p-12">
        <p className="font-display text-2xl font-bold">Still have questions?</p>
        <p className="mx-auto mt-2 max-w-md text-blue-100">Our Ranchi support team typically responds within 2 hours.</p>
        <Link href="/contact" className="mt-6 inline-block">
          <Button variant="glass" size="lg" className="border-white/30 bg-white text-indigo-700">
            Contact support
          </Button>
        </Link>
      </SectionReveal>
    </div>
  );
}
