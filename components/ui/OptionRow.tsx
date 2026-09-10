import { motion } from "@/theme/tokens";
import { Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import { haptics } from "@/utils/haptics";
import clsx from "clsx";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

type OptionRowProps = {
  label: string;
  description?: string;
  selected: boolean;
  onSelect: () => void;
  /** "radio" (default) for a single-select group; "checkbox" when several rows can be selected at once. */
  role?: "radio" | "checkbox";
  className?: string;
};

/** A single-select radio row by default — a group of these forms one choice. Pass `role="checkbox"` for a multi-select group instead. */
export function OptionRow({
  label,
  description,
  selected,
  onSelect,
  role = "radio",
  className,
}: OptionRowProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Pressable
      accessibilityRole={role}
      accessibilityState={{ checked: selected }}
      onPress={() => {
        haptics.light();
        onSelect();
      }}
      onPressIn={() => {
        scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      className={twMerge(
        "min-h-tap flex-row items-center gap-3.5 rounded-pill px-3.5 py-2.75",
        selected ? "bg-brand-tint" : "bg-card",
        className,
      )}
      style={animatedStyle}
    >
      <View
        className={clsx(
          "size-[18px] shrink-0 items-center justify-center rounded-pill border-2",
          selected ? "border-brand bg-brand" : "border-line-strong",
        )}
      >
        {selected ? <View className="size-2 rounded-pill bg-card" /> : null}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="type-body-medium text-primary">{label}</Text>
        {description ? (
          <Text className="type-caption mt-0.5 text-secondary">
            {description}
          </Text>
        ) : null}
      </View>
    </Animated.Pressable>
  );
}
