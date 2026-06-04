import type { Metadata } from "next";
import { Geist, Geist_Mono, Syne } from "next/font/google";
import "./globals.css";
import { SiteShell } from "@/components/site-shell";
import type { ReactNode } from "react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const syne = Syne({
  variable: "--font-syne",
  subsets: ["latin"],
  weight: ["600", "700", "800"],
});

export const metadata: Metadata = {
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000"),
  title: {
    default: "Nextgen Bike Rent Service",
    template: "%s | Nextgen Bike Rent Service",
  },
  description: "Premium Ranchi bike rental platform with animated booking flow.",
  openGraph: {
    title: "Nextgen Bike Rent Service",
    description: "Book bikes in Ranchi instantly with secure OTP and Razorpay payment.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Nextgen Bike Rent Service",
    description: "Futuristic Ranchi bike rentals with premium booking UX.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${syne.variable} h-full scroll-smooth antialiased`}
    >
      <body className="min-h-full">
        <SiteShell>{children}</SiteShell>
      </body>
    </html>
  );
}
