import { ReactNode } from "react";
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
import { color, motion, radius, shadowStyle, space } from "@/theme/tokens";
import { type } from "@/theme/typography";
import type { WarrantyStatus } from "@/utils/warranty";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type ItemRowStatus = WarrantyStatus | "unknown";

type ItemRowProps = {
  name: string;
  meta: string;
  status: ItemRowStatus;
  remaining: string;
  icon: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const skins: Record<
  ItemRowStatus,
  { backgroundColor: string; color: string }
> = {
  covered: {
    backgroundColor: color.statusCoveredBg,
    color: color.statusCoveredFg,
  },
  expiring: {
    backgroundColor: color.statusExpiringBg,
    color: color.statusExpiringFg,
  },
  expired: {
    backgroundColor: color.statusExpiredBg,
    color: color.statusExpiredFg,
  },
  unknown: {
    backgroundColor: color.statusExpiredBg,
    color: color.statusExpiredFg,
  },
};

export function ItemRow({
  name,
  meta,
  status,
  remaining,
  icon,
  onPress,
  style,
}: ItemRowProps) {
  const scale = useSharedValue(1);
  const skin = skins[status];
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => {
        if (onPress) scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[styles.base, shadowStyle.sm, animatedStyle, style]}
    >
      <View
        style={[
          styles.iconTile,
          {
            backgroundColor: skin.backgroundColor,
          },
        ]}
      >
        {icon}
      </View>
      <View style={styles.content}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {meta}
        </Text>
      </View>
      <View
        style={[
          styles.pill,
          {
            backgroundColor: skin.backgroundColor,
          },
        ]}
      >
        <Text style={[styles.remaining, { color: skin.color }]}>
          {remaining}
        </Text>
      </View>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[5],
    paddingVertical: 11,
    paddingLeft: 11,
    paddingRight: 14,
    borderRadius: radius.card,
    backgroundColor: color.bgCard,
    flexShrink: 0,
  },
  iconTile: {
    width: 50,
    height: 50,
    borderRadius: radius.tile,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  content: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...type.heading,
    color: color.textPrimary,
  },
  meta: {
    ...type.caption,
    color: color.textSecondary,
    marginTop: 3,
  },
  pill: {
    paddingHorizontal: 11,
    paddingVertical: 4,
    borderRadius: radius.pill,
    flexShrink: 0,
  },
  remaining: {
    ...type.caption,
    fontWeight: "600",
  },
});
