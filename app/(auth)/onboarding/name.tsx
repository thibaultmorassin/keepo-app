import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { useOnboardingDraft } from "@/contexts/onboardingDraft";
import { ScrollView, Text, View } from "@/tw";
import { haptics } from "@/utils/haptics";
import { observer } from "@legendapp/state/react";
import { router } from "expo-router";
import { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function OnboardingNameScreen() {
  const insets = useSafeAreaInsets();

  const { firstName, setFirstName, lastName, setLastName } =
    useOnboardingDraft();

  const canSubmit = firstName.trim().length > 0 && lastName.trim().length > 0;

  const handleContinue = useCallback(() => {
    if (!canSubmit) return;
    haptics.light();
    router.push("/onboarding/create-account");
  }, [canSubmit]);

  return (
    <View
      className="flex-1 bg-app"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      <View className="px-gutter pb-3 pt-5">
        <OnboardingStepHeader step={2} onBack={() => router.back()} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-section px-gutter pb-6 pt-3"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1.5">
          <Text className="type-micro text-secondary">
            Pour vos réclamations
          </Text>
          <Text className="type-title text-primary">
            Pour signer vos courriers
          </Text>
          <Text className="type-body text-secondary">
            Nous utilisons votre nom pour signer vos courriers de réclamation en
            cas de sinistre.
          </Text>
        </View>

        <Card tone="outline" className="gap-2.5">
          <Field
            label="Prénom"
            value={firstName}
            onChangeText={setFirstName}
            placeholder="Marie"
            autoCapitalize="words"
            autoComplete="given-name"
            textContentType="givenName"
            className="min-w-0 flex-1"
          />
          <Field
            label="Nom"
            value={lastName}
            onChangeText={setLastName}
            placeholder="Dupont"
            autoCapitalize="words"
            autoComplete="family-name"
            textContentType="familyName"
            className="min-w-0 flex-1"
          />
        </Card>
      </ScrollView>

      <OnboardingFooter>
        <Button
          variant="primary"
          size="lg"
          full
          disabled={!canSubmit}
          onPress={handleContinue}
        >
          Continuer
        </Button>
      </OnboardingFooter>
    </View>
  );
}

export default observer(OnboardingNameScreen);
