"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { siteAssets } from "@/lib/site-assets";

export function AdminLoginForm() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setLoading(true);
    setError("");
    const res = await fetch("/api/auth/admin/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ username, password }),
      credentials: "include",
    });
    const data = await res.json();
    setLoading(false);
    if (!res.ok) {
      setError(data.message || "Invalid credentials");
      return;
    }
    router.push("/admin");
    router.refresh();
  }

  return (
    <div className="glass gradient-border mx-auto max-w-md space-y-5 rounded-2xl p-8">
      <div className="flex flex-col items-center gap-3 text-center">
        <img src={siteAssets.logo} alt="Nextgen Logo" className="h-16 w-auto object-contain drop-shadow-md" />
        <div>
          <h1 className="text-2xl font-bold text-slate-900">Admin Login</h1>
          <p className="text-sm text-slate-600">Nextgen control panel</p>
        </div>
      </div>

      {error && <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-3">
        <input
          className="input-field"
          placeholder="Admin ID"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          autoComplete="username"
          required
        />
        <input
          className="input-field"
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          autoComplete="current-password"
          required
        />
        <Button type="submit" className="w-full" disabled={loading}>
          {loading ? "Signing in..." : "Login to Dashboard"}
        </Button>
      </form>
    </div>
  );
}
