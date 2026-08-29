import { color, duration, radius, shadowStyle, space } from "@/theme/tokens";
import { ReactNode, useEffect } from "react";
import {
  Modal,
  Pressable,
  StyleSheet,
  View,
} from "react-native";
import Animated, {
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
      <View style={styles.container}>
        <Animated.View style={[styles.backdrop, backdropStyle]}>
          <Pressable
            accessibilityLabel="Fermer"
            style={StyleSheet.absoluteFill}
            onPress={onClose}
          />
        </Animated.View>
        <Animated.View
          style={[
            styles.sheet,
            { paddingBottom: insets.bottom + space[6] },
            sheetStyle,
          ]}
        >
          <View style={styles.handle} />
          {children}
        </Animated.View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "flex-end",
  },
  backdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(27,26,23,0.4)",
  },
  sheet: {
    backgroundColor: color.bgCard,
    borderTopLeftRadius: radius.hero,
    borderTopRightRadius: radius.hero,
    paddingTop: space[4],
    paddingHorizontal: space.gutterScreen,
    ...shadowStyle.lift,
  },
  handle: {
    alignSelf: "center",
    width: 36,
    height: 4,
    borderRadius: radius.pill,
    backgroundColor: color.borderStrong,
    marginBottom: space[6],
  },
});
