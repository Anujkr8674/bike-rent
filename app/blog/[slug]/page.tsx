import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { blogPosts, getBlogPost } from "@/lib/content/blog";
import { BlogCard } from "@/components/blog/blog-card";
import { PageHero } from "@/components/layout/page-hero";
import { Calendar, Clock, ArrowLeft } from "lucide-react";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return blogPosts.map((p) => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) return { title: "Post not found" };
  return {
    title: post.title,
    description: post.excerpt,
    keywords: post.keywords,
    openGraph: { title: post.title, description: post.excerpt, images: [post.image] },
  };
}

export default async function BlogDetailPage({ params }: Props) {
  const { slug } = await params;
  const post = getBlogPost(slug);
  if (!post) notFound();

  const related = blogPosts.filter((p) => p.slug !== slug && p.category === post.category).slice(0, 3);

  const jsonLd = {
    "@context": "https://schema.org",
    "@type": "BlogPosting",
    headline: post.title,
    description: post.excerpt,
    datePublished: post.date,
    author: { "@type": "Organization", name: post.author },
    image: post.image,
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <PageHero
        badge={post.category}
        title={post.title}
        subtitle={post.excerpt}
        breadcrumbs={[{ label: "Home", href: "/" }, { label: "Blog", href: "/blog" }, { label: post.title }]}
        backgroundImage={post.image}
        variant="dark"
      />
      <article className="page-wrap py-12 md:py-16">
        <div className="relative mb-10 aspect-[21/9] overflow-hidden rounded-2xl">
          <Image src={post.image} alt={post.title} fill className="object-cover" priority sizes="100vw" />
        </div>
        <div className="flex flex-wrap gap-4 text-sm text-zinc-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-4 w-4" />
            {new Date(post.date).toLocaleDateString("en-IN", { dateStyle: "long" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-4 w-4" />
            {post.readTime} read
          </span>
          <span>By {post.author}</span>
        </div>
        <div className="prose prose-zinc mt-10 max-w-3xl">
          {post.content.map((para, i) => (
            <p key={i} className="mb-6 text-lg leading-relaxed text-zinc-700">
              {para}
            </p>
          ))}
        </div>
        <Link href="/blog" className="mt-12 inline-flex items-center gap-2 text-sm font-medium text-blue-600 hover:underline">
          <ArrowLeft className="h-4 w-4" />
          Back to blog
        </Link>
        {related.length > 0 && (
          <section className="mt-16 border-t border-zinc-200 pt-16">
            <h2 className="section-title">Related articles</h2>
            <div className="mt-8 grid gap-6 sm:grid-cols-3">
              {related.map((p) => (
                <BlogCard key={p.slug} post={p} />
              ))}
            </div>
          </section>
        )}
      </article>
    </>
  );
}
