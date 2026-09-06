import type { Tables } from "@/utils/database.types";
import { claims$, itemDocuments$, items$ } from "@/utils/SupaLegend";

type ItemRow = Tables<"items">;
type ClaimRow = Tables<"claims">;
type DocumentRow = Tables<"item_documents">;

function byOwner<T extends { user_id: string }>(
  record: Record<string, T> | undefined,
  userId: string | undefined,
): Record<string, T> {
  if (!userId || !record) return {};
  const owned: Record<string, T> = {};
  for (const [id, row] of Object.entries(record)) {
    if (row.user_id === userId) owned[id] = row;
  }
  return owned;
}

/**
 * The synced Legend State stores (`items$`, `claims$`, `itemDocuments$`) are
 * populated by RLS + realtime and cached to AsyncStorage with no notion of
 * "the currently signed-in user" — a previous account's rows can keep
 * sitting in memory (or on disk, until the next sync round-trip) after a
 * different account signs in on the same device. Every screen that reads
 * one of these stores must go through the helpers below instead of the raw
 * `.get()`, or a stale row can leak across accounts.
 */
export function ownedItems(
  userId: string | undefined,
): Record<string, ItemRow> {
  return byOwner(items$.get() as Record<string, ItemRow> | undefined, userId);
}

export function ownedClaims(
  userId: string | undefined,
): Record<string, ClaimRow> {
  return byOwner(
    claims$.get() as Record<string, ClaimRow> | undefined,
    userId,
  );
}

/** `item_documents` has no `user_id` column of its own — ownership is derived through the parent item, so pass the already-filtered `ownedItems` result. */
export function ownedDocuments(
  itemsRecord: Record<string, ItemRow>,
): Record<string, DocumentRow> {
  const documentsRecord = itemDocuments$.get() as
    | Record<string, DocumentRow>
    | undefined;
  if (!documentsRecord) return {};

  const owned: Record<string, DocumentRow> = {};
  for (const [id, doc] of Object.entries(documentsRecord)) {
    if (itemsRecord[doc.item_id]) owned[id] = doc;
  }
  return owned;
}
