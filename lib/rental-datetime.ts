/** 30-minute slots as 24h `HH:mm` */
export function generateTimeSlots(stepMinutes = 30): string[] {
  const slots: string[] = [];
  for (let h = 0; h < 24; h++) {
    for (let m = 0; m < 60; m += stepMinutes) {
      slots.push(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`);
    }
  }
  return slots;
}

export const TIME_SLOTS = generateTimeSlots(30);

export function todayDateString(): string {
  const now = new Date();
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
}

export function defaultPickupTime(): string {
  const now = new Date();
  const minutes = now.getMinutes();
  const rounded = Math.ceil(minutes / 30) * 30;
  const d = new Date(now);
  d.setMinutes(rounded, 0, 0);
  if (rounded >= 60) {
    d.setHours(d.getHours() + 1);
    d.setMinutes(0);
  }
  return `${String(d.getHours()).padStart(2, "0")}:${String(d.getMinutes()).padStart(2, "0")}`;
}

export function formatTimeIndian(time24: string): string {
  const [hStr, mStr] = time24.split(":");
  const h = Number(hStr);
  const m = Number(mStr);
  if (Number.isNaN(h) || Number.isNaN(m)) return time24;
  const period = h >= 12 ? "PM" : "AM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return `${hour12}:${String(m).padStart(2, "0")} ${period}`;
}

export function formatDateIndian(dateStr: string): string {
  if (!dateStr) return "";
  const d = new Date(`${dateStr}T12:00:00`);
  if (Number.isNaN(d.getTime())) return dateStr;
  return new Intl.DateTimeFormat("en-IN", { day: "numeric", month: "short", year: "numeric" }).format(d);
}

export function combineDateAndTime(date: string, time: string): string {
  if (!date) return "";
  const t = time || "09:00";
  return `${date}T${t}`;
}

export function splitDateTime(value: string): { date: string; time: string } {
  if (!value) return { date: "", time: "" };
  const [date, timePart] = value.split("T");
  const time = (timePart || "09:00").slice(0, 5);
  return { date: date || "", time };
}

export function formatDateTimeIndian(value: string): string {
  if (!value) return "";
  const { date, time } = splitDateTime(value);
  if (!date) return "";
  const dateLabel = formatDateIndian(date);
  if (!time) return dateLabel;
  return `${dateLabel}, ${formatTimeIndian(time)}`;
}

export function parseLocalDateTime(value: string): Date | null {
  if (!value) return null;
  const { date, time } = splitDateTime(value);
  if (!date) return null;
  const d = new Date(`${date}T${time || "00:00"}:00`);
  return Number.isNaN(d.getTime()) ? null : d;
}

export function isPastDate(dateStr: string): boolean {
  if (!dateStr) return false;
  return dateStr < todayDateString();
}

export function isDropBeforePickup(pickup: string, drop: string): boolean {
  const a = parseLocalDateTime(pickup);
  const b = parseLocalDateTime(drop);
  if (!a || !b) return false;
  return b.getTime() <= a.getTime();
}

/** Smallest drop datetime at least 30 minutes after pickup */
export function minDropDateTime(pickup: string): string {
  const base = parseLocalDateTime(pickup);
  if (!base) return "";
  base.setMinutes(base.getMinutes() + 30);
  const date = `${base.getFullYear()}-${String(base.getMonth() + 1).padStart(2, "0")}-${String(base.getDate()).padStart(2, "0")}`;
  const time = `${String(base.getHours()).padStart(2, "0")}:${String(base.getMinutes()).padStart(2, "0")}`;
  return combineDateAndTime(date, time);
}
