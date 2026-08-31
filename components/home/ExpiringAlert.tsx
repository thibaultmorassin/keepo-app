import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { color } from "@/theme/tokens";
import { Text, View } from "@/tw";
import type { ItemRow } from "@/utils/warranty";
import { remainingDays } from "@/utils/warranty";

type ExpiringAlertProps = {
  item: ItemRow;
  onPress?: () => void;
};

export function ExpiringAlert({ item, onPress }: ExpiringAlertProps) {
  const days = remainingDays(item.warranty_end_date) ?? 0;

  return (
    <Card
      tone="plain"
      onPress={onPress}
      pad={0}
      className="flex-row items-center gap-3 bg-expiring-bg py-3.25 pl-3.25 pr-card shadow-none"
    >
      <View className="size-9 shrink-0 items-center justify-center rounded-pill bg-amber-200">
        <Icon name="bell-ring" size={18} color={color.statusExpiringFg} />
      </View>
      <View className="min-w-0 flex-1">
        <Text className="type-body-semibold text-expiring-fg">
          {item.title} — plus que {days} jours
        </Text>
        <Text className="type-caption mt-0.5 text-amber-700 opacity-[0.82]">
          Dernier moment pour déclarer un souci
        </Text>
      </View>
      <Icon name="chevron-right" size={17} color={color.statusExpiringFg} />
    </Card>
  );
}
