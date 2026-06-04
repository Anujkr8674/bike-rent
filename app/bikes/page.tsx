import type { Metadata } from "next";
import { BikesListing } from "@/components/bikes/bikes-listing";
import { PageHero } from "@/components/layout/page-hero";
import { heroImages } from "@/lib/content/hero-images";

export const metadata: Metadata = {
  title: "Bikes for Rent in Ranchi",
  description: "Browse motorcycles and scooters for rent in Ranchi. Filter by price, CC, fuel type. Live daily pricing.",
};

export default function BikesPage() {
  return (
    <>
      <PageHero
        badge="Fleet"
        title="Find your perfect ride"
        subtitle="Freedo-style filters with dynamic rent totals based on your rental dates."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Bikes" }]}
        backgroundImage={heroImages.bikes}
      />
      <BikesListing embedded />
    </>
  );
}
