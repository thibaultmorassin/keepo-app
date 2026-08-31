import { motion } from "@/theme/tokens";
import { Text } from "@/tw";
import { Animated } from "@/tw/animated";
import clsx from "clsx";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

type StatTileTone = "onBrand" | "plain" | "covered" | "expiring" | "expired";

type StatTileProps = {
  value: string;
  label: string;
  tone?: StatTileTone;
  className?: string;
};

const tones: Record<StatTileTone, string> = {
  onBrand: "bg-on-dark/17",
  plain: "bg-sunken",
  covered: "bg-covered-bg",
  expiring: "bg-expiring-bg",
  expired: "bg-expired-bg",
};

const texts: Record<StatTileTone, string> = {
  onBrand: "text-on-dark",
  plain: "text-primary",
  covered: "text-covered-fg",
  expiring: "text-expiring-fg",
  expired: "text-expired-fg",
};

export function StatTile({
  value,
  label,
  tone = "onBrand",
  className,
}: StatTileProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Pressable
      onPressIn={() => {
        scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      className={twMerge(
        clsx("shrink-0 flex-1 rounded-tile px-3 py-list", tones[tone]),
        className,
      )}
      style={animatedStyle}
    >
      <Text
        className={clsx(
          "font-display-bold text-[20px]/[22px] font-bold tracking-[-0.4px]",
          texts[tone],
        )}
      >
        {value}
      </Text>
      <Text className={clsx("type-caption mt-0.5 opacity-85", texts[tone])}>
        {label}
      </Text>
    </Animated.Pressable>
  );
}
