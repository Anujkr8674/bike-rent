"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { ArrowRight, Bike, FileText, Image as ImageIcon, PhoneCall, CalendarCheck, Users2 } from "lucide-react";
import { SectionReveal } from "@/components/ui/section-reveal";
import { Button } from "@/components/ui/button";
import { formatCurrency } from "@/lib/utils";

type Summary = {
  totalUsers: number;
  totalBookings: number;
  totalBikes: number;
  availableBikes: number;
  unavailableBikes: number;
  totalContacts: number;
  revenue: number;
  recentActivities: Array<{
    id: string;
    action: string;
    entityType: string;
    createdAt: string;
    admin?: { fullName: string | null; email: string };
  }>;
  recentContacts: Array<{
    id: string;
    fullName: string;
    email: string;
    subject: string;
    status: string;
    createdAt: string;
  }>;
};

const quickActions = [
  { href: "/admin/bikes", label: "Manage bikes", icon: Bike },
  { href: "/admin/contact", label: "Contacts", icon: PhoneCall },
  { href: "/admin/bookings", label: "Manage bookings", icon: CalendarCheck },
 
];

export default function AdminPage() {
  const [summary, setSummary] = useState<Summary | null>(null);

  useEffect(() => {
    fetch("/api/admin/analytics", { credentials: "include", cache: "no-store" })
      .then((r) => r.json())
      .then(setSummary)
      .catch(() => undefined);
  }, []);

  const cards = [
    { label: "Total bikes", value: summary?.totalBikes ?? 0, hint: "Managed in Supabase/Prisma", icon: Bike },
    { label: "Available", value: summary?.availableBikes ?? 0, hint: "Ready for booking", icon: Users2 },
    { label: "Unavailable", value: summary?.unavailableBikes ?? 0, hint: "Booked or blocked", icon: Bike },
    { label: "Contacts", value: summary?.totalContacts ?? 0, hint: "All inquiries", icon: PhoneCall },
    { label: "Bookings", value: summary?.totalBookings ?? 0, hint: "All booking records", icon: FileText },
    { label: "Revenue", value: formatCurrency(summary?.revenue ?? 0), hint: "Paid payments", icon: Users2 },
  ];

  return (
    <div className="space-y-8 px-5 pb-6 pt-0 md:px-8">
      <SectionReveal>
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Overview</p>
            <h1 className="font-display mt-2 text-3xl font-bold text-zinc-900 md:text-4xl">Dashboard</h1>
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-zinc-500">
              Monitor bikes, contacts, content, and activity from one place. This admin layer is ready for future
              bookings, payments, coupons, and customer modules.
            </p>
          </div>
          <div className="flex gap-2">
            <Link href="/admin/bikes">
              <Button className="gap-2">
                Add bike <ArrowRight className="h-4 w-4" />
              </Button>
            </Link>
            <Link href="/admin/contact">
              <Button variant="outline">Review contacts</Button>
            </Link>
          </div>
        </div>
      </SectionReveal>

      <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
        {cards.map((card, i) => {
          const Icon = card.icon;
          return (
            <SectionReveal key={card.label} delay={i * 0.05}>
              <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
                <div className="flex items-start justify-between gap-4">
                  <div>
                    <p className="text-sm font-medium text-zinc-500">{card.label}</p>
                    <p className="mt-2 font-display text-3xl font-bold text-zinc-900">{card.value}</p>
                  </div>
                  <div className="rounded-2xl bg-[#FF653F]/10 p-3 text-[#FF653F]">
                    <Icon className="h-5 w-5" />
                  </div>
                </div>
                <p className="mt-3 text-xs font-medium uppercase tracking-[0.25em] text-zinc-400">{card.hint}</p>
              </div>
            </SectionReveal>
          );
        })}
      </div>

      <div className="grid gap-6 xl:grid-cols-[1.4fr_0.9fr]">
        <SectionReveal>
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between gap-4">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">Recent contacts</p>
                <h2 className="mt-1 text-xl font-bold text-zinc-900">Contact inquiries</h2>
              </div>
              <Link href="/admin/contact" className="text-sm font-medium text-[#FF653F] hover:underline">
                View all
              </Link>
            </div>

            <div className="mt-4 space-y-3">
              {(summary?.recentContacts ?? []).length === 0 ? (
                <p className="rounded-2xl border border-dashed border-zinc-200 p-5 text-sm text-zinc-500">
                  No contacts yet. The contact form will feed this section once wired to the database.
                </p>
              ) : (
                summary?.recentContacts.map((contact) => (
                  <div key={contact.id} className="rounded-2xl border border-zinc-100 p-4">
                    <div className="flex items-start justify-between gap-4">
                      <div>
                        <p className="font-semibold text-zinc-900">{contact.fullName}</p>
                        <p className="text-sm text-zinc-500">{contact.email}</p>
                      </div>
                      <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                        {contact.status}
                      </span>
                    </div>
                    <p className="mt-2 text-sm text-zinc-600">{contact.subject}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </SectionReveal>

        <SectionReveal delay={0.05}>
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div>
              <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">Quick actions</p>
              <h2 className="mt-1 text-xl font-bold text-zinc-900">Jump into admin tasks</h2>
            </div>
            <div className="mt-4 space-y-3">
              {quickActions.map((action) => {
                const Icon = action.icon;
                return (
                  <Link
                    key={action.href}
                    href={action.href}
                    className="flex items-center justify-between rounded-2xl border border-zinc-100 px-4 py-3 transition hover:border-[#FF653F]/30 hover:bg-[#FF653F]/5"
                  >
                    <span className="flex items-center gap-3 font-medium text-zinc-800">
                      <Icon className="h-4.5 w-4.5 text-[#FF653F]" />
                      {action.label}
                    </span>
                    <ArrowRight className="h-4 w-4 text-zinc-400" />
                  </Link>
                );
              })}
            </div>

            {/* <div className="mt-6 rounded-2xl bg-zinc-50 p-4">
              <p className="text-sm font-medium text-zinc-600">Next step</p>
              <p className="mt-1 text-sm text-zinc-500">
                Wire Supabase Storage uploads and CMS routes to make the bike manager fully interactive.
              </p>
            </div> */}
          </div>
        </SectionReveal>
      </div>

      <div className="grid gap-6 xl:grid-cols-2">
        <SectionReveal>
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">Activity log</p>
                <h2 className="mt-1 text-xl font-bold text-zinc-900">Recent admin actions</h2>
              </div>
              <Link href="/admin/activity" className="text-sm font-medium text-[#FF653F] hover:underline">
                Open log
              </Link>
            </div>
            <div className="mt-4 space-y-3">
              {(summary?.recentActivities ?? []).length === 0 ? (
                <p className="rounded-2xl border border-dashed border-zinc-200 p-5 text-sm text-zinc-500">
                  No activity has been tracked yet.
                </p>
              ) : (
                summary?.recentActivities.map((entry) => (
                  <div key={entry.id} className="rounded-2xl border border-zinc-100 p-4">
                    <p className="text-sm font-medium text-zinc-900">{entry.action}</p>
                    <p className="text-sm text-zinc-500">
                      {entry.entityType}
                      {entry.admin?.fullName ? ` - ${entry.admin.fullName}` : ""}
                    </p>
                  </div>
                ))
              )}
            </div>
          </div>
        </SectionReveal>

        {/* <SectionReveal delay={0.05}>
          <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">System status</p>
            <h2 className="mt-1 text-xl font-bold text-zinc-900">Prepared for scale</h2>
            <ul className="mt-4 space-y-3 text-sm text-zinc-600">
              <li className="rounded-2xl bg-zinc-50 px-4 py-3">Prisma-backed admin data model</li>
              <li className="rounded-2xl bg-zinc-50 px-4 py-3">Supabase Storage ready for bike media</li>
              <li className="rounded-2xl bg-zinc-50 px-4 py-3">Route-guarded admin authentication</li>
              <li className="rounded-2xl bg-zinc-50 px-4 py-3">CMS placeholders for content, contacts, and logs</li>
            </ul>
          </div>
        </SectionReveal> */}
        <SectionReveal delay={0.05}>
  <div className="rounded-3xl border border-zinc-200 bg-white p-5 shadow-sm">
    <p className="text-sm font-semibold uppercase tracking-[0.25em] text-zinc-400">
      Admin Overview
    </p>
    <h2 className="mt-1 text-xl font-bold text-zinc-900">
      Manage your rental business
    </h2>

    <ul className="mt-4 space-y-3 text-sm text-zinc-600">
      <li className="rounded-2xl bg-zinc-50 px-4 py-3">
        Monitor bookings and customer requests
      </li>
      <li className="rounded-2xl bg-zinc-50 px-4 py-3">
        Manage bikes, categories, and availability
      </li>
      <li className="rounded-2xl bg-zinc-50 px-4 py-3">
        Track payments and booking status
      </li>
      <li className="rounded-2xl bg-zinc-50 px-4 py-3">
        View customer details and rental history
      </li>
    </ul>
  </div>
</SectionReveal>
      </div>
    </div>
  );
}
