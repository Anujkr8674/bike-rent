"use client";

import { useState } from "react";
import { AdminModulePage } from "@/components/admin/admin-module-page";
import { Button } from "@/components/ui/button";

export default function AdminChangePasswordPage() {
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess(false);

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      setLoading(false);
      return;
    }

    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      setLoading(false);
      return;
    }

    try {
      const res = await fetch("/api/auth/admin/change-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ currentPassword, newPassword }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "Failed to change password.");
      } else {
        setSuccess(true);
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch (err) {
      setError("An unexpected error occurred.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <AdminModulePage
      eyebrow="Security"
      title="Change Password"
      description="Update your admin account password to keep it secure."
    >
      <div className="rounded-3xl border border-white/10 bg-[#111111] p-8 shadow-xl shadow-black/40 max-w-xl">
        {error && (
          <div className="mb-6 rounded-lg border border-red-500/50 bg-red-950/50 p-4 text-sm text-red-400">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 rounded-lg border border-emerald-500/50 bg-emerald-950/50 p-4 text-sm text-emerald-400">
            Password updated successfully.
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Current Password
            </label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#FF653F] focus:outline-none focus:ring-1 focus:ring-[#FF653F] transition-colors"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              New Password
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#FF653F] focus:outline-none focus:ring-1 focus:ring-[#FF653F] transition-colors"
              required
            />
          </div>
          <div>
            <label className="mb-2 block text-sm font-medium text-zinc-300">
              Confirm New Password
            </label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="w-full rounded-xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-white placeholder-zinc-500 focus:border-[#FF653F] focus:outline-none focus:ring-1 focus:ring-[#FF653F] transition-colors"
              required
            />
          </div>

          <div className="pt-2">
            <Button type="submit" disabled={loading} className="w-full md:w-auto">
              {loading ? "Updating..." : "Update Password"}
            </Button>
          </div>
        </form>
      </div>
    </AdminModulePage>
  );
}
