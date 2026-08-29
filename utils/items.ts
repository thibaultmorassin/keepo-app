import type { TablesInsert } from "@/utils/database.types";
import { generateId, items$ } from "@/utils/SupaLegend";

/**
 * `created_at` / `updated_at` are left null so the `handle_times` trigger owns
 * them, matching the shape Legend State expects for a locally-created row.
 */
type NewItemRow = Omit<TablesInsert<"items">, "created_at" | "updated_at"> & {
  created_at: null;
  updated_at: null;
};

const itemsStore = items$ as unknown as Record<
  string,
  { set: (value: NewItemRow) => void }
>;

/** The five categories the add form offers, aligned with `categoryIcon`. */
export const CATEGORIES = [
  "Électroménager",
  "Électronique",
  "Informatique",
  "Jardin",
  "Mobilité",
] as const;

export type Category = (typeof CATEGORIES)[number];

/**
 * `items` has no duration column — duration is folded into `warranty_end_date`
 * on write and read back out by `warrantyDurationLabel`.
 */
export const DURATIONS = [
  { label: "1 an", months: 12 },
  { label: "2 ans", months: 24 },
  { label: "3 ans", months: 36 },
  { label: "5 ans", months: 60 },
] as const;

export type DurationLabel = (typeof DURATIONS)[number]["label"];

export const DEFAULT_DURATION: DurationLabel = "2 ans";

export function monthsForDuration(label: DurationLabel): number {
  return DURATIONS.find((d) => d.label === label)?.months ?? 24;
}

export function toIsoDate(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0");
  const day = String(date.getDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

/** The inverse of `toIsoDate` — parsed in local time, not UTC. */
export function parseIsoDate(isoDate: string): Date {
  const [year, month, day] = isoDate.split("-").map(Number);
  return new Date(year, month - 1, day);
}

/** The warranty end date a quick-pick duration produces from a purchase date. */
export function endDateForDuration(
  purchaseDate: Date | null,
  months: number,
): Date {
  const anchor = purchaseDate ?? new Date();
  return parseIsoDate(addMonthsIso(toIsoDate(anchor), months));
}

/**
 * Adds whole months to an ISO date, clamping to the end of the target month so
 * 31 January + 1 month lands on 28/29 February rather than sliding into March.
 */
export function addMonthsIso(isoDate: string, months: number): string {
  const [year, month, day] = isoDate.split("-").map(Number);
  const target = new Date(year, month - 1 + months, 1);
  const lastDayOfTargetMonth = new Date(
    target.getFullYear(),
    target.getMonth() + 1,
    0,
  ).getDate();
  target.setDate(Math.min(day, lastDayOfTargetMonth));
  return toIsoDate(target);
}

/**
 * Parses what a French keypad produces — "1 299,00", "649.5", "649" — into
 * whole euros. Prices are stored in euros, not cents (see `formatEuro`).
 */
export function parsePriceInput(raw: string): number | null {
  const cleaned = raw.replace(/[\s  €]/g, "").replace(",", ".");
  if (!cleaned) return null;

  const value = Number(cleaned);
  if (!Number.isFinite(value) || value < 0) return null;

  return Math.round(value);
}

export type NewItemInput = {
  userId: string;
  title: string;
  category: string;
  store?: string | null;
  price?: number | null;
  purchaseDate: string;
  warrantyEndDate: string;
  /** Whether this item participates in the expiry reminder. Defaults on. */
  reminderEnabled?: boolean;
};

/**
 * Writes a new item into the synced store and returns its id. The write is
 * local-first: it lands in the observable immediately and Legend State pushes
 * it to Supabase when there's a connection.
 */
export function createItem(input: NewItemInput): string {
  const id = generateId();
  const store = input.store?.trim();

  itemsStore[id].set({
    id,
    user_id: input.userId,
    title: input.title.trim(),
    category: input.category,
    store: store ? store : null,
    price: input.price ?? null,
    currency: "EUR",
    purchase_date: input.purchaseDate,
    warranty_end_date: input.warrantyEndDate,
    reminder_enabled: input.reminderEnabled ?? true,
    notes: null,
    // Left to the `handle_times` trigger.
    created_at: null,
    updated_at: null,
    deleted: false,
  });

  return id;
}
