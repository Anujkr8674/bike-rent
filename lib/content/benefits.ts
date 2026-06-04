import type { LucideIcon } from "lucide-react";
import {
  BadgeCheck,
  Shield,
  Wallet,
  Headphones,
  CalendarX,
  HardHat,
  Clock,
  Zap,
} from "lucide-react";
import { siteAssets } from "@/lib/site-assets";

export type BenefitItem = {
  icon: LucideIcon;
  title: string;
  desc: string;
  image: string;
};

export const benefitItems: BenefitItem[] = [
  {
    icon: BadgeCheck,
    title: "Verified bikes",
    desc: "Every vehicle is inspected, serviced, and documented before your ride.",
    image: siteAssets.benefits.verifiedBikes,
  },
  {
    icon: Shield,
    title: "Secure booking",
    desc: "OTP login and Razorpay-encrypted payments for peace of mind.",
    image: siteAssets.benefits.secureBooking,
  },
  {
    icon: Wallet,
    title: "Affordable pricing",
    desc: "Hourly and daily plans with transparent totals - no hidden fees.",
    image: siteAssets.benefits.affordablePricing,
  },
  {
    icon: Headphones,
    title: "Support team",
    desc: "Ranchi-based humans ready to help before, during, and after your trip.",
    image: siteAssets.benefits.supportTeam,
  },
  {
    icon: CalendarX,
    title: "Easy cancellation",
    desc: "Free cancellation up to 24 hours before pickup. Fair and simple.",
    image: siteAssets.benefits.easyCancellation,
  },
  {
    icon: HardHat,
    title: "Sanitized helmets",
    desc: "Clean helmets included with every booking for safer city rides.",
    image: siteAssets.benefits.sanitizedHelmets,
  },
  {
    icon: Clock,
    title: "Flexible duration",
    desc: "Book by the hour for errands or by the day for tours and commutes.",
    image: siteAssets.benefits.flexibleDuration,
  },
  {
    icon: Zap,
    title: "Instant confirmation",
    desc: "Get booking confirmation and pickup details within minutes.",
    image: siteAssets.benefits.instantConfirmation,
  },
];
