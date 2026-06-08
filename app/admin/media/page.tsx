"use client";

import { Button } from "@/components/ui/button";
import { AdminModulePage } from "@/components/admin/admin-module-page";

export default function AdminMediaPage() {
  return (
    <AdminModulePage
      eyebrow="Asset library"
      title="Media Library"
      description="Browse uploaded assets, preview files, copy URLs, search by filename, and delete unused media from Supabase Storage."
      actions={<Button>Upload media</Button>}
      stats={[
        { label: "Images", value: "0" },
        { label: "Videos", value: "0" },
        { label: "Files", value: "0" },
        { label: "Storage usage", value: "0 MB" },
      ]}
    >
      <div className="rounded-3xl border border-dashed border-white/10 bg-[#111111] p-8 text-sm text-zinc-400 shadow-xl shadow-black/40">
        Media grid, preview drawer, copy URL, and delete actions will be built here.
      </div>
    </AdminModulePage>
  );
}
