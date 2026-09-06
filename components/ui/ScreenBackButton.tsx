import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { View } from "@/tw";
import { haptics } from "@/utils/haptics";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenBackButtonProps = {
  onPress?: () => void;
};

/**
 * Floats over a screen's own scrollable content, in the same spot the native
 * Stack header's back chevron used to sit — for screens that turn the native
 * header off so every back button in the app is this one, not the OS's.
 * Defaults to `router.back()`; pass `onPress` for anything more specific.
 */
export function ScreenBackButton({ onPress }: ScreenBackButtonProps) {
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    haptics.light();
    if (onPress) {
      onPress();
    } else {
      router.back();
    }
  };

  return (
    <View
      pointerEvents="box-none"
      className="absolute left-gutter z-10"
      style={{ top: insets.top + 8 }}
    >
      <IconButton label="Retour" onPress={handlePress}>
        <Icon name="chevron-left" size={19} />
      </IconButton>
    </View>
  );
}
