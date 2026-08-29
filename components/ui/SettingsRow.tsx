import { Icon, type IconName } from "@/components/ui/Icon";
import { color, motion, radius, space } from "@/theme/tokens";
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
  useSharedValue,
  withSpring,
} from "react-native-reanimated";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type SettingsRowProps = {
  icon?: IconName;
  label: string;
  value?: string;
  meta?: string;
  onPress?: () => void;
  showChevron?: boolean;
  style?: StyleProp<ViewStyle>;
};

/**
 * A divider-agnostic row for the Settings screen: leading icon (optional,
 * in a tinted circle) + label (+ optional meta line) + trailing value and/or
 * chevron. Meant to be composed inside a `Card pad={0}` list, with the parent
 * drawing the row dividers (same convention as `items/[id].tsx`'s specRows).
 */
export function SettingsRow({
  icon,
  label,
  value,
  meta,
  onPress,
  showChevron = true,
  style,
}: SettingsRowProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <View style={[styles.row, style]}>
      {icon ? (
        <View style={styles.iconCircle}>
          <Icon name={icon} size={17} color={color.brandStrong} />
        </View>
      ) : null}
      <View style={styles.copy}>
        <Text numberOfLines={1} style={styles.label}>
          {label}
        </Text>
        {meta ? (
          <Text numberOfLines={1} style={styles.meta}>
            {meta}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text numberOfLines={1} style={styles.value}>
          {value}
        </Text>
      ) : null}
      {onPress && showChevron ? (
        <Icon name="chevron-right" size={18} color={color.textMuted} />
      ) : null}
    </View>
  );

  if (!onPress) return content;

  return (
    <AnimatedPressable
      accessibilityRole="button"
      accessibilityLabel={label}
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={animatedStyle}
    >
      {content}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  row: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[5],
    minHeight: space.tapMin,
    paddingVertical: 13,
  },
  iconCircle: {
    width: 34,
    height: 34,
    flexShrink: 0,
    borderRadius: radius.pill,
    backgroundColor: color.brandTint,
    alignItems: "center",
    justifyContent: "center",
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  label: {
    ...type.body,
    color: color.textPrimary,
  },
  meta: {
    ...type.caption,
    color: color.textSecondary,
    marginTop: 1,
  },
  value: {
    ...type.body,
    color: color.textSecondary,
    flexShrink: 1,
    maxWidth: "45%",
  },
});
