import { ClaimStepHeader } from "@/components/claim/ClaimStepHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { DocumentRow } from "@/components/ui/DocumentRow";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useClaimDraft } from "@/contexts/claimDraft";
import { useSession } from "@/contexts/session";
import { color } from "@/theme/tokens";
import { ScrollView, Text, TextInput, View } from "@/tw";
import {
  buildAllFallbackMessages,
  createClaim,
  TONES,
  type FallbackMessageInput,
  type Tone,
} from "@/utils/claims";
import { formatFileSize } from "@/utils/format";
import { haptics } from "@/utils/haptics";
import { ownedDocuments, ownedItems } from "@/utils/ownership";
import { fetchProfilePrefs } from "@/utils/profile";
import { downloadReceiptFile } from "@/utils/receipts";
import { supabase } from "@/utils/supabase";
import { observer } from "@legendapp/state/react";
import * as Clipboard from "expo-clipboard";
import { LinearGradient } from "expo-linear-gradient";
import * as MailComposer from "expo-mail-composer";
import { router } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const GENERATE_TIMEOUT_MS = 7000;

function ClaimMessageScreen() {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const {
    itemId,
    issueGroup,
    issue,
    since,
    description,
    recipient,
    recipientEmail,
    setRecipientEmail,
    senderPhone,
    tone,
    setTone,
    messages,
    setMessages,
    reset,
  } = useClaimDraft();

  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);

  const itemsRecord = ownedItems(session?.user.id);
  const item = itemId ? itemsRecord?.[itemId] : undefined;

  const documentsRecord = ownedDocuments(itemsRecord);
  // The item's most recent document — best-effort stand-in for "the receipt"
  // (there's no `role` column distinguishing a purchase receipt from a claim
  // evidence photo). Always forwarded as an attachment when sending, and
  // always shown here regardless of whether one was found.
  const receipt = itemId
    ? Object.values(documentsRecord ?? {})
        .filter((doc) => doc.item_id === itemId)
        .sort((a, b) => (b.created_at ?? "").localeCompare(a.created_at ?? ""))[0]
    : undefined;

  useEffect(() => {
    if (messages || !item || !issueGroup || !issue) return;
    let cancelled = false;

    async function run() {
      setGenerating(true);

      const { data: profile } = session
        ? await fetchProfilePrefs(session.user.id)
        : { data: null };
      const senderName = [profile?.firstName, profile?.lastName]
        .filter(Boolean)
        .join(" ")
        .trim();

      const input: FallbackMessageInput = {
        itemTitle: item!.title,
        store: item!.store,
        purchaseDateIso: item!.purchase_date,
        warrantyEndDateIso: item!.warranty_end_date,
        issueGroup: issueGroup!,
        issue: issue!,
        since,
        description,
        recipient,
        senderName,
        senderPhone,
      };

      const fallback = buildAllFallbackMessages(input);
      if (cancelled) return;

      const timeout = new Promise<null>((resolve) =>
        setTimeout(() => resolve(null), GENERATE_TIMEOUT_MS),
      );

      try {
        const result = await Promise.race([
          supabase.functions.invoke<{ messages: Record<Tone, string> }>(
            "generate-claim-message",
            {
              body: {
                itemTitle: input.itemTitle,
                store: input.store,
                purchaseDate: input.purchaseDateIso,
                warrantyEndDate: input.warrantyEndDateIso,
                issueGroup: input.issueGroup,
                issue: input.issue,
                since: input.since,
                description: input.description,
                recipient: input.recipient,
              },
            },
          ),
          timeout,
        ]);

        if (cancelled) return;

        const generated =
          result && !result.error ? result.data?.messages : undefined;

        setMessages(generated ?? fallback);
      } catch {
        if (!cancelled) setMessages(fallback);
      } finally {
        if (!cancelled) setGenerating(false);
      }
    }

    void run();
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    messages,
    item,
    issueGroup,
    issue,
    since,
    description,
    recipient,
    senderPhone,
    session,
  ]);

  const handleCopy = useCallback(async () => {
    if (!messages) return;
    await Clipboard.setStringAsync(messages[tone]);
    haptics.light();
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }, [messages, tone]);

  const handleSend = useCallback(async () => {
    if (!messages || sending || !itemId || !session || !issueGroup || !issue)
      return;

    setSending(true);
    setSendError(null);
    haptics.medium();

    // The claim record is offline-first and must land regardless of what
    // happens with the mail composer below.
    const claimId = createClaim({
      userId: session.user.id,
      itemId,
      issueGroup,
      issue,
      since,
      description,
      recipient,
      tone,
      message: messages[tone],
      sentAt: new Date().toISOString(),
    });

    let attachmentUri: string | null = null;
    if (receipt) {
      try {
        attachmentUri = await downloadReceiptFile(receipt);
      } catch {
        // Proceed without the attachment — the claim itself is already saved.
      }
    }

    try {
      const canCompose = await MailComposer.isAvailableAsync();
      if (canCompose) {
        await MailComposer.composeAsync({
          recipients: recipientEmail.trim() ? [recipientEmail.trim()] : [],
          subject: `Réclamation — ${item?.title ?? ""}`,
          body: messages[tone],
          attachments: attachmentUri ? [attachmentUri] : undefined,
        });
      } else {
        setSendError(
          "Aucune messagerie configurée — copiez le message pour l'envoyer vous-même.",
        );
      }
    } catch {
      // The user backed out of the compose screen — the claim is already saved.
    }

    reset();
    router.replace({
      pathname: "/declare/success",
      params: { itemId, claimId },
    });
  }, [
    messages,
    sending,
    itemId,
    session,
    issueGroup,
    issue,
    since,
    description,
    recipient,
    tone,
    item,
    recipientEmail,
    receipt,
    reset,
  ]);

  return (
    <View className="flex-1 bg-app">
      <View className="bg-app px-gutter pt-5 pb-3">
        <ClaimStepHeader
          step={3}
          itemName={item?.title ?? ""}
          onBack={() => router.back()}
        />
      </View>

      <ScrollView
        contentContainerClassName="gap-section px-gutter pt-3"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 140,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="type-title text-primary">
          C&apos;est prêt à partir
        </Text>

        <SegmentedControl<Tone>
          options={TONES}
          value={tone}
          onChange={setTone}
        />

        <Card tone="plain" size="hero" className="gap-3.5">
          <View className="flex-row items-center justify-between border-b border-line pb-3">
            <View className="flex-row items-center gap-1.5">
              <Text className="type-mono text-muted">À :</Text>
              <TextInput
                value={recipientEmail}
                onChangeText={setRecipientEmail}
                placeholder="email@exemple.com"
                placeholderTextColor={color.textMuted}
                keyboardType="email-address"
                autoCapitalize="none"
                autoCorrect={false}
                className="type-mono min-w-30 text-muted"
              />
            </View>
            <Text className="type-caption text-muted">Garantie</Text>
          </View>
          <Text className="type-body text-primary">
            {generating && !messages
              ? "Rédaction du message…"
              : (messages?.[tone] ?? "")}
          </Text>
        </Card>

        {receipt ? (
          <DocumentRow
            tone="tint"
            name={receipt.file_name}
            meta={`joint automatiquement${receipt.file_size ? ` · ${formatFileSize(receipt.file_size)}` : ""}`}
            action={
              <Icon name="paperclip" size={18} color={color.brandStrong} />
            }
          />
        ) : (
          <DocumentRow
            tone="tint"
            name="Aucun document disponible"
            meta="ajoutez une preuve d'achat depuis la fiche de l'objet"
            action={<Icon name="paperclip" size={18} color={color.textMuted} />}
          />
        )}

        {sendError ? (
          <Text className="type-body text-claim-fg">{sendError}</Text>
        ) : null}

        <View className="flex-row items-start gap-2.5 px-1">
          <Icon name="info" size={15} color={color.textSecondary} />
          <Text className="type-caption flex-1 text-secondary">
            On garde une copie dans l&apos;app et on vous relance dans 7 jours
            sans réponse.
          </Text>
        </View>
      </ScrollView>

      <LinearGradient
        colors={[`${color.bgApp}00`, color.bgApp]}
        locations={[0, 0.62]}
        pointerEvents="box-none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 18,
          paddingTop: 20,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <View className="flex-row gap-2.5">
          <IconButton
            label="Copier le message"
            onPress={handleCopy}
            className="size-13"
          >
            <Icon
              name={copied ? "check" : "copy"}
              size={20}
              color={copied ? color.brandStrong : color.textPrimary}
            />
          </IconButton>
          <Button
            variant="claim"
            size="lg"
            full
            disabled={!messages}
            loading={sending}
            onPress={handleSend}
            className="flex-1"
          >
            Envoyer avec le reçu
          </Button>
        </View>
      </LinearGradient>
    </View>
  );
}

export default observer(ClaimMessageScreen);
