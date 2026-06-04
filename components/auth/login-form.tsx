"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";

export function LoginForm() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password }),
      credentials: "include",
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message || "Login failed");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  async function sendOtp() {
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/request-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });
    setLoading(false);
    if (!res.ok) {
      const data = await res.json();
      setError(data.message || "Could not send OTP");
      return;
    }
    setOtpSent(true);
  }

  async function verifyOtp(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/verify-otp", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, otp }),
      credentials: "include",
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message || "Invalid OTP");
      return;
    }
    router.push("/dashboard");
    router.refresh();
  }

  return (
    <div className="glass gradient-border mx-auto max-w-lg space-y-4 rounded-2xl p-6">
      <h1 className="text-2xl font-bold text-slate-900">Login to Nextgen</h1>
      <p className="text-sm text-slate-600">Ranchi bike rental — password or email OTP.</p>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handlePasswordLogin} className="space-y-3">
        <input
          className="input-field"
          placeholder="Email"
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
        <input
          className="input-field"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <Button type="submit" className="w-full" disabled={loading}>
          Login with Password
        </Button>
      </form>

      <div className="relative text-center text-xs text-slate-400">
        <span className="bg-white px-2">or OTP login</span>
      </div>

      <form onSubmit={verifyOtp} className="space-y-3">
        <div className="flex gap-2">
          <input
            className="input-field"
            placeholder="OTP"
            value={otp}
            onChange={(e) => setOtp(e.target.value)}
          />
          <Button type="button" variant="outline" onClick={sendOtp} disabled={loading || !email}>
            {otpSent ? "Resend" : "Send OTP"}
          </Button>
        </div>
        <Button type="submit" variant="outline" className="w-full" disabled={loading || !otp}>
          Verify OTP & Login
        </Button>
      </form>

      <div className="flex justify-between text-xs text-slate-600">
        <Link href="/signup" className="text-blue-600 hover:underline">
          Create account
        </Link>
        <Link href="/forgot-password" className="hover:underline">
          Forgot password?
        </Link>
      </div>
    </div>
  );
}
