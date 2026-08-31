import { duration } from "@/theme/tokens";
import { Modal, Pressable, View } from "@/tw";
import { Animated } from "@/tw/animated";
import { ReactNode, useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type BottomSheetProps = {
  visible: boolean;
  onClose: () => void;
  children: ReactNode;
};

/**
 * A minimal bottom sheet for native pickers (date, duration) that don't have
 * their own modal chrome — backdrop tap to dismiss, slide up from the bottom,
 * rounded top corners with a handle. Not a general-purpose product surface;
 * the design system's own components (Card, Chip…) still own screen content.
 */
export function BottomSheet({ visible, onClose, children }: BottomSheetProps) {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withTiming(visible ? 1 : 0, {
      duration: reduceMotion ? 0 : duration.base,
      easing: Easing.out(Easing.cubic),
    });
  }, [visible, reduceMotion, progress]);

  const backdropStyle = useAnimatedStyle(() => ({
    opacity: progress.value,
  }));

  const sheetStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: (1 - progress.value) * 420 }],
  }));

  return (
    <Modal
      visible={visible}
      transparent
      animationType="none"
      statusBarTranslucent
      onRequestClose={onClose}
    >
      <View className="flex-1 justify-end">
        <Animated.View
          className="absolute inset-0 bg-[rgba(27,26,23,0.4)]"
          style={backdropStyle}
        >
          <Pressable
            accessibilityLabel="Fermer"
            className="absolute inset-0"
            onPress={onClose}
          />
        </Animated.View>
        <Animated.View
          className="rounded-t-hero bg-card px-gutter pt-2 shadow-lift"
          style={[{ paddingBottom: insets.bottom + 16 }, sheetStyle]}
        >
          <View className="mb-4 h-1 w-9 self-center rounded-pill bg-line-strong" />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}
