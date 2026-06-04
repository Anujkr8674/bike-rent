"use client";

import { useState } from "react";
import { PageHero } from "@/components/layout/page-hero";
import { BlogCard } from "@/components/blog/blog-card";
import { blogPosts } from "@/lib/content/blog";
import { SectionReveal } from "@/components/ui/section-reveal";
import { cn } from "@/lib/utils";
import { heroImages } from "@/lib/content/hero-images";

const categories = ["All", ...Array.from(new Set(blogPosts.map((p) => p.category)))];

export default function BlogPage() {
  const [cat, setCat] = useState("All");
  const filtered = cat === "All" ? blogPosts : blogPosts.filter((p) => p.category === cat);
  const featured = blogPosts[0];

  return (
    <>
      <PageHero
        badge="Blog"
        title="Riding guides & Ranchi insights"
        subtitle="SEO-friendly articles on bike rental, travel in Jharkhand, safety tips, and getting the best value from your rental."
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog" }]}
        backgroundImage={heroImages.blog}
      />
      <div className="page-wrap py-16 md:py-24">
        <SectionReveal>
          <BlogCard post={featured} />
        </SectionReveal>

        <div className="mt-12 flex flex-wrap gap-2">
          {categories.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn("chip", cat === c && "chip-active")}
            >
              {c}
            </button>
          ))}
        </div>

        <div className="mt-10 grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.slice(1).map((post, i) => (
            <SectionReveal key={post.slug} delay={i * 0.05}>
              <BlogCard post={post} />
            </SectionReveal>
          ))}
        </div>
      </div>
    </>
  );
}
