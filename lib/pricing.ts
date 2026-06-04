import { parseLocalDateTime } from "@/lib/rental-datetime";

const MS_HOUR = 60 * 60 * 1000;
const MIN_BILLABLE_HOURS = 1;

export type RentalDuration = {
  hours: number;
  days: number;
  label: string;
  isHourly: boolean;
};

export type RentalQuote = RentalDuration & {
  total: number;
  pricePerDay: number;
  pricePerHour: number;
};

/** Legacy: date-only strings `YYYY-MM-DD` */
export function calcRentalDays(pickup: string, drop: string): number {
  const duration = calcRentalDuration(pickup, drop);
  if (!duration) return 1;
  return Math.max(1, duration.days || (duration.isHourly ? 1 : 1));
}

export function calcRentalDuration(pickup: string, drop: string): RentalDuration | null {
  const start = parseLocalDateTime(pickup);
  const end = parseLocalDateTime(drop);
  if (!start || !end || end.getTime() <= start.getTime()) return null;

  const diffMs = end.getTime() - start.getTime();
  const hoursRaw = diffMs / MS_HOUR;
  const hours = Math.max(MIN_BILLABLE_HOURS, Math.ceil(hoursRaw * 2) / 2);

  if (hours < 24) {
    const hLabel = hours === 1 ? "1 hour" : `${hours} hours`;
    return { hours, days: 0, label: hLabel, isHourly: true };
  }

  const days = Math.ceil(hours / 24);
  const label = days === 1 ? "1 day" : `${days} days`;
  return { hours, days, label, isHourly: false };
}

export function calcRentalQuote(
  pricePerDay: number,
  pricePerHour: number,
  pickup: string,
  drop: string,
): RentalQuote | null {
  const duration = calcRentalDuration(pickup, drop);
  if (!duration) return null;

  const total = duration.isHourly
    ? Math.round(duration.hours * pricePerHour)
    : Math.round((duration.days || 1) * pricePerDay);

  return {
    ...duration,
    total,
    pricePerDay,
    pricePerHour,
  };
}

export function calcDailyTotal(pricePerDay: number, days: number) {
  return pricePerDay * days;
}

export function buildRentalSearchParams(input: {
  pickup?: string;
  drop?: string;
  category?: string;
  days?: number;
}) {
  const qs = new URLSearchParams();
  if (input.pickup) qs.set("pickup", input.pickup);
  if (input.drop) qs.set("drop", input.drop);
  if (input.category && input.category !== "all") qs.set("category", input.category);
  if (input.pickup && input.drop) {
    const duration = calcRentalDuration(input.pickup, input.drop);
    if (duration?.days) qs.set("days", String(duration.days));
    else if (duration?.hours) qs.set("hours", String(duration.hours));
  } else if (input.days) {
    qs.set("days", String(input.days));
  }
  return qs;
}
