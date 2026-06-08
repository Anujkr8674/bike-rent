import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { ContactForm } from "@/components/contact/contact-form";
import { SectionReveal } from "@/components/ui/section-reveal";
import { siteConfig } from "@/lib/content/site";
import { heroImages } from "@/lib/content/hero-images";
import { Clock, Mail, MapPin, MessageCircle, Phone, AlertCircle } from "lucide-react";

export const metadata: Metadata = {
  title: "Contact Us",
  description: "Contact Nextgen Bike Rent Service in Ranchi. Phone, email, WhatsApp, business hours, and support for bookings.",
};

export default function ContactPage() {
  return (
    <>
      <PageHero
        badge="Contact"
        title="We're here for Ranchi riders"
        subtitle="Questions about booking, fleet, or partnerships? Reach our local team — we typically respond within 2 hours."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Contact" }]}
        backgroundImage={heroImages.contact}
      />

      <div className="page-wrap py-16 md:py-24">
        <div className="grid gap-12 lg:grid-cols-5">
          <div className="space-y-6 lg:col-span-2">
            <SectionReveal>
              <div className="rounded-2xl p-6 bg-[#0A0A0A] border border-white/10 transition-all duration-300 hover:border-[#FF6B1A] hover:shadow-[0_0_30px_rgba(255,107,26,0.3)] hover:-translate-y-1">
                <Phone className="h-6 w-6 text-[#FF6B1A]" />
                <p className="mt-3 font-semibold text-white">Phone</p>
                <a href={`tel:${siteConfig.phone}`} className="text-[#FF6B1A] hover:underline">
                  {siteConfig.phone}
                </a>
              </div>
            </SectionReveal>
            <SectionReveal delay={0.05}>
              <div className="rounded-2xl p-6 bg-[#0A0A0A] border border-white/10 transition-all duration-300 hover:border-[#FF6B1A] hover:shadow-[0_0_30px_rgba(255,107,26,0.3)] hover:-translate-y-1">
                <Mail className="h-6 w-6 text-[#FF6B1A]" />
                <p className="mt-3 font-semibold text-white">Email</p>
                <a href={`mailto:${siteConfig.email}`} className="text-[#FF6B1A] hover:underline">
                  {siteConfig.email}
                </a>
              </div>
            </SectionReveal>
            <SectionReveal delay={0.1}>
              <a
                href={`https://wa.me/${siteConfig.whatsapp}`}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 rounded-2xl bg-[#00A884] p-6 text-white hover:bg-[#008f6f] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_0_30px_rgba(0,168,132,0.4)]"
              >
                <MessageCircle className="h-6 w-6" />
                <div>
                  <p className="font-semibold">WhatsApp</p>
                  <p className="text-sm text-emerald-100">Fastest response</p>
                </div>
              </a>
            </SectionReveal>
            <SectionReveal delay={0.15}>
              <div className="rounded-2xl p-6 bg-[#0A0A0A] border border-white/10 transition-all duration-300 hover:border-[#FF6B1A] hover:shadow-[0_0_30px_rgba(255,107,26,0.3)] hover:-translate-y-1">
                <Clock className="h-6 w-6 text-[#FF6B1A]" />
                <p className="mt-3 font-semibold text-white">Business hours</p>
                <p className="text-sm text-zinc-400">Mon–Sat: {siteConfig.hours.weekdays}</p>
                <p className="text-sm text-zinc-400">Sun: {siteConfig.hours.weekend}</p>
                <p className="mt-2 flex items-start gap-2 text-xs text-zinc-500">
                  <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
                  {siteConfig.hours.emergency}
                </p>
              </div>
            </SectionReveal>
            <SectionReveal delay={0.2}>
              <p className="text-sm text-zinc-400">
                Quick help: <Link href="/faq" className="text-[#FF6B1A] hover:underline">FAQ</Link> ·{" "}
                <Link href="/support" className="text-[#FF6B1A] hover:underline">Support</Link>
              </p>
            </SectionReveal>
          </div>
          <div className="lg:col-span-3">
            <SectionReveal>
              <ContactForm />
            </SectionReveal>
          </div>
        </div>

        <SectionReveal className="mt-16">
          <h2 className="section-title flex items-center gap-2">
            <MapPin className="h-7 w-7 text-[#FF6B1A]" />
            Visit us in Ranchi
          </h2>
          <div className="mt-6 overflow-hidden rounded-2xl border border-white/10 shadow-[0_0_30px_rgba(255,107,26,0.05)]">
            <iframe
              title="Nextgen Bike Rent Ranchi"
              src={siteConfig.mapEmbed}
              className="h-[400px] w-full"
              loading="lazy"
              referrerPolicy="no-referrer-when-downgrade"
            />
          </div>
          <p className="mt-4 text-sm text-zinc-400">{siteConfig.address}</p>
        </SectionReveal>
      </div>
    </>
  );
}
