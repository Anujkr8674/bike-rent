import { siteAssets } from "@/lib/site-assets";

export type Testimonial = {
  id: string;
  name: string;
  location: string;
  bike: string;
  rating: number;
  text: string;
  verified: boolean;
  avatar: string;
};

export const testimonials: Testimonial[] = [
  {
    id: "1",
    name: "Rahul Kumar",
    location: "Morabadi, Ranchi",
    bike: "Pulsar NS200",
    rating: 5,
    text: "Booked for a week-long college commute. Pickup was under 10 minutes, bike was spotless, and pricing was transparent. Best rental in Ranchi.",
    verified: true,
    avatar: siteAssets.testimonials.rahul,
  },
  {
    id: "2",
    name: "Priya Sharma",
    location: "Dhurwa, Ranchi",
    bike: "Activa",
    rating: 5,
    text: "Hourly rental for shopping and errands - super smooth app experience. No hidden charges. Will definitely use again.",
    verified: true,
    avatar: siteAssets.testimonials.priya,
  },
  {
    id: "3",
    name: "Amit Tiwari",
    location: "Kanke, Ranchi",
    bike: "Classic 350",
    rating: 5,
    text: "Weekend trip to Netarhat with Classic 350. The team helped with route tips and the bike performed flawlessly.",
    verified: true,
    avatar: siteAssets.testimonials.amit,
  },
  {
    id: "4",
    name: "Sneha Patel",
    location: "Lalpur, Ranchi",
    bike: "R15",
    rating: 5,
    text: "As a tourist, I needed a reliable sports bike. Nextgen made it easy with OTP login and instant confirmation.",
    verified: true,
    avatar: siteAssets.testimonials.sneha,
  },
  {
    id: "5",
    name: "Vikash Mehta",
    location: "Harmu, Ranchi",
    bike: "KTM Duke",
    rating: 4,
    text: "Premium bike, premium service. Slightly higher deposit but worth it for the condition of the Duke.",
    verified: true,
    avatar: siteAssets.testimonials.vikash,
  },
  {
    id: "6",
    name: "Anjali Das",
    location: "Ranchi",
    bike: "Jupiter",
    rating: 5,
    text: "Perfect scooty for daily office commute. Flexible daily plan saved me money vs other local rentals.",
    verified: true,
    avatar: siteAssets.testimonials.anjali,
  },
];
