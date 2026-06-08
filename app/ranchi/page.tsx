import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Button } from "@/components/ui/button";
import { FaqAccordion } from "@/components/faq/faq-accordion";
import { faqCategories } from "@/lib/content/faqs";
import { coveredCities } from "@/lib/constants";
import { BikesListing } from "@/components/bikes/bikes-listing";
import { heroImages } from "@/lib/content/hero-images";

export const metadata: Metadata = {
  title: "Bike Rental in Ranchi | Best Bike Rent Service Jharkhand",
  description:
    "Affordable bike rental in Ranchi. Hourly & daily scooty and motorcycle rent. Pulsar, Activa, Royal Enfield. Best bike rent service in Ranchi, Jharkhand.",
  keywords: [
    "bike rental ranchi",
    "scooty rental ranchi",
    "bike rent ranchi jharkhand",
    "hourly bike rental ranchi",
    "affordable bike rental ranchi",
  ],
};

const seoSections = [
  {
    h2: "Affordable Scooty Rental in Ranchi",
    p: "Need a scooty for college, office, or errands? Our Activa, Jupiter, Access 125, and Ntorq fleet starts from ₹499/day with hourly options. Transparent pricing with no hidden charges — see live totals before you book.",
  },
  {
    h2: "Best Bike Rent Service in Ranchi",
    p: "Nextgen combines verified bikes, OTP-secured booking, Razorpay payments, and Ranchi-based support. We're built for local riders who want reliability without the old-school rental hassle.",
  },
  {
    h2: "Hourly Bike Rental in Ranchi",
    p: "Short trips don't need full-day rates. Book 2–8 hour slots for meetings, shopping, or campus runs. Perfect for students and professionals across Morabadi, Lalpur, Dhurwa, and Kanke.",
  },
  {
    h2: "Motorcycle Rental for Tours & Weekends",
    p: "Planning Netarhat, Patratu, or Hundru Falls? Choose from Pulsar, Duke, R15, or Royal Enfield with outstation approval. We prep bikes for longer rides and offer roadside backup.",
  },
];

export default function RanchiPage() {
  const localFaqs = faqCategories.slice(0, 2);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Nextgen Bike Rent Service",
    description: "Bike and scooty rental in Ranchi, Jharkhand",
    areaServed: "Ranchi",
    address: { "@type": "PostalAddress", addressLocality: "Ranchi", addressRegion: "Jharkhand", addressCountry: "IN" },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        badge="Ranchi, Jharkhand"
        title="Bike rental in Ranchi — premium fleet, local trust"
        subtitle="Hourly & daily motorcycles and scooters. Serving students, tourists, and commuters across Ranchi with India's most modern rental experience."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Ranchi" }]}
        backgroundImage={heroImages.ranchi}
      />

      <div className="page-wrap space-y-8 py-12">
        {seoSections.map((s, i) => (
          <SectionReveal key={s.h2} delay={i * 0.05}>
            <section>
              <h2 className="font-display text-2xl font-bold text-white">{s.h2}</h2>
              <p className="mt-3 max-w-3xl text-zinc-400 leading-relaxed">{s.p}</p>
            </section>
          </SectionReveal>
        ))}

        <SectionReveal>
          <h2 className="section-title">Service areas in Ranchi</h2>
          <div className="mt-4 flex flex-wrap gap-2">
            {coveredCities.map((c) => (
              <span key={c} className="chip chip-active">
                {c}
              </span>
            ))}
          </div>
        </SectionReveal>

        <SectionReveal>
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="section-title">Available bikes in Ranchi</h2>
            <Link href="/book">
              <Button className="bg-[#FF6B1A] text-white hover:bg-[#FF8A3D]">Book now</Button>
            </Link>
          </div>
        </SectionReveal>
      </div>

      <BikesListing embedded />

      <div className="page-wrap py-16">
        <h2 className="section-title">Ranchi rental FAQ</h2>
        <div className="mt-8 max-w-3xl">
          <FaqAccordion categories={localFaqs} />
        </div>
      </div>
    </>
  );
}
