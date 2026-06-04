import type { MetadataRoute } from "next";
import { blogPosts } from "@/lib/content/blog";
import { ranchiBikes } from "@/lib/bikes";

export default function sitemap(): MetadataRoute.Sitemap {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL || "http://localhost:3000";
  const staticPages = [
    "",
    "/about",
    "/contact",
    "/bikes",
    "/book",
    "/faq",
    "/testimonials",
    "/why-choose-us",
    "/privacy-policy",
    "/terms",
    "/refund-policy",
    "/cancellation-policy",
    "/rental-policy",
    "/blog",
    "/careers",
    "/support",
    "/ranchi",
    "/login",
    "/signup",
  ];

  const bikePages = ranchiBikes.map((b) => `/bikes/${b.id}`);
  const blogPages = blogPosts.map((p) => `/blog/${p.slug}`);

  return [...staticPages, ...bikePages, ...blogPages].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date(),
    changeFrequency: path === "" ? "daily" : "weekly",
    priority: path === "" ? 1 : path.startsWith("/bikes") ? 0.9 : 0.7,
  }));
}
