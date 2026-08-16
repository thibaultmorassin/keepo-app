import { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { color, motion, radius, space } from "@/theme/tokens";
import { fontFamily } from "@/theme/typography";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ChipTone = "brand" | "neutral";

type ChipProps = {
  children: ReactNode;
  selected?: boolean;
  tone?: ChipTone;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function Chip({
  children,
  selected = false,
  tone = "brand",
  onPress,
  style,
}: ChipProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const selectedStyle =
    tone === "neutral"
      ? { backgroundColor: color.bgInverse, borderColor: "transparent" }
      : { backgroundColor: color.brand, borderColor: "transparent" };

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.base,
        selected ? selectedStyle : styles.unselected,
        animatedStyle,
        style,
      ]}
    >
      <Text
        style={[
          styles.label,
          { color: selected ? color.textOnDark : color.textSecondary },
        ]}
      >
        {children}
      </Text>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: space.tapMin,
    paddingHorizontal: 15,
    paddingVertical: 9,
    borderRadius: radius.chip,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  unselected: {
    backgroundColor: "transparent",
    borderColor: color.borderSubtle,
  },
  label: {
    fontFamily: fontFamily.sansMedium,
    fontSize: 13,
    lineHeight: 16,
    fontWeight: "500",
  },
});
