import { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";
import { color, duration, space } from "@/theme/tokens";
import { fontFamily, type } from "@/theme/typography";
import type { WarrantyStatus } from "@/utils/warranty";

type CoverageBarStatus = WarrantyStatus | "unknown";

type CoverageBarProps = {
  pct: number;
  status: CoverageBarStatus;
  headline: string;
  note?: string | null;
  from?: string;
  to?: string;
  animate?: boolean;
};

const barColors: Record<CoverageBarStatus, string> = {
  covered: color.statusCoveredBar,
  expiring: color.statusExpiringBar,
  expired: color.statusExpiredBar,
  unknown: color.statusExpiredBar,
};

const fgColors: Record<CoverageBarStatus, string> = {
  covered: color.statusCoveredFg,
  expiring: color.statusExpiringFg,
  expired: color.statusExpiredFg,
  unknown: color.statusExpiredFg,
};

export function CoverageBar({
  pct,
  status,
  headline,
  note,
  from,
  to,
  animate = true,
}: CoverageBarProps) {
  const reduceMotion = useReducedMotion();
  const clampedPct = Math.max(0, Math.min(100, pct));
  const width = useSharedValue(reduceMotion || !animate ? clampedPct : 0);

  useEffect(() => {
    if (reduceMotion || !animate) {
      width.value = clampedPct;
      return;
    }

    width.value = withTiming(clampedPct, {
      duration: duration.slow,
      easing: Easing.out(Easing.cubic),
    });
  }, [animate, clampedPct, reduceMotion, width]);

  const fillStyle = useAnimatedStyle(() => ({
    width: `${width.value}%`,
  }));

  return (
    <View>
      {headline || note ? (
        <View style={styles.header}>
          <Text style={[styles.headline, { color: fgColors[status] }]}>
            {headline}
          </Text>
          {note ? <Text style={styles.note}>{note}</Text> : null}
        </View>
      ) : null}

      <View style={styles.track}>
        <Animated.View
          style={[
            styles.fill,
            { backgroundColor: barColors[status] },
            fillStyle,
          ]}
        />
      </View>

      {from || to ? (
        <View style={styles.dates}>
          {from ? <Text style={styles.date}>{from}</Text> : <View />}
          {to ? <Text style={styles.date}>{to}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: "row",
    alignItems: "baseline",
    justifyContent: "space-between",
    gap: space[5],
  },
  headline: {
    ...type.heading,
    fontFamily: fontFamily.displayBold,
    fontWeight: "700",
    flex: 1,
  },
  note: {
    ...type.caption,
    color: color.textMuted,
  },
  track: {
    height: 9,
    borderRadius: 999,
    backgroundColor: color.bgSunken,
    marginTop: space[5],
    overflow: "hidden",
  },
  fill: {
    height: "100%",
    borderRadius: 999,
  },
  dates: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: space[4],
  },
  date: {
    ...type.mono,
    color: color.textMuted,
  },
});
