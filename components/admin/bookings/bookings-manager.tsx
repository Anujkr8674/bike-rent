"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  CalendarCheck,
  ChevronDown,
  Eye,
  Loader2,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
  IndianRupee,
  FileCheck,
  Clock,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn, formatCurrency } from "@/lib/utils";
import { formatDateTimeIndian } from "@/lib/rental-datetime";

const bookingStatusOptions = [
  "all",
  "AWAITING_DOCUMENTS",
  "VERIFICATION_PENDING",
  "CONFIRMED",
  "ACTIVE",
  "COMPLETED",
  "CANCELLED",
] as const;

type BookingStatusFilter = (typeof bookingStatusOptions)[number];
type BookingStatus = Exclude<BookingStatusFilter, "all">;

const bookingStatusLabels: Record<BookingStatusFilter, string> = {
  all: "All statuses",
  AWAITING_DOCUMENTS: "Awaiting documents",
  VERIFICATION_PENDING: "Verification pending",
  CONFIRMED: "Confirmed",
  ACTIVE: "Active",
  COMPLETED: "Completed",
  CANCELLED: "Cancelled",
};

type BookingRow = {
  id: string;
  trackingId: string | null;
  bookingRef: string;
  customerName: string | null;
  customerEmail: string | null;
  customerPhone: string | null;
  bikeName: string | null;
  bikeNumber: string | null;
  bikeColor: string | null;
  pickupDate: string;
  pickupTime?: string | null;
  dropDate: string;
  returnTime?: string | null;
  paymentStatus: string;
  documentStatus: string;
  status: string;
  amount: unknown;
  securityDeposit: unknown;
  createdAt: string;
  payment?: { amount: unknown } | null;
  documents?: {
    verificationStatus: string;
    dlNumber?: string | null;
    dlFrontUrl?: string | null;
    dlBackUrl?: string | null;
    aadhaarNumber?: string | null;
    aadhaarFrontUrl?: string | null;
    aadhaarBackUrl?: string | null;
  } | null;
};

type BookingsResponse = {
  bookings: BookingRow[];
  stats: {
    total: number;
    paidCount: number;
    awaitingDocs: number;
    verificationPending: number;
    confirmedCount: number;
    activeCount: number;
    revenue: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

function getBookingStatusTone(status: string) {
  switch (status) {
    case "CONFIRMED":
    case "ACTIVE":
    case "COMPLETED":
      return { wrapper: "bg-emerald-50 text-emerald-700", label: bookingStatusLabels[status as BookingStatus] ?? status };
    case "VERIFICATION_PENDING":
      return { wrapper: "bg-violet-50 text-violet-700", label: "Verification pending" };
    case "AWAITING_DOCUMENTS":
      return { wrapper: "bg-amber-50 text-amber-800", label: "Awaiting documents" };
    case "CANCELLED":
      return { wrapper: "bg-rose-50 text-rose-700", label: "Cancelled" };
    default:
      return { wrapper: "bg-zinc-100 text-zinc-600", label: status.replace(/_/g, " ") };
  }
}

function getPaymentTone(status: string) {
  if (status === "PAID") return "bg-emerald-50 text-emerald-700";
  if (status === "PENDING") return "bg-amber-50 text-amber-800";
  if (status === "FAILED") return "bg-rose-50 text-rose-700";
  return "bg-zinc-100 text-zinc-600";
}

function ModalFrame({
  open,
  title,
  description,
  onClose,
  children,
  className,
}: {
  open: boolean;
  title: string;
  description?: string;
  onClose: () => void;
  children: ReactNode;
  className?: string;
}) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/55 p-3 backdrop-blur-sm sm:p-5">
      <div
        role="dialog"
        aria-modal="true"
        className={cn(
          "relative w-full max-w-4xl overflow-hidden rounded-2xl border border-zinc-200 bg-white shadow-2xl",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-zinc-100 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FF653F]">Booking details</p>
            <h3 className="mt-1 text-xl font-bold text-zinc-900 sm:text-2xl">{title}</h3>
            {description ? <p className="mt-1 text-sm text-zinc-500">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-zinc-200 text-zinc-500 hover:text-zinc-800"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function BookingsManager() {
  const [data, setData] = useState<BookingsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<BookingStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detail, setDetail] = useState<BookingRow | null>(null);
  const [previewModal, setPreviewModal] = useState<{ url: string; label: string } | null>(null);

  const load = (pageNumber = page) => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status !== "all") params.set("status", status);
    params.set("page", String(pageNumber));
    params.set("limit", "15");

    fetch(`/api/admin/bookings?${params}`)
      .then((r) => r.json())
      .then((json: BookingsResponse & { message?: string }) => {
        if (!json.bookings) throw new Error(json.message || "Failed to load");
        setData(json);
      })
      .catch((err) => setError(err instanceof Error ? err.message : "Failed to load"))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    const timer = window.setTimeout(() => load(page), 220);
    return () => window.clearTimeout(timer);
  }, [page, q, status]);

  const summaryItems = useMemo(
    () => [
      { label: "Total bookings", value: data?.stats.total ?? 0, color: "text-zinc-900", icon: CalendarCheck },
      { label: "Paid", value: data?.stats.paidCount ?? 0, color: "text-emerald-600", icon: IndianRupee },
      { label: "Awaiting docs", value: data?.stats.awaitingDocs ?? 0, color: "text-amber-600", icon: FileCheck },
      { label: "Verification", value: data?.stats.verificationPending ?? 0, color: "text-violet-600", icon: Clock },
      { label: "Confirmed", value: data?.stats.confirmedCount ?? 0, color: "text-sky-600", icon: ShieldCheck },
      { label: "Revenue", value: formatCurrency(data?.stats.revenue ?? 0), color: "text-[#FF653F]", icon: IndianRupee },
    ],
    [data?.stats],
  );

  const runAction = async (id: string, action: string, extra?: Record<string, string>) => {
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const res = await fetch(`/api/admin/bookings/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, ...extra }),
      });
      const json = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(json.message || "Action failed");
      setSuccess("Booking updated.");
      load(page);
      if (detailId === id) {
        const detailRes = await fetch(`/api/admin/bookings/${id}`).then((r) => r.json());
        setDetail(detailRes.booking);
      }
    } catch (actionError) {
      setError(actionError instanceof Error ? actionError.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const openDetails = async (row: BookingRow) => {
    setDetailId(row.id);
    setDetail(row);
    try {
      const detailRes = await fetch(`/api/admin/bookings/${row.id}`).then((r) => r.json());
      if (detailRes.booking) setDetail(detailRes.booking);
    } catch {
      // keep row data
    }
  };

  const detailTone = getBookingStatusTone(detail?.status ?? "");

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#FF653F]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-zinc-900 sm:text-3xl">Bookings</h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-500">
            Guest bookings, payments, document verification, and status updates.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => load(1)} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </section>

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="grid divide-y divide-zinc-100 sm:grid-cols-3 lg:grid-cols-6 sm:divide-x sm:divide-y-0">
          {summaryItems.map((item) => {
            const Icon = item.icon;
            return (
              <div key={item.label} className="flex items-center gap-3 px-4 py-4">
                <div className="rounded-xl bg-[#FF653F]/10 p-2.5 text-[#FF653F]">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{item.label}</p>
                  <p className={cn("mt-0.5 text-lg font-bold tabular-nums", item.color)}>{item.value}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">{error}</div>
      ) : null}
      {success ? (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-700">
          {success}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-zinc-200 bg-white shadow-sm">
        <div className="border-b border-zinc-100 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={q}
                onChange={(e) => {
                  setPage(1);
                  setQ(e.target.value);
                }}
                placeholder="Search tracking ID, name, email, bike…"
                className="h-11 w-full rounded-lg border border-[#FF653F]/50 bg-white pl-10 pr-4 text-sm outline-none focus:border-[#FF653F] focus:ring-2 focus:ring-[#FF653F]/15"
              />
            </div>
            <div className="relative w-full lg:w-52">
              <select
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value as BookingStatusFilter);
                }}
                className="h-11 w-full appearance-none rounded-lg border border-zinc-200 bg-white px-4 pr-10 text-sm font-medium outline-none focus:border-[#FF653F]/50"
              >
                {bookingStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {bookingStatusLabels[option]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-500">
            {data?.pagination.total ?? 0} records · Page {data?.pagination.page ?? page} of{" "}
            {data?.pagination.totalPages ?? 1}
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center text-sm text-zinc-500">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading bookings…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-zinc-100 bg-zinc-50/80 text-left text-[11px] font-semibold uppercase tracking-wider text-slate-600">
                  <th className="px-4 py-3.5">Tracking</th>
                  <th className="px-4 py-3.5">Customer</th>
                  <th className="px-4 py-3.5">Bike</th>
                  <th className="px-4 py-3.5">Amount</th>
                  <th className="px-4 py-3.5">Payment</th>
                  <th className="px-4 py-3.5">Documents</th>
                  <th className="px-4 py-3.5">Status</th>
                  <th className="px-4 py-3.5">Created</th>
                  <th className="px-4 py-3.5 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-100">
                {(data?.bookings ?? []).map((row) => {
                  const tone = getBookingStatusTone(row.status);
                  return (
                    <tr key={row.id} className="transition hover:bg-zinc-50/60">
                      <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-[#FF653F]">
                        {row.trackingId || "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-zinc-900">{row.customerName}</p>
                        <p className="text-xs text-zinc-500">{row.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium">{row.bikeName}</p>
                        {row.bikeNumber ? <p className="text-xs text-zinc-500">{row.bikeNumber}</p> : null}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 font-medium">
                        {formatCurrency(Number(row.payment?.amount ?? 0))}
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", getPaymentTone(row.paymentStatus))}>
                          {row.paymentStatus}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className="inline-flex rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-semibold text-zinc-700">
                          {row.documentStatus.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tone.wrapper)}>
                          {tone.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-zinc-600">
                        {new Date(row.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <div className="relative">
                            <select
                              value={row.status}
                              disabled={busy}
                              onChange={(e) =>
                                void runAction(row.id, "set_booking_status", {
                                  bookingStatus: e.target.value,
                                })
                              }
                              className="h-9 min-w-[140px] appearance-none rounded-lg border border-zinc-200 bg-white pl-3 pr-8 text-xs font-medium text-zinc-700 outline-none focus:border-[#FF653F]/50"
                            >
                              {bookingStatusOptions
                                .filter((o): o is BookingStatus => o !== "all")
                                .map((option) => (
                                  <option key={option} value={option}>
                                    {bookingStatusLabels[option]}
                                  </option>
                                ))}
                            </select>
                            <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                          </div>
                          <button
                            type="button"
                            onClick={() => void openDetails(row)}
                            className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white hover:bg-slate-800"
                          >
                            <Eye className="h-3.5 w-3.5" />
                            View More
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
                {(data?.bookings ?? []).length === 0 ? (
                  <tr>
                    <td colSpan={9} className="px-4 py-16 text-center text-sm text-zinc-500">
                      No bookings found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-zinc-100 px-4 py-3">
          <p className="text-sm text-zinc-500">
            Page {data?.pagination.page ?? page} of {data?.pagination.totalPages ?? 1}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1 || busy}
              onClick={() => setPage((p) => p - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={(data?.pagination.totalPages ?? 1) <= page || busy}
              onClick={() => setPage((p) => p + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <ModalFrame
        open={Boolean(detailId && detail)}
        onClose={() => {
          setDetailId(null);
          setDetail(null);
        }}
        title={detail?.trackingId || "Booking"}
        description={`${detail?.customerName} · ${detail?.bikeName}`}
        className="max-h-[90vh] max-w-3xl"
      >
        {detail ? (
          <div className="max-h-[calc(90vh-5rem)] overflow-y-auto p-5 sm:p-6">
            <div className="flex flex-wrap gap-2">
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", detailTone.wrapper)}>
                {detailTone.label}
              </span>
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", getPaymentTone(detail.paymentStatus))}>
                {detail.paymentStatus}
              </span>
              <span className="rounded-full bg-zinc-100 px-2.5 py-1 text-xs font-medium text-zinc-600">
                Docs: {detail.documentStatus.replace(/_/g, " ")}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
              <Info label="Booking #" value={detail.bookingRef} />
              <Info label="Customer" value={detail.customerName || "—"} />
              <Info label="Phone" value={detail.customerPhone || "—"} />
              <Info label="Email" value={detail.customerEmail || "—"} />
              <Info label="Bike" value={detail.bikeName || "—"} />
              <Info label="Bike number" value={detail.bikeNumber || "—"} />
              <Info label="Color" value={detail.bikeColor || "—"} />
              <Info
                label="Pickup"
                value={formatDateTimeIndian(
                  `${String(detail.pickupDate).split("T")[0]}T${detail.pickupTime || "09:00"}`,
                )}
              />
              <Info
                label="Return"
                value={formatDateTimeIndian(
                  `${String(detail.dropDate).split("T")[0]}T${detail.returnTime || "18:00"}`,
                )}
              />
              <Info label="Rental" value={formatCurrency(Number(detail.amount))} />
              <Info label="Deposit" value={formatCurrency(Number(detail.securityDeposit))} />
              <Info label="Total paid" value={formatCurrency(Number(detail.payment?.amount ?? 0))} />
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" disabled={busy} onClick={() => void runAction(detail.id, "approve_documents")}>
                Approve documents
              </Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => void runAction(detail.id, "reject_documents")}>
                Reject documents
              </Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => void runAction(detail.id, "confirm_booking")}>
                Confirm booking
              </Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => void runAction(detail.id, "cancel_booking")}>
                Cancel booking
              </Button>
            </div>

            {detail.documents?.dlFrontUrl ? (
              <div className="mt-6 border-t border-zinc-100 pt-5">
                <h4 className="text-sm font-semibold text-zinc-900">Documents</h4>
                <p className="mt-1 text-xs text-zinc-500">
                  DL: {detail.documents.dlNumber} · Aadhaar: {detail.documents.aadhaarNumber}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {detail.documents.dlFrontUrl ? (
                    <button
                      type="button"
                      onClick={() => setPreviewModal({ url: detail.documents!.dlFrontUrl!, label: "DL Front" })}
                      className="group overflow-hidden rounded-lg border border-zinc-200 hover:border-[#FF653F] hover:shadow-md transition"
                    >
                      <img
                        src={detail.documents.dlFrontUrl}
                        alt="DL front"
                        className="h-24 w-full object-cover group-hover:opacity-80"
                      />
                      <p className="px-2 py-1 text-xs font-medium text-zinc-600 group-hover:text-[#FF653F]">DL front</p>
                    </button>
                  ) : null}
                  {detail.documents.dlBackUrl ? (
                    <button
                      type="button"
                      onClick={() => setPreviewModal({ url: detail.documents!.dlBackUrl!, label: "DL Back" })}
                      className="group overflow-hidden rounded-lg border border-zinc-200 hover:border-[#FF653F] hover:shadow-md transition"
                    >
                      <img
                        src={detail.documents.dlBackUrl}
                        alt="DL back"
                        className="h-24 w-full object-cover group-hover:opacity-80"
                      />
                      <p className="px-2 py-1 text-xs font-medium text-zinc-600 group-hover:text-[#FF653F]">DL back</p>
                    </button>
                  ) : null}
                  {detail.documents.aadhaarFrontUrl ? (
                    <button
                      type="button"
                      onClick={() => setPreviewModal({ url: detail.documents!.aadhaarFrontUrl!, label: "Aadhaar Front" })}
                      className="group overflow-hidden rounded-lg border border-zinc-200 hover:border-[#FF653F] hover:shadow-md transition"
                    >
                      <img
                        src={detail.documents.aadhaarFrontUrl}
                        alt="Aadhaar front"
                        className="h-24 w-full object-cover group-hover:opacity-80"
                      />
                      <p className="px-2 py-1 text-xs font-medium text-zinc-600 group-hover:text-[#FF653F]">Aadhaar front</p>
                    </button>
                  ) : null}
                  {detail.documents.aadhaarBackUrl ? (
                    <button
                      type="button"
                      onClick={() => setPreviewModal({ url: detail.documents!.aadhaarBackUrl!, label: "Aadhaar Back" })}
                      className="group overflow-hidden rounded-lg border border-zinc-200 hover:border-[#FF653F] hover:shadow-md transition"
                    >
                      <img
                        src={detail.documents.aadhaarBackUrl}
                        alt="Aadhaar back"
                        className="h-24 w-full object-cover group-hover:opacity-80"
                      />
                      <p className="px-2 py-1 text-xs font-medium text-zinc-600 group-hover:text-[#FF653F]">Aadhaar back</p>
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}
          </div>
        ) : null}
      </ModalFrame>

      {previewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4">
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-white">
            <button
              onClick={() => setPreviewModal(null)}
              className="sticky top-0 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-zinc-100 hover:bg-zinc-200 m-2"
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
    </div>
  );
}

function Info({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-lg border border-zinc-100 bg-zinc-50 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-800 break-words">{value}</p>
    </div>
  );
}
