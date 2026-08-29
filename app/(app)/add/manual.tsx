import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Chip } from "@/components/ui/Chip";
import { DateField } from "@/components/ui/DateField";
import { DocumentRow } from "@/components/ui/DocumentRow";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { ReceiptPreviewModal } from "@/components/ui/ReceiptPreviewModal";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { Switch } from "@/components/ui/Switch";
import { useSession } from "@/contexts/session";
import { color, radius, space } from "@/theme/tokens";
import { fontFamily, type } from "@/theme/typography";
import { formatFileSize } from "@/utils/format";
import { haptics } from "@/utils/haptics";
import {
  CATEGORIES,
  createItem,
  DEFAULT_DURATION,
  type DurationLabel,
  DURATIONS,
  endDateForDuration,
  monthsForDuration,
  parsePriceInput,
  toIsoDate,
} from "@/utils/items";
import {
  type PickedReceipt,
  pickReceiptDocument,
  pickReceiptFromCamera,
  pickReceiptFromLibrary,
  receiptKindLabel,
  uploadReceipt,
} from "@/utils/receipts";
import { DEFAULT_REMINDER_DAYS } from "@/utils/warranty";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import { Controller, useForm } from "react-hook-form";
import {
  ActionSheetIOS,
  Alert,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const DURATION_LABELS = DURATIONS.map((d) => d.label);

const PICKER_ACTIONS = [
  { label: "Prendre une photo", pick: pickReceiptFromCamera },
  { label: "Choisir dans la galerie", pick: pickReceiptFromLibrary },
  { label: "Choisir un fichier", pick: pickReceiptDocument },
];

type FormValues = {
  title: string;
  category: string | null;
  price: string;
  purchaseDate: Date | null;
  store: string;
  warrantyEndDate: Date;
  reminderEnabled: boolean;
};

export default function AddManualScreen() {
  const insets = useSafeAreaInsets();
  const { session } = useSession();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      title: "",
      category: null,
      price: "",
      purchaseDate: null,
      store: "",
      warrantyEndDate: endDateForDuration(
        null,
        monthsForDuration(DEFAULT_DURATION),
      ),
      reminderEnabled: true,
    },
  });

  const purchaseDate = watch("purchaseDate");

  // `durationMode` is the active preset, or null once the end date has been
  // hand-edited to something the presets don't match (e.g. 16 months). It's
  // a UI-only concern, not a value the form itself submits.
  const [durationMode, setDurationMode] = useState<DurationLabel | null>(
    DEFAULT_DURATION,
  );
  const [receipt, setReceipt] = useState<PickedReceipt | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [saving, setSaving] = useState(false);
  const [submitError, setSubmitError] = useState<string | null>(null);

  const handlePurchaseDateChange = useCallback(
    (date: Date) => {
      setValue("purchaseDate", date);
      // A preset stays in effect across a purchase-date edit; a hand-picked
      // end date is the user's explicit choice and is left alone.
      if (durationMode) {
        setValue(
          "warrantyEndDate",
          endDateForDuration(date, monthsForDuration(durationMode)),
        );
      }
    },
    [durationMode, setValue],
  );

  const handleDurationPreset = useCallback(
    (label: DurationLabel) => {
      haptics.light();
      setDurationMode(label);
      setValue(
        "warrantyEndDate",
        endDateForDuration(purchaseDate, monthsForDuration(label)),
      );
    },
    [purchaseDate, setValue],
  );

  const handleWarrantyEndDateChange = useCallback(
    (date: Date) => {
      setDurationMode(null);
      setValue("warrantyEndDate", date);
    },
    [setValue],
  );

  const runPicker = useCallback(
    async (pick: () => Promise<PickedReceipt | null>) => {
      try {
        const picked = await pick();
        if (picked) {
          haptics.light();
          setReceipt(picked);
          // Straight to a preview — the user should see what got attached
          // before trusting it and moving on.
          setPreviewOpen(true);
        }
      } catch {
        setSubmitError("Impossible d'ouvrir ce reçu. Réessayez.");
      }
    },
    [],
  );

  const handleAttach = useCallback(() => {
    haptics.light();

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: [...PICKER_ACTIONS.map((a) => a.label), "Annuler"],
          cancelButtonIndex: PICKER_ACTIONS.length,
          title: "Ajouter le reçu",
        },
        (index) => {
          const action = PICKER_ACTIONS[index];
          if (action) void runPicker(action.pick);
        },
      );
      return;
    }

    Alert.alert("Ajouter le reçu", undefined, [
      ...PICKER_ACTIONS.map((action) => ({
        text: action.label,
        onPress: () => void runPicker(action.pick),
      })),
      { text: "Annuler", style: "cancel" as const },
    ]);
  }, [runPicker]);

  const onSubmit = useCallback(
    (data: FormValues) => {
      const userId = session?.user.id;
      if (saving || !data.purchaseDate || !data.category || !userId) return;

      setSaving(true);
      setSubmitError(null);
      haptics.medium();

      const id = createItem({
        userId,
        title: data.title,
        category: data.category,
        store: data.store,
        price: parsePriceInput(data.price),
        purchaseDate: toIsoDate(data.purchaseDate),
        warrantyEndDate: toIsoDate(data.warrantyEndDate),
        reminderEnabled: data.reminderEnabled,
      });

      // The item itself is offline-first; the upload is not. Never block the
      // save on it — a failed upload leaves the item intact, minus its receipt.
      if (receipt) {
        void uploadReceipt(userId, id, receipt).catch(() => {
          // Surfaced on the item detail screen as a missing document.
        });
      }

      router.replace({ pathname: "/add/success", params: { id } });
    },
    [receipt, saving, session],
  );

  const handleSave = useCallback(() => {
    void handleSubmit(onSubmit)();
  }, [handleSubmit, onSubmit]);

  return (
    <View style={styles.screen}>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : undefined}
        style={styles.flex}
      >
        <ScrollView
          contentContainerStyle={[
            styles.content,
            {
              paddingTop: space[7],
              paddingBottom: insets.bottom + 180,
            },
          ]}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <IconButton
              label="Retour"
              onPress={() => {
                haptics.light();
                router.back();
              }}
            >
              <Icon name="chevron-left" size={19} />
            </IconButton>
            <Text style={styles.heading}>Vérifier et enregistrer</Text>
          </View>

          <Card tone="plain" size="hero" style={styles.formCard}>
            <Controller
              control={control}
              name="title"
              rules={{
                validate: (value) =>
                  value.trim().length > 0 || "Donnez un nom à l'objet.",
              }}
              render={({ field: { value, onChange } }) => (
                <Field
                  label="Nom de l'objet"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Lave-vaisselle Bosch Serie 6"
                  autoCapitalize="sentences"
                  error={errors.title?.message}
                />
              )}
            />

            <Controller
              control={control}
              name="category"
              rules={{
                validate: (value) =>
                  value !== null || "Choisissez une catégorie.",
              }}
              render={({ field: { value, onChange } }) => (
                <View style={styles.group}>
                  <Text style={styles.groupLabel}>Catégorie</Text>
                  <View style={styles.chipRow}>
                    {CATEGORIES.map((option) => (
                      <Chip
                        key={option}
                        selected={value === option}
                        onPress={() => {
                          haptics.light();
                          onChange(option);
                        }}
                      >
                        {option}
                      </Chip>
                    ))}
                  </View>
                  {errors.category ? (
                    <Text style={styles.error}>{errors.category.message}</Text>
                  ) : null}
                </View>
              )}
            />

            <View style={styles.splitRow}>
              <Controller
                control={control}
                name="price"
                rules={{
                  validate: (value) =>
                    value.trim().length === 0 ||
                    parsePriceInput(value) !== null ||
                    "Prix invalide.",
                }}
                render={({ field: { value, onChange } }) => (
                  <Field
                    label="Prix"
                    value={value}
                    onChangeText={onChange}
                    placeholder="649,00"
                    keyboardType="decimal-pad"
                    suffix="€"
                    style={styles.splitItem}
                    error={errors.price?.message}
                  />
                )}
              />
              <Controller
                control={control}
                name="purchaseDate"
                rules={{
                  validate: (value) => value !== null || "Choisissez une date.",
                }}
                render={({ field: { value } }) => (
                  <DateField
                    label="Date d'achat"
                    value={value}
                    onChange={handlePurchaseDateChange}
                    maximumDate={new Date()}
                    style={styles.splitItem}
                    error={errors.purchaseDate?.message}
                  />
                )}
              />
            </View>

            <Controller
              control={control}
              name="store"
              render={({ field: { value, onChange } }) => (
                <Field
                  label="Magasin"
                  value={value}
                  onChangeText={onChange}
                  placeholder="Darty Beaugrenelle"
                  autoCapitalize="words"
                />
              )}
            />

            <View style={styles.group}>
              <Text style={styles.groupLabel}>Durée de garantie</Text>
              <SegmentedControl
                options={DURATION_LABELS}
                value={durationMode}
                onChange={handleDurationPreset}
              />
              <Controller
                control={control}
                name="warrantyEndDate"
                render={({ field: { value } }) => (
                  <DateField
                    label="Se termine le"
                    value={value}
                    onChange={handleWarrantyEndDateChange}
                    minimumDate={purchaseDate ?? undefined}
                  />
                )}
              />
            </View>
          </Card>

          {receipt ? (
            <DocumentRow
              name={receipt.name}
              meta={`${receiptKindLabel(receipt)}${
                receipt.size ? ` · ${formatFileSize(receipt.size)}` : ""
              }`}
              action={
                <Pressable
                  accessibilityRole="button"
                  accessibilityLabel="Remplacer le reçu"
                  hitSlop={8}
                  onPress={handleAttach}
                >
                  <Text style={styles.replace}>Remplacer</Text>
                </Pressable>
              }
              onPress={() => setPreviewOpen(true)}
            />
          ) : (
            <Pressable
              accessibilityRole="button"
              accessibilityLabel="Ajouter le reçu"
              onPress={handleAttach}
              style={styles.attach}
            >
              <View style={styles.attachIcon}>
                <Icon name="receipt" size={19} color={color.brand} />
              </View>
              <View style={styles.attachCopy}>
                <Text style={styles.attachTitle}>Ajouter le reçu</Text>
                <Text style={styles.attachBody}>
                  Photo, image ou PDF — la preuve d&apos;achat.
                </Text>
              </View>
            </Pressable>
          )}

          <Card tone="tint">
            <Controller
              control={control}
              name="reminderEnabled"
              render={({ field: { value, onChange } }) => (
                <Switch
                  value={value}
                  onValueChange={(next) => {
                    haptics.light();
                    onChange(next);
                  }}
                  label="Me prévenir avant la fin"
                  description={`${DEFAULT_REMINDER_DAYS} jours avant l'expiration`}
                />
              )}
            />
          </Card>

          {submitError ? <Text style={styles.error}>{submitError}</Text> : null}
        </ScrollView>
      </KeyboardAvoidingView>

      <LinearGradient
        colors={[`${color.bgApp}00`, color.bgApp]}
        locations={[0, 0.62]}
        pointerEvents="box-none"
        style={[styles.footer, { paddingBottom: insets.bottom + space[8] }]}
      >
        <Button
          variant="primary"
          size="lg"
          full
          loading={saving}
          onPress={handleSave}
        >
          Enregistrer l&apos;objet
        </Button>
      </LinearGradient>

      <ReceiptPreviewModal
        visible={previewOpen}
        onClose={() => setPreviewOpen(false)}
        receipt={receipt}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.bgApp,
  },
  flex: {
    flex: 1,
  },
  content: {
    paddingHorizontal: space.gutterScreen,
    gap: space[6],
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[5],
  },
  heading: {
    ...type.heading,
    color: color.textPrimary,
    flex: 1,
  },
  formCard: {
    gap: space[8],
  },
  group: {
    gap: space[4],
  },
  groupLabel: {
    ...type.micro,
    color: color.textSecondary,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: space[3],
  },
  splitRow: {
    flexDirection: "row",
    gap: 10,
  },
  splitItem: {
    flex: 1,
    minWidth: 0,
  },
  replace: {
    ...type.label,
    color: color.brand,
    fontWeight: "600",
  },
  attach: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[5],
    paddingVertical: 14,
    paddingHorizontal: space[6],
    borderRadius: radius.card,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: color.borderStrong,
    minHeight: space.tapMin,
  },
  attachIcon: {
    width: 40,
    height: 40,
    flexShrink: 0,
    borderRadius: radius.pill,
    backgroundColor: color.brandTint,
    alignItems: "center",
    justifyContent: "center",
  },
  attachCopy: {
    flex: 1,
    minWidth: 0,
  },
  attachTitle: {
    ...type.body,
    fontFamily: fontFamily.sansSemiBold,
    fontWeight: "600",
    color: color.textPrimary,
  },
  attachBody: {
    ...type.caption,
    color: color.textSecondary,
    marginTop: 1,
  },
  error: {
    ...type.body,
    color: color.actionClaimFg,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space.gutterScreen,
    paddingTop: space[7],
  },
});
