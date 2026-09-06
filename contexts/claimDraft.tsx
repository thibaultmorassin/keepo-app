import type { IssueGroup, Recipient, Tone } from "@/utils/claims";
import type { PickedReceipt } from "@/utils/receipts";
import { observable } from "@legendapp/state";

/**
 * The in-progress claim, kept in a module-level Legend State observable
 * rather than component state. The `declare` modal's own screens (and their
 * `ClaimDraftProvider` predecessor) unmount every time the modal is
 * dismissed, so anything held in `useState` there is wiped on close — this
 * lives outside that tree, so closing and reopening the flow resumes exactly
 * where the user left it. Never persisted to AsyncStorage: it's cleared by
 * `reset()` once a claim is actually sent, and simply doesn't survive an app
 * kill — an in-progress draft is not meant to outlive the session.
 *
 * Read from inside a component wrapped in `observer()` (every `declare/*`
 * screen already is, per the app's Legend State convention) so `.get()`
 * reads subscribe correctly, exactly like `items$`/`claims$` elsewhere.
 */
type ClaimDraftState = {
  itemId: string | null;
  issueGroup: IssueGroup | null;
  issue: string | null;
  since: string;
  description: string;
  recipient: Recipient;
  /** Ephemeral — never written to `claims` (no column for it). Only builds the "À :" line and the mail composer's recipient. */
  recipientEmail: string;
  /** Ephemeral — `profiles` has no phone column. Only used in the generated message's sign-off. */
  senderPhone: string;
  tone: Tone;
  photos: PickedReceipt[];
  /** All three tones, generated (or fallback-filled) together on step 3. `null` until step 3 has run for the current facts. */
  messages: Record<Tone, string> | null;
};

function createInitialState(): ClaimDraftState {
  return {
    itemId: null,
    issueGroup: null,
    issue: null,
    since: "",
    description: "",
    recipient: "Le vendeur",
    recipientEmail: "",
    senderPhone: "",
    tone: "Chaleureux",
    photos: [],
    messages: null,
  };
}

const draft$ = observable<ClaimDraftState>(createInitialState());

/** Same-item edits keep everything; picking a genuinely different item starts that item's own fresh draft. */
function setItemId(id: string) {
  if (draft$.itemId.peek() === id) return;
  draft$.set({ ...createInitialState(), itemId: id });
}

function setIssue(group: IssueGroup, issue: string) {
  draft$.issueGroup.set(group);
  draft$.issue.set(issue);
  draft$.messages.set(null);
}

function setSince(value: string) {
  draft$.since.set(value);
  draft$.messages.set(null);
}

function setDescription(value: string) {
  draft$.description.set(value);
  draft$.messages.set(null);
}

function setRecipient(value: Recipient) {
  draft$.recipient.set(value);
  draft$.messages.set(null);
}

function setRecipientEmail(value: string) {
  draft$.recipientEmail.set(value);
}

function setSenderPhone(value: string) {
  draft$.senderPhone.set(value);
}

function setTone(value: Tone) {
  draft$.tone.set(value);
}

function addPhoto(photo: PickedReceipt) {
  draft$.photos.set([...draft$.photos.peek(), photo]);
}

function removePhoto(index: number) {
  draft$.photos.set(draft$.photos.peek().filter((_, i) => i !== index));
}

function setMessages(messages: Record<Tone, string> | null) {
  draft$.messages.set(messages);
}

/** Only meant to be called once a claim is actually sent — not on modal close, which should resume the draft. */
function reset() {
  draft$.set(createInitialState());
}

export function useClaimDraft() {
  return {
    itemId: draft$.itemId.get(),
    setItemId,
    issueGroup: draft$.issueGroup.get(),
    issue: draft$.issue.get(),
    setIssue,
    since: draft$.since.get(),
    setSince,
    description: draft$.description.get(),
    setDescription,
    recipient: draft$.recipient.get(),
    setRecipient,
    recipientEmail: draft$.recipientEmail.get(),
    setRecipientEmail,
    senderPhone: draft$.senderPhone.get(),
    setSenderPhone,
    tone: draft$.tone.get(),
    setTone,
    photos: draft$.photos.get(),
    addPhoto,
    removePhoto,
    messages: draft$.messages.get(),
    setMessages,
    reset,
  };
}
