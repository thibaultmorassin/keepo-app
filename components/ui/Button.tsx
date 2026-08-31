import { color, motion } from "@/theme/tokens";
import { Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import clsx from "clsx";
import { ReactNode } from "react";
import { ActivityIndicator } from "react-native";
import { useAnimatedStyle, useSharedValue, withSpring } from "react-native-reanimated";
import { twMerge } from "tailwind-merge";

type ButtonVariant = "primary" | "secondary" | "ghost" | "claim" | "inverse";
type ButtonSize = "sm" | "md" | "lg";

type ButtonProps = {
  children: ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: ReactNode;
  iconAfter?: ReactNode;
  full?: boolean;
  disabled?: boolean;
  loading?: boolean;
  onPress?: () => void;
  className?: string;
};

const variants: Record<ButtonVariant, string> = {
  primary: "bg-brand shadow-card",
  secondary: "bg-sunken",
  ghost: "bg-transparent",
  claim: "bg-claim-solid shadow-card",
  inverse: "bg-inverse shadow-card",
};

const labels: Record<ButtonVariant, string> = {
  primary: "text-on-dark",
  secondary: "text-primary",
  ghost: "text-secondary",
  claim: "text-on-dark",
  inverse: "text-on-dark",
};

/** The spinner takes a colour value, not a class. */
const spinnerColors: Record<ButtonVariant, string> = {
  primary: color.textOnDark,
  secondary: color.textPrimary,
  ghost: color.textSecondary,
  claim: color.textOnDark,
  inverse: color.textOnDark,
};

const sizes: Record<ButtonSize, string> = {
  sm: "px-3.5 py-2",
  md: "px-5 py-3.5",
  lg: "px-6 py-4",
};

const labelSizes: Record<ButtonSize, string> = {
  sm: "text-[13px]",
  md: "text-[14.5px]",
  lg: "text-[16px]",
};

export function Button({
  children,
  variant = "primary",
  size = "md",
  icon,
  iconAfter,
  full = false,
  disabled = false,
  loading = false,
  onPress,
  className,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const isDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <Animated.Pressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      onPressIn={() => {
        if (!isDisabled) scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      className={twMerge(
        clsx(
          "min-h-tap items-center justify-center rounded-pill",
          sizes[size],
          variants[variant],
          full ? "w-full self-stretch" : "self-start",
        ),
        className,
        isDisabled && "bg-muted",
      )}
      style={animatedStyle}
    >
      {loading ? (
        <ActivityIndicator color={spinnerColors[variant]} />
      ) : (
        <View className="flex-row items-center justify-center gap-2">
          {icon}
          <Text
            className={clsx(
              "font-display font-semibold tracking-[-0.15px]",
              labelSizes[size],
              isDisabled ? "text-on-dark" : labels[variant],
            )}
          >
            {children}
          </Text>
          {iconAfter}
        </View>
      )}
    </Animated.Pressable>
  );
}
