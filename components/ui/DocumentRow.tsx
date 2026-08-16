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

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

type DocumentRowTone = "plain" | "tint";

type DocumentRowProps = {
  name: string;
  meta: string;
  tone?: DocumentRowTone;
  action?: ReactNode;
  onPress?: () => void;
  style?: StyleProp<ViewStyle>;
};

export function DocumentRow({
  name,
  meta,
  tone = "plain",
  action,
  onPress,
  style,
}: DocumentRowProps) {
  const scale = useSharedValue(1);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ scale: scale.value }],
  }));

  const content = (
    <>
      <View style={styles.thumbnail}>
        <View style={[styles.line, styles.lineShort]} />
        <View style={styles.line} />
        <View style={[styles.line, styles.lineMid]} />
        <View style={[styles.line, styles.lineShortest]} />
        <View style={styles.accent} />
      </View>
      <View style={styles.copy}>
        <Text style={styles.name} numberOfLines={1}>
          {name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {meta}
        </Text>
      </View>
      {action}
    </>
  );

  if (!onPress) {
    return (
      <View
        style={[
          styles.base,
          tone === "tint" ? styles.tint : styles.plain,
          style,
        ]}
      >
        {content}
      </View>
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
      style={[
        styles.base,
        tone === "tint" ? styles.tint : styles.plain,
        animatedStyle,
        style,
      ]}
    >
      {content}
    </AnimatedPressable>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[5],
    paddingVertical: 12,
    paddingLeft: 12,
    paddingRight: space[6],
    borderRadius: radius.card,
    flexShrink: 0,
  },
  plain: {
    backgroundColor: color.bgCard,
    ...shadowStyle.sm,
  },
  tint: {
    backgroundColor: color.brandTint,
  },
  thumbnail: {
    width: 44,
    height: 56,
    flexShrink: 0,
    borderRadius: 10,
    paddingVertical: 7,
    paddingHorizontal: 6,
    backgroundColor: color.paper0,
    borderWidth: 1,
    borderColor: color.borderSubtle,
    gap: 3,
  },
  line: {
    height: 2,
    borderRadius: 2,
    backgroundColor: color.ink100,
  },
  lineShort: {
    width: "70%",
    height: 3,
    backgroundColor: color.ink300,
  },
  lineMid: {
    width: "85%",
  },
  lineShortest: {
    width: "60%",
  },
  accent: {
    marginTop: "auto",
    height: 3,
    borderRadius: 2,
    backgroundColor: color.green200,
    width: "50%",
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  name: {
    ...type.body,
    fontWeight: "600",
  },
  meta: {
    ...type.mono,
    color: color.textMuted,
    marginTop: 2,
  },
});
