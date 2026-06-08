"use client";

import { Loader2 } from "lucide-react";

type PleaseWaitOverlayProps = {
  open: boolean;
  message?: string;
};

export function PleaseWaitOverlay({ open, message = "Please wait..." }: PleaseWaitOverlayProps) {
  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-[#000000]/80 backdrop-blur-[2px]">
      <div className="mx-4 flex min-w-[240px] flex-col items-center rounded-2xl border border-white/10 bg-[#111111] px-8 py-7 shadow-2xl">
        <Loader2 className="h-10 w-10 animate-spin text-[#FF5722]" />
        <p className="mt-4 text-base font-semibold text-white">{message}</p>
        <p className="mt-1 text-sm text-zinc-400">Do not close this window.</p>
      </div>
    </div>
  );
}
