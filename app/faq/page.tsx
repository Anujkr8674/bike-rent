import type { Metadata } from "next";
import { PageHero } from "@/components/layout/page-hero";
import { FaqPageContent } from "@/components/faq/faq-page-content";
import { heroImages } from "@/lib/content/hero-images";

export const metadata: Metadata = {
  title: "FAQ",
  description: "Frequently asked questions about bike rental in Ranchi — booking, payment, cancellation, deposits, and usage rules.",
};

export default function FaqPage() {
  return (
    <>
      <PageHero
        badge="Help Center"
        title="Frequently asked questions"
        subtitle="Everything you need to know about booking, payments, cancellations, and riding with Nextgen in Ranchi."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "FAQ" }]}
        backgroundImage={heroImages.faq}
      />
      <FaqPageContent />
    </>
  );
}
