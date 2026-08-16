import { ReactNode } from "react";
import {
  Pressable,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";
import Animated, {
  useAnimatedStyle,
  useSharedValue,
  withSpring,
} from "react-native-reanimated";
import { color, motion, radius, shadowStyle, space } from "@/theme/tokens";

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type CardTone = "plain" | "sunken" | "brand" | "tint" | "inverse" | "outline";
type CardSize = "card" | "hero";

type CardProps = {
  children: ReactNode;
  tone?: CardTone;
  size?: CardSize;
  pad?: number;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

const skins: Record<CardTone, ViewStyle> = {
  plain: { backgroundColor: color.bgCard, ...shadowStyle.sm },
  sunken: { backgroundColor: color.bgSunken },
  brand: {
    backgroundColor: color.brand,
    ...shadowStyle.card,
  },
  tint: { backgroundColor: color.brandTint },
  inverse: {
    backgroundColor: color.bgInverse,
    ...shadowStyle.card,
  },
  outline: {
    backgroundColor: color.bgCard,
    borderWidth: 1,
    borderColor: color.borderSubtle,
  },
};

function CardContent({
  children,
  tone,
  size,
  pad,
  style,
}: Omit<CardProps, "onPress">) {
  return (
    <View
      style={[
        styles.base,
        {
          borderRadius: size === "hero" ? radius.hero : radius.card,
          padding: pad ?? (size === "hero" ? space.padCardLg : space.padCard),
        },
        skins[tone ?? "plain"],
        style,
      ]}
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
  style,
}: CardProps) {
  const scale = useSharedValue(1);
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  if (!onPress) {
    return (
      <CardContent tone={tone} size={size} pad={pad} style={style}>
        {children}
      </CardContent>
    );
  }

  return (
    <AnimatedPressable
      accessibilityRole="button"
      onPress={onPress}
      onPressIn={() => {
        scale.value = withSpring(motion.pressScale);
      }}
      onPressOut={() => {
        scale.value = withSpring(1);
      }}
      style={[styles.pressable, animatedStyle]}
    >
      <CardContent
        tone={tone}
        size={size}
        pad={pad}
        style={[styles.pressableContent, style]}
      >
        {children}
      </CardContent>
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexShrink: 0,
  },
  pressable: {
    flexGrow: 1,
    flexShrink: 1,
    flexBasis: 0,
  },
  pressableContent: {
    flex: 1,
    alignSelf: "stretch",
  },
});
