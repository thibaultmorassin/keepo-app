import { Icon, type IconName } from "@/components/ui/Icon";
import { color, motion } from "@/theme/tokens";
import { Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

type SettingsRowProps = {
  icon?: IconName;
  label: string;
  value?: string;
  meta?: string;
  onPress?: () => void;
  showChevron?: boolean;
  className?: string;
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
  className,
}: SettingsRowProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <View
      className={twMerge(
        "min-h-tap flex-row items-center gap-3 py-3.25",
        className,
      )}
    >
      {icon ? (
        <View className="size-8.5 shrink-0 items-center justify-center rounded-pill bg-brand-tint">
          <Icon name={icon} size={17} color={color.brandStrong} />
        </View>
      ) : null}
      <View className="min-w-0 flex-1">
        <Text numberOfLines={1} className="type-body text-primary">
          {label}
        </Text>
        {meta ? (
          <Text numberOfLines={1} className="type-caption mt-px text-secondary">
            {meta}
          </Text>
        ) : null}
      </View>
      {value ? (
        <Text
          numberOfLines={1}
          className="type-body max-w-[45%] shrink text-secondary"
        >
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
    <Animated.Pressable
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
    </Animated.Pressable>
  );
}
