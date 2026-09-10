import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { color } from "@/theme/tokens";
import { ScrollView, Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import { haptics } from "@/utils/haptics";
import { router } from "expo-router";
import { useCallback } from "react";
import { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

const STAGGER = 40;

export default function OnboardingHookScreen() {
  const insets = useSafeAreaInsets();

  const reduceMotion = useReducedMotion();

  const entering = reduceMotion
    ? (delay: number) => FadeIn.delay(delay).duration(220)
    : (delay: number) => FadeInDown.delay(delay).duration(220);

  const handleClose = useCallback(() => {
    haptics.light();
    router.back();
  }, []);

  const handleContinue = useCallback(() => {
    haptics.light();
    router.push("/onboarding/how-it-works");
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
          <IconButton label="Fermer" onPress={handleClose}>
            <Icon name="x" size={19} />
          </IconButton>
        </Animated.View>

        <Animated.View entering={entering(STAGGER)} className="gap-1.5">
          <Text className="type-micro text-secondary">Le problème</Text>
          <Text className="type-display text-primary">
            Une facture introuvable, toujours
          </Text>
          <Text className="type-body mt-1 text-secondary">
            Un appareil casse, et la facture a disparu entre les emails et les
            tiroirs.
          </Text>
        </Animated.View>

        <Animated.View entering={entering(STAGGER * 2)}>
          <Card tone="brand" size="hero" className="relative overflow-hidden">
            <View className="absolute -right-11.5 -top-11.5 size-42.5 rounded-pill bg-on-dark/12" />
            <View className="relative flex-row gap-3.5">
              <View className="size-12 shrink-0 items-center justify-center rounded-pill bg-on-dark/20">
                <Icon name="receipt" size={24} color={color.textOnDark} />
              </View>
              <View className="min-w-0 flex-1 gap-1.5">
                <Text className="type-micro text-on-dark opacity-[0.82]">
                  Ce que vous vous dites
                </Text>
                <Text className="font-display-bold text-[19px]/[23px] font-bold tracking-[-0.285px] text-on-dark">
                  « Je sais que je l&apos;ai acheté, mais où est le reçu ? »
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>
      </ScrollView>

      <OnboardingFooter>
        <Button variant="primary" size="lg" full onPress={handleContinue}>
          Continuer
        </Button>
      </OnboardingFooter>
    </View>
  );
}
