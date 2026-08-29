import { color, radius } from "@/theme/tokens";
import { type } from "@/theme/typography";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useReducedMotion,
  withTiming,
} from "react-native-reanimated";

const TRACK_WIDTH = 48;
const TRACK_HEIGHT = 28;
const THUMB_SIZE = 22;
const THUMB_INSET = 3;

type SwitchProps = {
  value: boolean;
  onValueChange: (next: boolean) => void;
  label?: string;
  description?: string;
  style?: StyleProp<ViewStyle>;
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
      style={[styles.track, value && styles.trackOn]}
    >
      <Animated.View style={[styles.thumb, thumbStyle]} />
    </Pressable>
  );
}

/** On/off with an optional label + description row. Bare toggle if no label. */
export function Switch({
  value,
  onValueChange,
  label,
  description,
  style,
}: SwitchProps) {
  const toggle = (
    <Toggle value={value} onValueChange={onValueChange} label={label} />
  );

  if (!label) return toggle;

  return (
    <View style={[styles.row, style]}>
      <View style={styles.copy}>
        <Text style={styles.label}>{label}</Text>
        {description ? <Text style={styles.description}>{description}</Text> : null}
      </View>
      {toggle}
    </View>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    ...type.body,
    fontWeight: "500",
    color: color.textPrimary,
  },
  description: {
    ...type.caption,
    color: color.brandStrong,
    opacity: 0.75,
    marginTop: 2,
  },
  track: {
    width: TRACK_WIDTH,
    height: TRACK_HEIGHT,
    flexShrink: 0,
    borderRadius: radius.pill,
    backgroundColor: color.paper3,
    justifyContent: "center",
  },
  trackOn: {
    backgroundColor: color.brand,
  },
  thumb: {
    width: THUMB_SIZE,
    height: THUMB_SIZE,
    borderRadius: radius.pill,
    backgroundColor: color.bgCard,
  },
});
