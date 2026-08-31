import { color } from "@/theme/tokens";
import { useEffect, useMemo } from "react";
import { View } from "@/tw";
import { Animated } from "@/tw/animated";
import {
  Easing,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withDelay,
  withTiming,
} from "react-native-reanimated";

const CONFETTI_COUNT = 16;

// Precomputed once at module load so the burst geometry stays stable across
// renders (and avoids calling Math.random during render).
const CONFETTI_PIECES = Array.from({ length: CONFETTI_COUNT }, (_, i) => {
  const angle =
    (Math.PI * 2 * i) / CONFETTI_COUNT + (Math.random() - 0.5) * 0.4;
  return {
    id: i,
    angle,
    distance: 90 + Math.random() * 80,
    paletteIndex: i,
    size: 7 + Math.random() * 7,
    spin: (Math.random() - 0.5) * 540,
    delay: Math.random() * 220,
  };
});

/** A single confetti shard that bursts outward from the center, then falls and fades. */
const ConfettiPiece = ({
  angle,
  distance,
  color,
  size,
  spin,
  delay,
}: {
  angle: number;
  distance: number;
  color: string;
  size: number;
  spin: number;
  delay: number;
}) => {
  const progress = useSharedValue(0);

  useEffect(() => {
    progress.value = withDelay(
      delay,
      withTiming(1, { duration: 2400, easing: Easing.out(Easing.quad) }),
    );
  }, [delay, progress]);

  const targetX = Math.cos(angle) * distance;
  const targetY = Math.sin(angle) * distance;

  const animatedStyle = useAnimatedStyle(() => {
    const p = progress.value;
    return {
      opacity: interpolate(p, [0, 0.1, 0.75, 1], [0, 1, 1, 0]),
      transform: [
        { translateX: p * targetX },
        // Add a little gravity so shards arc downward as they travel.
        { translateY: p * targetY + p * p * 60 },
        { rotate: `${p * spin}deg` },
        { scale: interpolate(p, [0, 0.15, 1], [0, 1, 0.85]) },
      ],
    };
  });

  return (
    <Animated.View
      pointerEvents="none"
      className="absolute rounded-xs"
      // Size and colour are randomised per shard, so they cannot be classes.
      style={[
        { width: size, height: size * 0.5, backgroundColor: color },
        animatedStyle,
      ]}
    />
  );
};

/**
 * A one-shot confetti burst centered on wherever it's mounted — pieces fly
 * outward, arc down under a little gravity, and fade. Fires once per mount
 * (no imperative trigger, no props to reconfigure the burst); drop it
 * alongside whatever it's celebrating, e.g. a success checkmark.
 */
function Confetti({ testID }: { testID?: string }) {
  const palette = useMemo(
    () => [
      color.brand,
      color.green500,
      color.amber500,
      color.coral600,
      color.ultra600,
    ],
    [],
  );

  return (
    <View
      pointerEvents="none"
      testID={testID}
      className="absolute items-center justify-center"
    >
      {CONFETTI_PIECES.map((piece) => (
        <ConfettiPiece
          key={piece.id}
          angle={piece.angle}
          distance={piece.distance}
          color={palette[piece.paletteIndex % palette.length]}
          size={piece.size}
          spin={piece.spin}
          delay={piece.delay}
        />
      ))}
    </View>
  );
}

export { Confetti };
