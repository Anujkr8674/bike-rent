"use client";

import { usePathname } from "next/navigation";
import { Navbar } from "@/components/navbar";
import { Footer } from "@/components/footer";
import type { ReactNode } from "react";

const hiddenChromePrefixes = ["/admin"];

export function SiteShell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const hideChrome = hiddenChromePrefixes.some((prefix) => pathname.startsWith(prefix));

  return (
    <div className="flex min-h-screen flex-col">
      {!hideChrome && <Navbar />}
      <main className="flex-1">{children}</main>
      {!hideChrome && <Footer />}
    </div>
  );
}
