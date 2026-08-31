import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { color } from "@/theme/tokens";
import { Image, Text, View } from "@/tw";
import type { PickedReceipt } from "@/utils/receipts";
import {
  BottomSheetModal,
  BottomSheetView,
} from "@expo/ui/community/bottom-sheet";
import { useEffect, useRef } from "react";

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
      <BottomSheetView style={{ flex: 1, paddingHorizontal: 18, paddingTop: 8, gap: 16 }}>
        <View className="flex-1 items-center justify-center">
          {receipt && isImage ? (
            <Image
              source={{ uri: receipt.uri }}
              className="size-full rounded-input"
              resizeMode="contain"
            />
          ) : (
            <View className="items-center gap-2 px-8">
              <Icon name="file-text" size={40} color={color.textSecondary} />
              <Text
                className="type-body-semibold text-center text-primary"
                numberOfLines={2}
              >
                {receipt?.name}
              </Text>
              <Text className="type-caption text-center text-secondary">
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
