import type { IssueGroup, Recipient, Tone } from "@/utils/claims";
import type { PickedReceipt } from "@/utils/receipts";
import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

type ClaimDraftValue = {
  itemId: string | null;
  setItemId: (id: string) => void;

  issueGroup: IssueGroup | null;
  issue: string | null;
  /** Sets both atomically — one `OptionRow` tap picks one option from one group. */
  setIssue: (group: IssueGroup, issue: string) => void;

  since: string;
  setSince: (value: string) => void;

  description: string;
  setDescription: (value: string) => void;

  recipient: Recipient;
  setRecipient: (value: Recipient) => void;

  /** Ephemeral — never written to `claims` (no column for it). Only builds the "À :" line and the `mailto:` link. */
  recipientEmail: string;
  setRecipientEmail: (value: string) => void;

  /** Ephemeral — `profiles` has no phone column. Only used in the generated message's sign-off. */
  senderPhone: string;
  setSenderPhone: (value: string) => void;

  tone: Tone;
  setTone: (value: Tone) => void;

  photos: PickedReceipt[];
  addPhoto: (photo: PickedReceipt) => void;
  removePhoto: (index: number) => void;

  /** All three tones, generated (or fallback-filled) together on step 3. `null` until step 3 has run for the current facts. */
  messages: Record<Tone, string> | null;
  setMessages: (messages: Record<Tone, string> | null) => void;

  reset: () => void;
};

const initialState = {
  itemId: null as string | null,
  issueGroup: null as IssueGroup | null,
  issue: null as string | null,
  since: "",
  description: "",
  recipient: "Le vendeur" as Recipient,
  recipientEmail: "",
  senderPhone: "",
  tone: "Chaleureux" as Tone,
  photos: [] as PickedReceipt[],
  messages: null as Record<Tone, string> | null,
};

const ClaimDraftContext = createContext<ClaimDraftValue | null>(null);

export function ClaimDraftProvider({ children }: PropsWithChildren) {
  const [itemId, setItemIdState] = useState(initialState.itemId);
  const [issueGroup, setIssueGroup] = useState(initialState.issueGroup);
  const [issue, setIssueState] = useState(initialState.issue);
  const [since, setSince] = useState(initialState.since);
  const [description, setDescription] = useState(initialState.description);
  const [recipient, setRecipient] = useState(initialState.recipient);
  const [recipientEmail, setRecipientEmail] = useState(
    initialState.recipientEmail,
  );
  const [senderPhone, setSenderPhone] = useState(initialState.senderPhone);
  const [tone, setTone] = useState(initialState.tone);
  const [photos, setPhotos] = useState(initialState.photos);
  const [messages, setMessages] = useState(initialState.messages);

  const setItemId = useCallback((id: string) => setItemIdState(id), []);

  const setIssue = useCallback((group: IssueGroup, value: string) => {
    setIssueGroup(group);
    setIssueState(value);
    setMessages(null);
  }, []);

  const setSinceAndInvalidate = useCallback((value: string) => {
    setSince(value);
    setMessages(null);
  }, []);

  const setDescriptionAndInvalidate = useCallback((value: string) => {
    setDescription(value);
    setMessages(null);
  }, []);

  const setRecipientAndInvalidate = useCallback((value: Recipient) => {
    setRecipient(value);
    setMessages(null);
  }, []);

  const addPhoto = useCallback((photo: PickedReceipt) => {
    setPhotos((current) => [...current, photo]);
  }, []);

  const removePhoto = useCallback((index: number) => {
    setPhotos((current) => current.filter((_, i) => i !== index));
  }, []);

  const reset = useCallback(() => {
    setItemIdState(initialState.itemId);
    setIssueGroup(initialState.issueGroup);
    setIssueState(initialState.issue);
    setSince(initialState.since);
    setDescription(initialState.description);
    setRecipient(initialState.recipient);
    setRecipientEmail(initialState.recipientEmail);
    setSenderPhone(initialState.senderPhone);
    setTone(initialState.tone);
    setPhotos(initialState.photos);
    setMessages(initialState.messages);
  }, []);

  const value = useMemo<ClaimDraftValue>(
    () => ({
      itemId,
      setItemId,
      issueGroup,
      issue,
      setIssue,
      since,
      setSince: setSinceAndInvalidate,
      description,
      setDescription: setDescriptionAndInvalidate,
      recipient,
      setRecipient: setRecipientAndInvalidate,
      recipientEmail,
      setRecipientEmail,
      senderPhone,
      setSenderPhone,
      tone,
      setTone,
      photos,
      addPhoto,
      removePhoto,
      messages,
      setMessages,
      reset,
    }),
    [
      itemId,
      setItemId,
      issueGroup,
      issue,
      setIssue,
      since,
      setSinceAndInvalidate,
      description,
      setDescriptionAndInvalidate,
      recipient,
      setRecipientAndInvalidate,
      recipientEmail,
      senderPhone,
      tone,
      photos,
      addPhoto,
      removePhoto,
      messages,
      reset,
    ],
  );

  return (
    <ClaimDraftContext.Provider value={value}>
      {children}
    </ClaimDraftContext.Provider>
  );
}

export function useClaimDraft(): ClaimDraftValue {
  const value = useContext(ClaimDraftContext);
  if (!value) {
    throw new Error("useClaimDraft must be wrapped in a <ClaimDraftProvider />");
  }
  return value;
}
