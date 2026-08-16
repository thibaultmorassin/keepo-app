import type { IconName } from "@/components/ui/Icon";
import type { Tables } from "@/utils/database.types";

export const EXPIRING_THRESHOLD_DAYS = 45;
export const DEFAULT_REMINDER_DAYS = 30;

export type WarrantyStatus = "covered" | "expiring" | "expired";
export type WarrantyFilter = WarrantyStatus | null;

export type ItemRow = Tables<"items">;

function daysBetween(from: Date, toIso: string): number {
  const to = parseDate(toIso);
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.floor((to.getTime() - from.getTime()) / msPerDay);
}

function parseDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

export function statusOf(
  warrantyEndDate: string | null,
  now: Date = new Date(),
): WarrantyStatus | null {
  if (!warrantyEndDate) return null;

  const days = daysBetween(now, warrantyEndDate);
  if (days < 0) return "expired";
  if (days <= EXPIRING_THRESHOLD_DAYS) return "expiring";
  return "covered";
}

export function remainingDays(
  warrantyEndDate: string | null,
  now: Date = new Date(),
): number | null {
  if (!warrantyEndDate) return null;
  return daysBetween(now, warrantyEndDate);
}

export function remainingLabel(
  warrantyEndDate: string | null,
  now: Date = new Date(),
): string {
  const status = statusOf(warrantyEndDate, now);
  if (!status) return "Sans date";
  if (status === "expired") return "Expirée";

  const days = remainingDays(warrantyEndDate, now) ?? 0;
  if (status === "expiring") return `${days} j`;
  return `${Math.round(days / 30)} mois`;
}

export function categoryIcon(category: string): IconName {
  switch (category) {
    case "Électronique":
      return "smartphone";
    case "Informatique":
      return "laptop";
    case "Électroménager":
      return "washing-machine";
    case "Audio":
      return "headphones";
    case "Mobilité":
      return "bike";
    case "Jardin":
      return "trees";
    default:
      return "package";
  }
}

export type HomeStats = {
  totalCoveredValue: number;
  totalItems: number;
  openClaims: number;
  coveredCount: number;
  expiringCount: number;
  expiredCount: number;
  expiringItem: ItemRow | null;
};

export function deriveHomeStats(
  items: ItemRow[],
  openClaims: number,
  now: Date = new Date(),
): HomeStats {
  let totalCoveredValue = 0;
  let coveredCount = 0;
  let expiringCount = 0;
  let expiredCount = 0;
  let expiringItem: ItemRow | null = null;
  let soonestExpiringDays = Number.POSITIVE_INFINITY;

  for (const item of items) {
    const status = statusOf(item.warranty_end_date, now);
    if (!status) continue;

    if (status === "covered") {
      coveredCount += 1;
      totalCoveredValue += item.price ?? 0;
    } else if (status === "expiring") {
      expiringCount += 1;
      totalCoveredValue += item.price ?? 0;
      const days = remainingDays(item.warranty_end_date, now) ?? 0;
      if (days < soonestExpiringDays) {
        soonestExpiringDays = days;
        expiringItem = item;
      }
    } else {
      expiredCount += 1;
    }
  }

  return {
    totalCoveredValue,
    totalItems: items.length,
    openClaims,
    coveredCount,
    expiringCount,
    expiredCount,
    expiringItem,
  };
}

export function filterItems(
  items: ItemRow[],
  filter: WarrantyFilter,
  now: Date = new Date(),
): ItemRow[] {
  if (!filter) return items;
  return items.filter((item) => statusOf(item.warranty_end_date, now) === filter);
}

export function itemMeta(item: ItemRow): string {
  const location = item.store?.trim() || item.category;
  const date = item.purchase_date;
  return `${location} · ${formatPurchaseMeta(date)}`;
}

function formatPurchaseMeta(isoDate: string): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const months = [
    "janv.",
    "févr.",
    "mars",
    "avr.",
    "mai",
    "juin",
    "juil.",
    "août",
    "sept.",
    "oct.",
    "nov.",
    "déc.",
  ];
  return `${day} ${months[month - 1]} ${year}`;
}

export function openClaimsLabel(count: number): string {
  if (count === 0) return "0 réclamation ouverte";
  if (count === 1) return "1 réclamation ouverte";
  return `${count} réclamations ouvertes`;
}
