import type { LucideIcon } from "lucide-react";
import {
  Bike,
  BadgeIndianRupee,
  Zap,
  Wrench,
  HardHat,
  MapPin,
  Headphones,
  ShieldCheck,
} from "lucide-react";
import { siteAssets } from "@/lib/site-assets";

export type WhyChooseFeature = {
  icon: LucideIcon;
  title: string;
  description: string;
};

export const whyChooseFeatures: WhyChooseFeature[] = [
  {
    icon: Bike,
    title: "Wide Range of Bikes",
    description: "Choose from a variety of well-maintained bikes and scooters.",
  },
  {
    icon: BadgeIndianRupee,
    title: "Best Price Guarantee",
    description: "Get the best prices with transparent pricing and no hidden charges.",
  },
  {
    icon: Zap,
    title: "Easy Booking Process",
    description: "Book your ride in just a few clicks with our simple and quick process.",
  },
  {
    icon: Wrench,
    title: "Well Maintained Bikes",
    description: "All bikes are well maintained and serviced regularly for smooth rides.",
  },
  {
    icon: HardHat,
    title: "Quality Gear for You",
    description: "Helmets and accessories included for a safe and comfortable ride.",
  },
  {
    icon: MapPin,
    title: "Pan India Availability",
    description: "Available in 50+ cities across India. Ride where you want.",
  },
  {
    icon: Headphones,
    title: "24/7 Customer Support",
    description: "We're here for you anytime, anywhere. Just a call away!",
  },
  {
    icon: ShieldCheck,
    title: "Safe & Reliable",
    description: "All our bikes are regularly inspected for your safety and peace of mind.",
  },
];

export const whyChooseCenter = {
  image: siteAssets.whyChoose.center,
  imageAlt: "Premium motorcycle on an open road - Nextgen Bike Rent",
  heading: "Freedom to Ride, Anytime, Anywhere.",
  tagline: "Your journey begins with the",
  highlight: "perfect ride.",
};

/** Fixed design canvas - scaled uniformly on all viewports */
export const ORBIT_DESIGN_SIZE = 840;
export const ORBIT_RADIUS_X = 41.5;
export const ORBIT_RADIUS_Y = 42.5;
