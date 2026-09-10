import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { Button } from "@/components/ui/Button";
import type { IconName } from "@/components/ui/Icon";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { color } from "@/theme/tokens";
import { ScrollView, Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import { haptics } from "@/utils/haptics";
import { router } from "expo-router";
import { useCallback } from "react";
import { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STAGGER = 40;

const STEPS: { icon: IconName; label: string }[] = [
  { icon: "scan-line", label: "Un reçu photographié ou saisi" },
  { icon: "bell-ring", label: "La date de garantie surveillée" },
  { icon: "shield-check", label: "La réclamation écrite pour vous" },
];

export default function OnboardingHowItWorksScreen() {
  const insets = useSafeAreaInsets();

  const reduceMotion = useReducedMotion();

  const entering = reduceMotion
    ? (delay: number) => FadeIn.delay(delay).duration(220)
    : (delay: number) => FadeInDown.delay(delay).duration(220);

  const handleBack = useCallback(() => {
    haptics.light();
    router.back();
  }, []);

  const handleContinue = useCallback(() => {
    haptics.light();
    router.push("/onboarding/personalize");
  }, []);

  return (
    <View
      className="flex-1 bg-app"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-section px-gutter pb-6 pt-5"
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={entering(0)} className="self-start">
          <IconButton label="Retour" onPress={handleBack}>
            <Icon name="chevron-left" size={19} />
          </IconButton>
        </Animated.View>

        <Animated.View entering={entering(STAGGER)} className="gap-1.5">
          <Text className="type-micro text-secondary">Comment ça marche</Text>
          <Text className="type-display text-primary">
            Scannez, on garde le reste
          </Text>
        </Animated.View>

        <View className="gap-list">
          {STEPS.map((step, index) => (
            <Animated.View
              key={step.label}
              entering={entering(STAGGER * (2 + index))}
              className="flex-row items-center gap-3 rounded-tile bg-card px-4 py-3.5 shadow-sm"
            >
              <View className="size-10 items-center justify-center rounded-full bg-brand-tint">
                <Icon name={step.icon} size={20} color={color.brandStrong} />
              </View>
              <Text className="type-body flex-1 text-primary">
                {step.label}
              </Text>
            </Animated.View>
          ))}
        </View>
      </ScrollView>

      <OnboardingFooter>
        <Button variant="primary" size="lg" full onPress={handleContinue}>
          Continuer
        </Button>
      </OnboardingFooter>
    </View>
  );
}
