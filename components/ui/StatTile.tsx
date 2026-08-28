import { color, radius, space } from "@/theme/tokens";
import { fontFamily, type } from "@/theme/typography";
import React from "react";
import { StyleSheet, Text, View } from "react-native";

type StatTileTone = "onBrand" | "plain" | "covered" | "expiring" | "expired";

type StatTileProps = React.ComponentProps<typeof View> & {
  value: string;
  label: string;
  tone?: StatTileTone;
};

const skins: Record<
  StatTileTone,
  { backgroundColor: string; color: string; labelOpacity: number }
> = {
  onBrand: {
    backgroundColor: "rgba(252,250,246,0.17)",
    color: color.textOnDark,
    labelOpacity: 0.85,
  },
  plain: {
    backgroundColor: color.bgSunken,
    color: color.textPrimary,
    labelOpacity: 0.85,
  },
  covered: {
    backgroundColor: color.statusCoveredBg,
    color: color.statusCoveredFg,
    labelOpacity: 0.85,
  },
  expiring: {
    backgroundColor: color.statusExpiringBg,
    color: color.statusExpiringFg,
    labelOpacity: 0.85,
  },
  expired: {
    backgroundColor: color.statusExpiredBg,
    color: color.statusExpiredFg,
    labelOpacity: 0.85,
  },
};

export function StatTile({
  value,
  label,
  tone = "onBrand",
  style,
  ...props
}: StatTileProps) {
  const skin = skins[tone];

  return (
    <View
      style={[styles.base, { backgroundColor: skin.backgroundColor }, style]}
      {...props}
    >
      <Text style={[styles.value, { color: skin.color }]}>{value}</Text>
      <Text
        style={[
          styles.label,
          { color: skin.color, opacity: skin.labelOpacity },
        ]}
      >
        {label}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    flex: 1,
    borderRadius: radius.tile,
    paddingHorizontal: space[5],
    paddingVertical: 9,
    flexShrink: 0,
  },
  value: {
    fontFamily: fontFamily.displayBold,
    fontSize: 20,
    lineHeight: 22,
    letterSpacing: -0.4,
    fontWeight: "700",
  },
  label: {
    ...type.caption,
    marginTop: 2,
  },
});
