"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Hero } from "@/components/home/hero";
import { PopularSlider } from "@/components/home/popular-slider";
import { TrendingBikes, AppCta } from "@/components/home/home-sections";
import { WhyChooseSection } from "@/components/why-choose-us";
import { CityCoverageSection } from "@/components/home/city-coverage-section";
import { FaqSectionHome } from "@/components/home/faq-section-home";
import { TrustStrip } from "@/components/home/trust-strip";
import { ShowcaseBand } from "@/components/home/showcase-band";
import { ServicesSection } from "@/components/home/services-section";
import { ImpactSection } from "@/components/home/impact-section";
import {
  AboutPreview,
  TestimonialsPreview,
  ContactPreview,
  BlogPreview,
} from "@/components/home/page-previews";
import { calcRentalDays } from "@/lib/pricing";

function HomeContent() {
  const params = useSearchParams();
  const pickup = params.get("pickup") || "";
  const drop = params.get("drop") || "";
  const days = useMemo(() => {
    const d = params.get("days");
    if (d) return Number(d) || 1;
    return calcRentalDays(pickup, drop);
  }, [params, pickup, drop]);

  return (
    <>
      <Hero />
      <TrustStrip />
      <PopularSlider days={days} pickup={pickup} drop={drop} />
      <ServicesSection />
      <TrendingBikes days={days} pickup={pickup} drop={drop} />
      <ShowcaseBand />
      
      <WhyChooseSection />
      {/* <AboutPreview /> */}
      <ImpactSection />
      <TestimonialsPreview />
      {/* <CityCoverageSection /> */}
      <FaqSectionHome />
      {/* <BlogPreview /> */}
      {/* <ContactPreview /> */}
      {/* <AppCta /> */}
    </>
  );
}

export function HomePage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50" />}>
      <HomeContent />
    </Suspense>
  );
}
