import { motion } from "@/theme/tokens";
import { Animated } from "@/tw/animated";
import clsx from "clsx";
import { ReactNode } from "react";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

type IconButtonVariant = "surface" | "ghost" | "brand" | "inverse";
type IconButtonSize = "sm" | "md";

type IconButtonProps = {
  children: ReactNode;
  label: string;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  onPress?: () => void;
  className?: string;
};

const variants: Record<IconButtonVariant, string> = {
  surface: "bg-sunken",
  ghost: "bg-transparent",
  brand: "bg-brand-tint",
  inverse: "bg-on-dark/16",
};

const sizes: Record<IconButtonSize, string> = {
  sm: "size-[34px]",
  md: "size-[42px]",
};

export function IconButton({
  children,
  label,
  variant = "surface",
  size = "md",
  onPress,
  className,
}: IconButtonProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Pressable
      accessibilityLabel={label}
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      className={twMerge(
        clsx(
          "shrink-0 items-center justify-center rounded-pill",
          sizes[size],
          variants[variant],
        ),
        className,
      )}
      style={animatedStyle}
    >
      {children}
    </Animated.Pressable>
  );
}
