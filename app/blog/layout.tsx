import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Blog",
  description: "Bike rental guides, Ranchi travel tips, and riding advice from Nextgen Bike Rent Service.",
};

export default function BlogLayout({ children }: { children: React.ReactNode }) {
  return children;
}
