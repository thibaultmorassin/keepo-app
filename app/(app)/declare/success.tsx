import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Confetti } from "@/components/ui/confetti";
import { Icon } from "@/components/ui/Icon";
import { color } from "@/theme/tokens";
import { Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import type { Tables } from "@/utils/database.types";
import { haptics } from "@/utils/haptics";
import { items$ } from "@/utils/SupaLegend";
import { observer } from "@legendapp/state/react";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import {
  FadeIn,
  FadeInDown,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withSpring,
  withTiming,
} from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

/** How long the celebration holds before it takes itself off screen. */
const SUCCESS_HOLD_MS = 5000;
const STAGGER = 60;

function ClaimSuccessScreen() {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { itemId } = useLocalSearchParams<{ itemId?: string }>();

  const itemsRecord = items$.get() as
    | Record<string, Tables<"items">>
    | undefined;
  const item = itemId ? itemsRecord?.[itemId] : undefined;

  const dismissed = useRef(false);
  const sealScale = useSharedValue(reduceMotion ? 1 : 0);
  const pulse = useSharedValue(0);

  const close = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    // Closes the whole modal from inside the nested stack and lands on the
    // item the claim was filed for.
    if (itemId) {
      router.dismissTo(`/items/${itemId}`);
    } else {
      router.dismissTo("/");
    }
  }, [itemId]);

  useEffect(() => {
    haptics.success();

    if (!reduceMotion) {
      sealScale.value = withDelay(
        80,
        withSpring(1, { damping: 11, stiffness: 180 }),
      );
      pulse.value = withDelay(120, withTiming(1, { duration: 900 }));
    }

    const timer = setTimeout(close, SUCCESS_HOLD_MS);
    return () => clearTimeout(timer);
  }, [close, pulse, reduceMotion, sealScale]);

  const sealStyle = useAnimatedStyle(() => ({
    transform: [{ scale: sealScale.value }],
  }));

  const pulseStyle = useAnimatedStyle(() => ({
    opacity: (1 - pulse.value) * 0.5,
    transform: [{ scale: 1 + pulse.value * 1.2 }],
  }));

  const entering = reduceMotion
    ? (delay: number) => FadeIn.delay(delay).duration(220)
    : (delay: number) => FadeInDown.delay(delay).duration(220);

  return (
    <SafeAreaView className="flex-1 bg-app px-gutter pt-5" edges={["bottom"]}>
      <View className="flex-1 items-center justify-center gap-3">
        <View className="mb-3 size-27 items-center justify-center rounded-pill bg-claim-bg">
          {!reduceMotion ? <Confetti /> : null}
          {!reduceMotion ? (
            <Animated.View
              className="absolute size-19 rounded-pill bg-coral-200"
              style={pulseStyle}
            />
          ) : null}
          <Animated.View
            className="size-19 items-center justify-center rounded-pill bg-claim-solid"
            style={sealStyle}
          >
            <Icon
              name="check"
              size={34}
              strokeWidth={3}
              color={color.textOnDark}
            />
          </Animated.View>
        </View>

        <Animated.Text
          entering={entering(STAGGER * 2)}
          className="type-display text-center text-primary"
        >
          C&apos;est envoyé.
        </Animated.Text>

        <Animated.Text
          entering={entering(STAGGER * 3)}
          className="type-body-lg max-w-75 text-center text-secondary"
        >
          {item
            ? `Votre réclamation pour ${item.title} a été transmise.`
            : "Votre réclamation a été transmise."}
        </Animated.Text>

        <Animated.View
          entering={entering(STAGGER * 4)}
          className="mt-2 self-stretch px-5"
        >
          <Card tone="tint" pad={12}>
            <Text className="type-label text-center text-brand-strong">
              On garde une copie dans l&apos;app
            </Text>
            <Text className="type-caption mt-0.5 text-center text-brand-strong opacity-75">
              Relance automatique dans 7 jours sans réponse.
            </Text>
          </Card>
        </Animated.View>
      </View>

      <Animated.View entering={entering(STAGGER * 5)} className="pt-5">
        <Button variant="primary" size="lg" full onPress={close}>
          Terminé
        </Button>
      </Animated.View>
    </SafeAreaView>
  );
}

export default observer(ClaimSuccessScreen);
