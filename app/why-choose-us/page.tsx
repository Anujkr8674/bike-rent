import type { Metadata } from "next";
import Link from "next/link";
import { PageHero } from "@/components/layout/page-hero";
import { WhyChooseSection } from "@/components/why-choose-us";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Button } from "@/components/ui/button";
import { heroImages } from "@/lib/content/hero-images";

export const metadata: Metadata = {
  title: "Why Choose Us",
  description: "Why Ranchi riders choose Nextgen Bike Rent — safety, pricing, verified fleet, support, and premium booking experience.",
};

export default function WhyChooseUsPage() {
  return (
    <>
      <PageHero
        badge="Why Nextgen"
        title="The premium choice for Ranchi bike rentals"
        subtitle="We're not another rental counter. We're a mobility platform built for trust, transparency, and riders who expect more."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Why Choose Us" }]}
        backgroundImage={heroImages.whyChoose}
      />
      <WhyChooseSection showLink={false} />
      <div className="page-wrap pb-20">
        <SectionReveal className="rounded-3xl bg-gradient-to-r from-blue-600 to-violet-600 p-10 text-center text-white md:p-14">
          <h2 className="font-display text-3xl font-bold">Ready to experience the difference?</h2>
          <p className="mx-auto mt-3 max-w-lg text-blue-100">
            Join thousands of Ranchi riders who trust Nextgen for daily commutes and weekend adventures.
          </p>
          <Link href="/bikes" className="mt-8 inline-block">
            <Button variant="glass" size="lg" className="border-white/30 bg-white text-indigo-700">
              Browse fleet
            </Button>
          </Link>
        </SectionReveal>
      </div>
    </>
  );
}
