"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import {
  ChevronDown,
  Download,
  Eye,
  Loader2,
  MessageSquarePlus,
  RefreshCw,
  Search,
  ShieldCheck,
  X,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const contactStatusOptions = ["all", "NEW", "CLOSED"] as const;
type ContactStatusFilter = (typeof contactStatusOptions)[number];
type ContactStatus = Exclude<ContactStatusFilter, "all">;

const statusLabels: Record<ContactStatusFilter, string> = {
  all: "All statuses",
  NEW: "New",
  CLOSED: "Closed",
};

function selectableStatus(status: string): ContactStatus {
  return status === "NEW" || status === "CLOSED" ? status : "NEW";
}

type ContactNote = {
  id: string;
  note: string;
  createdAt: string;
  admin?: { fullName: string | null; email: string } | null;
};

type ContactRecord = {
  id: string;
  fullName: string;
  email: string;
  phone: string | null;
  subject: string;
  message: string;
  source: string;
  status: ContactStatus;
  createdAt: string;
  updatedAt: string;
  statusUpdatedAt: string;
  notes: ContactNote[];
};

type ContactsResponse = {
  contacts: ContactRecord[];
  stats: {
    total: number;
    newCount: number;
    closedCount: number;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

type StatusBadgeTone = {
  wrapper: string;
  label: string;
};

function getStatusTone(status: string | null | undefined): StatusBadgeTone {
  switch (status) {
    case "NEW":
      return { wrapper: "bg-sky-500/10 text-sky-400", label: "New" };
    case "CLOSED":
      return { wrapper: "bg-emerald-500/10 text-emerald-400", label: "Closed" };
    case "CONTACTED":
      return { wrapper: "bg-amber-500/10 text-amber-300", label: "Contacted" };
    case "FOLLOW_UP":
      return { wrapper: "bg-violet-500/10 text-violet-400", label: "Follow-up" };
    default:
      return { wrapper: "bg-[#111111]/10 text-zinc-400", label: "Unknown" };
  }
}

function formatDateTime(value: string | null | undefined) {
  if (!value) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    dateStyle: "medium",
    timeStyle: "short",
  }).format(new Date(value));
}

function latestNotePreview(notes: ContactNote[]) {
  if (notes.length === 0) return "-";
  const text = notes[0]?.note ?? "";
  return text.length > 48 ? `${text.slice(0, 48)}…` : text;
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
        aria-label={title}
        className={cn(
          "relative w-full max-w-5xl overflow-hidden rounded-2xl border border-white/10 bg-[#111111] shadow-2xl",
          className,
        )}
      >
        <div className="flex items-start justify-between gap-4 border-b border-white/5 px-5 py-4 sm:px-6">
          <div>
            <p className="text-xs font-semibold uppercase tracking-wider text-[#FF653F]">Contact inquiry</p>
            <h3 className="mt-1 text-xl font-bold tracking-tight text-white sm:text-2xl">{title}</h3>
            {description ? <p className="mt-1 max-w-2xl text-sm text-zinc-400">{description}</p> : null}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="inline-flex h-10 w-10 items-center justify-center rounded-lg border border-white/10 text-zinc-400 transition hover:border-white/20 hover:text-zinc-200"
            aria-label="Close modal"
          >
            <X className="h-5 w-5" />
          </button>
        </div>
        {children}
      </div>
    </div>
  );
}

export function ContactManager() {
  const [q, setQ] = useState("");
  const [status, setStatus] = useState<ContactStatusFilter>("all");
  const [page, setPage] = useState(1);
  const [data, setData] = useState<ContactsResponse | null>(null);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [detailContactId, setDetailContactId] = useState<string | null>(null);
  const [detailNote, setDetailNote] = useState("");
  const [pendingStatus, setPendingStatus] = useState<{
    contactId: string;
    nextStatus: ContactStatus;
  } | null>(null);
  const [statusNote, setStatusNote] = useState("");

  useEffect(() => {
    const timer = window.setTimeout(() => {
      void (async () => {
        setLoading(true);
        setError(null);
        try {
          const params = new URLSearchParams();
          if (q.trim()) params.set("q", q.trim());
          if (status !== "all") params.set("status", status);
          params.set("page", String(page));
          params.set("limit", "10");

          const response = await fetch(`/api/admin/contact?${params.toString()}`, {
            credentials: "include",
            cache: "no-store",
          });
          const json = (await response.json()) as ContactsResponse & { message?: string };
          if (!response.ok) throw new Error(json.message || "Failed to load contacts.");
          setData(json);
        } catch (loadError) {
          setError(loadError instanceof Error ? loadError.message : "Failed to load contacts.");
        } finally {
          setLoading(false);
        }
      })();
    }, 220);

    return () => window.clearTimeout(timer);
  }, [page, q, status]);

  const detailContact = useMemo(
    () => data?.contacts.find((contact) => contact.id === detailContactId) ?? null,
    [data?.contacts, detailContactId],
  );

  const stats = data?.stats;

  const summaryItems = [
    { label: "Total", value: stats?.total ?? 0, color: "text-white" },
    { label: "New", value: stats?.newCount ?? 0, color: "text-sky-400" },
    { label: "Closed", value: stats?.closedCount ?? 0, color: "text-emerald-400" },
  ] as const;

  const exportCsv = () => {
    const rows = [
      ["Name", "Email", "Phone", "Subject", "Status", "Status Updated At", "Created At", "Source", "Message"],
      ...(data?.contacts ?? []).map((contact) => [
        contact.fullName,
        contact.email,
        contact.phone ?? "",
        contact.subject,
        contact.status,
        contact.statusUpdatedAt,
        contact.createdAt,
        contact.source,
        contact.message,
      ]),
    ];

    const csv = rows
      .map((row) =>
        row
          .map((value) => `"${String(value ?? "").replace(/"/g, '""')}"`)
          .join(","),
      )
      .join("\n");

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = "contacts.csv";
    link.click();
    URL.revokeObjectURL(url);
  };

  const openDetails = (contactId: string) => {
    setDetailContactId(contactId);
    setDetailNote("");
  };

  const closeDetails = () => {
    setDetailContactId(null);
    setDetailNote("");
  };

  const openStatusModal = (contactId: string, nextStatus: ContactStatus) => {
    setPendingStatus({ contactId, nextStatus });
    setStatusNote("");
  };

  const saveStatusChange = async () => {
    if (!pendingStatus) return;
    setBusy(true);
    setError(null);
    setSuccess(null);

    try {
      const response = await fetch("/api/admin/contact", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          contactId: pendingStatus.contactId,
          status: pendingStatus.nextStatus,
          note: statusNote.trim() || undefined,
        }),
      });
      const json = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(json.message || "Failed to update contact status.");

      setPendingStatus(null);
      setStatusNote("");
      setSuccess("Contact status updated.");
      const refreshed = await fetchContactsSnapshot(page, q, status);
      setData(refreshed);
    } catch (changeError) {
      setError(changeError instanceof Error ? changeError.message : "Failed to update contact status.");
    } finally {
      setBusy(false);
    }
  };

  const saveDetailNote = async () => {
    if (!detailContact || !detailNote.trim()) return;
    setBusy(true);
    setError(null);
    setSuccess(null);
    try {
      const response = await fetch("/api/admin/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ contactId: detailContact.id, note: detailNote.trim() }),
      });
      const json = (await response.json()) as { message?: string };
      if (!response.ok) throw new Error(json.message || "Failed to save note.");
      setDetailNote("");
      setSuccess("Note saved.");
      const refreshed = await fetchContactsSnapshot(page, q, status);
      setData(refreshed);
    } catch (noteError) {
      setError(noteError instanceof Error ? noteError.message : "Failed to save note.");
    } finally {
      setBusy(false);
    }
  };

  async function fetchContactsSnapshot(pageNumber: number, query: string, statusValue: ContactStatusFilter) {
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (statusValue !== "all") params.set("status", statusValue);
    params.set("page", String(pageNumber));
    params.set("limit", "10");
    const response = await fetch(`/api/admin/contact?${params.toString()}`, {
      credentials: "include",
      cache: "no-store",
    });
    const json = (await response.json()) as ContactsResponse & { message?: string };
    if (!response.ok) throw new Error(json.message || "Failed to load contacts.");
    return json;
  }

  const refreshList = () => {
    setPage(1);
    void fetchContactsSnapshot(1, q, status)
      .then((json) => setData(json))
      .catch((fetchError) => setError(fetchError instanceof Error ? fetchError.message : "Failed to refresh."));
  };

  const detailTone = getStatusTone(detailContact?.status);
  const pendingTone = getStatusTone(pendingStatus?.nextStatus ?? detailContact?.status);

  return (
    <div className="space-y-5 px-4 py-5 sm:px-6 lg:px-8">
      <section className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <p className="text-xs font-semibold uppercase tracking-wider text-[#FF653F]">Admin</p>
          <h1 className="mt-1 text-2xl font-bold tracking-tight text-white sm:text-3xl">Contact management</h1>
          <p className="mt-1 max-w-xl text-sm text-zinc-400">
            View and manage contact form submissions. Update status, add notes, and export records.
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <Button type="button" variant="outline" onClick={refreshList} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
          <Button type="button" onClick={exportCsv} className="gap-2 bg-[#FF653F] text-white hover:bg-[#FF5A33]">
            <Download className="h-4 w-4" />
            Export CSV
          </Button>
        </div>
      </section>

      <div className="overflow-hidden rounded-xl border border-white/10 bg-[#111111] shadow-xl shadow-black/40">
        <div className="grid divide-y divide-white/5 sm:grid-cols-3 sm:divide-x sm:divide-y-0">
          {summaryItems.map((item) => (
            <div key={item.label} className="px-4 py-4 text-center sm:text-left">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">{item.label}</p>
              <p className={cn("mt-1 text-2xl font-bold tabular-nums", item.color)}>{item.value}</p>
            </div>
          ))}
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
        <div className="border-b border-white/5 p-4 sm:p-5">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center">
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-zinc-400" />
              <input
                value={q}
                onChange={(event) => {
                  setPage(1);
                  setQ(event.target.value);
                }}
                placeholder="Search name, phone, email, subject or message..."
                className="h-11 w-full rounded-lg border border-[#FF653F]/50 bg-[#111111] pl-10 pr-4 text-sm outline-none transition placeholder:text-zinc-400 focus:border-[#FF653F] focus:ring-2 focus:ring-[#FF653F]/15"
              />
            </div>
            <div className="relative w-full lg:w-48">
              <select
                value={status}
                onChange={(event) => {
                  setPage(1);
                  setStatus(event.target.value as ContactStatusFilter);
                }}
                className="h-11 w-full appearance-none rounded-lg border border-white/10 bg-[#111111] px-4 pr-10 text-sm font-medium text-zinc-300 outline-none transition focus:border-[#FF653F]/50 focus:ring-2 focus:ring-[#FF653F]/10"
              >
                {contactStatusOptions.map((option) => (
                  <option key={option} value={option}>
                    {statusLabels[option]}
                  </option>
                ))}
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
            Loading contacts...
          </div>
        ) : (
          <>
            <div className="hidden overflow-x-auto md:block">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="border-b border-white/5 bg-[#111111]/5/80 text-left text-[11px] font-semibold uppercase tracking-wider text-zinc-400">
                    <th className="whitespace-nowrap px-4 py-3.5">Name</th>
                    <th className="whitespace-nowrap px-4 py-3.5">Phone</th>
                    <th className="whitespace-nowrap px-4 py-3.5">Email</th>
                    <th className="whitespace-nowrap px-4 py-3.5">Subject</th>
                    <th className="min-w-[140px] px-4 py-3.5">Message</th>
                    <th className="whitespace-nowrap px-4 py-3.5">Created</th>
                    <th className="whitespace-nowrap px-4 py-3.5">Status updated</th>
                    <th className="min-w-[100px] px-4 py-3.5">Note</th>
                    <th className="whitespace-nowrap px-4 py-3.5">Status</th>
                    <th className="whitespace-nowrap px-4 py-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {(data?.contacts ?? []).map((contact) => {
                    const tone = getStatusTone(contact.status);
                    return (
                      <tr key={contact.id} className="transition hover:bg-[#111111]/5/60">
                        <td className="whitespace-nowrap px-4 py-3.5 font-semibold text-white">
                          {contact.fullName}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-zinc-400">
                          {contact.phone || "—"}
                        </td>
                        <td className="max-w-[180px] truncate px-4 py-3.5 text-zinc-400" title={contact.email}>
                          {contact.email}
                        </td>
                        <td className="max-w-[140px] truncate px-4 py-3.5 text-zinc-300" title={contact.subject}>
                          {contact.subject}
                        </td>
                        <td className="max-w-[200px] truncate px-4 py-3.5 text-zinc-400" title={contact.message}>
                          {contact.message}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-zinc-400">
                          {formatDateTime(contact.createdAt)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5 text-zinc-400">
                          {formatDateTime(contact.statusUpdatedAt)}
                        </td>
                        <td className="max-w-[120px] truncate px-4 py-3.5 text-zinc-400" title={contact.notes[0]?.note}>
                          {latestNotePreview(contact.notes)}
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <span
                            className={cn(
                              "inline-flex rounded-full px-2.5 py-1 text-xs font-semibold",
                              tone.wrapper,
                            )}
                          >
                            {tone.label}
                          </span>
                        </td>
                        <td className="whitespace-nowrap px-4 py-3.5">
                          <div className="flex items-center justify-end gap-2">
                            <div className="relative">
                              <select
                                value={selectableStatus(contact.status)}
                                disabled={busy}
                                onChange={(event) =>
                                  openStatusModal(contact.id, event.target.value as ContactStatus)
                                }
                                className="h-9 min-w-[120px] appearance-none rounded-lg border border-white/10 bg-[#111111] pl-3 pr-8 text-xs font-medium text-zinc-300 outline-none focus:border-[#FF653F]/50"
                              >
                                {contactStatusOptions
                                  .filter((item): item is ContactStatus => item !== "all")
                                  .map((option) => (
                                    <option key={option} value={option}>
                                      {statusLabels[option]}
                                    </option>
                                  ))}
                              </select>
                              <ChevronDown className="pointer-events-none absolute right-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-zinc-400" />
                            </div>
                            <button
                              type="button"
                              onClick={() => openDetails(contact.id)}
                              className="inline-flex h-9 items-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white transition hover:bg-slate-800"
                            >
                              <Eye className="h-3.5 w-3.5" />
                              View More
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                  {(data?.contacts ?? []).length === 0 ? (
                    <tr>
                      <td colSpan={10} className="px-4 py-16 text-center text-sm text-zinc-400">
                        No contacts found for this filter.
                      </td>
                    </tr>
                  ) : null}
                </tbody>
              </table>
            </div>

            <div className="space-y-3 p-4 md:hidden">
              {(data?.contacts ?? []).map((contact) => {
                const tone = getStatusTone(contact.status);
                return (
                  <article
                    key={contact.id}
                    className="rounded-lg border border-white/10 bg-[#111111]/5/40 p-4"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="font-semibold text-white">{contact.fullName}</p>
                        <p className="mt-0.5 text-sm text-zinc-400">{contact.email}</p>
                        <p className="text-sm text-zinc-400">{contact.phone || "—"}</p>
                      </div>
                      <span className={cn("shrink-0 rounded-full px-2.5 py-1 text-xs font-semibold", tone.wrapper)}>
                        {tone.label}
                      </span>
                    </div>
                    <p className="mt-2 text-sm font-medium text-zinc-200">{contact.subject}</p>
                    <p className="mt-1 line-clamp-2 text-sm text-zinc-400">{contact.message}</p>
                    <p className="mt-2 text-xs text-zinc-400">
                      {formatDateTime(contact.createdAt)} · Updated {formatDateTime(contact.statusUpdatedAt)}
                    </p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      <select
                        value={selectableStatus(contact.status)}
                        disabled={busy}
                        onChange={(event) => openStatusModal(contact.id, event.target.value as ContactStatus)}
                        className="h-9 flex-1 min-w-[120px] rounded-lg border border-white/10 bg-[#111111] px-3 text-xs font-medium"
                      >
                        {contactStatusOptions
                          .filter((item): item is ContactStatus => item !== "all")
                          .map((option) => (
                            <option key={option} value={option}>
                              {statusLabels[option]}
                            </option>
                          ))}
                      </select>
                      <button
                        type="button"
                        onClick={() => openDetails(contact.id)}
                        className="inline-flex h-9 flex-1 items-center justify-center gap-1.5 rounded-lg bg-slate-900 px-3 text-xs font-semibold text-white"
                      >
                        <Eye className="h-3.5 w-3.5" />
                        View More
                      </button>
                    </div>
                  </article>
                );
              })}
              {(data?.contacts ?? []).length === 0 ? (
                <p className="py-12 text-center text-sm text-zinc-400">No contacts found for this filter.</p>
              ) : null}
            </div>
          </>
        )}

        <div className="flex flex-wrap items-center justify-between gap-3 border-t border-white/5 px-4 py-3 sm:px-5">
          <p className="text-sm text-zinc-400">
            Page {data?.pagination.page ?? page} of {data?.pagination.totalPages ?? 1}
          </p>
          <div className="flex gap-2">
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={page <= 1 || busy}
              onClick={() => setPage((current) => current - 1)}
            >
              Previous
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={(data?.pagination.totalPages ?? 1) <= page || busy}
              onClick={() => setPage((current) => current + 1)}
            >
              Next
            </Button>
          </div>
        </div>
      </div>

      <ModalFrame
        open={Boolean(pendingStatus)}
        onClose={() => {
          if (busy) return;
          setPendingStatus(null);
          setStatusNote("");
        }}
        title="Update contact status"
        description="Add an optional note. Status update time is saved automatically."
        className="max-w-lg"
      >
        <div className="p-5 sm:p-6">
          <div className="rounded-lg bg-[#111111]/5 p-4">
            <p className="text-xs font-medium uppercase tracking-wider text-zinc-400">Status change</p>
            <div className="mt-2 flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[#111111] px-3 py-1 text-sm font-medium text-white ring-1 ring-zinc-200">
                {data?.contacts.find((c) => c.id === pendingStatus?.contactId)?.fullName ?? "Contact"}
              </span>
              <span className={cn("rounded-full px-3 py-1 text-sm font-semibold", pendingTone.wrapper)}>
                {statusLabels[pendingStatus?.nextStatus ?? "NEW"]}
              </span>
            </div>
          </div>
          <div className="mt-4">
            <label className="text-sm font-medium text-white">Note (optional)</label>
            <textarea
              value={statusNote}
              onChange={(event) => setStatusNote(event.target.value)}
              rows={4}
              placeholder="Reason for status change, call details, next action..."
              className="mt-2 w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[#FF653F]/50 focus:ring-2 focus:ring-[#FF653F]/10"
            />
          </div>
          <div className="mt-5 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                if (busy) return;
                setPendingStatus(null);
                setStatusNote("");
              }}
              disabled={busy}
            >
              Cancel
            </Button>
            <Button
              type="button"
              onClick={() => void saveStatusChange()}
              disabled={busy}
              className="gap-2 bg-[#FF653F] text-white hover:bg-[#FF5A33]"
            >
              {busy ? <Loader2 className="h-4 w-4 animate-spin" /> : <ShieldCheck className="h-4 w-4" />}
              Save status
            </Button>
          </div>
        </div>
      </ModalFrame>

      <ModalFrame
        open={Boolean(detailContactId && detailContact)}
        onClose={closeDetails}
        title={detailContact?.fullName || "Contact details"}
        description={detailContact?.subject}
        className="max-w-3xl max-h-[90vh]"
      >
        {detailContact ? (
          <div className="max-h-[calc(90vh-5rem)] overflow-y-auto p-5 sm:p-6">
            <div className="flex flex-wrap items-center gap-2">
              <span className={cn("rounded-full px-2.5 py-1 text-xs font-semibold", detailTone.wrapper)}>
                {detailTone.label}
              </span>
              <span className="rounded-full bg-[#111111]/10 px-2.5 py-1 text-xs font-medium text-zinc-400">
                {detailContact.source.replace(/_/g, " ")}
              </span>
            </div>

            <div className="mt-4 grid gap-3 sm:grid-cols-2">
              <div className="rounded-lg border border-white/5 bg-[#111111]/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Email</p>
                <p className="mt-1 text-sm font-medium text-zinc-200">{detailContact.email}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-[#111111]/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Phone</p>
                <p className="mt-1 text-sm font-medium text-zinc-200">{detailContact.phone || "—"}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-[#111111]/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Created</p>
                <p className="mt-1 text-sm font-medium text-zinc-200">{formatDateTime(detailContact.createdAt)}</p>
              </div>
              <div className="rounded-lg border border-white/5 bg-[#111111]/5 p-3">
                <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Status updated</p>
                <p className="mt-1 text-sm font-medium text-zinc-200">
                  {formatDateTime(detailContact.statusUpdatedAt)}
                </p>
              </div>
            </div>

            <div className="mt-4 rounded-lg border border-white/5 bg-[#111111]/5 p-4">
              <p className="text-[11px] font-semibold uppercase tracking-wider text-zinc-400">Message</p>
              <p className="mt-2 whitespace-pre-line text-sm leading-relaxed text-zinc-300">{detailContact.message}</p>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              {(["NEW", "CLOSED"] as ContactStatus[]).map((nextStatus) => (
                <Button
                  key={nextStatus}
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={busy || detailContact.status === nextStatus}
                  onClick={() => openStatusModal(detailContact.id, nextStatus)}
                >
                  {statusLabels[nextStatus]}
                </Button>
              ))}
            </div>

            <div className="mt-6 border-t border-white/5 pt-5">
              <div className="flex items-center justify-between gap-2">
                <h4 className="text-sm font-semibold text-white">Notes</h4>
                <span className="text-xs text-zinc-400">{detailContact.notes.length} entries</span>
              </div>
              <div className="mt-3 max-h-48 space-y-2 overflow-y-auto">
                {detailContact.notes.length === 0 ? (
                  <p className="rounded-lg border border-dashed border-white/10 py-6 text-center text-sm text-zinc-400">
                    No notes yet.
                  </p>
                ) : (
                  detailContact.notes.map((entry) => (
                    <div key={entry.id} className="rounded-lg border border-white/5 bg-[#111111]/5 p-3">
                      <p className="text-sm text-zinc-300">{entry.note}</p>
                      <p className="mt-1 text-xs text-zinc-400">
                        {formatDateTime(entry.createdAt)}
                        {entry.admin?.fullName ? ` · ${entry.admin.fullName}` : ""}
                      </p>
                    </div>
                  ))
                )}
              </div>
              <textarea
                value={detailNote}
                onChange={(event) => setDetailNote(event.target.value)}
                rows={3}
                placeholder="Add a follow-up note..."
                className="mt-3 w-full rounded-lg border border-white/10 px-3 py-2.5 text-sm outline-none focus:border-[#FF653F]/50 focus:ring-2 focus:ring-[#FF653F]/10"
              />
              <Button
                type="button"
                onClick={saveDetailNote}
                disabled={busy || !detailNote.trim()}
                className="mt-2 gap-2"
              >
                <MessageSquarePlus className="h-4 w-4" />
                Save note
              </Button>
            </div>
          </div>
        ) : null}
      </ModalFrame>
    </div>
  );
}
