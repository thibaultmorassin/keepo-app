import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { color, radius, space } from "@/theme/tokens";
import { fontFamily, type } from "@/theme/typography";
import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Platform,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";

type DateFieldProps = {
  label: string;
  value: Date | null;
  onChange: (date: Date) => void;
  placeholder?: string;
  maximumDate?: Date;
  minimumDate?: Date;
  error?: string;
  style?: StyleProp<ViewStyle>;
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
  style,
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
    <View style={[styles.wrapper, style]}>
      <Text style={styles.label}>{label}</Text>
      <Pressable
        accessibilityRole="button"
        accessibilityLabel={label}
        accessibilityValue={{
          text: value ? formatDisplay(value) : placeholder,
        }}
        onPress={open}
        style={[styles.input, error && styles.inputError]}
      >
        <Text
          numberOfLines={1}
          style={[styles.text, !value && styles.textPlaceholder]}
        >
          {value ? formatDisplay(value) : placeholder}
        </Text>
        <Icon name="calendar" size={17} color={color.textMuted} />
      </Pressable>
      {error ? <Text style={styles.errorText}>{error}</Text> : null}

      <BottomSheet visible={sheetOpen} onClose={() => setSheetOpen(false)}>
        <Text style={styles.sheetTitle}>{label}</Text>
        <View style={styles.pickerContainer}>
          <DateTimePicker
            value={draft}
            mode="date"
            display="spinner"
            locale="fr-FR"
            accentColor={color.brand}
            maximumDate={maximumDate}
            minimumDate={minimumDate}
            style={styles.picker}
            onValueChange={(_event, date) => {
              if (date) setDraft(date);
            }}
          />
        </View>
        <View style={styles.sheetActions}>
          <Button
            variant="secondary"
            size="lg"
            style={styles.sheetAction}
            onPress={() => setSheetOpen(false)}
          >
            Annuler
          </Button>
          <Button
            variant="primary"
            size="lg"
            style={styles.sheetAction}
            onPress={confirm}
          >
            Valider
          </Button>
        </View>
      </BottomSheet>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: space[3],
  },
  label: {
    ...type.micro,
    color: color.textSecondary,
  },
  input: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[4],
    borderWidth: 1,
    borderColor: color.borderSubtle,
    backgroundColor: color.bgCard,
    borderRadius: radius.input,
    paddingVertical: 12,
    paddingHorizontal: 14,
    minHeight: 45,
  },
  inputError: {
    borderColor: color.actionClaimFg,
  },
  text: {
    flex: 1,
    fontFamily: fontFamily.sans,
    fontSize: 14.5,
    color: color.textPrimary,
  },
  textPlaceholder: {
    color: color.textMuted,
  },
  errorText: {
    ...type.caption,
    color: color.actionClaimFg,
  },
  sheetTitle: {
    ...type.heading,
    color: color.textPrimary,
    textAlign: "center",
  },
  pickerContainer: {
    alignItems: "center",
  },
  picker: {
    height: 216,
    marginTop: space[4],
  },
  sheetActions: {
    flexDirection: "row",
    gap: space[4],
    marginTop: space[6],
  },
  sheetAction: {
    flex: 1,
  },
});
