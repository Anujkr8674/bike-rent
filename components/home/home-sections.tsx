"use client";

import Link from "next/link";
import { motion, useInView } from "framer-motion";
import { useRef, useEffect, useState } from "react";
import {
  Award,
  Clock,
  Download,
  Mail,
  MapPin,
  Phone,
  Shield,
  Sparkles,
  Users,
} from "lucide-react";
import { useCatalogBikes } from "@/components/bikes/use-catalog-bikes";
import { coveredCities } from "@/lib/constants";
import { BikeCard } from "@/components/bikes/bike-card";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/content/site";

function AnimatedCounter({ value, suffix = "" }: { value: number; suffix?: string }) {
  const ref = useRef<HTMLSpanElement>(null);
  const inView = useInView(ref, { once: true });
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const step = Math.ceil(value / 40);
    const t = setInterval(() => {
      start += step;
      if (start >= value) {
        setCount(value);
        clearInterval(t);
      } else setCount(start);
    }, 30);
    return () => clearInterval(t);
  }, [inView, value]);

  return (
    <span ref={ref} className="font-display text-4xl font-bold text-zinc-900 md:text-5xl">
      {count.toLocaleString()}
      {suffix}
    </span>
  );
}

const testimonials = [
  { name: "Rahul K.", text: "Booked Pulsar for college commute — pickup was super fast in Morabadi.", rating: 5 },
  { name: "Priya S.", text: "Clean bikes, transparent pricing. Best rental experience in Ranchi.", rating: 5 },
  { name: "Amit T.", text: "Weekend trip to Netarhat with Classic 350 — flawless service.", rating: 5 },
];

const faqs = [
  { q: "Do you offer hourly rentals?", a: "Yes — choose hourly or daily plans at booking." },
  { q: "What documents are required?", a: "Valid driving license and government ID are mandatory." },
  { q: "Is fuel included?", a: "Fuel is not included; bikes are provided with a standard fuel level." },
  { q: "Which areas do you serve?", a: "We currently operate across Ranchi and nearby zones in Jharkhand." },
];

export function TrendingBikes({
  days = 1,
  pickup = "",
  drop = "",
}: {
  days?: number;
  pickup?: string;
  drop?: string;
}) {
  const bikes = useCatalogBikes(6);
  return (
    <section className="bg-zinc-50/80 py-20 md:py-10">
      <div className="page-wrap">
        <SectionReveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-violet-600">Trending now</p>
          <h2 className="section-title mt-2">Hot rides this week</h2>
        </SectionReveal>
        <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {bikes.map((bike, i) => (
            <BikeCard key={bike.id} bike={bike} days={days} pickup={pickup} drop={drop} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

export function WhyChooseUs() {
  const items = [
    { icon: Shield, title: "Verified fleet", desc: "Sanitized, serviced, and road-ready before every handover." },
    { icon: Clock, title: "10-min pickup", desc: "Fast key delivery across major Ranchi pickup points." },
    { icon: Sparkles, title: "Youth pricing", desc: "Student-friendly hourly and daily rates with no hidden fees." },
    { icon: Award, title: "Premium support", desc: "24×7 Ranchi-based support for bookings and roadside help." },
  ];
  return (
    <section className="py-20 md:py-28">
      <div className="page-wrap">
        <SectionReveal className="text-center">
          <h2 className="section-title">Why choose Nextgen</h2>
          <p className="section-subtitle mx-auto">Built like a funded mobility startup — not a basic rental counter.</p>
        </SectionReveal>
        <div className="mt-14 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {items.map(({ icon: Icon, title, desc }, i) => (
            <SectionReveal key={title} delay={i * 0.08}>
              <motion.div whileHover={{ y: -6 }} className="glass card-lift rounded-2xl p-6 text-center">
                <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-blue-500/10 to-violet-500/10">
                  <Icon className="h-7 w-7 text-blue-600" />
                </div>
                <h3 className="font-semibold text-zinc-900">{title}</h3>
                <p className="mt-2 text-sm text-zinc-500">{desc}</p>
              </motion.div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function AboutUs() {
  return (
    <section id="about" className="py-20 md:py-28">
      <div className="page-wrap grid items-center gap-12 lg:grid-cols-2">
        <SectionReveal>
          <p className="text-sm font-semibold uppercase tracking-widest text-cyan-600">About us</p>
          <h2 className="section-title mt-2">Ranchi&apos;s premium bike rental platform</h2>
          <p className="section-subtitle">
            Nextgen Bike Rent Service is built for Jharkhand&apos;s youth — college students, tourists, and daily commuters who want a luxury digital booking experience with real bikes and real support.
          </p>
          <Link href="/bikes" className="mt-6 inline-block">
            <Button>View our fleet</Button>
          </Link>
        </SectionReveal>
        <SectionReveal delay={0.15}>
          <div className="gradient-border rounded-3xl p-1">
            <div className="rounded-[calc(1.5rem-1px)] bg-gradient-to-br from-blue-50 to-violet-50 p-8 md:p-10">
              <Users className="h-10 w-10 text-indigo-600" />
              <p className="mt-4 text-3xl font-bold text-zinc-900">20,000+</p>
              <p className="text-zinc-600">Happy rides completed across Ranchi</p>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}

export function Testimonials() {
  return (
    <section className="bg-zinc-50/80 py-20 md:py-28">
      <div className="page-wrap">
        <SectionReveal className="text-center">
          <h2 className="section-title">Loved by riders</h2>
        </SectionReveal>
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((t, i) => (
            <SectionReveal key={t.name} delay={i * 0.1}>
              <div className="glass h-full rounded-2xl p-6">
                <p className="text-amber-400">{"★".repeat(t.rating)}</p>
                <p className="mt-4 text-zinc-600">&ldquo;{t.text}&rdquo;</p>
                <p className="mt-4 font-semibold text-zinc-900">{t.name}</p>
              </div>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function StatsSection() {
  return (
    <section className="py-20 md:py-28">
      <div className="page-wrap">
        <div className="gradient-border rounded-3xl bg-white p-10 md:p-14">
          <div className="grid gap-10 text-center sm:grid-cols-3">
            <div>
              <AnimatedCounter value={20000} suffix="+" />
              <p className="mt-2 text-sm font-medium text-zinc-500">Total bookings</p>
            </div>
            <div>
              <p className="font-display text-4xl font-bold text-zinc-900 md:text-5xl">4.9</p>
              <p className="mt-2 text-sm font-medium text-zinc-500">Avg rider rating</p>
            </div>
            <div>
              <AnimatedCounter value={15} suffix=" min" />
              <p className="mt-2 text-sm font-medium text-zinc-500">Avg pickup time</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export function CityCoverage() {
  return (
    <section className="py-20 md:py-28">
      <div className="page-wrap text-center">
        <SectionReveal>
          <MapPin className="mx-auto h-8 w-8 text-blue-600" />
          <h2 className="section-title mt-4">Serving Ranchi & nearby</h2>
          <p className="section-subtitle mx-auto">Jharkhand-focused service — expanding carefully, not nationwide.</p>
        </SectionReveal>
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {coveredCities.map((city) => (
            <span key={city} className="chip chip-active">
              {city}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

export function FaqSection() {
  return (
    <section id="faq" className="bg-zinc-50/80 py-20 md:py-28">
      <div className="page-wrap max-w-3xl">
        <SectionReveal className="text-center">
          <h2 className="section-title">FAQ</h2>
        </SectionReveal>
        <div className="mt-10 space-y-4">
          {faqs.map((f, i) => (
            <SectionReveal key={f.q} delay={i * 0.05}>
              <details className="group glass rounded-2xl p-5 open:shadow-md">
                <summary className="cursor-pointer list-none font-semibold text-zinc-900 marker:hidden">
                  {f.q}
                </summary>
                <p className="mt-3 text-sm text-zinc-600">{f.a}</p>
              </details>
            </SectionReveal>
          ))}
        </div>
      </div>
    </section>
  );
}

export function ContactSection() {
  return (
    <section id="contact" className="py-20 md:py-28">
      <div className="page-wrap">
        <SectionReveal className="text-center">
          <h2 className="section-title">Contact us</h2>
          <p className="section-subtitle mx-auto">Ranchi support team — we reply within minutes.</p>
        </SectionReveal>
        <div className="mx-auto mt-10 grid max-w-2xl gap-4 sm:grid-cols-2">
          <a href="mailto:ranchi@nextgenbike.in" className="glass flex items-center gap-3 rounded-2xl p-5 transition hover:shadow-lg">
            <Mail className="h-5 w-5 text-blue-600" />
            <span className="text-sm font-medium text-zinc-700">ranchi@nextgenbike.in</span>
          </a>
          <a href={`tel:${siteConfig.phone}`} className="glass flex items-center gap-3 rounded-2xl p-5 transition hover:shadow-lg">
            <Phone className="h-5 w-5 text-violet-600" />
            <span className="text-sm font-medium text-zinc-700">{siteConfig.phone}</span>
          </a>
        </div>
      </div>
    </section>
  );
}

export function AppCta() {
  return (
    <section className="py-20 md:py-28">
      <div className="page-wrap">
        <SectionReveal>
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-blue-600 via-indigo-600 to-violet-600 px-8 py-14 text-center text-white md:px-16">
            <div className="absolute inset-0 mesh-bg opacity-30" />
            <div className="relative z-10">
              <Download className="mx-auto h-10 w-10" />
              <h2 className="font-display mt-4 text-3xl font-bold md:text-4xl">Get the app experience</h2>
              <p className="mx-auto mt-3 max-w-lg text-blue-100">Mobile-first booking coming soon. Until then, enjoy app-grade UX on web.</p>
              <Button variant="glass" size="lg" className="mt-8 border-white/30 bg-white text-indigo-700 hover:bg-white/95">
                Notify me at launch
              </Button>
            </div>
          </div>
        </SectionReveal>
      </div>
    </section>
  );
}
