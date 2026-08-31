import { BottomSheet } from "@/components/ui/BottomSheet";
import { Button } from "@/components/ui/Button";
import { Text } from "@/tw";

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
      <Text className="type-heading text-center text-primary">
        {label ? `${label} — bientôt disponible` : "Bientôt disponible"}
      </Text>
      <Text className="type-body mt-2 text-center text-secondary">
        On y travaille — cette fonctionnalité arrive prochainement.
      </Text>
      <Button
        variant="primary"
        size="lg"
        full
        className="mt-5"
        onPress={onClose}
      >
        Compris
      </Button>
    </BottomSheet>
  );
}
