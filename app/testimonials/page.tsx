"use client";

import Image from "next/image";
import { PageHero } from "@/components/layout/page-hero";
import { testimonials } from "@/lib/content/testimonials";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Star, BadgeCheck } from "lucide-react";
import { motion } from "framer-motion";
import { heroImages } from "@/lib/content/hero-images";

export default function TestimonialsPage() {
  return (
    <>
      <PageHero
        badge="Reviews"
        title="Trusted by Ranchi riders"
        subtitle="Real reviews from students, commuters, and tourists who chose Nextgen for their daily rides and weekend trips."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Testimonials" }]}
        backgroundImage={heroImages.testimonials}
      />
      <div className="page-wrap py-16 md:py-24">
        <div className="mb-12 flex flex-wrap items-center justify-center gap-8 rounded-2xl bg-[#0A0A0A] border border-white/10 shadow-[0_0_30px_rgba(255,107,26,0.05)] p-8">
          <div className="text-center">
            <p className="font-display text-5xl font-bold text-white">4.9</p>
            <div className="mt-2 flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-[#FF6B1A] text-[#FF6B1A]" />
              ))}
            </div>
            <p className="mt-1 text-sm text-zinc-400">Average rating</p>
          </div>
          <div className="text-center">
            <p className="font-display text-5xl font-bold text-white">2,400+</p>
            <p className="mt-1 text-sm text-zinc-400">Verified reviews</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <SectionReveal key={t.id} delay={i * 0.05}>
              <motion.div whileHover={{ y: -4 }} className="bg-[#0A0A0A] h-full rounded-2xl p-6 border border-white/10 transition-colors duration-300 hover:border-[#FF6B1A] hover:shadow-[0_0_30px_rgba(255,107,26,0.3)]">
                <div className="flex items-center gap-3">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-white">{t.name}</p>
                    <p className="text-xs text-zinc-400">{t.location}</p>
                  </div>
                  {t.verified && (
                    <BadgeCheck className="ml-auto h-5 w-5 text-[#FF6B1A]" aria-label="Verified customer" />
                  )}
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-[#FF6B1A] text-[#FF6B1A]" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-400">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 text-xs font-medium text-[#FF6B1A]">Rode: {t.bike}</p>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </>
  );
}
