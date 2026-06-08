"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { siteAssets } from "@/lib/site-assets";

export function ServicesSection() {
  const dailyFeatures = [
    { title: "FLEXIBLE", desc: "Choose your preferred pickup and drop-off" },
    { title: "PRICING", desc: "Pay only for hours used" },
    { title: "PACKAGES", desc: "Lower rates for 7+, 15+, or 30+ days" },
    { title: "PRICING INCLUSIONS", desc: "24/7 Roadside Assistance" },
  ];

  const subscriptionFeatures = [
    { title: "DURATION", desc: "Rent for 3, 6, 9, or 12 months" },
    { title: "EASY PAYMENTS", desc: "Pay monthly as you go" },
    { title: "PRICING INCLUSIONS", desc: "Maintenance, 1 Helmet, & 24/7 Roadside Assistance" },
    { title: "CONVENIENT", desc: "Doorstep delivery" },
  ];

  return (
    <section
      aria-labelledby="services-heading"
      className="relative overflow-hidden py-20 md:py-10"
    >
      {/* Subtle Background Glows */}
      <div
        className="pointer-events-none absolute -left-40 top-1/4 h-[28rem] w-[28rem] rounded-full bg-[#FF6B1A]/10 blur-3xl"
        aria-hidden
      />
      <div
        className="pointer-events-none absolute -right-40 bottom-1/4 h-[28rem] w-[28rem] rounded-full bg-[#FF6B1A]/10 blur-3xl"
        aria-hidden
      />

      <div className="page-wrap relative z-10 max-w-7xl mx-auto px-6 sm:px-12 lg:px-8 text-center sm:text-left">

        {/* Title Section (Services we Offer) */}
        <div className="text-center mb-16 md:mb-20">
          <motion.h2
            id="services-heading"
            initial={{ opacity: 0, y: -20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="section-title text-white"
            
          >
            Services{" "}
            <span className="relative inline-block font-bold">
              we Offer
              <span className="absolute bottom-[-6px] left-0 right-0 h-[3.5px] bg-[#FF6B1A] rounded-full shadow-[0_0_10px_rgba(255,107,26,0.8)]" />
            </span>
          </motion.h2>
        </div>

        {/* 3-Column Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-16 lg:gap-8 items-center overflow-visible">

          {/* Column 1: Daily Rentals */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-2 lg:order-1 flex flex-col space-y-8 text-center lg:text-left items-center lg:items-start bg-[#0A0A0A]/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-[#FF6B1A]/20 shadow-[0_0_40px_rgba(255,107,26,0.08)]"
          >
            <div>
               <h3 className="section-title mt-2 text-white text-2xl sm:text-3xl">
                DAILY RENTALS
              </h3>
            </div>

            <div className="space-y-6 flex flex-col items-center lg:items-start">
              {dailyFeatures.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center lg:items-start">
                  <h4 className="text-sm font-bold tracking-wider text-white">
                    {feature.title}
                  </h4>
                  <p className="mt-1 text-[0.88rem] leading-relaxed text-zinc-400 max-w-[320px] lg:max-w-none">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-center lg:justify-start">
              <Link href="/bikes">
                <button className="bg-[#FF6B1A] text-white hover:bg-[#FF8A3D] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-extrabold rounded-lg px-10 py-4 text-xs sm:text-sm tracking-wider shadow-[0_0_20px_rgba(255,107,26,0.4)] uppercase">
                  RENT NOW
                </button>
              </Link>
            </div>
          </motion.div>

          {/* Column 2: Center Visual Graphic (Offset Solid Orange Semi-Circles with Popping Vehicles) */}
          <div className="order-1 lg:order-2 w-full flex justify-center py-6 sm:py-12 lg:py-0 overflow-visible">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, type: "spring", bounce: 0.2 }}
              className="relative w-full max-w-[300px] sm:max-w-[420px] h-[300px] sm:h-[440px] flex items-center justify-center overflow-visible"
            >

              {/* Large connecting circle in the background */}
              <div className="absolute w-[240px] sm:w-[380px] h-[240px] sm:h-[380px] rounded-full bg-[#FF6B1A]/5 border border-[#FF6B1A]/10 shadow-[0_0_50px_rgba(255,107,26,0.15)] z-0 pointer-events-none" />

              {/* Left Side (Motorcycle + Solid Orange Semi-Circle) - Shifted UP */}
              <div className="absolute left-[16%] sm:left-[10%] w-[90px] sm:w-[150px] h-full flex items-center justify-center overflow-visible">
                <motion.div
                  whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                  className="relative w-full h-[150px] sm:h-[260px] flex items-center justify-end cursor-pointer group overflow-visible"
                >
                  {/* Solid Left Semi-Circle (Solid Orange) */}
                  <div className="absolute right-0 w-[55px] sm:w-[90px] h-[110px] sm:h-[180px] rounded-l-full bg-[#FF6B1A] shadow-[0_0_30px_rgba(255,107,26,0.4)] group-hover:shadow-[0_0_50px_rgba(255,107,26,0.6)] transition-all duration-300 z-10 transform -translate-y-3 sm:-translate-y-6" />

                  {/* Invisible Hit Box for Left Scooter */}
                  <div className="absolute left-[-80px] sm:left-[-120px] right-[10px] sm:right-[30px] top-[-30px] bottom-[-30px] z-30" />

                  {/* Motorcycle Image (Massive and Popping Out + Infinite Floating Animation) */}
                  <motion.img
                    src={siteAssets.service.scooter}
                    alt="Monthly Subscription Scooter"
                    animate={{
                      y: [-20, -28, -20],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                    className="absolute right-[-25px] sm:right-[-60px] w-[180px] sm:w-[320px] max-w-none h-auto object-contain select-none filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] z-20 group-hover:translate-x-[-6px] transition-all duration-300 pointer-events-none"
                  />
                </motion.div>
              </div>

              {/* Right Side (Scooter + Solid Orange Semi-Circle) - Shifted DOWN */}
              <div className="absolute right-[16%] sm:right-[10%] w-[90px] sm:w-[150px] h-full flex items-center justify-center overflow-visible">
                <motion.div
                  whileHover={{ scale: 1.04, transition: { duration: 0.2 } }}
                  className="relative w-full h-[150px] sm:h-[260px] flex items-center justify-start cursor-pointer group overflow-visible"
                >
                  {/* Solid Right Semi-Circle (Solid Orange) */}
                  <div className="absolute left-0 w-[55px] sm:w-[90px] h-[110px] sm:h-[180px] rounded-r-full bg-[#FF6B1A] shadow-[0_0_30px_rgba(255,107,26,0.4)] group-hover:shadow-[0_0_50px_rgba(255,107,26,0.6)] transition-all duration-300 z-10 transform translate-y-3 sm:translate-y-6" />

                  {/* Invisible Hit Box for Right Bullet */}
                  <div className="absolute left-[10px] sm:left-[30px] right-[-80px] sm:right-[-120px] top-[-30px] bottom-[-30px] z-30" />

                  {/* Scooter Image (Massive and Popping Out + Infinite Floating Animation) */}
                  <motion.img
                    src={siteAssets.service.bullet}
                    alt="Daily Rental Motorcycle"

                    animate={{
                      y: [20, 28, 20],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 0.5,
                    }}
                    className="absolute left-[-25px] sm:left-[-60px] w-[180px] sm:w-[320px] max-w-none h-auto object-contain select-none filter drop-shadow-[0_12px_24px_rgba(0,0,0,0.18)] z-20 group-hover:translate-x-[6px] transition-all duration-300 pointer-events-none"
                  />
                </motion.div>
              </div>

            </motion.div>
          </div>

          {/* Column 3: Monthly Subscription */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="order-3 lg:order-3 flex flex-col space-y-8 text-center lg:text-right items-center lg:items-end bg-[#0A0A0A]/80 backdrop-blur-md p-8 sm:p-10 rounded-3xl border border-[#FF6B1A]/20 shadow-[0_0_40px_rgba(255,107,26,0.08)]"
          >
            <div>
              <h3 className="section-title mt-2 text-white text-2xl sm:text-3xl">
                RBX MONTHLY SUBSCRIPTION
              </h3>
            </div>

            <div className="space-y-6 flex flex-col items-center lg:items-end">
              {subscriptionFeatures.map((feature) => (
                <div key={feature.title} className="flex flex-col items-center lg:items-end">
                  <h4 className="text-sm font-bold tracking-wider text-white">
                    {feature.title}
                  </h4>
                  <p className="mt-1 text-[0.88rem] leading-relaxed text-zinc-400 max-w-[320px] lg:max-w-none">
                    {feature.desc}
                  </p>
                </div>
              ))}
            </div>

            <div className="pt-4 flex justify-center lg:justify-end">
              <Link href="/book">
                <button className="bg-[#FF6B1A] text-white hover:bg-[#FF8A3D] hover:scale-[1.02] active:scale-[0.98] transition-all duration-300 font-extrabold rounded-lg px-10 py-4 text-xs sm:text-sm tracking-wider shadow-[0_0_20px_rgba(255,107,26,0.4)] uppercase">
                  SUBSCRIBE NOW
                </button>
              </Link>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}
