import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { color, space } from "@/theme/tokens";
import { type } from "@/theme/typography";
import { StyleSheet, Text } from "react-native";

type ComingSoonSheetProps = {
  visible: boolean;
  onClose: () => void;
  label?: string;
};

/**
 * Shared placeholder for rows whose real destination doesn't exist yet
 * (E-mail, Mot de passe, and every AIDE row) — one sheet instead of a
 * bespoke state per row.
 */
export function ComingSoonSheet({
  visible,
  onClose,
  label,
}: ComingSoonSheetProps) {
  return (
    <BottomSheet visible={visible} onClose={onClose}>
      <Text style={styles.title}>
        {label ? `${label} — bientôt disponible` : "Bientôt disponible"}
      </Text>
      <Text style={styles.body}>
        On y travaille — cette fonctionnalité arrive prochainement.
      </Text>
      <Button
        variant="primary"
        size="lg"
        full
        style={styles.action}
        onPress={onClose}
      >
        Compris
      </Button>
    </BottomSheet>
  );
}

const styles = StyleSheet.create({
  title: {
    ...type.heading,
    color: color.textPrimary,
    textAlign: "center",
  },
  body: {
    ...type.body,
    color: color.textSecondary,
    textAlign: "center",
    marginTop: space[4],
  },
  action: {
    marginTop: space[7],
  },
});
