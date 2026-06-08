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
  Filter,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { ActionModal, type ActionModalState } from "@/components/admin/action-modal";
import { cn, formatCurrency } from "@/lib/utils";
import { formatDateTimeIndian } from "@/lib/rental-datetime";

const bookingStatusOptions = [
  "all",
  "AWAITING_DOCUMENTS",
  "VERIFICATION_PENDING",
  "CONFIRMED",
  "ACTIVE",
  "RETURNED",
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
  RETURNED: "Returned",
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
  returnNote?: string | null;
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
  bikeAvailabilityStatus?: string;
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
    AVAILABLE?: number;
    RESERVED?: number;
    ON_RENT?: number;
    MAINTENANCE?: number;
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
      return { wrapper: "bg-emerald-500/10 text-emerald-400", label: bookingStatusLabels[status as BookingStatus] ?? status };
    case "RETURNED":
      return { wrapper: "bg-blue-500/10 text-blue-400", label: "Returned" };
    case "VERIFICATION_PENDING":
      return { wrapper: "bg-violet-500/10 text-violet-400", label: "Verification pending" };
    case "AWAITING_DOCUMENTS":
      return { wrapper: "bg-amber-500/10 text-amber-300", label: "Awaiting documents" };
    case "CANCELLED":
      return { wrapper: "bg-rose-500/10 text-rose-400", label: "Cancelled" };
    default:
      return { wrapper: "bg-[#111111]/10 text-zinc-400", label: status.replace(/_/g, " ") };
  }
}

function getPaymentTone(status: string) {
  if (status === "PAID") return "bg-emerald-500/10 text-emerald-400";
  if (status === "PENDING") return "bg-amber-500/10 text-amber-300";
  if (status === "FAILED") return "bg-rose-500/10 text-rose-400";
  return "bg-[#111111]/10 text-zinc-400";
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
          "relative w-full max-w-4xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/5 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FF653F]">Booking details</p>
            <h3 className="mt-1 text-xl font-bold text-white sm:text-2xl">{title}</h3>
            {description ? <p className="mt-1 text-sm text-zinc-400">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-zinc-400 hover:text-zinc-200"
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
  const [bikeStatus, setBikeStatus] = useState("all");
  const [page, setPage] = useState(1);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [detailId, setDetailId] = useState<string | null>(null);
  const [detail, setDetail] = useState<BookingRow | null>(null);
  const [previewModal, setPreviewModal] = useState<{ url: string; label: string } | null>(null);

  const [modalState, setModalState] = useState<ActionModalState>("hidden");
  const [modalMessage, setModalMessage] = useState("");
  const [pendingAction, setPendingAction] = useState<{ id: string; action: string; extra?: Record<string, string> } | null>(null);
  const [returnNoteInput, setReturnNoteInput] = useState("");

  const load = (pageNumber = page) => {
    setLoading(true);
    setError(null);
    const params = new URLSearchParams();
    if (q.trim()) params.set("q", q.trim());
    if (status !== "all") params.set("status", status);
    if (bikeStatus !== "all") params.set("bikeStatus", bikeStatus);
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
  }, [page, q, status, bikeStatus]);

  const summaryItems = useMemo(
    () => [
      { label: "Total bookings", value: data?.stats.total ?? 0, color: "text-white", icon: CalendarCheck },
      { label: "Paid", value: data?.stats.paidCount ?? 0, color: "text-emerald-400", icon: IndianRupee },
      { label: "Awaiting docs", value: data?.stats.awaitingDocs ?? 0, color: "text-amber-400", icon: FileCheck },
      { label: "Verification", value: data?.stats.verificationPending ?? 0, color: "text-violet-400", icon: Clock },
      { label: "Confirmed", value: data?.stats.confirmedCount ?? 0, color: "text-sky-400", icon: ShieldCheck },
      { label: "Revenue", value: formatCurrency(data?.stats.revenue ?? 0), color: "text-[#FF653F]", icon: IndianRupee },
    ],
    [data?.stats],
  );

  const requestAction = (id: string, action: string, extra?: Record<string, string>) => {
    setPendingAction({ id, action, extra });
    setReturnNoteInput("");
    setModalMessage(`Are you sure you want to perform this action?`);
    setModalState("confirm");
  };

  const executeAction = async () => {
    if (!pendingAction) return;
    setBusy(true);
    setModalState("loading");
    
    const isReturnAction = pendingAction.action === "set_booking_status" && pendingAction.extra?.bookingStatus === "RETURNED";
    const payload = {
      action: pendingAction.action,
      ...pendingAction.extra,
      ...(isReturnAction && returnNoteInput ? { note: returnNoteInput } : {})
    };

    try {
      const res = await fetch(`/api/admin/bookings/${pendingAction.id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const json = (await res.json()) as { message?: string };
      if (!res.ok) throw new Error(json.message || "Action failed");
      
      setModalState("success");
      setModalMessage("Booking updated successfully.");
      load(page);
      if (detailId === pendingAction.id) {
        const detailRes = await fetch(`/api/admin/bookings/${pendingAction.id}`).then((r) => r.json());
        setDetail(detailRes.booking);
      }
    } catch (actionError) {
      setModalState("error");
      setModalMessage(actionError instanceof Error ? actionError.message : "Action failed");
    } finally {
      setBusy(false);
    }
  };

  const handleCancelAction = () => {
    setModalState("cancelled");
    setModalMessage("Action cancelled by user.");
  };

  const handleCloseModal = () => {
    setModalState("hidden");
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

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setStatus(e.target.value as BookingStatusFilter);
    setPage(1);
  };

  const handleBikeStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setBikeStatus(e.target.value);
    setPage(1);
  };

  const detailTone = getBookingStatusTone(detail?.status ?? "");

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <ActionModal
        state={modalState}
        title="Confirm Action"
        message={modalMessage}
        onConfirm={executeAction}
        onCancel={handleCancelAction}
        onClose={handleCloseModal}
      >
        {pendingAction?.action === "set_booking_status" && pendingAction.extra?.bookingStatus === "RETURNED" && (
          <div className="mt-2 w-full">
            <label className="mb-1 block text-sm font-medium text-zinc-300">
              Return Note (Optional)
            </label>
            <input
              type="text"
              value={returnNoteInput}
              onChange={(e) => setReturnNoteInput(e.target.value)}
              placeholder="e.g. Scratched mirror, late by 2 hours..."
              className="w-full rounded-lg border border-white/10 px-3 py-2 text-sm outline-none focus:border-[#FF653F]/50"
            />
          </div>
        )}
      </ActionModal>
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#FF653F]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">Bookings</h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-400">
            Guest bookings, payments, document verification, and status updates.
          </p>
        </div>
        <Button type="button" variant="outline" onClick={() => load(1)} className="gap-2">
          <RefreshCw className="h-4 w-4" />
          Refresh
        </Button>
      </section>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-xl shadow-black/40">
        <div className="grid divide-y divide-white/5 sm:grid-cols-3 lg:grid-cols-6 sm:divide-x sm:divide-y-0">
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

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-xl shadow-black/40">
        <div className="grid divide-y divide-white/5 sm:grid-cols-2 lg:grid-cols-4 sm:divide-x sm:divide-y-0">
          <div className="flex flex-col p-4 sm:p-5 hover:bg-white/[0.02] transition">
            <dt className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span> Available Bikes
            </dt>
            <dd className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">{data?.stats.AVAILABLE ?? 0}</span>
            </dd>
          </div>
          <div className="flex flex-col p-4 sm:p-5 hover:bg-white/[0.02] transition">
            <dt className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400"></span> Reserved
            </dt>
            <dd className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">{data?.stats.RESERVED ?? 0}</span>
            </dd>
          </div>
          <div className="flex flex-col p-4 sm:p-5 hover:bg-white/[0.02] transition">
            <dt className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-400"></span> On Rent
            </dt>
            <dd className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">{data?.stats.ON_RENT ?? 0}</span>
            </dd>
          </div>
          <div className="flex flex-col p-4 sm:p-5 hover:bg-white/[0.02] transition">
            <dt className="text-xs font-semibold text-zinc-500 uppercase flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-rose-400"></span> Maintenance
            </dt>
            <dd className="mt-2 flex items-baseline gap-2">
              <span className="text-2xl font-bold tracking-tight text-white">{data?.stats.MAINTENANCE ?? 0}</span>
            </dd>
          </div>
        </div>
      </div>

      {error ? (
        <div className="rounded-lg border border-rose-500/20 bg-rose-500/10 px-4 py-3 text-sm text-rose-400">{error}</div>
      ) : null}
      {success ? (
        <div className="rounded-lg border border-emerald-500/20 bg-emerald-500/10 px-4 py-3 text-sm text-emerald-400">
          {success}
        </div>
      ) : null}

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-xl shadow-black/40">
        <div className="border-b border-white/5 p-4 sm:p-5 bg-white/[0.02]">
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
                className="h-11 w-full rounded-lg border border-[#FF653F]/50 bg-[#111111] pl-10 pr-4 text-sm outline-none focus:border-[#FF653F] focus:ring-2 focus:ring-[#FF653F]/15"
              />
            </div>
            <div className="relative w-full lg:w-52">
              <select
                value={status}
                onChange={(e) => {
                  setPage(1);
                  setStatus(e.target.value as BookingStatusFilter);
                }}
                className="h-11 w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-4 pr-10 text-sm font-medium outline-none focus:border-[#FF653F]/50"
              >
                {bookingStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {bookingStatusLabels[option]}
                  </option>
                ))}
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            </div>
            <div className="relative w-full lg:w-52">
              <select
                value={bikeStatus}
                onChange={(e) => {
                  setPage(1);
                  setBikeStatus(e.target.value);
                }}
                className="h-11 w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-4 pr-10 text-sm font-medium outline-none focus:border-[#FF653F]/50"
              >
                <option value="all">All Bike Statuses</option>
                <option value="AVAILABLE">Available</option>
                <option value="RESERVED">Reserved</option>
                <option value="ON_RENT">On Rent</option>
                <option value="MAINTENANCE">Maintenance</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
            </div>
          </div>
          <p className="mt-3 text-xs text-zinc-400">
            {data?.pagination.total ?? 0} records · Page {data?.pagination.page ?? page} of{" "}
            {data?.pagination.totalPages ?? 1}
          </p>
        </div>

        {loading ? (
          <div className="flex min-h-[320px] items-center justify-center text-sm text-zinc-400">
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Loading bookings…
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-white/5 bg-[#111111]/5/80 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
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
              <tbody className="divide-y divide-white/5">
                {(data?.bookings ?? []).map((row) => {
                  const tone = getBookingStatusTone(row.status);
                  return (
                    <tr key={row.id} className="transition hover:bg-[#111111]/5/60">
                      <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-[#FF653F]">
                        {row.trackingId || "—"}
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-white">{row.customerName}</p>
                        <p className="text-xs text-zinc-400">{row.customerEmail}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium">{row.bikeName}</p>
                        {row.bikeNumber ? <p className="text-xs text-zinc-400 mb-1">{row.bikeNumber}</p> : null}
                        {row.bikeAvailabilityStatus ? (
                          <span className={cn(
                            "inline-flex rounded-full px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide",
                            row.bikeAvailabilityStatus === "AVAILABLE" ? "bg-emerald-500/10 text-emerald-400" :
                            row.bikeAvailabilityStatus === "RESERVED" ? "bg-amber-500/10 text-amber-400" :
                            row.bikeAvailabilityStatus === "ON_RENT" ? "bg-blue-500/10 text-blue-400" :
                            row.bikeAvailabilityStatus === "MAINTENANCE" ? "bg-rose-500/10 text-rose-400" :
                            "bg-zinc-500/10 text-zinc-400"
                          )}>
                            {row.bikeAvailabilityStatus.replace(/_/g, " ")}
                          </span>
                        ) : null}
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
                        <span className="inline-flex rounded-full bg-[#111111]/10 px-2.5 py-1 text-xs font-semibold text-zinc-300">
                          {row.documentStatus.replace(/_/g, " ")}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn("inline-flex rounded-full px-2.5 py-1 text-xs font-semibold", tone.wrapper)}>
                          {tone.label}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5 text-zinc-400">
                        {new Date(row.createdAt).toLocaleDateString("en-IN")}
                      </td>
                      <td className="whitespace-nowrap px-4 py-3.5">
                        <div className="flex items-center justify-end gap-2">
                          <div className="relative">
                            <select
                              value={row.status}
                              disabled={busy}
                              onChange={(e) =>
                                requestAction(row.id, "set_booking_status", {
                                  bookingStatus: e.target.value,
                                })
                              }
                              className="h-9 min-w-[140px] appearance-none rounded-lg border border-white/10 bg-[#111111] pl-3 pr-8 text-xs font-medium text-zinc-300 outline-none focus:border-[#FF653F]/50"
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
                    <td colSpan={9} className="px-4 py-16 text-center text-sm text-zinc-400">
                      No bookings found.
                    </td>
                  </tr>
                ) : null}
              </tbody>
            </table>
          </div>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 px-4 py-3">
          <p className="text-sm text-zinc-400">
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
              <span className="rounded-full bg-[#111111]/10 px-2.5 py-1 text-xs font-medium text-zinc-400">
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

            {detail.returnNote ? (
              <div className="mt-4 rounded-xl bg-blue-500/10 p-4 border border-blue-500/20">
                <p className="text-[11px] font-bold text-blue-400 uppercase tracking-wider">Return Note</p>
                <p className="mt-1 text-sm text-zinc-200 whitespace-pre-wrap leading-relaxed">{detail.returnNote}</p>
              </div>
            ) : null}

            <div className="mt-5 flex flex-wrap gap-2">
              <Button size="sm" disabled={busy} onClick={() => requestAction(detail.id, "approve_documents")}>
                Approve documents
              </Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => requestAction(detail.id, "reject_documents")}>
                Reject documents
              </Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => requestAction(detail.id, "confirm_booking")}>
                Confirm booking
              </Button>
              <Button size="sm" variant="outline" disabled={busy} onClick={() => requestAction(detail.id, "cancel_booking")}>
                Cancel booking
              </Button>
            </div>

            {detail.documents?.dlFrontUrl ? (
              <div className="mt-6 border-t border-white/5 pt-5">
                <h4 className="text-sm font-semibold text-white">Documents</h4>
                <p className="mt-1 text-xs text-zinc-400">
                  DL: {detail.documents.dlNumber} · Aadhaar: {detail.documents.aadhaarNumber}
                </p>
                <div className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-4">
                  {detail.documents.dlFrontUrl ? (
                    <button
                      type="button"
                      onClick={() => setPreviewModal({ url: detail.documents!.dlFrontUrl!, label: "DL Front" })}
                      className="group overflow-hidden rounded-lg border border-white/10 hover:border-[#FF653F] hover:shadow-md transition"
                    >
                      <img
                        src={detail.documents.dlFrontUrl}
                        alt="DL front"
                        className="h-24 w-full object-cover group-hover:opacity-80"
                      />
                      <p className="px-2 py-1 text-xs font-medium text-zinc-400 group-hover:text-[#FF653F]">DL front</p>
                    </button>
                  ) : null}
                  {detail.documents.dlBackUrl ? (
                    <button
                      type="button"
                      onClick={() => setPreviewModal({ url: detail.documents!.dlBackUrl!, label: "DL Back" })}
                      className="group overflow-hidden rounded-lg border border-white/10 hover:border-[#FF653F] hover:shadow-md transition"
                    >
                      <img
                        src={detail.documents.dlBackUrl}
                        alt="DL back"
                        className="h-24 w-full object-cover group-hover:opacity-80"
                      />
                      <p className="px-2 py-1 text-xs font-medium text-zinc-400 group-hover:text-[#FF653F]">DL back</p>
                    </button>
                  ) : null}
                  {detail.documents.aadhaarFrontUrl ? (
                    <button
                      type="button"
                      onClick={() => setPreviewModal({ url: detail.documents!.aadhaarFrontUrl!, label: "Aadhaar Front" })}
                      className="group overflow-hidden rounded-lg border border-white/10 hover:border-[#FF653F] hover:shadow-md transition"
                    >
                      <img
                        src={detail.documents.aadhaarFrontUrl}
                        alt="Aadhaar front"
                        className="h-24 w-full object-cover group-hover:opacity-80"
                      />
                      <p className="px-2 py-1 text-xs font-medium text-zinc-400 group-hover:text-[#FF653F]">Aadhaar front</p>
                    </button>
                  ) : null}
                  {detail.documents.aadhaarBackUrl ? (
                    <button
                      type="button"
                      onClick={() => setPreviewModal({ url: detail.documents!.aadhaarBackUrl!, label: "Aadhaar Back" })}
                      className="group overflow-hidden rounded-lg border border-white/10 hover:border-[#FF653F] hover:shadow-md transition"
                    >
                      <img
                        src={detail.documents.aadhaarBackUrl}
                        alt="Aadhaar back"
                        className="h-24 w-full object-cover group-hover:opacity-80"
                      />
                      <p className="px-2 py-1 text-xs font-medium text-zinc-400 group-hover:text-[#FF653F]">Aadhaar back</p>
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
          <div className="relative max-h-[90vh] w-full max-w-3xl overflow-auto rounded-lg bg-[#111111]">
            <button
              onClick={() => setPreviewModal(null)}
              className="sticky top-0 right-0 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-[#111111]/10 hover:bg-zinc-200 m-2"
            >
              <X className="h-5 w-5" />
            </button>
            <div className="p-4">
              <p className="mb-3 text-sm font-medium text-white">{previewModal.label}</p>
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
    <div className="rounded-lg border border-white/5 bg-[#111111]/5 p-3">
      <p className="text-[10px] font-semibold uppercase tracking-wider text-zinc-400">{label}</p>
      <p className="mt-1 text-sm font-medium text-zinc-200 break-words">{value}</p>
    </div>
  );
}
