import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Headphones, FileText, MessageCircle, Phone } from "lucide-react";
import { siteConfig } from "@/lib/content/site";
import { heroImages } from "@/lib/content/hero-images";

export const metadata: Metadata = {
  title: "Support Center",
  description: "Get help with bookings, payments, roadside assistance, and account issues. Nextgen Ranchi support.",
};

const topics = [
  { icon: FileText, title: "Booking help", desc: "Modify dates, change bike, or understand your confirmation.", href: "/faq" },
  { icon: Phone, title: "Call support", desc: siteConfig.phone, href: `tel:${siteConfig.phone}` },
  { icon: MessageCircle, title: "WhatsApp", desc: "Fast chat support for active rentals.", href: `https://wa.me/${siteConfig.whatsapp}` },
  { icon: Headphones, title: "Roadside assistance", desc: "24×7 for active bookings — breakdowns & emergencies.", href: "/contact" },
];

export default function SupportPage() {
  return (
    <>
      <PageHero
        badge="Support"
        title="Support Center"
        subtitle="We're here when you need us — before, during, and after your ride in Ranchi."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Support" }]}
        backgroundImage={heroImages.support}
      />
      <div className="page-wrap py-16 md:py-24">
        <div className="grid gap-6 sm:grid-cols-2">
          {topics.map((t, i) => (
            <SectionReveal key={t.title} delay={i * 0.05}>
              <Link href={t.href} className="card-lift glass block rounded-2xl p-6">
                <t.icon className="h-8 w-8 text-blue-600" />
                <h3 className="mt-4 font-semibold text-zinc-900">{t.title}</h3>
                <p className="mt-2 text-sm text-zinc-600">{t.desc}</p>
              </Link>
            </SectionReveal>
          ))}
        </div>
        <SectionReveal className="mt-12">
          <div className="rounded-2xl border border-zinc-200 bg-zinc-50 p-8">
            <h3 className="font-semibold text-zinc-900">Policy quick links</h3>
            <div className="mt-4 flex flex-wrap gap-3 text-sm">
              <Link href="/rental-policy" className="text-blue-600 hover:underline">Rental Policy</Link>
              <Link href="/cancellation-policy" className="text-blue-600 hover:underline">Cancellation</Link>
              <Link href="/refund-policy" className="text-blue-600 hover:underline">Refunds</Link>
              <Link href="/terms" className="text-blue-600 hover:underline">Terms</Link>
            </div>
          </div>
        </SectionReveal>
      </div>
    </>
  );
}
