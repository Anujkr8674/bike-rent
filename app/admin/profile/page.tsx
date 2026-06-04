"use client";

import { Button } from "@/components/ui/button";
import { AdminModulePage } from "@/components/admin/admin-module-page";

export default function AdminProfilePage() {
  return (
    <AdminModulePage
      eyebrow="Account"
      title="Profile & Password"
      description="Update admin name, email, avatar, and password from a dedicated account screen."
      actions={<Button>Save profile</Button>}
      stats={[
        { label: "Profile completeness", value: "0%" },
        { label: "Security score", value: "Basic" },
      ]}
    >
      <div className="rounded-3xl border border-dashed border-zinc-200 bg-white p-8 text-sm text-zinc-500 shadow-sm">
        Profile and password management form will be implemented here.
      </div>
    </AdminModulePage>
  );
}
