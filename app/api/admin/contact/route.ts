import { NextResponse } from "next/server";
import { LeadStatus as ContactStatus } from "@prisma/client";
import { db } from "@/lib/db";
import { getSession } from "@/lib/auth";
import { unstable_cache, revalidateTag } from "next/cache";

async function assertAdmin() {
  const session = await getSession();
  if (!session || session.role !== "ADMIN" || !session.adminId) return null;
  return session;
}

const allowedContactStatuses: ContactStatus[] = [ContactStatus.NEW, ContactStatus.CLOSED];

export async function GET(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });

  const url = new URL(req.url);
  const q = url.searchParams.get("q")?.trim() || "";
  const status = url.searchParams.get("status") || "all";
  const page = Math.max(1, Number(url.searchParams.get("page") || "1"));
  const limit = Math.min(50, Math.max(5, Number(url.searchParams.get("limit") || "10")));
  const skip = (page - 1) * limit;

  const where = {
    ...(status !== "all" ? { status: status as ContactStatus } : {}),
    ...(q
      ? {
          OR: [
            { fullName: { contains: q, mode: "insensitive" as const } },
            { email: { contains: q, mode: "insensitive" as const } },
            { phone: { contains: q, mode: "insensitive" as const } },
            { subject: { contains: q, mode: "insensitive" as const } },
            { message: { contains: q, mode: "insensitive" as const } },
          ],
        }
      : {}),
  };

  const getCachedCounts = unstable_cache(
    async () => {
      const [newCount, closedCount] = await Promise.all([
        db.contact.count({ where: { status: ContactStatus.NEW } }),
        db.contact.count({ where: { status: ContactStatus.CLOSED } }),
      ]);
      return { newCount, closedCount };
    },
    ["contact-status-counts"],
    { tags: ["contact-counts"], revalidate: 3600 }
  );

  const countsPromise = getCachedCounts();

  const [total, contacts, { newCount, closedCount }] = await Promise.all([
      db.contact.count({ where }),
      db.contact.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take: limit,
        include: {
          notes: {
            orderBy: { createdAt: "desc" },
            include: {
              admin: { select: { fullName: true, email: true } },
            },
          },
        },
      }),
      countsPromise
    ]);

  return NextResponse.json({
    contacts,
    stats: {
      total,
      newCount,
      closedCount,
    },
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.max(1, Math.ceil(total / limit)),
    },
  });
}

export async function PATCH(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const adminId = session.adminId;

  const body = (await req.json().catch(() => ({}))) as {
    contactId?: string;
    status?: ContactStatus;
    note?: string;
  };
  if (!body.contactId) return NextResponse.json({ message: "Contact id required." }, { status: 400 });
  if (!body.status) return NextResponse.json({ message: "Status required." }, { status: 400 });
  if (!allowedContactStatuses.includes(body.status)) {
    return NextResponse.json({ message: "Only New or Closed status is allowed." }, { status: 400 });
  }

  const statusUpdatedAt = new Date();
  const contact = await db.contact.update({
    where: { id: body.contactId },
    data: {
      status: body.status,
      statusUpdatedAt,
    },
  });

  if (body.note?.trim()) {
    await db.contactNote.create({
      data: {
        contactId: contact.id,
        adminId,
        note: body.note.trim(),
      },
    });
  }

  await db.activityLog
    .create({
      data: {
        adminId,
        action: "UPDATE",
        entityType: "contact",
        entityId: contact.id,
        meta: { status: contact.status, email: contact.email, statusUpdatedAt },
      },
    })
    .catch(() => undefined);

  revalidateTag("contact-counts");

  return NextResponse.json({ success: true, contact });
}

export async function POST(req: Request) {
  const session = await assertAdmin();
  if (!session) return NextResponse.json({ message: "Forbidden" }, { status: 403 });
  const adminId = session.adminId;

  const body = (await req.json().catch(() => ({}))) as { contactId?: string; note?: string };
  if (!body.contactId) return NextResponse.json({ message: "Contact id required." }, { status: 400 });
  if (!body.note?.trim()) return NextResponse.json({ message: "Note cannot be empty." }, { status: 400 });

  const note = await db.contactNote.create({
    data: {
      contactId: body.contactId,
      adminId,
      note: body.note.trim(),
    },
    include: {
      admin: { select: { fullName: true, email: true } },
    },
  });

  await db.activityLog
    .create({
      data: {
        adminId,
        action: "UPDATE",
        entityType: "contact",
        entityId: body.contactId,
        meta: { note: true },
      },
    })
    .catch(() => undefined);

  return NextResponse.json({ success: true, note });
}
