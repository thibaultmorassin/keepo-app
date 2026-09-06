import type { IconName } from "@/components/ui/Icon";
import { claims$, generateId } from "@/utils/SupaLegend";
import type { Tables, TablesInsert } from "@/utils/database.types";
import { formatShortDate } from "@/utils/format";

type Claim = Tables<"claims">;

/** The three issue groups the claim wizard offers, each with its own options. */
export const ISSUES = [
  {
    title: "Panne",
    icon: "zap-off" as IconName,
    options: [
      "S'arrête en cours de cycle",
      "Ne s'allume plus",
      "Fuite ou infiltration",
      "Bruit anormal",
    ],
  },
  {
    title: "Dommage accidentel",
    icon: "triangle-alert" as IconName,
    options: ["Chute ou choc", "Dégât des eaux", "Écran ou façade cassé"],
  },
  {
    title: "Livraison ou pièce",
    icon: "package" as IconName,
    options: ["Pièce manquante", "Accessoire défectueux", "Autre"],
  },
] as const;

export type IssueGroup = (typeof ISSUES)[number]["title"];

export const RECIPIENTS = ["Le vendeur", "Le fabricant"] as const;
export type Recipient = (typeof RECIPIENTS)[number];

export const TONES = ["Chaleureux", "Neutre", "Ferme"] as const;
export type Tone = (typeof TONES)[number];

/**
 * `created_at` / `updated_at` are left null so the `handle_times` trigger owns
 * them, matching the shape Legend State expects for a locally-created row
 * (mirrors `NewItemRow` in `utils/items.ts`).
 */
type NewClaimRow = Omit<TablesInsert<"claims">, "created_at" | "updated_at"> & {
  created_at: null;
  updated_at: null;
};

const claimsStore = claims$ as unknown as Record<
  string,
  { set: (value: NewClaimRow) => void }
>;

export type NewClaimInput = {
  userId: string;
  itemId: string;
  issueGroup: IssueGroup;
  issue: string;
  since: string;
  description: string;
  recipient: Recipient;
  tone: Tone;
  message: string;
  /**
   * The send button is the only way a claim is ever created in this flow, so
   * there's no meaningful "created but not yet sent" state to track — pass an
   * ISO timestamp to fold `sent_at` directly into the insert.
   */
  sentAt?: string | null;
};

/**
 * Writes a new claim into the synced store and returns its id. Local-first,
 * same as `createItem` — it lands in the observable immediately and Legend
 * State pushes it to Supabase when there's a connection.
 */
export function createClaim(input: NewClaimInput): string {
  const id = generateId();

  claimsStore[id].set({
    id,
    user_id: input.userId,
    item_id: input.itemId,
    issue_group: input.issueGroup,
    issue: input.issue,
    since: input.since.trim(),
    description: input.description.trim(),
    recipient: input.recipient,
    tone: input.tone,
    message: input.message,
    sent_at: input.sentAt ?? null,
    follow_up_at: null,
    resolved_at: null,
    created_at: null,
    updated_at: null,
    deleted: false,
  });

  return id;
}

/** Marks an existing claim as sent. Not used by the send flow (which folds `sent_at` into `createClaim`), kept for a future claims-tracker use case. */
export function markClaimSent(claimId: string): void {
  const store = claims$ as unknown as Record<
    string,
    { sent_at: { set: (value: string) => void } }
  >;
  store[claimId].sent_at.set(new Date().toISOString());
}

export type ClaimStatus = "pending" | "resolved";

/**
 * A claim only ever lands in the store already sent (see `createClaim`), so
 * the only distinction worth surfacing to the user is whether it's still
 * waiting on a reply.
 */
export function claimStatus(claim: Pick<Claim, "resolved_at">): ClaimStatus {
  return claim.resolved_at ? "resolved" : "pending";
}

export function claimStatusLabel(status: ClaimStatus): string {
  return status === "resolved" ? "Résolue" : "En attente";
}

/** The icon of the issue group a claim was filed under — falls back for data predating a group rename. */
export function claimIssueGroupIcon(issueGroup: string): IconName {
  return (
    ISSUES.find((group) => group.title === issueGroup)?.icon ??
    "triangle-alert"
  );
}

/** Whole days elapsed since a claim was sent — used to flag ones going quiet. */
export function daysSinceSent(sentAt: string, now: Date = new Date()): number {
  const msPerDay = 1000 * 60 * 60 * 24;
  return Math.max(
    0,
    Math.floor((now.getTime() - new Date(sentAt).getTime()) / msPerDay),
  );
}

export function daysSinceSentLabel(sentAt: string, now: Date = new Date()): string {
  const days = daysSinceSent(sentAt, now);
  if (days === 0) return "Envoyée aujourd'hui";
  if (days === 1) return "Envoyée hier";
  return `Envoyée il y a ${days} j`;
}

export type FallbackMessageInput = {
  itemTitle: string;
  store: string | null;
  purchaseDateIso: string;
  warrantyEndDateIso: string | null;
  issueGroup: IssueGroup;
  issue: string;
  since: string;
  description: string;
  recipient: Recipient;
  /** "" if the profile has neither first nor last name. */
  senderName: string;
  /** "" if not provided — the ephemeral draft field. */
  senderPhone: string;
};

function signOff(senderName: string, senderPhone: string): string {
  const name = senderName.trim() || "Le client";
  return senderPhone.trim() ? `${name} — ${senderPhone.trim()}` : name;
}

function warrantyClause(warrantyEndDateIso: string | null): string {
  return warrantyEndDateIso
    ? `Il est encore sous garantie jusqu'au ${formatShortDate(warrantyEndDateIso)}.`
    : "Il est encore sous garantie.";
}

function storeClause(store: string | null): string {
  return store?.trim() ? `chez vous (${store.trim()})` : "chez vous";
}

/**
 * Deterministic, offline-capable message per tone — no network, no LLM. Used
 * as the instant seed before the LLM call resolves, and as the silent
 * fallback whenever it fails, times out, or the device is offline. Only
 * "Ferme" cites the consumer-code articles, per the copy rules in
 * `.claude/skills/keepo-design/Preuve.mdx` §5.
 */
export function buildFallbackMessage(
  input: FallbackMessageInput,
  tone: Tone,
): string {
  const purchaseDate = formatShortDate(input.purchaseDateIso);
  const symptom = input.description.trim() || input.issue;
  const store = storeClause(input.store);
  const warranty = warrantyClause(input.warrantyEndDateIso);
  const sign = signOff(input.senderName, input.senderPhone);

  switch (tone) {
    case "Chaleureux":
      return [
        "Bonjour,",
        "",
        `J'ai acheté ${store} un ${input.itemTitle} le ${purchaseDate} (ticket joint). Depuis ${input.since.trim() || "peu"}, ${symptom.toLowerCase()}.`,
        "",
        `${warranty} Comment se passe la prise en charge ? Je peux passer quand vous voulez cette semaine.`,
        "",
        `Merci beaucoup, bonne journée !`,
        sign,
      ].join("\n");

    case "Neutre":
      return [
        "Bonjour,",
        "",
        `Je vous contacte au sujet d'un ${input.itemTitle} acheté le ${purchaseDate} ${store} (ticket en pièce jointe).`,
        "",
        `${symptom} La garantie court jusqu'au ${input.warrantyEndDateIso ? formatShortDate(input.warrantyEndDateIso) : "une date ultérieure"}.`,
        "",
        "Merci de m'indiquer la procédure de prise en charge.",
        "",
        "Cordialement,",
        sign,
      ].join("\n");

    case "Ferme":
      return [
        "Bonjour,",
        "",
        `Le ${input.itemTitle} acheté le ${purchaseDate} ${store} (ticket joint) présente un problème : ${symptom.toLowerCase()}.`,
        "",
        `${warranty} Je vous demande une réparation ou un remplacement sans frais, conformément aux articles L.217-3 et suivants du code de la consommation.`,
        "",
        "Merci de me confirmer la prise en charge sous 8 jours.",
        "",
        "Cordialement,",
        sign,
      ].join("\n");
  }
}

/** All three tones at once — one pass, so switching tone on step 3 is instant. */
export function buildAllFallbackMessages(
  input: FallbackMessageInput,
): Record<Tone, string> {
  return {
    Chaleureux: buildFallbackMessage(input, "Chaleureux"),
    Neutre: buildFallbackMessage(input, "Neutre"),
    Ferme: buildFallbackMessage(input, "Ferme"),
  };
}
