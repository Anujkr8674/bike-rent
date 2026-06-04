import { siteAssets } from "@/lib/site-assets";

export type BlogPost = {
  slug: string;
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  image: string;
  author: string;
  content: string[];
  keywords: string[];
};

export const blogPosts: BlogPost[] = [
  {
    slug: "bike-rental-ranchi-complete-guide",
    title: "Complete Guide to Bike Rental in Ranchi (2025)",
    excerpt: "Everything you need to know about renting bikes in Ranchi - pricing, documents, best areas, and tips.",
    category: "Ranchi Guides",
    date: "2025-03-12",
    readTime: "8 min",
    image: siteAssets.blog.guide,
    author: "Nextgen Team",
    keywords: ["bike rental ranchi", "scooty rent ranchi", "bike hire jharkhand"],
    content: [
      "Ranchi has grown into one of Jharkhand's most dynamic cities for students, professionals, and tourists. Whether you're commuting between Morabadi and Lalpur or planning a weekend escape to Netarhat, a reliable two-wheeler changes how you experience the city.",
      "At Nextgen Bike Rent Service, we've designed our platform around Ranchi-specific needs: hourly rentals for quick errands, daily plans for office commutes, and premium motorcycles for leisure rides.",
      "Required documents typically include a valid driving license and government ID. We recommend booking 24 hours in advance during peak seasons (festivals, university events) to secure your preferred model.",
      "Popular pickup zones include Dhurwa, Kanke Road, Main Road, and Harmu. Our fleet spans scooters (Activa, Jupiter), commuters (Pulsar, Apache), and premium options (R15, Duke, Royal Enfield).",
    ],
  },
  {
    slug: "best-bikes-city-rides-ranchi",
    title: "Best Bikes for City Rides in Ranchi",
    excerpt: "Compare scooters vs motorcycles for Ranchi traffic, hills, and daily commuting.",
    category: "Bike Tips",
    date: "2025-02-28",
    readTime: "6 min",
    image: siteAssets.blog.cityRides,
    author: "Nextgen Team",
    keywords: ["best bikes ranchi", "city commute bike"],
    content: [
      "Ranchi's mix of flat city roads and occasional inclines makes bike choice important. For daily office runs and college commutes, scooters like Activa and Jupiter offer comfort, storage, and excellent mileage.",
      "If you enjoy spirited riding on open stretches toward Kanke or Booty, consider Pulsar NS200, Apache RTR, or Yamaha R15. These bikes balance agility with enough power for highway sections.",
      "Budget-conscious riders often choose Splendor-class commuters; we stock modern equivalents with better features and maintained engines.",
    ],
  },
  {
    slug: "weekend-ride-destinations-jharkhand",
    title: "Top Weekend Ride Destinations from Ranchi",
    excerpt: "Netarhat, Patratu, Hundru Falls - plan your next Jharkhand road trip.",
    category: "Travel",
    date: "2025-02-15",
    readTime: "10 min",
    image: siteAssets.blog.weekendTrips,
    author: "Nextgen Team",
    keywords: ["weekend rides jharkhand", "netarhat bike trip"],
    content: [
      "Jharkhand offers some of Eastern India's most underrated riding routes. From Ranchi, Netarhat (the 'Queen of Chotanagpur') is a favourite - winding roads, cool climate, and sunrise viewpoints.",
      "Patratu Valley delivers dramatic landscapes ideal for photography. Plan an early start, carry water, and ensure your rental bike is serviced - we pre-check all outstation-ready units.",
      "Always inform our support team if you're riding beyond city limits so we can note your trip and assist if needed.",
    ],
  },
  {
    slug: "affordable-bike-rental-tips",
    title: "How to Get Affordable Bike Rentals in Ranchi",
    excerpt: "Save money with hourly plans, weekday discounts, and smart booking timing.",
    category: "Savings",
    date: "2025-01-20",
    readTime: "5 min",
    image: siteAssets.blog.affordable,
    author: "Nextgen Team",
    keywords: ["affordable bike rent ranchi", "cheap scooty rental"],
    content: [
      "Hourly rentals beat daily rates when you need a bike for 2-4 hours. Compare per-hour vs per-day pricing on our bike cards before booking.",
      "Weekday bookings (Monday-Thursday) often have better availability and promotional rates. Students can inquire about semester-long partnership discounts at select colleges.",
      "Returning the bike on time avoids late fees. Fuel efficiently and return with the same fuel level to skip refuel charges.",
    ],
  },
  {
    slug: "bike-riding-safety-monsoon-ranchi",
    title: "Monsoon Riding Safety Tips for Ranchi Riders",
    excerpt: "Stay safe during Jharkhand rains with maintenance and riding best practices.",
    category: "Safety",
    date: "2024-12-08",
    readTime: "7 min",
    image: siteAssets.blog.monsoon,
    author: "Nextgen Team",
    keywords: ["monsoon bike safety ranchi"],
    content: [
      "Monsoon in Ranchi means wet roads and reduced visibility. We fit quality tyres and check brakes before every handover during rainy season.",
      "Reduce speed on painted road markings and metal bridges. Increase following distance and use both brakes progressively.",
      "Wear reflective gear and keep headlights on. If conditions are severe, pause your trip - we offer rescheduling per our cancellation policy.",
    ],
  },
  {
    slug: "hourly-vs-daily-bike-rental",
    title: "Hourly vs Daily Bike Rental: Which Is Right for You?",
    excerpt: "Choose the perfect rental plan for your Ranchi schedule and budget.",
    category: "Guides",
    date: "2024-11-22",
    readTime: "4 min",
    image: siteAssets.blog.hourlyVsDaily,
    author: "Nextgen Team",
    keywords: ["hourly bike rental ranchi", "daily bike rent"],
    content: [
      "Hourly rentals suit shopping trips, meetings across town, and quick campus runs. You pay only for hours used with a low minimum.",
      "Daily rentals work best for multi-day office commutes, tourist exploration, and weekend getaways. Per-day rates drop effectively on longer bookings.",
      "Our booking page shows live totals for both modes - experiment with dates to see your best value.",
    ],
  },
];

export function getBlogPost(slug: string) {
  return blogPosts.find((p) => p.slug === slug);
}
