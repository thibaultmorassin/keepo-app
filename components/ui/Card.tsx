import { View } from "@/tw";
import { Animated } from "@/tw/animated";
import { motion } from "@/theme/tokens";
import clsx from "clsx";
import { ReactNode } from "react";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

type CardTone = "plain" | "sunken" | "brand" | "tint" | "inverse" | "outline";
type CardSize = "card" | "hero";

type CardProps = {
  children: ReactNode;
  tone?: CardTone;
  size?: CardSize;
  pad?: number;
  onPress?: () => void;
  className?: string;
};

const tones: Record<CardTone, string> = {
  plain: "bg-card shadow-sm",
  sunken: "bg-sunken",
  brand: "bg-brand shadow-card",
  tint: "bg-brand-tint",
  inverse: "bg-inverse shadow-card",
  outline: "bg-card border border-line",
};

const sizes: Record<CardSize, string> = {
  card: "rounded-card p-card",
  hero: "rounded-hero p-card-lg",
};

function CardContent({
  children,
  tone = "plain",
  size = "card",
  pad,
  className,
}: Omit<CardProps, "onPress">) {
  return (
    <View
      className={twMerge(clsx("shrink-0", sizes[size], tones[tone]), className)}
      // Only pass `style` when there is a numeric override: react-native-css
      // writes className into `style`, so even an explicit `undefined` clobbers it.
      {...(pad === undefined ? {} : { style: { padding: pad } })}
    >
      {children}
    </View>
  );
}

export function Card({
  children,
  tone = "plain",
  size = "card",
  pad,
  onPress,
  className,
}: CardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!onPress) {
    return (
      <CardContent tone={tone} size={size} pad={pad} className={className}>
        {children}
      </CardContent>
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
      className="grow shrink basis-0"
      style={animatedStyle}
    >
      <CardContent
        tone={tone}
        size={size}
        pad={pad}
        className={twMerge("flex-1 self-stretch", className)}
      >
        {children}
      </CardContent>
    </Animated.Pressable>
  );
}
