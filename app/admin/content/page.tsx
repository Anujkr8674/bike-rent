"use client";

import { AdminModulePage } from "@/components/admin/admin-module-page";

export default function AdminContentPage() {
  return (
    <AdminModulePage
      eyebrow="CMS"
      title="Content Manager"
      description="Centralize admin-managed bike content, FAQs, homepage blocks, testimonials, and SEO-ready pages."
      stats={[
        { label: "Bikes content", value: "0" },
        { label: "Homepage blocks", value: "0" },
        { label: "SEO pages", value: "0" },
        { label: "Rich text docs", value: "0" },
      ]}
    >
      <div className="rounded-3xl border border-dashed border-white/10 bg-[#111111] p-8 text-sm text-zinc-400 shadow-xl shadow-black/40">
        TipTap-powered rich text editors and CMS blocks will live here.
      </div>
    </AdminModulePage>
  );
}
