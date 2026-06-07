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
    <footer className="mt-auto border-t border-zinc-200 bg-zinc-50">
      <div className="border-b border-zinc-200 bg-gradient-to-r from-[#FF653F] via-[#FF4F2E] to-[#FF653F] py-12 text-white">
        <div className="page-wrap flex flex-col items-center justify-between gap-6 md:flex-row">
          <div>
            <h3 className="font-display text-2xl font-bold">Ride smarter in Ranchi</h3>
            <p className="mt-2 max-w-md text-white/80">Get updates on offers, new bikes, and riding guides.</p>
          </div>
          <form className="flex w-full max-w-md gap-2">
            <input
              type="email"
              placeholder="Your email"
              className="flex-1 rounded-xl border-0 bg-white/95 px-4 py-3 text-sm text-zinc-900 outline-none"
            />
            <button
              type="button"
              className="rounded-xl bg-white px-6 py-3 text-sm font-semibold text-[#FF653F] hover:bg-white/95"
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
            <p className="mt-4 text-sm leading-relaxed text-zinc-500">{siteConfig.tagline}. Trusted local rentals with premium digital booking.</p>
            <div className="mt-4 space-y-2 text-sm text-zinc-600">
              <p className="flex items-center gap-2">
                <MapPin className="h-4 w-4 shrink-0 text-[#FF653F]" />
                {siteConfig.address}
              </p>
              <a href={`tel:${siteConfig.phone}`} className="flex items-center gap-2 hover:text-[#FF653F]">
                <Phone className="h-4 w-4 text-[#FF653F]" />
                {siteConfig.phone}
              </a>
              <a href={`mailto:${siteConfig.email}`} className="flex items-center gap-2 hover:text-[#FF653F]">
                <Mail className="h-4 w-4 text-[#FF653F]" />
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
              <p className="text-sm font-semibold capitalize text-zinc-900">{key}</p>
              <ul className="mt-4 space-y-2.5">
                {links.map((l) => (
                  <li key={l.href}>
                    <Link href={l.href} className="text-sm text-zinc-500 transition hover:text-[#FF653F]">
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-col items-center justify-between gap-4 border-t border-zinc-200 pt-8 sm:flex-row">
          <p className="text-xs text-zinc-400">
            © {new Date().getFullYear()} {siteConfig.name}. All rights reserved. Serving Ranchi, Jharkhand.
          </p>
          <div className="flex flex-wrap justify-center gap-4 text-xs text-zinc-500">
            <Link href="/privacy-policy" className="hover:text-[#FF653F]">
              Privacy
            </Link>
            <Link href="/terms" className="hover:text-[#FF653F]">
              Terms
            </Link>
            <Link href="/admin/login" className="hover:text-[#FF653F]">
              Admin
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
