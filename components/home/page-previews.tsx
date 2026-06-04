"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Button } from "@/components/ui/button";
import { testimonials } from "@/lib/content/testimonials";
import { allFaqs } from "@/lib/content/faqs";
import { whyChooseItems } from "@/lib/content/why-choose";
import Image from "next/image";
import { Star } from "lucide-react";
import { siteAssets } from "@/lib/site-assets";

function ViewAll({ href, label }: { href: string; label: string }) {
  return (
    <Link href={href} className="inline-flex items-center gap-1 text-sm font-semibold text-blue-600 hover:underline">
      {label} <ArrowRight className="h-4 w-4" />
    </Link>
  );
}

export function ExplorePagesGrid() {
  const pages = [
    { href: "/about", label: "About Us", desc: "Our story & team" },
    { href: "/bikes", label: "Fleet", desc: "All bikes & filters" },
    { href: "/ranchi", label: "Ranchi Service", desc: "Local SEO hub" },
    { href: "/blog", label: "Blog", desc: "Guides & tips" },
    { href: "/testimonials", label: "Reviews", desc: "Rider stories" },
    { href: "/faq", label: "FAQ", desc: "Booking help" },
    { href: "/contact", label: "Contact", desc: "Get in touch" },
    { href: "/support", label: "Support", desc: "Help center" },
  ];
  return (
    <section className="py-16 md:py-20">
      <div className="page-wrap">
        <SectionReveal className="text-center">
          <h2 className="section-title">Explore our platform</h2>
          <p className="section-subtitle mx-auto">Full pages for every question — built for trust and SEO.</p>
        </SectionReveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {pages.map((p, i) => (
            <SectionReveal key={p.href} delay={i * 0.04}>
              <Link href={p.href} className="card-lift glass block rounded-2xl p-5">
                <p className="font-semibold text-zinc-900">{p.label}</p>
                <p className="mt-1 text-sm text-zinc-500">{p.desc}</p>
              </Link>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChoosePreview() {
  return (
    <section className="py-16 md:py-20">
      <div className="page-wrap">
        <SectionReveal className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="section-title">Why choose Nextgen</h2>
            <p className="section-subtitle">Premium experience built for Ranchi riders.</p>
          </div>
          <ViewAll href="/why-choose-us" label="See all benefits" />
        </SectionReveal>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {whyChooseItems.slice(0, 4).map((item, i) => {
            const Icon = item.icon;
            return (
              <SectionReveal key={item.title} delay={i * 0.05}>
                <div className="glass h-full rounded-2xl p-5">
                  <Icon className="h-6 w-6 text-blue-600" />
                  <h3 className="mt-3 font-semibold text-zinc-900">{item.title}</h3>
                  <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{item.desc}</p>
                </div>
              </SectionReveal>
            );
          })}
        </div>
      </div>
    </section>
  );
}

export function AboutPreview() {
  return (
    <section className="bg-zinc-50/80 py-16 md:py-20">
      <div className="page-wrap grid items-center gap-10 lg:grid-cols-2">
        <SectionReveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">About us</p>
          <h2 className="section-title">Ranchi&apos;s premium rental startup</h2>
          <p className="section-subtitle mt-4">
            Founded in Ranchi, we&apos;ve completed 20,000+ rides with a mission to make two-wheeler access safe, affordable, and delightful. Meet our team and see how we&apos;re building Jharkhand&apos;s most trusted mobility brand.
          </p>
          <Link href="/about" className="mt-6 inline-block">
            <Button>Read our story</Button>
          </Link>
        </SectionReveal>

        <SectionReveal delay={0.1}>
          <div className="group relative overflow-hidden rounded-[2rem] border border-white/80 bg-slate-950 shadow-2xl shadow-slate-900/20 transition-transform duration-500 hover:-translate-y-2">
            <Image
              src={siteAssets.pagePreviews.about}
              alt="Ranchi bike rental team"
              fill
              className="object-cover transition duration-700 group-hover:scale-105"
              sizes="(max-width: 1024px) 100vw, 540px"
            />
            <div className="absolute inset-0 bg-gradient-to-br from-slate-950/80 via-slate-950/20 to-transparent" />
            <div className="relative z-10 flex min-h-[420px] flex-col justify-between p-8 sm:p-10 text-white">
              <div className="space-y-4">
                <span className="inline-flex rounded-full bg-cyan-500/15 px-4 py-2 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-200">
                  Trusted since 2022
                </span>
                <h3 className="text-4xl font-semibold leading-tight">Local ownership, premium service</h3>
                <p className="max-w-xl text-sm leading-relaxed text-white/75">
                  Designed for Ranchi riders, our fleet combines modern bikes, instant support, and a genuine local experience.
                </p>
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-[1.75rem] bg-white/95 p-5 text-slate-950 shadow-lg shadow-slate-900/10">
                  <p className="text-3xl font-bold">20k+</p>
                  <p className="mt-2 text-sm text-slate-600">Rides completed</p>
                </div>
                <div className="rounded-[1.75rem] bg-white/95 p-5 text-slate-950 shadow-lg shadow-slate-900/10">
                  <p className="text-3xl font-bold">4.9</p>
                  <p className="mt-2 text-sm text-slate-600">Average rider rating</p>
                </div>
              </div>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

export function TestimonialsPreview() {
  const items = testimonials.slice(0, 3);
  return (
    <section className="py-16 md:py-20">
      <div className="page-wrap">
        <SectionReveal className="flex flex-wrap items-end justify-between gap-4">
          <h2 className="section-title">Loved by riders</h2>
          <ViewAll href="/testimonials" label="All reviews" />
        </SectionReveal>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {items.map((t, i) => (
            <SectionReveal key={t.id} delay={i * 0.08}>
              <div className="glass h-full rounded-2xl p-5">
                <div className="flex items-center gap-3">
                  <Image src={t.avatar} alt="" width={40} height={40} className="rounded-full" />
                  <div>
                    <p className="font-semibold text-zinc-900">{t.name}</p>
                    <div className="flex gap-0.5">
                      {Array.from({ length: t.rating }).map((_, j) => (
                        <Star key={j} className="h-3 w-3 fill-amber-400 text-amber-400" />
                      ))}
                    </div>
                  </div>
                </div>
                <p className="mt-4 line-clamp-3 text-sm text-zinc-600">&ldquo;{t.text}&rdquo;</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqPreview() {
  return (
    <section className="bg-zinc-50/80 py-16 md:py-20">
      <div className="page-wrap max-w-3xl">
        <SectionReveal className="text-center">
          <h2 className="section-title">Common questions</h2>
          <ViewAll href="/faq" label="View full FAQ" />
        </SectionReveal>
        <div className="mt-8 space-y-3">
          {allFaqs.slice(0, 4).map((f, i) => (
            <SectionReveal key={f.q} delay={i * 0.05}>
              <div className="glass rounded-xl p-4">
                <p className="font-medium text-zinc-900">{f.q}</p>
                <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{f.a}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactPreview() {
  return (
    <section className="py-16 md:py-20">
      <div className="page-wrap">
        <SectionReveal className="glass gradient-border rounded-3xl p-8 text-center md:p-12">
          <h2 className="section-title">Get in touch</h2>
          <p className="section-subtitle mx-auto">WhatsApp, phone, email, or visit our Ranchi hub.</p>
          <Link href="/contact" className="mt-6 inline-block">
            <Button size="lg">Contact page</Button>
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}

export function BlogPreview() {
  return (
    <section className="py-16 md:py-20">
      <div className="page-wrap text-center">
        <SectionReveal>
          <h2 className="section-title">Riding guides & Ranchi tips</h2>
          <p className="section-subtitle mx-auto">Blog articles for SEO and rider education.</p>
          <Link href="/blog" className="mt-6 inline-block">
            <Button variant="outline">Read the blog</Button>
          </Link>
        </SectionReveal>
      </div>
    </section>
  );
}
