import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { color, radius, space } from "@/theme/tokens";
import { type } from "@/theme/typography";
import type { PickedReceipt } from "@/utils/receipts";
import {
  BottomSheetModal,
  BottomSheetView,
} from "@expo/ui/community/bottom-sheet";
import { useEffect, useRef } from "react";
import { Image, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ReceiptPreviewModalProps = {
  visible: boolean;
  onClose: () => void;
  receipt: PickedReceipt | null;
};

/** Bottom sheet preview of the receipt just picked, so it's the right one before saving. */
export function ReceiptPreviewModal({
  visible,
  onClose,
  receipt,
}: ReceiptPreviewModalProps) {
  const insets = useSafeAreaInsets();
  const modalRef = useRef<BottomSheetModal>(null);
  const isImage = receipt?.mimeType?.startsWith("image/") ?? false;

  useEffect(() => {
    if (visible) {
      modalRef.current?.present();
    } else {
      modalRef.current?.dismiss();
    }
  }, [visible]);

  return (
    <BottomSheetModal
      ref={modalRef}
      snapPoints={["92%"]}
      enablePanDownToClose
      onDismiss={onClose}
    >
      <BottomSheetView style={[styles.sheet]}>
        <View style={styles.body}>
          {receipt && isImage ? (
            <Image
              source={{ uri: receipt.uri }}
              style={styles.image}
              resizeMode="contain"
              borderRadius={radius.input}
            />
          ) : (
            <View style={styles.fallback}>
              <Icon name="file-text" size={40} color={color.textSecondary} />
              <Text style={styles.fallbackTitle} numberOfLines={2}>
                {receipt?.name}
              </Text>
              <Text style={styles.fallbackBody}>
                Aperçu indisponible pour ce type de fichier.
              </Text>
            </View>
          )}
        </View>

        <Button
          variant="secondary"
          size="lg"
          full
          onPress={() => modalRef.current?.dismiss()}
        >
          Fermer
        </Button>
      </BottomSheetView>
    </BottomSheetModal>
  );
}

const styles = StyleSheet.create({
  sheet: {
    flex: 1,
    paddingHorizontal: space.gutterScreen,
    paddingTop: space[4],
    gap: space[6],
  },
  body: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  image: {
    width: "100%",
    height: "100%",
  },
  fallback: {
    alignItems: "center",
    gap: space[4],
    paddingHorizontal: space[9],
  },
  fallbackTitle: {
    ...type.body,
    fontWeight: "600",
    color: color.textPrimary,
    textAlign: "center",
  },
  fallbackBody: {
    ...type.caption,
    color: color.textSecondary,
    textAlign: "center",
  },
});
