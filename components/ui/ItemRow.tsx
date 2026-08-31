import { motion } from "@/theme/tokens";
import { Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import type { WarrantyStatus } from "@/utils/warranty";
import clsx from "clsx";
import { ReactNode } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

type ItemRowStatus = WarrantyStatus | "unknown";

type ItemRowProps = {
  name: string;
  meta: string;
  status: ItemRowStatus;
  remaining: string;
  icon: ReactNode;
  onPress?: () => void;
  className?: string;
};

const backgrounds: Record<ItemRowStatus, string> = {
  covered: "bg-covered-bg",
  expiring: "bg-expiring-bg",
  expired: "bg-expired-bg",
  unknown: "bg-expired-bg",
};

const foregrounds: Record<ItemRowStatus, string> = {
  covered: "text-covered-fg",
  expiring: "text-expiring-fg",
  expired: "text-expired-fg",
  unknown: "text-expired-fg",
};

export function ItemRow({
  name,
  meta,
  status,
  remaining,
  icon,
  onPress,
  className,
}: ItemRowProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => {
        if (onPress) scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      className={twMerge(
        "shrink-0 flex-row items-center gap-3 rounded-card bg-card py-2.75 pl-2.75 pr-3.5 shadow-sm",
        className,
      )}
      style={animatedStyle}
    >
      <View
        className={clsx(
          "size-12.5 shrink-0 items-center justify-center rounded-tile",
          backgrounds[status],
        )}
      >
        {icon}
      </View>
      <View className="min-w-0 flex-1">
        <Text className="type-heading text-primary" numberOfLines={1}>
          {name}
        </Text>
        <Text className="type-caption mt-0.75 text-secondary" numberOfLines={1}>
          {meta}
        </Text>
      </View>
      <View
        className={clsx(
          "shrink-0 rounded-pill px-2.75 py-1",
          backgrounds[status],
        )}
      >
        <Text className={clsx("type-caption-semibold", foregrounds[status])}>
          {remaining}
        </Text>
      </View>
    </Animated.Pressable>
  );
}
