"use client";

import { AdminModulePage } from "@/components/admin/admin-module-page";

export default function AdminActivityPage() {
  return (
    <AdminModulePage
      eyebrow="Audit trail"
      title="Activity Logs"
      description="Track login, logout, create, update, delete, password changes, and settings updates for the admin team."
      stats={[
        { label: "Today", value: "0" },
        { label: "This week", value: "0" },
        { label: "Password changes", value: "0" },
        { label: "System events", value: "0" },
      ]}
    >
      <div className="rounded-3xl border border-dashed border-white/10 bg-[#111111] p-8 text-sm text-zinc-400 shadow-xl shadow-black/40">
        Immutable activity log stream will be added here.
      </div>
    </AdminModulePage>
  );
}
