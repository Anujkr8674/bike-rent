"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bike,
  MapPin,
  Menu,
  X,
  ChevronDown,
  Phone,
  MessageCircle,
  Search,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { siteConfig } from "@/lib/content/site";
import { siteAssets } from "@/lib/site-assets";
import { cn } from "@/lib/utils";

const mainLinks = [
  { href: "/", label: "Home" },
  { href: "/bikes", label: "Bikes" },
  // { href: "/book", label: "Book" },
  { href: "/ranchi", label: "Ranchi" },
  { href: "/about", label: "About" },
  // { href: "/blog", label: "Blog" },
  { href: "/contact", label: "Contact" },
];

const moreLinks = [
  // { href: "/about", label: "About" },
  { href: "/why-choose-us", label: "Why Us" },
  { href: "/testimonials", label: "Reviews" },
  { href: "/faq", label: "FAQ" },
  // { href: "/contact", label: "Contact" },
  { href: "/support", label: "Support" },
  { href: "/blog", label: "Blog" },
  // { href: "/careers", label: "Careers" },
];

function isLinkActive(href: string, pathname: string) {
  if (href === "/") return pathname === "/";
  return pathname === href || pathname.startsWith(`${href}/`);
}

export function Navbar() {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileMoreOpen, setMobileMoreOpen] = useState(false);
  const [desktopMoreOpen, setDesktopMoreOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [overHero, setOverHero] = useState(false);

  const isTransparent = overHero && !scrolled;
  const moreActive = moreLinks.some((l) => isLinkActive(l.href, pathname));

  const checkHeroPosition = useCallback(() => {
    const heroEl = document.querySelector(".hero-fullbleed, .page-hero-banner");
    if (!heroEl) {
      setOverHero(false);
      return;
    }
    const rect = heroEl.getBoundingClientRect();
    setOverHero(rect.bottom > 100);
  }, []);

  useEffect(() => {
    const onScroll = () => {
      setScrolled(window.scrollY > 24);
      checkHeroPosition();
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [checkHeroPosition]);

  useEffect(() => {
    checkHeroPosition();
  }, [pathname, checkHeroPosition]);

  useEffect(() => {
    document.body.style.overflow = mobileOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [mobileOpen]);

  useEffect(() => {
    setMobileOpen(false);
    setMobileMoreOpen(false);
    setDesktopMoreOpen(false);
  }, [pathname]);

  if (pathname.startsWith("/admin")) return null;

  const navLinkClass = (href: string, active?: boolean) =>
    cn(
      "rounded-lg px-3 py-2 text-sm font-medium transition",
      active
        ? isTransparent
          ? "bg-white/20 text-white"
          : "bg-[#FF653F]/10 text-[#FF653F]"
        : isTransparent
          ? "text-white/90 hover:bg-white/10 hover:text-white"
          : "text-zinc-600 hover:bg-zinc-100 hover:text-[#FF653F]",
    );

  return (
    <>
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className={cn(
          "fixed z-50 transition-all duration-300",
          scrolled
            ? "top-0 left-0 right-0 border-b border-zinc-200/80 bg-white/95 shadow-sm backdrop-blur-xl"
            : isTransparent
              ? "top-3 sm:top-5 md:top-6 lg:top-7 left-2.5 sm:left-4 md:left-5 lg:left-6 right-2.5 sm:right-4 md:right-5 lg:right-6 border-b border-transparent bg-transparent"
              : "top-0 left-0 right-0 border-b border-zinc-200/60 bg-white/80 backdrop-blur-md",
        )}
      >
        <div className="page-wrap flex items-center justify-between gap-4 py-1 md:py-1">
          <Link href="/" className="flex items-center">
            <img src={siteAssets.logo} alt="Logo" className="h-16 md:h-16 w-auto object-contain" />
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {mainLinks.map((item) => {
              const active = isLinkActive(item.href, pathname);
              return (
                <Link key={item.href} href={item.href} className={navLinkClass(item.href, active)}>
                  {item.label}
                </Link>
              );
            })}
            <div
              className="relative"
              onMouseEnter={() => setDesktopMoreOpen(true)}
              onMouseLeave={() => setDesktopMoreOpen(false)}
            >
              <button
                type="button"
                onClick={() => setDesktopMoreOpen(!desktopMoreOpen)}
                className={navLinkClass("/more", moreActive)}
              >
                More <ChevronDown className={cn("inline h-4 w-4 transition", desktopMoreOpen && "rotate-180")} />
              </button>
              <AnimatePresence>
                {desktopMoreOpen && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: 8 }}
                    className="absolute left-1/2 top-full mt-2 w-48 -translate-x-1/2 transform rounded-xl border border-zinc-200 bg-white py-2 shadow-xl"
                  >
                    {moreLinks.map((l) => {
                      const active = isLinkActive(l.href, pathname);
                      return (
                        <Link
                          key={l.href}
                          href={l.href}
                          className={cn(
                            "block px-4 py-2 text-sm transition",
                            active
                              ? "bg-[#FF653F]/10 font-medium text-[#FF653F]"
                              : "text-zinc-600 hover:bg-zinc-50 hover:text-[#FF653F]",
                          )}
                          onClick={() => setDesktopMoreOpen(false)}
                        >
                          {l.label}
                        </Link>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </nav>

          <div className="hidden items-center gap-2 md:flex">
            <span
              className={cn(
                "hidden items-center gap-1 rounded-full px-2.5 py-1 text-xs font-medium lg:flex",
                isTransparent
                  ? "border border-white/25 bg-white/15 text-white"
                  : "border border-[#FF653F]/20 bg-[#FF653F]/10 text-[#FF653F]",
              )}
            >
              <MapPin className="h-3 w-3" /> Ranchi
            </span>
            {/* <Link href="/track-booking">
              <Button
                size="sm"
                variant={isTransparent ? "glass" : "outline"}
                className={cn("gap-1.5", isTransparent && "border-white/30 text-white hover:bg-[/20")}
              >
                <Search className="h-3.5 w-3.5" />
                Track Booking
              </Button> 
            </Link> */}
            <Link href="/track-booking">
              <Button
                size="sm"
                className="gap-1.5 bg-[#FF6B1A] text-white hover:bg-[#e85f12]"
              >
                <Search className="h-3.5 w-3.5" />
                Track Booking
              </Button>
            </Link>
          </div>

          <button
            type="button"
            className={cn(
              "rounded-xl border p-2.5 lg:hidden",
              isTransparent
                ? "border-white/30 bg-white/10 text-white backdrop-blur-sm"
                : "border-zinc-200 bg-white text-zinc-900",
            )}
            onClick={() => setMobileOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-5 w-5" />
          </button>
        </div>
      </motion.header>

      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.button
              type="button"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm lg:hidden"
              aria-label="Close menu"
              onClick={() => setMobileOpen(false)}
            />

            <motion.aside
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 320 }}
              className="fixed right-0 top-0 z-[70] flex h-[100dvh] w-[min(100%,340px)] flex-col border-l border-white/20 bg-white/95 shadow-2xl backdrop-blur-2xl lg:hidden"
            >
              <div className="flex items-center justify-between border-b border-zinc-100 px-5 py-4">
                <Link href="/" className="flex items-center gap-2.5" onClick={() => setMobileOpen(false)}>
                  <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-gradient-to-br from-[#FF653F] to-[#FF4F2E] text-white">
                    <Bike className="h-5 w-5" />
                  </span>
                  <span className="font-display text-sm font-bold text-zinc-900">Nextgen Bike Rent</span>
                </Link>
                <button
                  type="button"
                  onClick={() => setMobileOpen(false)}
                  className="rounded-lg p-2 text-zinc-500 hover:bg-zinc-100"
                  aria-label="Close menu"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>

              <nav className="flex-1 overflow-y-auto px-4 py-4">
                {mainLinks.map((item) => {
                  const active = isLinkActive(item.href, pathname);
                  return (
                    <Link
                      key={item.href}
                      href={item.href}
                      onClick={() => setMobileOpen(false)}
                      className={cn(
                        "mb-1 block rounded-xl px-4 py-3.5 text-base font-medium transition",
                        active ? "bg-[#FF653F]/10 text-[#FF653F]" : "text-zinc-700 hover:bg-zinc-50",
                      )}
                    >
                      {item.label}
                    </Link>
                  );
                })}

                <div className="mb-1">
                  <button
                    type="button"
                    onClick={() => setMobileMoreOpen(!mobileMoreOpen)}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-4 py-3.5 text-base font-medium transition",
                      moreActive || mobileMoreOpen
                        ? "bg-[#FF653F]/10 text-[#FF653F]"
                        : "text-zinc-700 hover:bg-zinc-50",
                    )}
                  >
                    More
                    <ChevronDown className={cn("h-5 w-5 transition", mobileMoreOpen && "rotate-180")} />
                  </button>
                  <AnimatePresence>
                    {mobileMoreOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden pl-2"
                      >
                        {moreLinks.map((item) => {
                          const active = isLinkActive(item.href, pathname);
                          return (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setMobileOpen(false)}
                              className={cn(
                                "mb-1 block rounded-lg px-4 py-3 text-sm font-medium transition",
                                active ? "bg-[#FF653F]/10 text-[#FF653F]" : "text-zinc-600 hover:bg-zinc-50",
                              )}
                            >
                              {item.label}
                            </Link>
                          );
                        })}
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>

                <div className="mt-4 border-t border-zinc-100 pt-4">
                  <Link href="/track-booking" onClick={() => setMobileOpen(false)}>
                    <Button className="w-full gap-2">
                      <Search className="h-4 w-4" />
                      Track Booking
                    </Button>
                  </Link>
                </div>
              </nav>

              <div className="shrink-0 border-t border-zinc-100 bg-white/90 p-5">
                <div className="space-y-2.5 text-sm text-zinc-600">
                  <p className="flex items-start gap-2">
                    <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-[#FF653F]" />
                    <span>{siteConfig.address}</span>
                  </p>
                  <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 hover:text-[#FF653F]">
                    <Phone className="h-4 w-4 shrink-0 text-[#FF653F]" />
                    {siteConfig.phone}
                  </a>
                </div>
                <div className="mt-4 grid grid-cols-2 gap-2.5">
                  <a
                    href={`https://wa.me/${siteConfig.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex h-11 items-center justify-center gap-1.5 rounded-xl bg-emerald-600 text-sm font-semibold text-white transition hover:bg-emerald-700"
                  >
                    <MessageCircle className="h-4 w-4" />
                    WhatsApp
                  </a>
                  <Link
                    href="/contact"
                    onClick={() => setMobileOpen(false)}
                    className="inline-flex h-11 items-center justify-center rounded-xl bg-[#FF653F] text-sm font-semibold text-white transition hover:bg-[#FF4F2E]"
                  >
                    Contact
                  </Link>
                </div>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
