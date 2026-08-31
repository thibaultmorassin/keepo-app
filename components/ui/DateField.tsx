import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { color } from "@/theme/tokens";
import { Pressable, Text, View } from "@/tw";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import clsx from "clsx";
import { useState } from "react";
import { Platform } from "react-native";
import { twMerge } from "tailwind-merge";

type DateFieldProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  error?: string;
  className?: string;
};

function formatDisplay(date: Date): string {
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0");
  return `${day}/${month}/${date.getFullYear()}`;
}

/**
 * A `Field`-shaped trigger for the system date picker: a bottom sheet with a
 * spinner on iOS (draft-then-confirm, so a stray scroll can't commit), the
 * native imperative dialog on Android.
 */
export function DateField({
  label,
  value,
  onChange,
  placeholder = "JJ/MM/AAAA",
  maximumDate,
  minimumDate,
  error,
  className,
}: DateFieldProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [draft, setDraft] = useState<Date>(value ?? maximumDate ?? new Date());

  function open() {
    setDraft(value ?? maximumDate ?? new Date());

    if (Platform.OS === "android") {
      DateTimePickerAndroid.open({
        value: value ?? maximumDate ?? new Date(),
        mode: "date",
        maximumDate,
        minimumDate,
        onValueChange: (_event, date) => {
          if (date) onChange(date);
        },
      });
      return;
    }

    setSheetOpen(true);
  }

  function confirm() {
    onChange(draft);
    setSheetOpen(false);
  }

  return (
    <View className={twMerge("gap-1.5", className)}>
      <Text className="type-micro text-secondary">{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{
          text: value ? formatDisplay(value) : placeholder,
        }}
        onPress={open}
        className={clsx(
          "min-h-11.25 flex-row items-center gap-2 rounded-input border border-line bg-card px-3.5 py-3",
          error && "border-claim-fg",
        )}
      >
        <Text
          numberOfLines={1}
          className={clsx(
            "flex-1 font-sans text-[14.5px]",
            value ? "text-primary" : "text-muted",
          )}
        >
          {value ? formatDisplay(value) : placeholder}
        </Text>
        <Icon name="calendar" size={17} color={color.textMuted} />
      </Pressable>
      {error ? (
        <Text className="type-caption text-claim-fg">{error}</Text>
      ) : null}

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Text className="type-heading text-center text-primary">{label}</Text>
        <View className="items-center">
          <DateTimePicker
            value={draft}
            mode="date"
            display="spinner"
            locale="fr-FR"
            accentColor={color.brand}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            style={{ height: 216, marginTop: 8 }}
            onValueChange={(_event, date) => {
              if (date) setDraft(date);
            }}
          />
        </View>
        <View className="mt-4 flex-row gap-2">
          <Button
            variant="secondary"
            size="lg"
            className="flex-1"
            onPress={() => setSheetOpen(false)}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            size="lg"
            className="flex-1"
            onPress={confirm}
          >
            Valider
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}
