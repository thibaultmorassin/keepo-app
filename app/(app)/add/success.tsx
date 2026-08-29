import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Confetti } from "@/components/ui/confetti";
import { Icon } from "@/components/ui/Icon";
import { color, radius, space } from "@/theme/tokens";
import { type } from "@/theme/typography";
import type { Tables } from "@/utils/database.types";
import { formatShortDate } from "@/utils/format";
import { haptics } from "@/utils/haptics";
import { items$ } from "@/utils/SupaLegend";
import {
  DEFAULT_REMINDER_DAYS,
  remainingLabel,
  statusOf,
  warrantyDurationLabel,
} from "@/utils/warranty";
import { observer } from "@legendapp/state/react";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useRef } from "react";
import { StyleSheet, Text, View } from "react-native";
import Animated, {
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
  const { id } = useLocalSearchParams<{ id: string }>();

  const itemsRecord = items$.get() as
    | Record<string, Tables<"items">>
    | undefined;
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
      style={[
        styles.screen,
        {
          paddingTop: space[7],
          paddingBottom: insets.bottom + space[8],
        },
      ]}
    >
      <View style={styles.celebration}>
        <View style={styles.sealWrapper}>
          {!reduceMotion ? <Confetti /> : null}
          {!reduceMotion ? (
            <Animated.View style={[styles.pulse, pulseStyle]} />
          ) : null}
          <Animated.View style={[styles.seal, sealStyle]}>
            <Icon
              name="check"
              size={34}
              strokeWidth={3}
              color={color.textOnDark}
            />
          </Animated.View>
        </View>

        <Animated.Text entering={entering(STAGGER * 2)} style={styles.headline}>
          C&apos;est gardé.
        </Animated.Text>

        <Animated.Text entering={entering(STAGGER * 3)} style={styles.subtitle}>
          {item && endDate
            ? `${item.title} est couvert jusqu'au ${formatShortDate(endDate)}.`
            : "Votre objet est enregistré."}
        </Animated.Text>

        {item && endDate ? (
          <Animated.View entering={entering(STAGGER * 4)} style={styles.recap}>
            <Card tone="tint" pad={space[5]}>
              <Text style={styles.recapLine}>
                {duration ? `Garantie ${duration}` : remainingLabel(endDate)}
                {/* "24 mois" restates a fresh "2 ans" — the remaining count only
                    earns its place once it's the more urgent number. */}
                {duration && statusOf(endDate) !== "covered"
                  ? ` · ${remainingLabel(endDate)}`
                  : ""}
              </Text>
              <Text style={styles.recapNote}>
                {item.reminder_enabled
                  ? `On vous prévient ${DEFAULT_REMINDER_DAYS} jours avant la fin.`
                  : "Aucun rappel programmé pour cet objet."}
              </Text>
            </Card>
          </Animated.View>
        ) : null}
      </View>

      <Animated.View entering={entering(STAGGER * 5)} style={styles.footer}>
        <Button variant="primary" size="lg" full onPress={close}>
          Terminé
        </Button>
      </Animated.View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.bgApp,
    paddingHorizontal: space.gutterScreen,
  },
  celebration: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    gap: space[5],
  },
  sealWrapper: {
    width: 108,
    height: 108,
    borderRadius: radius.pill,
    backgroundColor: color.brandTint,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: space[5],
  },
  pulse: {
    position: "absolute",
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: color.green200,
  },
  seal: {
    width: 76,
    height: 76,
    borderRadius: radius.pill,
    backgroundColor: color.brand,
    alignItems: "center",
    justifyContent: "center",
  },
  headline: {
    ...type.display,
    color: color.textPrimary,
    textAlign: "center",
  },
  subtitle: {
    ...type.bodyLg,
    color: color.textSecondary,
    textAlign: "center",
    maxWidth: 300,
  },
  recap: {
    marginTop: space[4],
    alignSelf: "stretch",
    paddingHorizontal: space[7],
  },
  recapLine: {
    ...type.label,
    color: color.brandStrong,
    textAlign: "center",
  },
  recapNote: {
    ...type.caption,
    color: color.brandStrong,
    opacity: 0.75,
    textAlign: "center",
    marginTop: 2,
  },
  footer: {
    paddingTop: space[7],
  },
});

export default observer(AddSuccessScreen);
