"use client";

import { useState } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [msg, setMsg] = useState("");

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setMsg(res.ok ? "Reset link sent to your email." : "Could not send reset email.");
  }

  return (
    <div className="page-wrap py-12">
      <form onSubmit={submit} className="glass mx-auto max-w-lg space-y-4 rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-slate-900">Forgot Password</h1>
        <input className="input-field" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        {msg && <p className="text-sm text-emerald-700">{msg}</p>}
        <Button type="submit" className="w-full">
          Send Reset Link
        </Button>
        <Link href="/login" className="block text-center text-sm text-blue-600 hover:underline">
          Back to login
        </Link>
      </form>
    </div>
  );
}
