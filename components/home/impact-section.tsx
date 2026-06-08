"use client";

import { motion } from "framer-motion";
import { SectionReveal } from "@/components/ui/section-reveal";
import { siteAssets } from "@/lib/site-assets";

export function ImpactSection() {
  const images = siteAssets.impact;

  return (
    <section className="relative overflow-hidden py-20 md:py-28">
      <div
        className="pointer-events-none absolute -left-40 top-1/3 h-[30rem] w-[30rem] rounded-full bg-[#FF6B1A]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-1/3 h-[30rem] w-[30rem] rounded-full bg-[#FF6B1A]/10 blur-3xl"
        aria-hidden
      />

      <div className="page-wrap relative z-10 max-w-7xl px-4 sm:px-6 lg:px-8">
        <SectionReveal className="mb-16 text-center md:mb-20">
          <h2 className="section-title text-white">
            Our impact in <span className="font-bold text-[#FF6B1A]">numbers</span>
          </h2>
        </SectionReveal>

        <div className="hidden max-w-6xl grid-cols-5 items-stretch gap-4 overflow-visible md:grid lg:gap-6">
          <motion.div
            whileHover={{ y: -4 }}
            className="relative z-10 flex aspect-square flex-col justify-center rounded-[24px] border border-white/10 bg-[#111111] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          >
            <span className="font-sans text-xs font-black uppercase tracking-widest text-zinc-400">
              REGULARLY SERVICED
            </span>
            <span className="mt-1 font-sans text-4xl font-black text-[#FF6B1A] lg:text-5xl">
              FLEET
            </span>
            <svg
              className="absolute right-[-15px] bottom-[-10px] z-20 h-12 w-12 rotate-[10deg] text-zinc-600 pointer-events-none hidden lg:block"
              viewBox="0 0 43 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 24C12 20 24 10 30.5 3M30.5 3H21.5M30.5 3V12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </motion.div>

          <div className="aspect-square overflow-hidden rounded-[24px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <img src={images.cleaning} alt="Fleet cleaning" className="h-full w-full select-none object-cover" />
          </div>

          <div className="aspect-square overflow-hidden rounded-[24px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <img src={images.helmet} alt="Helmet rider" className="h-full w-full select-none object-cover" />
          </div>

          <div className="aspect-square overflow-hidden rounded-[24px] border-4 border-[#FF6B1A] shadow-[0_0_20px_rgba(255,107,26,0.3)]">
            <img src={images.sunset} alt="Sunset bike ride" className="h-full w-full select-none object-cover" />
          </div>

          <motion.div
            whileHover={{ y: -4 }}
            className="flex aspect-square flex-col justify-center rounded-[24px] border border-white/10 bg-[#111111] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          >
            <span className="font-sans text-4xl font-black text-white lg:text-5xl">100+</span>
            <span className="mt-2 font-sans text-xs font-black uppercase tracking-widest text-zinc-400">
              BIKES ON ROAD
            </span>
          </motion.div>

          <div className="aspect-square overflow-hidden rounded-[24px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <img src={images.scooter1} alt="Scooter rider" className="h-full w-full select-none object-cover" />
          </div>

          <div className="aspect-square overflow-hidden rounded-[24px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <img src={images.bikerider} alt="Motorcycle commuter" className="h-full w-full select-none object-cover" />
          </div>

          <motion.div
            whileHover={{ y: -4 }}
            className="flex aspect-square flex-col items-center justify-center rounded-[24px] border border-white/10 bg-[#111111] p-4 text-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          >
            <div className="relative flex h-16 w-16 items-center justify-center rounded-full border-4 border-[#FF6B1A] font-black text-3xl text-white lg:h-20 lg:w-20 lg:text-4xl shadow-[0_0_15px_rgba(255,107,26,0.3)]">
              10
            </div>
            <span className="mt-2 font-sans text-[0.68rem] font-black uppercase tracking-wider text-zinc-300 lg:text-[0.75rem]">
              YEARS OF EXCELLENCE
            </span>
          </motion.div>

          <div className="relative z-10 aspect-square overflow-hidden rounded-[24px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <img src={images.twins} alt="Adventure touring twins" className="h-full w-full select-none object-cover" />
            <svg
              className="absolute left-[-20px] bottom-[-20px] z-20 h-14 w-14 rotate-[-10deg] text-zinc-600 pointer-events-none hidden lg:block"
              viewBox="0 0 43 27"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <path
                d="M3 3C12 7 24 17 30.5 24M30.5 24V15M30.5 24H21.5"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </div>

          <div className="aspect-square overflow-hidden rounded-[24px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <img src={images.highway} alt="Highway cruising" className="h-full w-full select-none object-cover" />
          </div>

          <motion.div
            whileHover={{ y: -4 }}
            className="flex aspect-square flex-col justify-center rounded-[24px] border border-white/10 bg-[#111111] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          >
            <span className="font-sans text-xs font-black uppercase tracking-widest text-zinc-400">
              SPREAD ACROSS
            </span>
            <span className="mt-1 font-sans text-3xl font-black text-white lg:text-4xl">
              20+ CITIES
            </span>
          </motion.div>

          <div className="aspect-square overflow-hidden rounded-[24px] border-4 border-[#FF6B1A] shadow-[0_0_20px_rgba(255,107,26,0.3)]">
            <img src={images.parked} alt="Clean rental fleet parked" className="h-full w-full select-none object-cover" />
          </div>

          <div className="aspect-square overflow-hidden rounded-[24px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <img src={images.front} alt="Motorcycle showroom line" className="h-full w-full select-none object-cover" />
          </div>

          <div className="aspect-square overflow-hidden rounded-[24px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
            <img src={images.scooter2} alt="City scooter rider" className="h-full w-full select-none object-cover" />
          </div>

          <motion.div
            whileHover={{ y: -4 }}
            className="flex aspect-square flex-col justify-center rounded-[24px] border border-white/10 bg-[#111111] p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)]"
          >
            <span className="font-sans text-4xl font-black text-[#FF6B1A] lg:text-5xl">1.8M+</span>
            <span className="mt-2 font-sans text-xs font-black uppercase tracking-widest text-zinc-400">
              HAPPY USERS
            </span>
          </motion.div>
        </div>

        <div className="mx-auto flex w-full max-w-[340px] flex-col space-y-6 md:hidden sm:max-w-[400px]">
          <div className="flex w-full items-start justify-between px-1">
            <div className="flex flex-col">
              <span className="text-[0.62rem] font-extrabold uppercase tracking-widest text-zinc-400">
                REGULARLY SERVICED
              </span>
              <span className="text-2xl font-black text-[#FF6B1A]">FLEET</span>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="text-2xl font-black text-white">6000+</span>
              <span className="mt-0.5 text-[0.62rem] font-extrabold uppercase tracking-widest text-zinc-400">
                BIKES ON ROAD
              </span>
            </div>
          </div>

          <div className="grid w-full grid-cols-3 items-stretch gap-3">
            <div className="aspect-square overflow-hidden rounded-[16px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <img src={images.cleaning} alt="Cleaning" className="h-full w-full object-cover" />
            </div>
            <div className="aspect-square overflow-hidden rounded-[16px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <img src={images.helmet} alt="Rider" className="h-full w-full object-cover" />
            </div>
            <div className="aspect-square overflow-hidden rounded-[16px] border-2 border-[#FF6B1A] shadow-[0_0_15px_rgba(255,107,26,0.3)]">
              <img src={images.sunset} alt="Sunset" className="h-full w-full object-cover" />
            </div>

            <div className="aspect-square overflow-hidden rounded-[16px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <img src={images.scooter1} alt="Scooter" className="h-full w-full object-cover" />
            </div>
            <div className="flex aspect-square flex-col items-center justify-center rounded-[16px] border border-white/10 bg-[#111111] p-2 text-center shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <div className="flex h-10 w-10 items-center justify-center rounded-full border-2 border-[#FF6B1A] text-md font-black text-white shadow-[0_0_10px_rgba(255,107,26,0.3)]">
                10
              </div>
              <span className="mt-1 text-[0.45rem] font-black uppercase tracking-wider leading-none text-zinc-300 sm:text-[0.52rem]">
                YEARS OF EXCELLENCE
              </span>
            </div>
            <div className="aspect-square overflow-hidden rounded-[16px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <img src={images.twins} alt="Twins" className="h-full w-full object-cover" />
            </div>

            <div className="aspect-square overflow-hidden rounded-[16px] border-2 border-[#FF6B1A] shadow-[0_0_15px_rgba(255,107,26,0.3)]">
              <img src={images.parked} alt="Parked" className="h-full w-full object-cover" />
            </div>
            <div className="aspect-square overflow-hidden rounded-[16px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <img src={images.front} alt="Fleet" className="h-full w-full object-cover" />
            </div>
            <div className="aspect-square overflow-hidden rounded-[16px] border border-white/10 shadow-[0_4px_20px_rgba(0,0,0,0.5)]">
              <img src={images.scooter2} alt="Scooter" className="h-full w-full object-cover" />
            </div>
          </div>

          <div className="flex w-full items-start justify-between px-1 pt-1">
            <div className="flex flex-col">
              <span className="text-[0.62rem] font-extrabold uppercase tracking-widest text-zinc-400">
                SPREAD ACROSS
              </span>
              <span className="mt-0.5 text-xl font-black text-white">20+ CITIES</span>
            </div>

            <div className="flex flex-col items-end text-right">
              <span className="text-2xl font-black text-[#FF6B1A]">1.8M+</span>
              <span className="mt-0.5 text-[0.62rem] font-extrabold uppercase tracking-widest text-zinc-400">
                HAPPY USERS
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
