import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import { Button } from "@/components/ui/Button";
import { OptionRow } from "@/components/ui/OptionRow";
import { useOnboardingDraft } from "@/contexts/onboardingDraft";
import { ScrollView, Text, View } from "@/tw";
import { haptics } from "@/utils/haptics";
import { observer } from "@legendapp/state/react";
import { router } from "expo-router";
import { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const CONCERNS = [
  "Perdre une facture",
  "Rater une date de garantie",
  "Ne pas savoir ce qui est couvert",
];

function OnboardingPersonalizeScreen() {
  const insets = useSafeAreaInsets();

  const { concerns, toggleConcern } = useOnboardingDraft();

  const handleContinue = useCallback(() => {
    haptics.light();
    router.push("/onboarding/name");
  }, []);

  return (
    <View
      className="flex-1 bg-app"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      <View className="px-gutter pb-3 pt-5">
        <OnboardingStepHeader step={1} onBack={() => router.back()} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-section px-gutter pb-6 pt-3"
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1.5">
          <Text className="type-title text-primary">
            Votre plus grande crainte
          </Text>
          <Text className="type-body text-secondary">
            Choisissez ce qui vous inquiète le plus avec vos garanties.
          </Text>
        </View>

        <View className="gap-1.5">
          {CONCERNS.map((concern) => (
            <OptionRow
              key={concern}
              label={concern}
              role="checkbox"
              selected={concerns.includes(concern)}
              onSelect={() => toggleConcern(concern)}
            />
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

export default observer(OnboardingPersonalizeScreen);
