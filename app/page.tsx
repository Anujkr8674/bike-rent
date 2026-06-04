import { HomePage } from "@/components/home-page";

export default function Home() {
  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    name: "Nextgen Bike Rent Service",
    areaServed: "Ranchi, Jharkhand",
    url: process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000",
    serviceType: "Bike rental",
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <HomePage />
    </>
  );
}
