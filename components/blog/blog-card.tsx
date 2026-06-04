import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/content/blog";
import { Calendar, Clock } from "lucide-react";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="card-lift group block overflow-hidden rounded-2xl border border-zinc-200 bg-white">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={post.image} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
        <span className="absolute left-3 top-3 rounded-full bg-white/90 px-3 py-1 text-xs font-semibold text-blue-700">{post.category}</span>
      </div>
      <div className="p-5">
        <div className="flex gap-3 text-xs text-zinc-500">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold text-zinc-900 group-hover:text-blue-600">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-600">{post.excerpt}</p>
      </div>
    </Link>
  );
}
