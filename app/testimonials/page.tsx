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
        <div className="mb-12 flex flex-wrap items-center justify-center gap-8 rounded-2xl bg-gradient-to-r from-blue-50 to-violet-50 p-8">
          <div className="text-center">
            <p className="font-display text-5xl font-bold text-zinc-900">4.9</p>
            <div className="mt-2 flex justify-center gap-0.5">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className="h-5 w-5 fill-amber-400 text-amber-400" />
              ))}
            </div>
            <p className="mt-1 text-sm text-zinc-600">Average rating</p>
          </div>
          <div className="text-center">
            <p className="font-display text-5xl font-bold text-zinc-900">2,400+</p>
            <p className="mt-1 text-sm text-zinc-600">Verified reviews</p>
          </div>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {testimonials.map((t, i) => (
            <SectionReveal key={t.id} delay={i * 0.05}>
              <motion.div whileHover={{ y: -4 }} className="glass h-full rounded-2xl p-6">
                <div className="flex items-center gap-3">
                  <Image src={t.avatar} alt={t.name} width={48} height={48} className="rounded-full object-cover" />
                  <div>
                    <p className="font-semibold text-zinc-900">{t.name}</p>
                    <p className="text-xs text-zinc-500">{t.location}</p>
                  </div>
                  {t.verified && (
                    <BadgeCheck className="ml-auto h-5 w-5 text-blue-600" aria-label="Verified customer" />
                  )}
                </div>
                <div className="mt-3 flex gap-0.5">
                  {Array.from({ length: t.rating }).map((_, j) => (
                    <Star key={j} className="h-4 w-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>
                <p className="mt-4 text-sm leading-relaxed text-zinc-600">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 text-xs font-medium text-blue-600">Rode: {t.bike}</p>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </>
  );
}
