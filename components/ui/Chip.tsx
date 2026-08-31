import { motion } from "@/theme/tokens";
import { Text } from "@/tw";
import { Animated } from "@/tw/animated";
import clsx from "clsx";
import { ReactNode } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

type ChipTone = "brand" | "neutral";

type ChipProps = {
  children: ReactNode;
  selected?: boolean;
  tone?: ChipTone;
  onPress?: () => void;
  className?: string;
};

const selectedTones: Record<ChipTone, string> = {
  brand: "bg-brand border-transparent",
  neutral: "bg-inverse border-transparent",
};

export function Chip({
  children,
  selected = false,
  tone = "brand",
  onPress,
  className,
}: ChipProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Pressable
      accessibilityRole="button"
      accessibilityState={{ selected }}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      className={twMerge(
        clsx(
          "min-h-tap shrink-0 items-center justify-center rounded-chip border px-3.75 py-list",
          selected ? selectedTones[tone] : "border-line bg-transparent",
        ),
        className,
      )}
      style={animatedStyle}
    >
      <Text
        className={clsx(
          "font-sans-medium text-[13px]/[16px] font-medium",
          selected ? "text-on-dark" : "text-secondary",
        )}
      >
        {children}
      </Text>
    </Animated.Pressable>
  );
}
