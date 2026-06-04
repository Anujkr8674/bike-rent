"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Send } from "lucide-react";

export function ContactForm() {
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError("");

    const formData = new FormData(e.currentTarget);
    const payload = {
      fullName: String(formData.get("fullName") || ""),
      email: String(formData.get("email") || ""),
      phone: String(formData.get("phone") || ""),
      subject: String(formData.get("subject") || ""),
      message: String(formData.get("message") || ""),
    };

    const res = await fetch("/api/contact", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      setError(data.message || "Unable to send message.");
      return;
    }

    setSent(true);
  }

  if (sent) {
    return (
      <div className="glass-strong rounded-2xl p-8 text-center">
        <p className="font-display text-xl font-bold text-zinc-900">Message received</p>
        <p className="mt-2 text-zinc-600">Our Ranchi team will respond within 2 hours during business hours.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="glass-strong gradient-border space-y-4 rounded-2xl p-6 md:p-8">
      <div className="grid gap-4 md:grid-cols-2">
        <input className="input-field" name="fullName" placeholder="Full name" required />
        <input className="input-field" name="email" type="email" placeholder="Email" required />
      </div>
      <input className="input-field" name="phone" placeholder="Phone" required />
      <select className="input-field" name="subject" required defaultValue="">
        <option value="" disabled>
          Subject
        </option>
        <option>Booking inquiry</option>
        <option>Support</option>
        <option>Partnership</option>
        <option>Other</option>
      </select>
      <textarea className="input-field min-h-[120px] resize-y" name="message" placeholder="Your message" required />
      {error && <p className="rounded-xl bg-red-50 px-4 py-3 text-sm text-red-600">{error}</p>}
      <Button type="submit" className="w-full gap-2" disabled={loading}>
        <Send className="h-4 w-4" />
        {loading ? "Sending..." : "Send Message"}
      </Button>
    </form>
  );
}
