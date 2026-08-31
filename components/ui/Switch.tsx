import { Pressable, Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import clsx from "clsx";
import {
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

const TRACK_WIDTH = 48;
const THUMB_SIZE = 22;
const THUMB_INSET = 3;

type SwitchProps = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  label?: string;
  description?: string;
  className?: string;
};

function Toggle({
  value,
  onValueChange,
  label,
}: Pick<SwitchProps, "value" | "onValueChange" | "label">) {
  const reduceMotion = useReducedMotion();

  const thumbStyle = useAnimatedStyle(() => {
    const x = value ? TRACK_WIDTH - THUMB_SIZE - THUMB_INSET : THUMB_INSET;
    return {
      transform: [
        { translateX: reduceMotion ? x : withTiming(x, { duration: 160 }) },
      ],
    };
  });

  return (
    <Pressable
      accessibilityRole="switch"
      accessibilityState={{ checked: value }}
      accessibilityLabel={label}
      onPress={() => onValueChange(!value)}
      className={clsx(
        "h-7 w-12 shrink-0 justify-center rounded-pill",
        value ? "bg-brand" : "bg-paper-3",
      )}
    >
      <Animated.View
        className="size-5.5 rounded-pill bg-card"
        style={thumbStyle}
      />
    </Pressable>
  );
}

/** On/off with an optional label + description row. Bare toggle if no label. */
export function Switch({
  value,
  onValueChange,
  label,
  description,
  className,
}: SwitchProps) {
  const toggle = (
    <Toggle value={value} onValueChange={onValueChange} label={label} />
  );

  if (!label) return toggle;

  return (
    <View className={twMerge("flex-row items-center gap-3", className)}>
      <View className="min-w-0 flex-1">
        <Text className="type-body-medium text-primary">{label}</Text>
        {description ? (
          <Text className="type-caption mt-0.5 text-brand-strong opacity-75">
            {description}
          </Text>
        ) : null}
      </View>
      {toggle}
    </View>
  );
}
