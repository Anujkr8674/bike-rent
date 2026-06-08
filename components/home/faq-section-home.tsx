"use client";

import Image from "next/image";
import Link from "next/link";
import { SectionReveal } from "@/components/ui/section-reveal";
import { PremiumAccordion } from "@/components/faq/premium-accordion";
import { allFaqs } from "@/lib/content/faqs";
import { ArrowRight } from "lucide-react";
import { siteAssets } from "@/lib/site-assets";

const homeFaqItems = allFaqs.slice(0, 9).map((f, i) => ({
  id: `faq-${i}`,
  question: f.q,
  answer: f.a,
}));

export function FaqSectionHome() {
  return (
    <section id="faq" className="relative overflow-hidden py-20 md:py-28">
      <div className="absolute inset-0 bg-[#050505]" />
      <div className="pointer-events-none absolute right-0 top-0 h-72 w-72 rounded-full bg-[#FF6B1A]/10 blur-3xl" />

      <div className="page-wrap relative z-10">
        <div className="grid items-start gap-10 lg:grid-cols-[4.5fr_7.5fr] lg:gap-14">
          <SectionReveal className="lg:sticky lg:top-28">
            <p className="text-sm font-semibold uppercase tracking-widest text-[#FF6B1A]">Support</p>
            <h2 className="section-title mt-2 text-balance text-white">Questions? We&apos;ve got answers.</h2>
            <p className="section-subtitle mt-3 text-pretty text-zinc-400">
              Everything about booking, payments, and riding in Ranchi — in one premium help center.
            </p>
            <div className="relative mt-8 w-full aspect-[4/3] sm:aspect-[16/10] lg:aspect-[4/5] max-h-[400px] lg:max-h-[580px] overflow-hidden rounded-3xl border border-white/10 shadow-2xl shadow-[#FF6B1A]/15">
              <Image
                src={siteAssets.faqHome.faq}
                alt="Support for Ranchi bike rental"
                fill
                unoptimized
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 40vw"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0A0A0A]/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 rounded-xl bg-[#0A0A0A]/80 p-4 backdrop-blur-md border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
                <p className="text-sm font-semibold text-white">24×7 Ranchi support</p>
                <p className="mt-1 text-xs text-zinc-400">Active rentals get priority roadside help</p>
              </div>
            </div>
            <Link href="/faq" className="mt-6 inline-flex items-center gap-1 text-sm font-semibold text-[#FF6B1A] hover:underline">
              Full FAQ page <ArrowRight className="h-4 w-4" />
            </Link>
          </SectionReveal>

          <SectionReveal delay={0.1}>
            <PremiumAccordion items={homeFaqItems} />
            {/* <div className="mt-8 rounded-2xl bg-gradient-to-r from-blue-600 to-violet-600 p-6 text-white"> */}
            {/* <p className="font-semibold">Still need help?</p> */}
            {/* <p className="mt-1 text-sm text-blue-100">Chat with our Ranchi team on WhatsApp.</p> */}
            {/* <Link href="/contact" className="mt-4 inline-block">
                <Button variant="glass" size="sm" className="border-white/30 bg-white text-indigo-700">
                  Contact support
                </Button>
              </Link> */}
            {/* </div> */}
          </SectionReveal>
        </div>
      </div>
    </section>
  );
}
