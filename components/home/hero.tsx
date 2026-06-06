"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  MapPin, Sparkles, X, Calendar, Phone, MessageCircle,
  Star, Zap, Users, ArrowRight, Shield, Gift,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingSearchBar } from "@/components/home/booking-search-bar";
import { siteAssets } from "@/lib/site-assets";
import { siteConfig } from "@/lib/content/site";

/* ─── Particle config ─── */
const particles = [
  { size: 6, top: "15%", left: "10%", driftX: "100px", driftY: "-80px", duration: "12s", delay: "0s" },
  { size: 4, top: "25%", left: "85%", driftX: "-60px", driftY: "-100px", duration: "15s", delay: "-3s" },
  { size: 8, top: "70%", left: "20%", driftX: "120px", driftY: "-60px", duration: "18s", delay: "-6s" },
  { size: 5, top: "60%", left: "75%", driftX: "-90px", driftY: "-130px", duration: "14s", delay: "-2s" },
  { size: 3, top: "80%", left: "50%", driftX: "70px", driftY: "-90px", duration: "16s", delay: "-8s" },
  { size: 7, top: "40%", left: "5%", driftX: "110px", driftY: "-70px", duration: "13s", delay: "-5s" },
  { size: 4, top: "35%", left: "92%", driftX: "-80px", driftY: "-110px", duration: "17s", delay: "-1s" },
  { size: 5, top: "10%", left: "45%", driftX: "50px", driftY: "-140px", duration: "19s", delay: "-9s" },
];

/* ─── Component ─── */
export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const heroContainerRef = useRef<HTMLDivElement>(null);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });

  /* ─── Scroll detection ─── */
  useEffect(() => {
    const handleScroll = () => setHasScrolled(window.scrollY > 30);
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  /* ─── Mouse tracking for radial glow ─── */
  useEffect(() => {
    const el = heroContainerRef.current;
    if (!el) return;
    const onMove = (e: MouseEvent) => {
      const rect = el.getBoundingClientRect();
      setMousePos({
        x: ((e.clientX - rect.left) / rect.width) * 100,
        y: ((e.clientY - rect.top) / rect.height) * 100,
      });
    };
    el.addEventListener("mousemove", onMove, { passive: true });
    return () => el.removeEventListener("mousemove", onMove);
  }, []);

  const showForm = isFormOpen;

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const contentY = useTransform(scrollYProgress, [0, 1], [0, 80]);

  /* ─── Mouse glow style ─── */
  const mouseGlowStyle = useMemo(() => ({
    background: `radial-gradient(600px circle at ${mousePos.x}% ${mousePos.y}%, rgba(255,101,63,0.12) 0%, transparent 60%)`,
  }), [mousePos.x, mousePos.y]);

  return (
    <div
      ref={heroContainerRef}
      className="w-full h-[100dvh] min-h-[640px] bg-[#0A0A0B] py-3 px-0 sm:py-5 sm:px-1 md:py-6 md:px-2 lg:py-7 lg:px-3 flex flex-col justify-stretch overflow-hidden"
    >
      <section
        ref={ref}
        className="hero-fullbleed relative flex-1 w-full overflow-hidden rounded-[24px] sm:rounded-[36px] border border-white/[0.08] shadow-2xl bg-zinc-900"
      >
        {/* ═══ LAYER 1: Background static image ═══ */}
        <div className="absolute inset-0 z-0">
          <div
            className="absolute inset-0 bg-cover bg-center scale-105"
            style={{ backgroundImage: `url(${siteAssets.hero.poster})` }}
            aria-hidden
          />

          {/* Multi-layer gradient overlays */}
          <div className="absolute inset-0 bg-gradient-to-b from-black/75 via-black/40 to-black/90" />
          <div className="absolute inset-0 bg-gradient-to-r from-black/35 via-transparent to-black/40" />
          <div className="absolute inset-0 bg-gradient-to-t from-[#FF653F]/[0.12] via-transparent to-transparent" />
          <div className="absolute right-0 top-8 h-[28rem] w-[28rem] rounded-full bg-[#FF653F]/12 blur-3xl opacity-90" />

          {/* Mouse-tracking radial glow */}
          <div
            className="absolute inset-0 transition-[background] duration-300 ease-out"
            style={mouseGlowStyle}
          />

          {/* Film grain texture */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="hero-grain-overlay" />
          </div>

          {/* Floating particles */}
          {particles.map((p, i) => (
            <div
              key={i}
              className="hero-particle"
              style={{
                width: p.size,
                height: p.size,
                top: p.top,
                left: p.left,
                "--drift-x": p.driftX,
                "--drift-y": p.driftY,
                animationDuration: p.duration,
                animationDelay: p.delay,
              } as React.CSSProperties}
            />
          ))}
        </div>

        {/* ═══ LAYER 2: Main content ═══ */}
        <motion.div
          style={{ opacity, y: contentY }}
          className="page-wrap relative z-10 flex h-full min-h-0 flex-col pt-20 pb-4 sm:pt-24 sm:pb-6"
        >
          {/* Top content grid (split left/right) */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center flex-1 min-h-0">
            {/* Left Column: Text & CTAs & Stats */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
              className="lg:col-span-7 flex flex-col items-start text-left z-10"
            >
              {/* Ranchi Badge */}
              <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/95 backdrop-blur-2xl shadow-sm shadow-[#FF653F]/10">
                <Star className="h-3.5 w-3.5 fill-[#FF653F] text-[#FF653F]" />
                <span>Ranchi&apos;s #1 <span className="text-[#FF653F]">Premium</span> Bike Rental</span>
              </div>

              {/* Headline */}
              <h1 className="font-display mt-6 text-4xl sm:text-3xl lg:text-[3.2rem] font-black leading-[1.02] tracking-tight text-white max-w-2xl">
                Explore India.
                <br />
                The <span className="bg-gradient-to-r from-[#FF653F] to-[#FFA382] bg-clip-text text-transparent">Nextgen</span> Way.
              </h1>

              {/* Subtitle */}
              <p className="mt-4 text-base sm:text-lg text-zinc-300 leading-relaxed max-w-xl">
                Premium bikes. Easy rentals. Unmatched journeys.
                <br />
                For students, tourists & everyday explorers.
              </p>

              {/* Buttons */}
              <div className="mt-10 flex flex-wrap items-center gap-4 w-full">
                <Button
                  onClick={() => setIsFormOpen(true)}
                  size="lg"
                  className="bg-gradient-to-r from-[#FF502B] to-[#FF7F39] hover:from-[#e04523] hover:to-[#e87030] text-white shadow-xl shadow-[#FF653F]/25 border-0 rounded-full px-10 py-5 font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2"
                >
                  Book Instantly
                  <ArrowRight className="h-4.5 w-4.5" />
                </Button>

                <a
                  href={`https://wa.me/${siteConfig.whatsapp}`}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-white/10 bg-black/25 hover:bg-black/40 text-white rounded-full px-10 py-5 font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 backdrop-blur-md flex items-center gap-3"
                  >
                    <MessageCircle className="h-5 w-5 text-emerald-400 fill-emerald-400/10" />
                    Chat on WhatsApp
                  </Button>
                </a>
              </div>

              {/* Stat pills row */}
              <div className="mt-10 flex flex-wrap items-center gap-6">
                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF653F]/10 border border-[#FF653F]/20 text-[#FF653F]">
                    <Zap className="h-5 w-5 fill-[#FF653F]/10" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white leading-none">10 Min</p>
                    <p className="text-xs font-medium text-zinc-400 mt-1">Avg. Pickup</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF653F]/10 border border-[#FF653F]/20 text-[#FF653F]">
                    <Users className="h-5 w-5 fill-[#FF653F]/10" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white leading-none">20K+</p>
                    <p className="text-xs font-medium text-zinc-400 mt-1">Happy Riders</p>
                  </div>
                </div>

                <div className="h-8 w-px bg-white/10 hidden sm:block" />

                <div className="flex items-center gap-3">
                  <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#FF653F]/10 border border-[#FF653F]/20 text-[#FF653F]">
                    <Star className="h-5 w-5 fill-[#FF653F]/10" />
                  </div>
                  <div>
                    <p className="text-base font-bold text-white leading-none">4.9★</p>
                    <p className="text-xs font-medium text-zinc-400 mt-1">Rider Rating</p>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Right Column / Hero Image Preview */}
            <div className="lg:col-span-5 relative hidden items-center justify-end">
              <div className="relative w-full max-w-[520px] h-[540px]">
                <div className="absolute inset-0 rounded-[36px] overflow-hidden border border-white/15 shadow-[0_50px_140px_rgba(0,0,0,0.45)] bg-zinc-950/80">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={siteAssets.hero.poster}
                    alt="Rider on road"
                    className="h-full w-full object-cover object-center"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-black/45" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                </div>

                <div className="absolute inset-0 pointer-events-none z-10">
                  <div className="absolute -right-12 top-8 h-44 w-44 rounded-full bg-[#FF653F]/10 blur-3xl" />
                  <div className="absolute left-8 top-16 h-24 w-24 rounded-full bg-white/5 shadow-[0_0_80px_rgba(255,255,255,0.08)]" />
                  <svg className="w-full h-full overflow-visible" fill="none" viewBox="0 0 520 540">
                    <path
                      d="M 35 435 C 130 330 250 295 368 170"
                      stroke="#FF653F"
                      strokeWidth="3"
                      strokeDasharray="8 8"
                      strokeLinecap="round"
                      className="opacity-80"
                    />
                    <circle cx="368" cy="170" r="7" fill="#FF653F" />
                  </svg>
                </div>

                <div className="absolute right-6 top-6 z-20">
                  <div className="flex items-center gap-2 rounded-3xl border border-white/10 bg-black/60 px-4 py-3 shadow-xl backdrop-blur-xl">
                    <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-[#FF653F]/15 border border-[#FF653F]/25 text-[#FF653F]">
                      <MapPin className="h-4.5 w-4.5 fill-[#FF653F]/10" />
                    </div>
                    <div className="text-left">
                      <p className="text-[10px] uppercase font-semibold tracking-[0.22em] text-zinc-400 leading-none">From Ranchi</p>
                      <p className="text-sm font-bold text-white leading-none">To Anywhere</p>
                    </div>
                  </div>
                </div>

                <motion.div
                  initial={{ opacity: 0, scale: 0.95, y: 14 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  transition={{ delay: 0.6, duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
                  className="absolute left-6 bottom-10 z-20"
                >
                  <div className="flex items-center gap-3 rounded-[30px] border border-white/10 bg-black/55 backdrop-blur-xl px-5 py-3 shadow-2xl">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-[#FF653F]/15 border border-[#FF653F]/25 text-[#FF653F]">
                      <MapPin className="h-5 w-5 fill-[#FF653F]/10" />
                    </div>
                    <div>
                      <p className="text-[10px] font-semibold uppercase tracking-[0.24em] text-zinc-400 leading-none">From Ranchi</p>
                      <p className="text-sm font-bold text-white mt-1">To Anywhere</p>
                    </div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Bottom Footer Widgets Row */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="hidden"
          >
            {/* Widget 1: Popular in Ranchi */}
            <div className="lg:col-span-7 bg-[#0B0B0C]/85 backdrop-blur-xl border border-white/10 rounded-[24px] p-5 flex flex-col justify-between">
              <div>
                <h4 className="font-display font-bold text-white text-base leading-none">Popular in Ranchi</h4>
                <p className="text-xs text-zinc-400 mt-1">Top picks for every kind of rider.</p>
              </div>

              <div className="mt-4 grid grid-cols-2 sm:grid-cols-4 gap-3">
                {/* Mini RE Himalayan */}
                <div className="group/card bg-white/[0.03] border border-white/5 hover:border-[#FF653F]/40 hover:bg-white/[0.05] rounded-xl p-3 flex flex-col items-center justify-between transition-all duration-300 h-28 cursor-pointer">
                  <div className="relative h-12 w-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={siteAssets.impact.front}
                      alt="RE Himalayan"
                      className="h-full object-contain scale-[1.3] transition-transform duration-300 group-hover/card:scale-[1.4]"
                    />
                  </div>
                  <div className="text-center mt-2 w-full">
                    <p className="text-[10px] font-bold text-white truncate">RE Himalayan</p>
                    <p className="text-[9px] font-semibold text-zinc-400 mt-0.5">From ₹799/day</p>
                  </div>
                </div>

                {/* Mini Apache R15 */}
                <div className="group/card bg-white/[0.03] border border-white/5 hover:border-[#FF653F]/40 hover:bg-white/[0.05] rounded-xl p-3 flex flex-col items-center justify-between transition-all duration-300 h-28 cursor-pointer">
                  <div className="relative h-12 w-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={siteAssets.impact.helmet}
                      alt="Apache"
                      className="h-full object-contain scale-[1.3] transition-transform duration-300 group-hover/card:scale-[1.4]"
                    />
                  </div>
                  <div className="text-center mt-2 w-full">
                    <p className="text-[10px] font-bold text-white truncate">Apache RTR 160</p>
                    <p className="text-[9px] font-semibold text-zinc-400 mt-0.5">From ₹599/day</p>
                  </div>
                </div>

                {/* Mini Pulsar */}
                <div className="group/card bg-white/[0.03] border border-white/5 hover:border-[#FF653F]/40 hover:bg-white/[0.05] rounded-xl p-3 flex flex-col items-center justify-between transition-all duration-300 h-28 cursor-pointer">
                  <div className="relative h-12 w-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={siteAssets.impact.scooter2}
                      alt="Pulsar"
                      className="h-full object-contain scale-[1.3] transition-transform duration-300 group-hover/card:scale-[1.4]"
                    />
                  </div>
                  <div className="text-center mt-2 w-full">
                    <p className="text-[10px] font-bold text-white truncate">Pulsar NS200</p>
                    <p className="text-[9px] font-semibold text-zinc-400 mt-0.5">From ₹499/day</p>
                  </div>
                </div>

                {/* Mini RE Bullet */}
                <div className="group/card bg-white/[0.03] border border-white/5 hover:border-[#FF653F]/40 hover:bg-white/[0.05] rounded-xl p-3 flex flex-col items-center justify-between transition-all duration-300 h-28 cursor-pointer">
                  <div className="relative h-12 w-full flex items-center justify-center">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={siteAssets.impact.parked}
                      alt="RE Classic"
                      className="h-full object-contain scale-[1.3] transition-transform duration-300 group-hover/card:scale-[1.4]"
                    />
                  </div>
                  <div className="text-center mt-2 w-full">
                    <p className="text-[10px] font-bold text-white truncate">KTM Duke 250</p>
                    <p className="text-[9px] font-semibold text-zinc-400 mt-0.5">From ₹899/day</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Widget 2: Weekend Getaway */}
            <div className="lg:col-span-5 bg-[#0B0B0C]/85 backdrop-blur-xl border border-white/10 rounded-[24px] p-5 flex items-center justify-between gap-4">
              <div className="flex flex-col justify-between h-full">
                <div>
                  <h4 className="font-display font-bold text-white text-base leading-none">Weekend Getaway?</h4>
                  <p className="text-xs text-zinc-400 mt-1">We&apos;ve got the ride for you.</p>
                </div>

                <div className="flex items-center gap-2.5 mt-3.5 bg-[#FF653F]/10 border border-[#FF653F]/15 rounded-xl p-3">
                  <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-[#FF653F] text-white">
                    <Gift className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <p className="text-xs font-bold text-white leading-none">10% OFF on 2+ days</p>
                    <p className="text-[10px] font-semibold text-zinc-400 mt-1">
                      Use code: <span className="text-[#FF653F] font-bold">NEXTGEN10</span>
                    </p>
                  </div>
                </div>
              </div>

              <div className="relative h-28 w-28 sm:h-28 sm:w-32 shrink-0 overflow-hidden rounded-2xl border border-white/15">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={siteAssets.hero.carouselImages.windingRoad}
                  alt="Winding road landscape"
                  className="h-full w-full object-cover"
                />
              </div>
            </div>
          </motion.div>
        </motion.div>

        {/* ═══ Click-outside backdrop for form ═══ */}
        <AnimatePresence>
          {showForm && (
            <div
              className="fixed inset-0 z-25 bg-transparent"
              onClick={() => setIsFormOpen(false)}
            />
          )}
        </AnimatePresence>

        {/* ═══ Booking form overlay ═══ */}
        <AnimatePresence>
          {showForm && (
            <motion.div
              initial={{ opacity: 0, scale: 0.96, y: 40 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 40 }}
              transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="absolute bottom-0 inset-x-0 z-30 bg-transparent p-6 sm:p-8 flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="w-full max-w-4xl relative pt-6">
                <div className="relative">
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="absolute -top-3 -right-3 text-zinc-600 hover:text-zinc-900 bg-white hover:bg-zinc-50 border border-zinc-200/80 shadow-md p-2 rounded-full transition-all duration-300 z-40 cursor-pointer hover:scale-105 active:scale-95 flex items-center justify-center"
                    aria-label="Close booking form"
                  >
                    <X className="h-4 w-4" />
                  </button>
                  <BookingSearchBar variant="hero" />
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Bottom action bar (mobile + desktop) ═══ */}
        <AnimatePresence>
          {!showForm && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.4 }}
              className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 z-20 flex sm:hidden flex-wrap items-center justify-center gap-2.5 w-full px-4"
            >
              <Button
                onClick={() => setIsFormOpen(true)}
                size="sm"
                className="bg-[#FF653F] hover:bg-[#e05432] text-white shadow-lg shadow-[#FF653F]/30 border-0"
              >
                <Calendar className="h-4 w-4" />
                Book Instantly
              </Button>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-white hover:text-white hover:border-white/30 backdrop-blur-md shadow-md"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400" />
                  WhatsApp
                </Button>
              </a>
              <a href={`tel:${siteConfig.phone}`}>
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-white hover:text-white hover:border-white/30 backdrop-blur-md shadow-md"
                >
                  <Phone className="h-4 w-4 text-blue-400" />
                  Call
                </Button>
              </a>
            </motion.div>
          )}
        </AnimatePresence>

        {/* ═══ Scroll indicator ═══ */}
        <AnimatePresence>
          {!hasScrolled && !showForm && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="absolute bottom-6 sm:bottom-8 right-6 sm:right-12 flex flex-col items-center gap-2 text-white/60 pointer-events-none z-20"
            >
              <span className="text-[10px] uppercase tracking-[0.2em] font-bold">Scroll</span>
              <div className="relative">
                {/* Pulsing glow ring behind the mouse indicator */}
                <div
                  className="absolute -inset-1.5 rounded-full bg-[#FF653F]/20"
                  style={{ animation: "hero-glow-pulse 2.5s ease-in-out infinite" }}
                />
                <motion.div
                  animate={{ y: [0, 6, 0] }}
                  transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
                  className="relative w-5 h-8 border border-white/30 rounded-full flex justify-center p-1 bg-white/[0.04] backdrop-blur-sm"
                >
                  <div className="w-1.5 h-2 bg-[#FF653F] rounded-full shadow-[0_0_6px_rgba(255,101,63,0.6)]" />
                </motion.div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </section>
    </div>
  );
}

