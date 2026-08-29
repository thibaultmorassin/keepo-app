import { color, duration, radius, shadowStyle, space } from "@/theme/tokens";
import { fontFamily } from "@/theme/typography";
import { useState } from "react";
import {
  LayoutChangeEvent,
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
} from "react-native-reanimated";

const TRACK_PADDING = space[2];

type SegmentedControlProps<T extends string> = {
  options: readonly T[];
  /** `null` renders no segment selected — e.g. a custom value the presets don't match. */
  value: T | null;
  onChange?: (value: T) => void;
  style?: StyleProp<ViewStyle>;
};

/** 2–4 exclusive short options in one sunken track. 5+ belongs in a Chip row. */
export function SegmentedControl<T extends string>({
  options,
  value,
  onChange,
  style,
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
      style={[styles.track, style]}
    >
      {segmentWidth > 0 ? (
        <Animated.View style={[styles.thumb, thumbStyle]} />
      ) : null}
      {options.map((option) => {
        const selected = option === value;
        return (
          <Pressable
            key={option}
            accessibilityRole="tab"
            accessibilityState={{ selected }}
            onPress={() => onChange?.(option)}
            style={styles.segment}
          >
            <Text
              numberOfLines={1}
              style={[
                styles.label,
                selected ? styles.labelSelected : styles.labelIdle,
              ]}
            >
              {option}
            </Text>
          </Pressable>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  track: {
    flexDirection: "row",
    padding: TRACK_PADDING,
    backgroundColor: color.bgSunken,
    borderRadius: radius.pill,
    flexShrink: 0,
  },
  thumb: {
    position: "absolute",
    top: TRACK_PADDING,
    left: TRACK_PADDING,
    bottom: TRACK_PADDING,
    borderRadius: radius.pill,
    backgroundColor: color.bgCard,
    ...shadowStyle.sm,
  },
  segment: {
    flex: 1,
    minHeight: 38,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: space[4],
  },
  label: {
    fontSize: 13,
    lineHeight: 16,
  },
  labelSelected: {
    fontFamily: fontFamily.sansSemiBold,
    fontWeight: "600",
    color: color.textPrimary,
  },
  labelIdle: {
    fontFamily: fontFamily.sansMedium,
    fontWeight: "500",
    color: color.textSecondary,
  },
});
