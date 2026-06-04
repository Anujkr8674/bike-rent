"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState, type ReactNode } from "react";
import {
  LayoutDashboard,
  Bike,
  Users2,
  Image as ImageIcon,
  Settings2,
  History,
  UserCircle2,
  LogOut,
  ClipboardList,
  Sparkles,
  CalendarCheck,
} from "lucide-react";
import { logoutCompletely } from "@/lib/auth-client";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const navItems = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard },
  { href: "/admin/bikes", label: "Bikes", icon: Bike },
  { href: "/admin/bookings", label: "Bookings", icon: CalendarCheck },
  { href: "/admin/contact", label: "Contacts", icon: Users2 },
  // { href: "/admin/media", label: "Media Library", icon: ImageIcon },
  // { href: "/admin/settings", label: "Settings", icon: Settings2 },
  // { href: "/admin/activity", label: "Activity Logs", icon: History },
  { href: "/admin/profile", label: "Profile", icon: UserCircle2 },
  // { href: "/admin/content", label: "CMS Content", icon: ClipboardList },
];

export function AdminShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const isLogin = pathname === "/admin/login";

  if (isLogin) return <div className="mesh-bg min-h-screen">{children}</div>;

  return (
    <div className="min-h-screen bg-zinc-50">
      {mobileNavOpen ? (
        <button
          type="button"
          aria-label="Close navigation"
          className="fixed inset-0 z-40 bg-zinc-950/40 backdrop-blur-[2px] md:hidden"
          onClick={() => setMobileNavOpen(false)}
        />
      ) : null}

      <div className="grid min-h-screen md:grid-cols-[280px_1fr]">
        <aside
          className={cn(
            "fixed inset-y-0 left-0 z-50 w-72 border-r border-zinc-200 bg-white/95 backdrop-blur-xl transition-transform duration-300 md:sticky md:top-0 md:z-auto md:h-screen md:max-h-screen md:w-auto md:translate-x-0 md:overflow-y-auto",
            mobileNavOpen ? "translate-x-0" : "-translate-x-full md:translate-x-0",
          )}
        >
          <div className="flex min-h-full flex-col">
            <div className="border-b border-zinc-100 px-6 py-5">
              <div className="flex items-center gap-3">
                <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-[#FF653F] to-[#FF4F2E] text-white shadow-lg shadow-[#FF653F]/20">
                  <Sparkles className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.3em] text-zinc-400">Admin</p>
                  <h1 className="font-display text-lg font-bold text-zinc-900">Nextgen Control</h1>
                </div>
              </div>
            </div>

            <nav className="flex-1 space-y-1 px-3 py-4">
              {navItems.map((item) => {
                const active = pathname === item.href || (item.href !== "/admin" && pathname.startsWith(`${item.href}/`));
                const Icon = item.icon;

                return (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setMobileNavOpen(false)}
                    className={cn(
                      "flex items-center gap-3 rounded-2xl px-4 py-3 text-sm font-medium transition",
                      active
                        ? "bg-[#FF653F]/10 text-[#FF653F]"
                        : "text-zinc-600 hover:bg-zinc-100 hover:text-zinc-900",
                    )}
                  >
                    <Icon className="h-4 w-4" />
                    {item.label}
                  </Link>
                );
              })}
            </nav>

            <div className="border-t border-zinc-100 p-4">
              <Link
                href="/"
                className="mb-3 flex items-center justify-center rounded-2xl border border-zinc-200 px-4 py-3 text-sm font-medium text-zinc-700 transition hover:border-[#FF653F]/40 hover:bg-[#FF653F]/5 hover:text-[#FF653F]"
              >
                View public site
              </Link>
              <Button
                variant="outline"
                className="w-full gap-2"
                onClick={() => logoutCompletely("/admin/login")}
              >
                <LogOut className="h-4 w-4" />
                Logout
              </Button>
            </div>
          </div>
        </aside>

        <div className="min-w-0">
          <div className="sticky top-0 z-30 border-b border-zinc-200 bg-white/90 px-4 py-3 backdrop-blur-xl md:hidden">
            <div className="flex items-center justify-between gap-3">
              <button
                type="button"
                onClick={() => setMobileNavOpen(true)}
                className="inline-flex items-center gap-2 rounded-xl border border-zinc-200 bg-white px-3 py-2 text-sm font-semibold text-zinc-800 shadow-sm"
              >
                <span className="inline-flex h-2 w-2 rounded-full bg-[#FF653F]" />
                Menu
              </button>
              <Link href="/" className="text-sm font-medium text-zinc-600 hover:text-[#FF653F]">
                Open site
              </Link>
            </div>
          </div>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
