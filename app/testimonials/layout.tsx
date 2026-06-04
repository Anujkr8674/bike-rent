import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Testimonials",
  description: "Customer reviews and ratings for Nextgen Bike Rent Service in Ranchi, Jharkhand.",
};

export default function TestimonialsLayout({ children }: { children: React.ReactNode }) {
  return children;
}
