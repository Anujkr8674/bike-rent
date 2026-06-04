"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function SignupForm() {
  const router = useRouter();
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [info, setInfo] = useState("");

  async function requestOtp() {
    setLoading(true);
    setError("");
    setInfo("");
    const res = await fetch("/api/auth/signup/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ fullName, email, phone, password }),
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message || "Signup failed");
      return;
    }
    setInfo("OTP sent to your email. Check inbox (and spam).");
  }

  async function verifyAndCreate(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/signup/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include",
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message || "Verification failed");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="glass gradient-border mx-auto max-w-xl space-y-4 rounded-2xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Create Account</h1>
      <p className="text-sm text-slate-600">Sign up for Ranchi bike rentals with email OTP verification.</p>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}
      {info && <p className="rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">{info}</p>}

      <form onSubmit={verifyAndCreate} className="space-y-3">
        <div className="grid gap-3 md:grid-cols-2">
          <input className="input-field" placeholder="Full Name" value={fullName} onChange={(e) => setFullName(e.target.value)} required />
          <input className="input-field" placeholder="Phone Number" value={phone} onChange={(e) => setPhone(e.target.value)} required />
        </div>
        <input className="input-field" placeholder="Email" type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        <input className="input-field" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        <div className="flex gap-2">
          <input className="input-field" placeholder="Enter OTP" value={otp} onChange={(e) => setOtp(e.target.value)} required />
          <Button type="button" variant="outline" onClick={requestOtp} disabled={loading}>
            Send OTP
          </Button>
        </div>
        <Button type="submit" className="w-full" disabled={loading}>
          Verify & Create Account
        </Button>
      </form>

      <p className="text-center text-xs text-slate-600">
        Already have an account?{" "}
        <Link href="/login" className="text-blue-600 hover:underline">
          Login
        </Link>
      </p>
    </div>
  );
}
