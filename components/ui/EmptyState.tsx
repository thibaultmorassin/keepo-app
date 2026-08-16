import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";
import { color, radius, space } from "@/theme/tokens";
import { type } from "@/theme/typography";

type EmptyStateProps = {
  title: string;
  body?: string;
  icon?: ReactNode;
  action: ReactNode;
  style?: StyleProp<ViewStyle>;
};

export function EmptyState({
  title,
  body,
  icon,
  action,
  style,
}: EmptyStateProps) {
  return (
    <View style={[styles.base, style]}>
      {icon ? <View style={styles.iconPuck}>{icon}</View> : null}
      <View style={styles.copy}>
        <Text style={styles.title}>{title}</Text>
        {body ? <Text style={styles.body}>{body}</Text> : null}
      </View>
      {action}
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    gap: space[5],
    paddingHorizontal: space[7],
    paddingVertical: space[9],
    borderRadius: radius.hero,
    backgroundColor: color.bgSunken,
  },
  iconPuck: {
    width: 62,
    height: 62,
    borderRadius: radius.pill,
    backgroundColor: color.bgCard,
    alignItems: "center",
    justifyContent: "center",
    shadowColor: "rgb(31, 26, 16)",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },
  copy: {
    alignItems: "center",
  },
  title: {
    ...type.title,
    color: color.textPrimary,
    textAlign: "center",
  },
  body: {
    ...type.body,
    color: color.textSecondary,
    textAlign: "center",
    marginTop: space[3],
    maxWidth: 280,
  },
});
