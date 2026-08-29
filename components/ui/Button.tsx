import { color, motion, radius, shadowStyle, space } from "@/theme/tokens";
import { fontFamily } from "@/theme/typography";
import { ReactNode } from "react";
import {
  ActivityIndicator,
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
  style?: StyleProp<ViewStyle>;
};

const skins: Record<
  ButtonVariant,
  { backgroundColor: string; color: string; shadow?: ViewStyle }
> = {
  primary: {
    backgroundColor: color.brand,
    color: color.textOnDark,
    shadow: shadowStyle.card,
  },
  secondary: {
    backgroundColor: color.bgSunken,
    color: color.textPrimary,
  },
  ghost: {
    backgroundColor: "transparent",
    color: color.textSecondary,
  },
  claim: {
    backgroundColor: color.actionClaimSolid,
    color: color.textOnDark,
    shadow: shadowStyle.card,
  },
  inverse: {
    backgroundColor: color.bgInverse,
    color: color.textOnDark,
    shadow: shadowStyle.card,
  },
};

const sizes: Record<
  ButtonSize,
  { paddingVertical: number; paddingHorizontal: number; fontSize: number }
> = {
  sm: { paddingVertical: 8, paddingHorizontal: 14, fontSize: 13 },
  md: { paddingVertical: 14, paddingHorizontal: 20, fontSize: 14.5 },
  lg: { paddingVertical: 16, paddingHorizontal: 24, fontSize: 16 },
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
  style,
}: ButtonProps) {
  const scale = useSharedValue(1);
  const skin = skins[variant];
  const sizeStyle = sizes[size];
  const isDisabled = disabled || loading;

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  return (
    <AnimatedPressable
      accessibilityRole="button"
      disabled={isDisabled}
      onPress={onPress}
      onPressIn={() => {
        if (!isDisabled) scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[
        styles.base,
        {
          backgroundColor: skin.backgroundColor,
          paddingVertical: sizeStyle.paddingVertical,
          paddingHorizontal: sizeStyle.paddingHorizontal,
          width: full ? "100%" : undefined,
          alignSelf: full ? "stretch" : "flex-start",
        },
        skin.shadow,
        animatedStyle,
        style,
        isDisabled ? styles.disabled : undefined,
      ]}
    >
      {loading ? (
        <ActivityIndicator color={skin.color} />
      ) : (
        <View style={styles.content}>
          {icon}
          <Text
            style={[
              styles.label,
              {
                color: skin.color,
                fontSize: sizeStyle.fontSize,
              },
            ]}
          >
            {children}
          </Text>
          {iconAfter}
        </View>
      )}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    minHeight: space.tapMin,
    borderRadius: radius.pill,
    alignItems: "center",
    justifyContent: "center",
  },
  content: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: space[4],
  },
  label: {
    fontFamily: fontFamily.display,
    fontWeight: "600",
    letterSpacing: -0.15,
  },
  disabled: {
    backgroundColor: color.textMuted,
    color: color.textOnDark,
  },
});
