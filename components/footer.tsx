import Link from "next/link";
import { Bike, Mail, MapPin, Phone, MessageCircle } from "lucide-react";
import { siteAssets } from "@/lib/site-assets";
import { siteConfig } from "@/lib/content/site";

const footerLinks = {
  services: [
    { href: "/bikes", label: "All Bikes" },
    { href: "/book", label: "Book Now" },
    { href: "/ranchi", label: "Bike Rental in Ranchi" },
    { href: "/why-choose-us", label: "Why Choose Us" },
  ],
  company: [
    { href: "/about", label: "About Us" },
    { href: "/blog", label: "Blog" },
    { href: "/careers", label: "Careers" },
    { href: "/testimonials", label: "Testimonials" },
  ],
  support: [
    { href: "/faq", label: "FAQ" },
    { href: "/support", label: "Support Center" },
    { href: "/contact", label: "Contact Us" },
  ],
  legal: [
    { href: "/privacy-policy", label: "Privacy Policy" },
    { href: "/terms", label: "Terms & Conditions" },
    { href: "/refund-policy", label: "Refund Policy" },
    { href: "/cancellation-policy", label: "Cancellation Policy" },
    { href: "/rental-policy", label: "Rental Policy" },
  ],
};

export function Footer() {
  return (
    <footer className="mt-auto border-t border-white/10 bg-[#0A0A0A]">
      <div className="relative overflow-hidden border-b border-white/10 bg-[#050505] py-12 text-white">
        <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 h-[20rem] w-[40rem] rounded-full bg-[#FF6B1A]/10 blur-[80px]" aria-hidden />
        <div className="page-wrap relative z-10 flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h3 className="font-display text-2xl font-bold">Ride smarter in Ranchi</h3>
            <p className="mt-2 max-w-md text-zinc-400">Get updates on offers, new bikes, and riding guides.</p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 rounded-xl border border-white/10 bg-black/50 px-4 py-3 text-sm text-white placeholder:text-zinc-500 outline-none focus:border-[#FF6B1A] transition-colors"
            />
            <button
              type="button"
              className="rounded-xl bg-[#FF6B1A] px-6 py-3 text-sm font-semibold text-white shadow-[0_0_20px_rgba(255,107,26,0.3)] hover:bg-[#FF8A3D] hover:shadow-[0_0_25px_rgba(255,107,26,0.5)] transition-all"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      <div className="page-wrap py-14 md:py-16">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-6">
          <div className="lg:col-span-2">
            <Link href="/" className="inline-flex items-center">
              <img src={siteAssets.logo} alt="Logo" className="h-16 md:h-20 w-auto object-contain" />
            </Link>
            <p className="mt-4 text-sm leading-relaxed text-zinc-400">{siteConfig.tagline}. Trusted local rentals with premium digital booking.</p>
            <div className="mt-4 space-y-2 text-sm text-zinc-300">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#FF6B1A]" />
                {siteConfig.address}
              </p>
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 hover:text-[#FF6B1A] transition-colors">
                <Phone className="h-4 w-4 text-[#FF6B1A]" />
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-[#FF6B1A] transition-colors">
                <Mail className="h-4 w-4 text-[#FF6B1A]" />
                {siteConfig.email}
              </a>
            </div>
            <a
              href={`https://wa.me/${siteConfig.whatsapp}`}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-4 inline-flex items-center gap-2 rounded-xl bg-emerald-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-emerald-700"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp Support
            </a>
          </div>

          {Object.entries(footerLinks).map(([key, links]) => (
            <div key={key}>
              <p className="text-sm font-semibold capitalize text-white">{key}</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-zinc-400 transition hover:text-[#FF6B1A]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-500">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Serving Ranchi, Jharkhand.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-400">
            <Link href="/privacy-policy" className="hover:text-[#FF6B1A] transition-colors">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#FF6B1A] transition-colors">
              Terms
            </Link>
            <Link href="/admin/login" className="hover:text-[#FF6B1A] transition-colors">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
