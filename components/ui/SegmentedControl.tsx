import { duration } from "@/theme/tokens";
import { Pressable, Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import clsx from "clsx";
import { useState } from "react";
import type { LayoutChangeEvent } from "react-native";
import {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

/** Matches the `p-1` on the track — the thumb is inset by the same amount. */
const TRACK_PADDING = 4;

type SegmentedControlProps<T extends string> = {
  options: readonly T[];
  /** `null` renders no segment selected — e.g. a custom value the presets don't match. */
  value: T | null;
  onChange?: (value: T) => void;
  className?: string;
};

/** 2–4 exclusive short options in one sunken track. 5+ belongs in a Chip row. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  className,
}: SegmentedControlProps<T>) {
  const [trackWidth, setTrackWidth] = useState(0);
  const reduceMotion = useReducedMotion();

  const selectedIndex = value === null ? -1 : options.indexOf(value);
  const hasSelection = selectedIndex >= 0;
  const segmentWidth = trackWidth
    ? (trackWidth - TRACK_PADDING * 2) / options.length
    : 0;

  const thumbStyle = useAnimatedStyle(() => {
    const x = Math.max(0, selectedIndex) * segmentWidth;
    return {
      width: segmentWidth,
      opacity: hasSelection ? 1 : 0,
      transform: [
        {
          translateX: reduceMotion
            ? x
            : withTiming(x, {
                duration: duration.fast,
                easing: Easing.out(Easing.cubic),
              }),
        },
      ],
    };
  });

  function handleLayout(event: LayoutChangeEvent) {
    setTrackWidth(event.nativeEvent.layout.width);
  }

  return (
    <View
      accessibilityRole="tablist"
      onLayout={handleLayout}
      className={twMerge(
        "shrink-0 flex-row rounded-pill bg-sunken p-1",
        className,
      )}
    >
      {segmentWidth > 0 ? (
        <Animated.View
          className="absolute inset-y-1 left-1 rounded-pill bg-card shadow-sm"
          style={thumbStyle}
        />
      ) : null}
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange?.(option)}
            className="min-h-9.5 flex-1 items-center justify-center px-2"
          >
            <Text
              numberOfLines={1}
              className={clsx(
                "text-[13px]/[16px]",
                selected
                  ? "font-sans-semibold font-semibold text-primary"
                  : "font-sans-medium font-medium text-secondary",
              )}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}
