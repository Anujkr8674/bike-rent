import { HomePage } from "@/components/home-page";
import { getCatalogBikes, getCachedCategories } from "@/lib/bike-catalog";

export default async function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Nextgen Bike Rent Service",
    areaServed: "Ranchi, Jharkhand",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    serviceType: "Bike rental",
  };

  const bikes = await getCatalogBikes();
  const categories = await getCachedCategories();

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePage initialBikes={bikes} initialCategories={categories} />
    </>
  );
}
