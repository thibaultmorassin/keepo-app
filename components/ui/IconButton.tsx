import { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { color, motion, radius } from "@/theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type IconButtonVariant = "surface" | "ghost" | "brand" | "inverse";
type IconButtonSize = "sm" | "md";

type IconButtonProps = {
  children: ReactNode;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const skins: Record<IconButtonVariant, ViewStyle> = {
  surface: { backgroundColor: color.bgSunken },
  ghost: { backgroundColor: "transparent" },
  brand: { backgroundColor: color.brandTint },
  inverse: { backgroundColor: "rgba(252,250,246,0.16)" },
};

export function IconButton({
  children,
  label,
  variant = "surface",
  size = "md",
  onPress,
  style,
}: IconButtonProps) {
  const scale = useSharedValue(1);
  const px = size === "sm" ? 34 : 42;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.base,
        {
          width: px,
          height: px,
        },
        skins[variant],
        animatedStyle,
        style,
      ]}
    >
      {children}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
});
