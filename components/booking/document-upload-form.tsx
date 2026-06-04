"use client";

import { useState, useRef } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { documentUploadSchema } from "@/lib/booking/schemas";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Loader2, X } from "lucide-react";

const formSchema = documentUploadSchema;
type FormValues = z.infer<typeof formSchema>;

type Props = {
  trackingId: string;
  email: string;
  onSuccess?: () => void;
  allowReupload?: boolean;
};

export function DocumentUploadForm({ trackingId, email, onSuccess, allowReupload = true }: Props) {
  const [dlFront, setDlFront] = useState<File | null>(null);
  const [dlBack, setDlBack] = useState<File | null>(null);
  const [aadhaarFront, setAadhaarFront] = useState<File | null>(null);
  const [aadhaarBack, setAadhaarBack] = useState<File | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [previewModal, setPreviewModal] = useState<{ url: string; label: string } | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: { trackingId, email },
  });

  const onSubmit = handleSubmit(async (data) => {
    if (!dlFront || !dlBack || !aadhaarFront || !aadhaarBack) {
      setError("Please upload all four images.");
      return;
    }
    setBusy(true);
    setError(null);
    const fd = new FormData();
    fd.set("trackingId", data.trackingId);
    fd.set("email", data.email);
    fd.set("dlNumber", data.dlNumber);
    fd.set("aadhaarNumber", data.aadhaarNumber);
    fd.set("dlFront", dlFront);
    fd.set("dlBack", dlBack);
    fd.set("aadhaarFront", aadhaarFront);
    fd.set("aadhaarBack", aadhaarBack);

    try {
      const res = await fetch("/api/bookings/documents", { method: "POST", body: fd });
      const json = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(json.message || "Upload failed");
      setSuccess(true);
      onSuccess?.();
    } catch (uploadError) {
      setError(uploadError instanceof Error ? uploadError.message : "Upload failed");
    } finally {
      setBusy(false);
    }
  });

  if (success && !allowReupload) {
    return <p className="rounded-lg bg-emerald-50 px-4 py-3 text-sm text-emerald-800">Documents submitted successfully.</p>;
  }

  return (
    <>
      <form onSubmit={onSubmit} className="space-y-4">
        <input type="hidden" {...register("trackingId")} />
        <input type="hidden" {...register("email")} />

        <div>
          <label className="text-sm font-medium">Driving license number *</label>
          <input {...register("dlNumber")} className="input-field mt-1 w-full" />
          {errors.dlNumber ? <p className="text-xs text-rose-600">{errors.dlNumber.message}</p> : null}
        </div>

        <div className="grid gap-8 sm:grid-cols-2">
          <FileField label="DL front *" file={dlFront} onChange={setDlFront} onPreview={() => dlFront && setPreviewModal({ url: URL.createObjectURL(dlFront), label: "DL Front" })} />
          <FileField label="DL back *" file={dlBack} onChange={setDlBack} onPreview={() => dlBack && setPreviewModal({ url: URL.createObjectURL(dlBack), label: "DL Back" })} />
          <FileField label="Aadhaar front *" file={aadhaarFront} onChange={setAadhaarFront} onPreview={() => aadhaarFront && setPreviewModal({ url: URL.createObjectURL(aadhaarFront), label: "Aadhaar Front" })} />
          <FileField label="Aadhaar back *" file={aadhaarBack} onChange={setAadhaarBack} onPreview={() => aadhaarBack && setPreviewModal({ url: URL.createObjectURL(aadhaarBack), label: "Aadhaar Back" })} />
        </div>

        <div>
          <label className="text-sm font-medium">Aadhaar number *</label>
          <input {...register("aadhaarNumber")} className="input-field mt-1 w-full" maxLength={12} />
          {errors.aadhaarNumber ? <p className="text-xs text-rose-600">{errors.aadhaarNumber.message}</p> : null}
        </div>

        {error ? <p className="text-sm text-rose-600">{error}</p> : null}
        {success ? <p className="text-sm text-emerald-600">Uploaded successfully. Admin will verify shortly.</p> : null}

        <Button type="submit" disabled={busy} className="w-full">
          {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : "Submit documents"}
        </Button>
      </form>

      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-lg bg-white">
            <button
              onClick={() => setPreviewModal(null)}
              className="sticky top-0 right-0 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-4">
              <p className="mb-3 text-sm font-medium text-zinc-900">{previewModal.label}</p>
              <img src={previewModal.url} alt={previewModal.label} className="w-full rounded-lg" />
            </div>
          </div>
        </div>
      )}
    </>
  );
}

function FileField({ label, file, onChange, onPreview }: { label: string; file: File | null; onChange: (f: File | null) => void; onPreview: () => void }) {
  const inputRef = useRef<HTMLInputElement>(null);
  
  return (
    <div>
      <label className="text-xs font-medium text-zinc-600">{label}</label>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => onChange(e.target.files?.[0] ?? null)}
      />
      {file && (
        <button
          type="button"
          onClick={onPreview}
          className="mt-1 mb-2 w-full overflow-hidden rounded-lg border border-zinc-200 hover:border-[#FF653F] hover:shadow-md transition group"
        >
          <img
            src={URL.createObjectURL(file)}
            alt={label}
            className="h-40 w-full object-cover group-hover:opacity-80"
          />
        </button>
      )}
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
        className="w-full rounded-lg border-2 border-dashed border-[#FF653F]/30 bg-[#FF653F]/5 px-4 py-2.5 text-sm font-medium text-[#FF653F] transition hover:border-[#FF653F]/60 hover:bg-[#FF653F]/10"
      >
        {file ? file.name : "Choose File"}
      </button>
    </div>
  );
}
