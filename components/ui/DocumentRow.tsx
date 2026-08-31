import { motion } from "@/theme/tokens";
import { Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import clsx from "clsx";
import { ReactNode } from "react";
import {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

type DocumentRowTone = "plain" | "tint";

type DocumentRowProps = {
  name: string;
  meta: string;
  tone?: DocumentRowTone;
  action?: ReactNode;
  onPress?: () => void;
  className?: string;
};

const tones: Record<DocumentRowTone, string> = {
  plain: "bg-card shadow-sm",
  tint: "bg-brand-tint",
};

const BASE = "shrink-0 flex-row items-center gap-3 rounded-card py-3 pl-3 pr-4";

export function DocumentRow({
  name,
  meta,
  tone = "plain",
  action,
  onPress,
  className,
}: DocumentRowProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <>
      <View className="h-14 w-11 shrink-0 gap-0.75 rounded-[10px] border border-line bg-paper-0 px-1.5 py-1.75">
        <View className="h-0.75 w-[70%] rounded-xs bg-ink-300" />
        <View className="h-0.5 rounded-xs bg-ink-100" />
        <View className="h-0.5 w-[85%] rounded-xs bg-ink-100" />
        <View className="h-0.5 w-[60%] rounded-xs bg-ink-100" />
        <View className="mt-auto h-0.75 w-1/2 rounded-xs bg-green-200" />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="type-body-semibold" numberOfLines={1}>
          {name}
        </Text>
        <Text className="type-mono mt-0.5 text-muted" numberOfLines={1}>
          {meta}
        </Text>
      </View>
      {action}
    </>
  );

  if (!onPress) {
    return (
      <View className={twMerge(clsx(BASE, tones[tone]), className)}>
        {content}
      </View>
    );
  }

  return (
    <Animated.Pressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      className={twMerge(clsx(BASE, tones[tone]), className)}
      style={animatedStyle}
    >
      {content}
    </Animated.Pressable>
  );
}
