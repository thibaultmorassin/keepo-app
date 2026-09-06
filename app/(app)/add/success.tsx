import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Confetti } from "@/components/ui/confetti";
import { Icon } from "@/components/ui/Icon";
import { useSession } from "@/contexts/session";
import { color } from "@/theme/tokens";
import { Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import { formatShortDate } from "@/utils/format";
import { haptics } from "@/utils/haptics";
import { ownedItems } from "@/utils/ownership";
import {
  DEFAULT_REMINDER_DAYS,
  remainingLabel,
  statusOf,
  warrantyDurationLabel,
} from "@/utils/warranty";
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
import { useSafeAreaInsets } from "react-native-safe-area-context";

/** How long the celebration holds before it takes itself off screen. */
const SUCCESS_HOLD_MS = 5000;
const STAGGER = 60;

function AddSuccessScreen() {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { session } = useSession();
  const { id } = useLocalSearchParams<{ id: string }>();

  const itemsRecord = ownedItems(session?.user.id);
  const item = id ? itemsRecord?.[id] : undefined;

  const dismissed = useRef(false);
  const sealScale = useSharedValue(reduceMotion ? 1 : 0);
  const pulse = useSharedValue(0);

  const close = useCallback(() => {
    if (dismissed.current) return;
    dismissed.current = true;
    // Closes the whole modal from inside the nested stack and lands on the
    // item just created — `dismissAll` would only pop back to the choice
    // screen, and a plain `push` would stack the detail screen under the
    // still-open modal.
    if (id) {
      router.dismissTo(`/items/${id}`);
    } else {
      router.dismissTo("/");
    }
  }, [id]);

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

  const endDate = item?.warranty_end_date ?? null;
  const duration = item
    ? warrantyDurationLabel(item.purchase_date, endDate)
    : null;

  return (
    <View
      className="flex-1 bg-app px-gutter pt-5"
      style={{ paddingBottom: insets.bottom + 24 }}
    >
      <View className="flex-1 items-center justify-center gap-3">
        <View className="mb-3 size-[108px] items-center justify-center rounded-pill bg-brand-tint">
          {!reduceMotion ? <Confetti /> : null}
          {!reduceMotion ? (
            <Animated.View
              className="absolute size-[76px] rounded-pill bg-green-200"
              style={pulseStyle}
            />
          ) : null}
          <Animated.View
            className="size-[76px] items-center justify-center rounded-pill bg-brand"
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
          C&apos;est gardé.
        </Animated.Text>

        <Animated.Text
          entering={entering(STAGGER * 3)}
          className="type-body-lg max-w-[300px] text-center text-secondary"
        >
          {item && endDate
            ? `${item.title} est couvert jusqu'au ${formatShortDate(endDate)}.`
            : "Votre objet est enregistré."}
        </Animated.Text>

        {item && endDate ? (
          <Animated.View
            entering={entering(STAGGER * 4)}
            className="mt-2 self-stretch px-5"
          >
            <Card tone="tint" pad={12}>
              <Text className="type-label text-center text-brand-strong">
                {duration ? `Garantie ${duration}` : remainingLabel(endDate)}
                {/* "24 mois" restates a fresh "2 ans" — the remaining count only
                    earns its place once it's the more urgent number. */}
                {duration && statusOf(endDate) !== "covered"
                  ? ` · ${remainingLabel(endDate)}`
                  : ""}
              </Text>
              <Text className="type-caption mt-0.5 text-center text-brand-strong opacity-75">
                {item.reminder_enabled
                  ? `On vous prévient ${DEFAULT_REMINDER_DAYS} jours avant la fin.`
                  : "Aucun rappel programmé pour cet objet."}
              </Text>
            </Card>
          </Animated.View>
        ) : null}
      </View>

      <Animated.View entering={entering(STAGGER * 5)} className="pt-5">
        <Button variant="primary" size="lg" full onPress={close}>
          Terminé
        </Button>
      </Animated.View>
    </View>
  );
}


export default observer(AddSuccessScreen);
