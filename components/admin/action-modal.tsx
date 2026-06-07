"use client";

import { Loader2, CheckCircle2, XCircle, Info } from "lucide-react";
import { Button } from "@/components/ui/button";

export type ActionModalState = "hidden" | "confirm" | "loading" | "success" | "error" | "cancelled";

export type ActionModalProps = {
  state: ActionModalState;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  onClose: () => void;
  children?: React.ReactNode;
};

export function ActionModal({
  state,
  title,
  message,
  confirmText = "Submit",
  cancelText = "Cancel",
  onConfirm,
  onCancel,
  onClose,
  children,
}: ActionModalProps) {
  if (state === "hidden") return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-zinc-950/50 backdrop-blur-[2px] p-4">
      <div className="w-full max-w-sm rounded-2xl border border-zinc-200 bg-white p-6 shadow-2xl">
        {state === "confirm" && (
          <div className="flex flex-col items-center text-center">
            <Info className="h-10 w-10 text-amber-500 mb-3" />
            <h3 className="text-lg font-bold text-zinc-900">{title}</h3>
            <p className="mt-2 text-sm text-zinc-500">{message}</p>
            {children && <div className="mt-4 w-full text-left">{children}</div>}
            <div className="mt-6 flex w-full gap-3">
              <Button
                type="button"
                variant="outline"
                onClick={onCancel}
                className="w-full text-rose-600 hover:bg-rose-50 hover:text-rose-700 border-rose-200"
              >
                {cancelText}
              </Button>
              <Button
                type="button"
                onClick={onConfirm}
                className="w-full bg-emerald-600 hover:bg-emerald-700 text-white"
              >
                {confirmText}
              </Button>
            </div>
          </div>
        )}

        {state === "loading" && (
          <div className="flex flex-col items-center text-center">
            <Loader2 className="h-10 w-10 animate-spin text-[#FF5722]" />
            <p className="mt-4 text-base font-semibold text-zinc-900">Please wait...</p>
            <p className="mt-1 text-sm text-zinc-500">Do not close this window.</p>
          </div>
        )}

        {state === "success" && (
          <div className="flex flex-col items-center text-center">
            <CheckCircle2 className="h-12 w-12 text-emerald-500" />
            <h3 className="mt-4 text-lg font-bold text-zinc-900">Success</h3>
            <p className="mt-1 text-sm font-semibold text-emerald-600">{message}</p>
            <Button type="button" onClick={onClose} className="mt-6 w-full">
              Close
            </Button>
          </div>
        )}

        {state === "error" && (
          <div className="flex flex-col items-center text-center">
            <XCircle className="h-12 w-12 text-rose-500" />
            <h3 className="mt-4 text-lg font-bold text-zinc-900">Failed</h3>
            <p className="mt-1 text-sm font-semibold text-rose-600">{message}</p>
            <Button type="button" onClick={onClose} className="mt-6 w-full" variant="outline">
              Close
            </Button>
          </div>
        )}

        {state === "cancelled" && (
          <div className="flex flex-col items-center text-center">
            <XCircle className="h-12 w-12 text-rose-500" />
            <h3 className="mt-4 text-lg font-bold text-zinc-900">Cancelled</h3>
            <p className="mt-1 text-sm font-semibold text-rose-600">{message}</p>
            <Button type="button" onClick={onClose} className="mt-6 w-full" variant="outline">
              Close
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
