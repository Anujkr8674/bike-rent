"use client";

import { useState, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Link from "next/link";
import { Button } from "@/components/ui/button";

function ResetForm() {
  const params = useSearchParams();
  const email = params.get("email") || "";
  const token = params.get("token") || "";
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    if (password !== confirm) {
      setMsg("Passwords do not match.");
      return;
    }
    const res = await fetch("/api/auth/reset-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, token, password }),
    });
    setMsg(res.ok ? "Password updated. You can login now." : "Reset failed.");
  }

  return (
    <form onSubmit={submit} className="glass mx-auto max-w-lg space-y-4 rounded-2xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Reset Password</h1>
      <input className="input-field" type="password" placeholder="New Password" value={password} onChange={(e) => setPassword(e.target.value)} required />
      <input className="input-field" type="password" placeholder="Confirm Password" value={confirm} onChange={(e) => setConfirm(e.target.value)} required />
      {msg && <p className="text-sm text-slate-600">{msg}</p>}
      <Button type="submit" className="w-full">
        Reset Password
      </Button>
      <Link href="/login" className="block text-center text-sm text-blue-600 hover:underline">
        Back to login
      </Link>
    </form>
  );
}

export default function ResetPasswordPage() {
  return (
    <div className="page-wrap py-12">
      <Suspense>
        <ResetForm />
      </Suspense>
    </div>
  );
}
