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

function clamp(value: number, min: number, max: number): number {
  return Math.min(max, Math.max(min, value));
}

function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** Percent of the warranty period elapsed. A full bar means act now. */
export function elapsedPct(
  purchaseDate: string,
  warrantyEndDate: string | null,
  now: Date = new Date(),
): number {
  if (!warrantyEndDate) return 0;

  const total = daysBetween(parseDate(purchaseDate), warrantyEndDate);
  if (total <= 0) return 100;

  const gone = daysBetween(parseDate(purchaseDate), toIsoDate(now));
  return clamp(Math.round((gone / total) * 100), 0, 100);
}

/** Status-dependent headline for CoverageBar. */
export function warrantyHeadline(
  warrantyEndDate: string | null,
  now: Date = new Date(),
): string {
  if (!warrantyEndDate) return "Sans date de fin";

  const status = statusOf(warrantyEndDate, now);
  if (status === "expired") return "Garantie terminée";

  const days = remainingDays(warrantyEndDate, now) ?? 0;
  if (status === "expiring") return `Plus que ${days} jours`;

  return `Sous garantie · ${Math.round(days / 30)} mois`;
}

/** Duration label from dates, e.g. "2 ans". */
export function warrantyDurationLabel(
  purchaseDate: string,
  warrantyEndDate: string | null,
): string | null {
  if (!warrantyEndDate) return null;

  const totalDays = daysBetween(parseDate(purchaseDate), warrantyEndDate);
  if (totalDays <= 0) return null;

  const months = Math.round(totalDays / 30);
  if (months >= 12) {
    const years = Math.round(months / 12);
    return years === 1 ? "1 an" : `${years} ans`;
  }

  return months === 1 ? "1 mois" : `${months} mois`;
}
