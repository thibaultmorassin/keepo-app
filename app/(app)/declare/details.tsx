import { ClaimStepHeader } from "@/components/claim/ClaimStepHeader";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { useClaimDraft } from "@/contexts/claimDraft";
import { useSession } from "@/contexts/session";
import { color } from "@/theme/tokens";
import { Image, Pressable, ScrollView, Text, View } from "@/tw";
import { RECIPIENTS, type Recipient } from "@/utils/claims";
import { haptics } from "@/utils/haptics";
import { ownedItems } from "@/utils/ownership";
import {
  pickReceiptDocument,
  pickReceiptFromCamera,
  pickReceiptFromLibrary,
  uploadReceipt,
  type PickedReceipt,
} from "@/utils/receipts";
import { observer } from "@legendapp/state/react";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback } from "react";
import { ActionSheetIOS, Alert, Platform } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const PICKER_ACTIONS = [
  { label: "Prendre une photo", pick: pickReceiptFromCamera },
  { label: "Choisir dans la galerie", pick: pickReceiptFromLibrary },
  { label: "Choisir un fichier", pick: pickReceiptDocument },
];

function ClaimDetailsScreen() {
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const {
    itemId,
    issue,
    since,
    setSince,
    description,
    setDescription,
    recipient,
    setRecipient,
    photos,
    addPhoto,
  } = useClaimDraft();

  const itemsRecord = ownedItems(session?.user.id);
  const item = itemId ? itemsRecord?.[itemId] : undefined;

  const runPicker = useCallback(
    async (pick: () => Promise<PickedReceipt | null>) => {
      try {
        const picked = await pick();
        if (picked) {
          haptics.light();
          addPhoto(picked);
          if (itemId && session?.user.id) {
            void uploadReceipt(session.user.id, itemId, picked).catch(() => {
              // Surfaced later on the item's own Documents list if it fails to sync.
            });
          }
        }
      } catch {
        // The user backed out or the picker failed — nothing to attach.
      }
    },
    [addPhoto, itemId, session],
  );

  const handleAttach = useCallback(() => {
    haptics.light();

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...PICKER_ACTIONS.map((a) => a.label), "Annuler"],
          cancelButtonIndex: PICKER_ACTIONS.length,
          title: "Ajouter une photo",
        },
        (index) => {
          const action = PICKER_ACTIONS[index];
          if (action) void runPicker(action.pick);
        },
      );
      return;
    }

    Alert.alert("Ajouter une photo", undefined, [
      ...PICKER_ACTIONS.map((action) => ({
        text: action.label,
        onPress: () => void runPicker(action.pick),
      })),
      { text: "Annuler", style: "cancel" as const },
    ]);
  }, [runPicker]);

  const handleGenerate = useCallback(() => {
    haptics.light();
    router.push("/declare/message");
  }, []);

  return (
    <View className="flex-1 bg-app">
      <View className="bg-app px-gutter pt-5 pb-3">
        <ClaimStepHeader
          step={2}
          itemName={item?.title ?? ""}
          onBack={() => router.back()}
        />
      </View>

      <ScrollView
        contentContainerClassName="gap-section px-gutter pt-3"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 130,
        }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        <Text className="type-title text-primary">Racontez-nous</Text>

        {issue ? (
          <Badge
            status="claim"
            icon={
              <Icon
                name="check"
                size={13}
                strokeWidth={3}
                color={color.actionClaimFg}
              />
            }
            className="self-start px-3.5 py-1.75"
          >
            {issue}
          </Badge>
        ) : null}

        <Card tone="plain" size="hero" className="gap-5">
          <Field
            label="Depuis quand ?"
            value={since}
            onChangeText={setSince}
            placeholder="Depuis lundi"
          />
          <Field
            label="Décrivez le problème"
            value={description}
            onChangeText={setDescription}
            placeholder="Ce qui se passe, en quelques mots"
            multiline
            numberOfLines={4}
          />
          <View className="gap-2">
            <Text className="type-micro text-secondary">Interlocuteur</Text>
            <SegmentedControl<Recipient>
              options={RECIPIENTS}
              value={recipient}
              onChange={setRecipient}
            />
          </View>
        </Card>

        <View className="flex-row gap-2.5">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Ajouter une photo"
            onPress={handleAttach}
            className="size-28.75 items-center justify-center rounded-card border border-dashed border-line-strong"
          >
            <Icon name="plus" size={22} color={color.textMuted} />
          </Pressable>
          {photos.map((photo, index) => (
            <View
              key={`${photo.uri}-${index}`}
              className="size-28.75 overflow-hidden rounded-card bg-sunken"
            >
              {photo.mimeType?.startsWith("image/") ? (
                <Image
                  source={{ uri: photo.uri }}
                  className="size-full"
                  resizeMode="cover"
                />
              ) : (
                <View className="flex-1 items-center justify-center gap-1 px-2">
                  <Icon
                    name="file-text"
                    size={20}
                    color={color.textSecondary}
                  />
                  <Text
                    className="type-mono text-center text-secondary"
                    numberOfLines={2}
                  >
                    {photo.name}
                  </Text>
                </View>
              )}
            </View>
          ))}
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
        <Button
          variant="primary"
          size="lg"
          full
          disabled={!description.trim()}
          onPress={handleGenerate}
        >
          Générer le message
        </Button>
      </LinearGradient>
    </View>
  );
}

export default observer(ClaimDetailsScreen);
