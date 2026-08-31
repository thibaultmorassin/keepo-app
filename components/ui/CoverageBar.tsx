import { duration } from "@/theme/tokens";
import { Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import type { WarrantyStatus } from "@/utils/warranty";
import clsx from "clsx";
import { useEffect } from "react";
import {
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from "react-native-reanimated";

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

const bars: Record<CoverageBarStatus, string> = {
  covered: "bg-covered-bar",
  expiring: "bg-expiring-bar",
  expired: "bg-expired-bar",
  unknown: "bg-expired-bar",
};

const foregrounds: Record<CoverageBarStatus, string> = {
  covered: "text-covered-fg",
  expiring: "text-expiring-fg",
  expired: "text-expired-fg",
  unknown: "text-expired-fg",
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
        <View className="flex-row items-baseline justify-between gap-3">
          <Text
            className={clsx(
              "type-heading flex-1 font-display-bold font-bold",
              foregrounds[status],
            )}
          >
            {headline}
          </Text>
          {note ? (
            <Text className="type-caption text-muted">{note}</Text>
          ) : null}
        </View>
      ) : null}

      <View className="mt-3 h-list overflow-hidden rounded-full bg-sunken">
        <Animated.View
          className={clsx("h-full rounded-full", bars[status])}
          style={fillStyle}
        />
      </View>

      {from || to ? (
        <View className="mt-2 flex-row justify-between">
          {from ? (
            <Text className="type-mono text-muted">{from}</Text>
          ) : (
            <View />
          )}
          {to ? <Text className="type-mono text-muted">{to}</Text> : null}
        </View>
      ) : null}
    </View>
  );
}
