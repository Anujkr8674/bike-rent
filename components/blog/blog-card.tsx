import Image from "next/image";
import Link from "next/link";
import type { BlogPost } from "@/lib/content/blog";
import { Calendar, Clock } from "lucide-react";

export function BlogCard({ post }: { post: BlogPost }) {
  return (
    <Link href={`/blog/${post.slug}`} className="group block overflow-hidden rounded-2xl border border-white/10 bg-[#0A0A0A] transition-all duration-300 hover:-translate-y-1 hover:border-[#FF6B1A] hover:shadow-[0_0_30px_rgba(255,107,26,0.3)]">
      <div className="relative aspect-[16/10] overflow-hidden">
        <Image src={post.image} alt={post.title} fill className="object-cover transition duration-500 group-hover:scale-105" sizes="(max-width:768px) 100vw, 33vw" />
        <span className="absolute left-3 top-3 rounded-full bg-black/60 backdrop-blur-md px-3 py-1 text-xs font-semibold text-[#FF6B1A]">{post.category}</span>
      </div>
      <div className="p-5">
        <div className="flex gap-3 text-xs text-zinc-400">
          <span className="flex items-center gap-1">
            <Calendar className="h-3.5 w-3.5" />
            {new Date(post.date).toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}
          </span>
          <span className="flex items-center gap-1">
            <Clock className="h-3.5 w-3.5" />
            {post.readTime}
          </span>
        </div>
        <h3 className="mt-3 font-display text-lg font-bold text-white transition-colors group-hover:text-[#FF6B1A]">{post.title}</h3>
        <p className="mt-2 line-clamp-2 text-sm text-zinc-400">{post.excerpt}</p>
      </div>
    </Link>
  );
}
