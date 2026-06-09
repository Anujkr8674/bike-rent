import { getSession } from "@/lib/auth";
import { db } from "@/lib/db";
import { AdminModulePage } from "@/components/admin/admin-module-page";
import { redirect } from "next/navigation";

export default async function AdminProfilePage() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN") {
    redirect("/admin/login");
  }

  const admin = await db.admin.findUnique({
    where: { email: session.email },
  });

  if (!admin) {
    redirect("/admin/login");
  }

  return (
    <AdminModulePage
      eyebrow="Account"
      title="Profile Details"
      description="View your admin account information."
    >
      <div className="rounded-3xl border border-white/10 bg-[#111111] p-8 text-sm text-zinc-400 shadow-xl shadow-black/40">
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="font-semibold text-white mb-2">Full Name</p>
              <div className="bg-white/5 px-4 py-3 rounded-lg border border-white/10 text-white">
                {admin.fullName || "Not provided"}
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Email</p>
              <div className="bg-white/5 px-4 py-3 rounded-lg border border-white/10 text-white">
                {admin.email}
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Title/Role</p>
              <div className="bg-white/5 px-4 py-3 rounded-lg border border-white/10 text-white">
                {admin.title || "Not provided"}
              </div>
            </div>
            <div>
              <p className="font-semibold text-white mb-2">Account Status</p>
              <div className="bg-white/5 px-4 py-3 rounded-lg border border-white/10 text-white">
                {admin.isActive ? (
                  <span className="text-emerald-400 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-emerald-400"></span> Active
                  </span>
                ) : (
                  <span className="text-red-400 flex items-center gap-2">
                    <span className="h-2 w-2 rounded-full bg-red-400"></span> Inactive
                  </span>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminModulePage>
  );
}
