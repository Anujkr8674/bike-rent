"use client";

import Link from "next/link";
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

  const popularBikes = useMemo(() => [
    { name: "Mountain Bike", price: "799", img: siteAssets.impact.front, slug: "adventure", highlight: false },
    { name: "Sports Bike", price: "499", img: siteAssets.impact.helmet, slug: "sports", highlight: true },
    { name: "Scooter", price: "199", img: siteAssets.impact.cleaning, slug: "scooter", highlight: false },
    { name: "Cruiser Bike", price: "899", img: siteAssets.impact.parked, slug: "cruiser", highlight: false }
  ], []);
  const [bikeIndex, setBikeIndex] = useState(0);
  const handlePrev = () => setBikeIndex((prev) => Math.max(0, prev - 1));
  const handleNext = () => setBikeIndex((prev) => Math.min(popularBikes.length - 2, prev + 1));

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
          className="page-wrap relative z-10 flex h-full w-full flex-col justify-start sm:justify-center pt-32 sm:pt-40 lg:pt-44 pb-28 sm:pb-12 overflow-y-auto sm:overflow-visible hide-scrollbar"
        >
          {/* Main Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-col items-start text-left max-w-2xl z-20 mt-10 sm:mt-16"
          >
            {/* Ranchi Badge */}
            <div className="inline-flex items-center gap-2 rounded-full border border-white/15 bg-white/10 px-4 py-1.5 text-xs font-semibold text-white/95 backdrop-blur-2xl shadow-sm shadow-[#FF653F]/10">
              <Star className="h-3.5 w-3.5 fill-[#FF653F] text-[#FF653F]" />
              <span>Ranchi&apos;s #1 <span className="text-[#FF653F]">Premium</span> Bike Rental</span>
            </div>

            {/* Headline */}
            <h1 className="mt-6 text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.02] tracking-tight text-white max-w-2xl">
              Ride the City.
              <br />
              Live the <span className="bg-gradient-to-r from-[#FF653F] to-[#FFA382] bg-clip-text text-transparent">Freedom.</span>
            </h1>

            {/* Subtitle */}
            <p className="mt-4 text-sm sm:text-base text-zinc-300 leading-relaxed max-w-md">
              Premium bikes. Easy rentals. Unmatched journeys.
              <br />
              For students, tourists & everyday explorers.
            </p>

            {/* Stat pills row in dark container */}
            <div className="mt-8 flex flex-nowrap w-full sm:w-auto overflow-x-auto sm:overflow-visible items-center gap-3 sm:gap-6 rounded-2xl bg-black/40 backdrop-blur-md border border-white/10 px-4 py-3 sm:px-6 sm:py-4 pb-3" style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}>
              <style dangerouslySetInnerHTML={{ __html: `::-webkit-scrollbar { display: none; }` }} />
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#FF653F]/20 text-[#FF653F]">
                  <Zap className="h-3 w-3 sm:h-4 sm:w-4 fill-[#FF653F]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white leading-none">10 Min</p>
                  <p className="text-[9px] sm:text-[10px] font-medium text-zinc-400 mt-1">Avg. Pickup</p>
                </div>
              </div>
              <div className="h-6 sm:h-8 w-px bg-white/10 shrink-0" />
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#FF653F]/20 text-[#FF653F]">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4 fill-[#FF653F]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white leading-none">20K+</p>
                  <p className="text-[9px] sm:text-[10px] font-medium text-zinc-400 mt-1">Happy Riders</p>
                </div>
              </div>
              <div className="h-6 sm:h-8 w-px bg-white/10 shrink-0" />
              <div className="flex items-center gap-2 sm:gap-3 shrink-0">
                <div className="flex h-8 w-8 sm:h-10 sm:w-10 items-center justify-center rounded-full bg-[#FF653F]/20 text-[#FF653F]">
                  <Shield className="h-3 w-3 sm:h-4 sm:w-4 fill-[#FF653F]" />
                </div>
                <div>
                  <p className="text-xs sm:text-sm font-bold text-white leading-none">4.9★</p>
                  <p className="text-[9px] sm:text-[10px] font-medium text-zinc-400 mt-1">Rider Rating</p>
                </div>
              </div>
            </div>

            {/* Buttons */}
            <div className="mt-8 hidden sm:flex flex-wrap items-center gap-4">
              <Button
                onClick={() => setIsFormOpen(true)}
                className="bg-gradient-to-r from-[#FF502B] to-[#FF7F39] hover:from-[#e04523] hover:to-[#e87030] text-white shadow-xl shadow-[#FF653F]/25 border-0 rounded-full px-8 py-6 font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center gap-2 h-12"
              >
                Book Instantly
                <ArrowRight className="h-4 w-4" />
              </Button>
              <a href={`https://wa.me/${siteConfig.whatsapp}`} target="_blank" rel="noopener noreferrer">
                <Button
                  variant="outline"
                  className="border-white/10 bg-black/40 hover:bg-black/60 text-white rounded-full px-8 py-6 font-semibold text-sm transition-all duration-300 hover:scale-[1.02] active:scale-95 backdrop-blur-md flex items-center gap-2 h-12"
                >
                  <MessageCircle className="h-5 w-5 text-emerald-400" />
                  WhatsApp Us
                </Button>
              </a>
            </div>

            {/* Avatars & Trust Text */}
            <div className="mt-10 flex items-center gap-4">
              <div className="flex -space-x-3">
                <img src={siteAssets.impact.scooter1} alt="User" className="w-10 h-10 rounded-full border-2 border-[#0A0A0B] object-cover" />
                <img src={siteAssets.impact.bikerider} alt="User" className="w-10 h-10 rounded-full border-2 border-[#0A0A0B] object-cover" />
                <img src={siteAssets.impact.sunset} alt="User" className="w-10 h-10 rounded-full border-2 border-[#0A0A0B] object-cover" />
              </div>
              <p className="text-[11px] leading-tight text-zinc-400 font-medium">
                Join thousands of happy riders<br/>
                who trust <span className="text-[#FF653F]">Nextgen</span> every day.
              </p>
            </div>
          </motion.div>

          {/* Dotted Line & Pin - Floating over the background */}
          <div className="absolute left-[35%] top-[45%] pointer-events-none z-10 w-[350px] hidden lg:block">
            <svg className="w-full h-[150px] overflow-visible" fill="none" viewBox="0 0 350 150">
              <path
                d="M 0 0 C 150 150 250 -50 350 100"
                stroke="#FF653F"
                strokeWidth="2.5"
                strokeDasharray="6 6"
                className="opacity-70"
              />
            </svg>
            <div className="absolute right-0 bottom-[15px] -translate-x-1 flex h-8 w-8 items-center justify-center">
              <MapPin className="h-7 w-7 fill-[#FF653F] text-white drop-shadow-[0_0_15px_rgba(255,101,63,0.8)]" />
            </div>
          </div>

          {/* Choose Your Ride Widget (Bottom Right on Desktop, Normal Flow on Mobile) */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8, ease: [0.22, 1, 0.36, 1] }}
            className="mt-10 sm:mt-0 relative sm:absolute sm:bottom-20 lg:bottom-6 sm:right-4 lg:right-6 z-20 w-full sm:w-[320px] bg-black/40 backdrop-blur-xl border border-white/10 rounded-[2rem] p-5 shadow-2xl"
          >
            <div className="flex justify-between items-center mb-5 border-l-2 border-[#FF653F] pl-3">
              <h4 className="font-display font-semibold text-white">Choose Your Ride</h4>
              <div className="flex gap-2">
                <button 
                  onClick={handlePrev}
                  disabled={bikeIndex === 0}
                  className="h-7 w-7 rounded-full border border-white/20 flex justify-center items-center text-white/50 hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="h-3 w-3 rotate-180" />
                </button>
                <button 
                  onClick={handleNext}
                  disabled={bikeIndex >= popularBikes.length - 2}
                  className="h-7 w-7 rounded-full border border-white/20 flex justify-center items-center text-white/50 hover:text-white hover:bg-white/10 transition disabled:opacity-30 disabled:cursor-not-allowed"
                >
                  <ArrowRight className="h-3 w-3" />
                </button>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-3">
              {popularBikes.slice(bikeIndex, bikeIndex + 2).map((bike) => (
                <Link key={bike.slug} href={`/bikes?category=${bike.slug}`} className="block h-full">
                  <div className={`group ${bike.highlight ? 'bg-gradient-to-b from-[#FF653F]/10 to-transparent border border-[#FF653F]/50 shadow-[0_0_20px_rgba(255,101,63,0.15)] relative overflow-hidden' : 'bg-white/5 hover:bg-white/10 border border-white/10'} rounded-2xl p-4 flex flex-col items-center transition-all cursor-pointer h-full`}>
                    {bike.highlight && <div className="absolute inset-0 bg-[#FF653F]/5 opacity-0 group-hover:opacity-100 transition-opacity" />}
                    <div className="h-16 w-full flex items-center justify-center">
                      <img src={bike.img} className={`h-full object-contain ${bike.highlight ? 'scale-110 group-hover:scale-125' : 'group-hover:scale-110'} transition-transform`} alt={bike.name} />
                    </div>
                    <div className="text-center mt-3 relative z-10">
                      <p className="text-[11px] font-bold text-white">{bike.name}</p>
                      <p className={`text-[9px] font-medium mt-0.5 ${bike.highlight ? 'text-[#FF653F] font-bold' : 'text-zinc-400'}`}>From ₹{bike.price} / day</p>
                    </div>
                  </div>
                </Link>
              ))}
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
              className="absolute bottom-4 left-0 right-0 z-20 flex sm:hidden flex-nowrap overflow-x-auto w-full px-4 gap-2.5 pb-2"
              style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
            >
              <Button
                onClick={() => setIsFormOpen(true)}
                size="sm"
                className="bg-[#FF653F] hover:bg-[#e05432] text-white shadow-lg shadow-[#FF653F]/30 border-0 shrink-0"
              >
                <Calendar className="h-4 w-4 mr-1" />
                Book Instantly
              </Button>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="shrink-0"
              >
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-white hover:text-white hover:border-white/30 backdrop-blur-md shadow-md w-full"
                >
                  <MessageCircle className="h-4 w-4 text-emerald-400 mr-1" />
                  WhatsApp
                </Button>
              </a>
              <a href={`tel:${siteConfig.phone}`} className="shrink-0">
                <Button
                  variant="outline"
                  size="sm"
                  className="border-white/15 bg-white/[0.06] hover:bg-white/[0.12] text-white hover:text-white hover:border-white/30 backdrop-blur-md shadow-md w-full"
                >
                  <Phone className="h-4 w-4 text-blue-400 mr-1" />
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

