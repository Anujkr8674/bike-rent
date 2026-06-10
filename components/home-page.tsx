"use client";

import { useSearchParams } from "next/navigation";
import { Suspense, useMemo } from "react";
import { Hero } from "@/components/home/hero";
import { BookingSearchBar } from "@/components/home/booking-search-bar";
import { CategorySection } from "@/components/home/category-section";
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

import type { BikeItem } from "@/lib/bikes";

interface CategoryItem {
  id: string;
  name: string;
  slug: string;
  imageUrl: string | null;
}

function HomeContent({
  initialBikes,
  initialCategories
}: {
  initialBikes: BikeItem[];
  initialCategories: CategoryItem[];
}) {
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
      <div className="relative z-50 border-b border-white/5 bg-black/40 py-8 sm:py-10 backdrop-blur-sm">
        <div className="page-wrap">
          <BookingSearchBar variant="default" />
        </div>
      </div>
      <TrustStrip />

      <PopularSlider days={days} pickup={pickup} drop={drop} bikes={initialBikes} />
      <CategorySection categories={initialCategories} bikes={initialBikes} />
      <ServicesSection />
      <TrendingBikes days={days} pickup={pickup} drop={drop} bikes={initialBikes} />
      {/* <ShowcaseBand /> */}

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

export function HomePage({
  initialBikes,
  initialCategories
}: {
  initialBikes: BikeItem[];
  initialCategories: CategoryItem[];
}) {
  return (
    <Suspense fallback={<div className="min-h-screen bg-zinc-50" />}>
      <HomeContent initialBikes={initialBikes} initialCategories={initialCategories} />
    </Suspense>
  );
}
