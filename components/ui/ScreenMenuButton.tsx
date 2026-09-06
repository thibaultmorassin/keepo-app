import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { View } from "@/tw";
import { haptics } from "@/utils/haptics";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ScreenMenuButtonProps = {
  onPress: () => void;
};

/**
 * The right-side counterpart to `ScreenBackButton` — same floating spot a
 * native header's `headerRight` would occupy, for a screen that has no
 * native header at all. Just opens whatever menu the screen passes in
 * (an `ActionSheetIOS` / `Alert` menu, typically).
 */
export function ScreenMenuButton({ onPress }: ScreenMenuButtonProps) {
  const insets = useSafeAreaInsets();

  const handlePress = () => {
    haptics.light();
    onPress();
  };

  return (
    <View
      pointerEvents="box-none"
      className="absolute right-gutter z-10"
      style={{ top: insets.top + 8 }}
    >
      <IconButton label="Options" onPress={handlePress}>
        <Icon name="ellipsis" size={19} />
      </IconButton>
    </View>
  );
}
