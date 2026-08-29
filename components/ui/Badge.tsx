import { color, radius, space } from "@/theme/tokens";
import { type } from "@/theme/typography";
import { ReactNode } from "react";
import { StyleProp, StyleSheet, Text, View, ViewStyle } from "react-native";

type BadgeStatus =
  | "covered"
  | "expiring"
  | "expired"
  | "claim"
  | "pro"
  | "inverse";

type BadgeProps = {
  children: ReactNode;
  status?: BadgeStatus;
  icon?: ReactNode;
  style?: StyleProp<ViewStyle>;
};

const skins: Record<BadgeStatus, { backgroundColor: string; color: string }> = {
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
  claim: {
    backgroundColor: color.actionClaimBg,
    color: color.actionClaimFg,
  },
  pro: {
    backgroundColor: color.accentProBg,
    color: color.accentProFg,
  },
  inverse: {
    backgroundColor: "rgba(252,250,246,0.18)",
    color: color.textOnDark,
  },
};

/** Small status pill. The status word is the colour system — pick the status. */
export function Badge({
  children,
  status = "covered",
  icon,
  style,
}: BadgeProps) {
  const skin = skins[status];

  return (
    <View style={[styles.base, { backgroundColor: skin.backgroundColor }, style]}>
      {icon}
      <Text style={[styles.label, { color: skin.color }]} numberOfLines={1}>
        {children}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[2],
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: radius.pill,
    alignSelf: "flex-start",
    flexShrink: 0,
  },
  label: {
    ...type.caption,
    fontWeight: "600",
  },
});
