import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getCatalogBikeBySlug, type BikeDetailItem } from "@/lib/bike-catalog";
import { PageHero } from "@/components/layout/page-hero";
import { Suspense } from "react";
import { BikeDetailView } from "@/components/bikes/bike-detail-view";
import { formatCurrency } from "@/lib/utils";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }>; searchParams: Promise<{ days?: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const bike = await getCatalogBikeBySlug(slug);
  if (!bike) return { title: "Bike not found" };
  return {
    title: `Rent ${bike.name} in Ranchi`,
    description: `Book ${bike.name} in Ranchi from ${formatCurrency(bike.pricePerDay)}/day. ${bike.cc}cc, ${bike.fuelType}, ${bike.mileage} kmpl.${bike.color ? ` Color: ${bike.color}.` : ""}`,
  };
}

export default async function BikeDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { days: daysParam } = await searchParams;
  const bike = await getCatalogBikeBySlug(slug);
  if (!bike) notFound();

  const days = Math.max(1, Number(daysParam) || 1);

  return (
    <>
      <PageHero
        badge={bike.category}
        title={bike.name}
        subtitle={`Rent in Ranchi · ${bike.brand} · ${bike.cc}cc · ${bike.fuelType}${bike.color ? ` · ${bike.color}` : ""}`}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Bikes", href: "/bikes" }, { label: bike.name }]}
        backgroundImage={bike.image}
        variant="dark"
      />
      <Suspense fallback={<div className="page-wrap py-20 text-zinc-400">Loading…</div>}>
        <BikeDetailView bike={bike as BikeDetailItem} days={days} />
      </Suspense>
    </>
  );
}
