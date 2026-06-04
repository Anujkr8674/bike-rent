"use client";

import { Button } from "@/components/ui/button";
import { AdminModulePage } from "@/components/admin/admin-module-page";

export default function AdminSettingsPage() {
  return (
    <AdminModulePage
      eyebrow="Configuration"
      title="Settings"
      description="Manage website info, contact details, social links, and SEO defaults from a single source of truth."
      actions={<Button>Save settings</Button>}
      stats={[
        { label: "Site name", value: "Nextgen" },
        { label: "Phone", value: "+91..." },
        { label: "WhatsApp", value: "+91..." },
        { label: "SEO status", value: "Draft" },
      ]}
    >
      <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-8 text-sm text-zinc-500 shadow-sm">
        Settings form with validation and sectioned controls will live here.
      </div>
    </AdminModulePage>
  );
}
