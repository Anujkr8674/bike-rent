"use client";

import { motion, AnimatePresence, useScroll, useTransform } from "framer-motion";
import { useCallback, useEffect, useRef, useState, type RefObject } from "react";
import { MapPin, Sparkles, X, Calendar, Phone, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { BookingSearchBar } from "@/components/home/booking-search-bar";
import { heroVideo } from "@/lib/content/hero-video";
import { siteAssets } from "@/lib/site-assets";
import { siteConfig } from "@/lib/content/site";

const heroSlides = [
  {
    type: "video" as const,
    src: heroVideo.src,
    poster: heroVideo.poster,
  },
  {
    type: "image" as const,
    src: heroVideo.poster,
    alt: "Premium bike background",
  },
  {
    type: "image" as const,
    src: siteAssets.hero.carouselImages.cityRide,
    alt: "City bike ride background",
  },
];

const IMAGE_SLIDE_DURATION_MS = 3000;

export function Hero() {
  const ref = useRef<HTMLElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [currentSlide, setCurrentSlide] = useState(0);
  const [slideDirection, setSlideDirection] = useState(1);
  const [transitioningSlide, setTransitioningSlide] = useState<number | null>(null);
  const [videoReady, setVideoReady] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 30) {
        setHasScrolled(true);
      } else {
        setHasScrolled(false);
      }
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const showForm = isFormOpen;
  const activeSlide = heroSlides[currentSlide];
  const overlaySlide = transitioningSlide !== null ? heroSlides[transitioningSlide] : null;
  const startSlideTransition = useCallback(() => {
    if (transitioningSlide !== null) return;

    setSlideDirection(1);
    setTransitioningSlide((current) => {
      const baseIndex = current ?? currentSlide;
      return (baseIndex + 1) % heroSlides.length;
    });
  }, [currentSlide, transitioningSlide]);

  const completeSlideTransition = useCallback(() => {
    setCurrentSlide((current) => transitioningSlide ?? current);
    setTransitioningSlide(null);
  }, [transitioningSlide]);

  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const opacity = useTransform(scrollYProgress, [0, 0.75], [1, 0]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    if (activeSlide.type === "video") {
      const resetReadyFrame = window.requestAnimationFrame(() => setVideoReady(false));
      void video.load();
      void video.play().catch(() => {});

      return () => window.cancelAnimationFrame(resetReadyFrame);
    } else {
      video.pause();
    }
  }, [activeSlide.type]);

  useEffect(() => {
    const video = videoRef.current;
    if (!video || activeSlide.type !== "video" || transitioningSlide !== null) return;

    const handlePlaying = () => setVideoReady(true);
    const handleError = () => setVideoReady(false);
    const handleEnded = () => {
      startSlideTransition();
    };

    video.addEventListener("playing", handlePlaying);
    video.addEventListener("error", handleError);
    video.addEventListener("ended", handleEnded);

    return () => {
      video.removeEventListener("playing", handlePlaying);
      video.removeEventListener("error", handleError);
      video.removeEventListener("ended", handleEnded);
    };
  }, [activeSlide.type, transitioningSlide, startSlideTransition]);

  useEffect(() => {
    if (activeSlide.type === "video" || transitioningSlide !== null) return;

    const timer = window.setTimeout(() => {
      startSlideTransition();
    }, IMAGE_SLIDE_DURATION_MS);

    return () => window.clearTimeout(timer);
  }, [activeSlide.type, currentSlide, transitioningSlide, startSlideTransition]);

  return (
    <div className="w-full h-[100dvh] min-h-[640px] bg-[#F8F9FA] py-3 px-1.5 sm:py-5 sm:px-3 md:py-6 md:px-4 lg:py-7 lg:px-5 flex flex-col justify-stretch overflow-hidden">
      <section
        ref={ref}
        className="hero-fullbleed relative flex-1 w-full overflow-hidden rounded-[24px] sm:rounded-[36px] border border-zinc-200 shadow-2xl bg-zinc-900"
      >
        <div className="absolute inset-0 z-0">
        <div className="absolute inset-0">{renderSlide(activeSlide, videoRef, videoReady)}</div>

        {overlaySlide && (
          <motion.div
            key={`overlay-${transitioningSlide}`}
            custom={slideDirection}
            variants={slideVariants}
            initial="enter"
            animate="center"
            transition={{ duration: 0.85, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
            onAnimationComplete={completeSlideTransition}
            aria-hidden
          >
            {renderSlide(overlaySlide, undefined, false)}
          </motion.div>
        )}

        <div className="absolute inset-0 bg-gradient-to-b from-black/55 via-black/40 to-black/65" />
        <div className="absolute inset-0 bg-[#FF653F]/10 mix-blend-overlay" />
      </div>

      <motion.div
        style={{ opacity }}
        className="page-wrap relative z-10 flex h-full min-h-0 flex-col pt-[4.25rem] pb-4 sm:pt-24 sm:pb-6"
      >
        <div className="flex min-h-0 flex-1 flex-col justify-center">
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
            className="mx-auto max-w-4xl text-center"
          >
            <motion.span
              initial={{ opacity: 0, scale: 0.92 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.15 }}
              className="inline-flex items-center gap-1.5 rounded-full border border-white/25 bg-white/15 px-2.5 py-1 text-[0.6rem] font-semibold text-white backdrop-blur-md sm:gap-2 sm:px-4 sm:py-1.5 sm:text-xs"
            >
              <Sparkles className="h-3 w-3" />
              Ranchi&apos;s #1 premium bike rental
              <MapPin className="h-3 w-3" />
            </motion.span>

            <motion.h1
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.25, duration: 0.7 }}
              className="font-display mt-3 text-[1.45rem] font-bold leading-[1.12] tracking-tight text-white sm:mt-5 sm:text-4xl md:text-5xl lg:text-6xl"
            >
              Ride the city with <span className="text-[#FF653F]">next-gen</span> mobility
            </motion.h1>

            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.38 }}
              className="mx-auto mt-2 max-w-xl text-xs leading-relaxed text-white/85 sm:mt-3 sm:text-base md:text-lg"
            >
              Hourly & daily rentals for students, tourists, and commuters.
            </motion.p>

            <motion.div
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.48 }}
              className="mt-4 hidden flex-wrap items-center justify-center gap-3 sm:flex"
            >
              {/* <Link href="/bikes">
                <Button size="lg">
                  Explore Fleet <ArrowRight className="h-4 w-4" />
                </Button>
              </Link>
              <Link href="/book">
                <Button variant="glass" size="lg" className="border-white/30 text-white hover:bg-white/20">
                  Book Instantly
                </Button>
              </Link> */}
            </motion.div>
          </motion.div>
        </div>

      </motion.div>

      {/* Click outside backdrop */}
      <AnimatePresence>
        {showForm && (
          <div
            className="fixed inset-0 z-25 bg-transparent"
            onClick={() => setIsFormOpen(false)}
          />
        )}
      </AnimatePresence>

      {/* Booking Form Overlay (Confined inside the Hero section) */}
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
                {/* Close button */}
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

      {/* Bottom links and action buttons (Confined inside the Hero section) */}
      <AnimatePresence>
        {!showForm && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.4 }}
            className="absolute bottom-8 left-1/2 -translate-x-1/2 z-20 flex flex-wrap items-center justify-center gap-3 w-full px-4"
          >
            <Button
              onClick={() => setIsFormOpen(true)}
              size="sm"
              className="shadow-md"
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
                className="border-white/20 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:border-white/40 shadow-md"
              >
                <MessageCircle className="h-4 w-4 text-emerald-400" />
                WhatsApp
              </Button>
            </a>

            <a
              href={`tel:${siteConfig.phone}`}>
              <Button
                variant="outline"
                size="sm"
                className="border-white/20 bg-white/10 hover:bg-white/20 text-white hover:text-white hover:border-white/40 shadow-md"
              >
                <Phone className="h-4 w-4 text-blue-400" />
                Call
              </Button>
            </a>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Floating mouse scroll indicator (Confined inside the Hero section) */}
      <AnimatePresence>
        {!hasScrolled && !showForm && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 20 }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="absolute bottom-8 right-6 sm:right-12 flex flex-col items-center gap-2 text-white/70 pointer-events-none z-20"
          >
            <span className="text-[10px] uppercase tracking-widest font-bold">Scroll to Explore</span>
            <motion.div
              animate={{ y: [0, 6, 0] }}
              transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
              className="w-5 h-8 border border-white/40 rounded-full flex justify-center p-1"
            >
              <div className="w-1.5 h-2 bg-[#FF653F] rounded-full" />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  </div>
  );
}

function cnVideoClass(ready: boolean) {
  return [
    "h-full w-full object-cover transition-opacity duration-500",
    ready ? "opacity-100" : "opacity-0",
  ].join(" ");
}

function renderSlide(
  slide: (typeof heroSlides)[number],
  videoRef?: RefObject<HTMLVideoElement | null>,
  videoReady = false
) {
  if (slide.type === "image") {
    return (
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{ backgroundImage: `url(${slide.src})` }}
        aria-hidden
      />
    );
  }

  return (
    <video
      ref={videoRef}
      autoPlay
      muted
      playsInline
      preload="auto"
      className={cnVideoClass(videoReady)}
      aria-hidden
    >
      <source src={slide.src} type="video/mp4" />
    </video>
  );
}

const slideVariants = {
  enter: (direction: number) => ({
    x: direction > 0 ? "100%" : "-100%",
    opacity: 1,
  }),
  center: {
    x: 0,
    opacity: 1,
  },
  exit: (direction: number) => ({
    x: direction > 0 ? "-100%" : "100%",
    opacity: 1,
  }),
};
