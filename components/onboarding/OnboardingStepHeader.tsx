import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { StepBar } from "@/components/ui/StepBar";
import { Text, View } from "@/tw";

type OnboardingStepHeaderProps = {
  step: 1 | 2 | 3;
  onBack: () => void;
};

/** Shared header for the three counted steps of the onboarding wizard (personalize, name, create-account) — the hook and how-it-works screens have their own simpler header. */
export function OnboardingStepHeader({
  step,
  onBack,
}: OnboardingStepHeaderProps) {
  return (
    <View className="gap-3.5">
      <View className="flex-row items-center gap-3">
        <IconButton label="Retour" onPress={onBack}>
          <Icon name="chevron-left" size={19} />
        </IconButton>
        <Text className="type-micro flex-1 text-secondary">
          Compte · étape {step} sur 3
        </Text>
      </View>
      <StepBar total={3} current={step} />
    </View>
  );
}
