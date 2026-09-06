import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { StepBar } from "@/components/ui/StepBar";
import { Text, View } from "@/tw";

type ClaimStepHeaderProps = {
  step: 1 | 2 | 3;
  itemName: string;
  onBack: () => void;
};

/** Shared header for the three counted steps of the claim wizard — the item picker (step 0) has its own simpler header. */
export function ClaimStepHeader({
  step,
  itemName,
  onBack,
}: ClaimStepHeaderProps) {
  return (
    <View className="gap-3.5">
      <View className="flex-row items-center gap-3">
        <IconButton label="Retour" onPress={onBack}>
          <Icon name="chevron-left" size={19} />
        </IconButton>
        <View className="min-w-0 flex-1">
          <Text className="type-micro text-secondary">
            Réclamation · étape {step} sur 3
          </Text>
          <Text
            className="type-body-semibold mt-px text-primary"
            numberOfLines={1}
          >
            {itemName}
          </Text>
        </View>
      </View>
      <StepBar total={3} current={step} />
    </View>
  );
}
