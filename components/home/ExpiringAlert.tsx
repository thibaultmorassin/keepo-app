import { StyleSheet, Text, View } from "react-native";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { color, radius, space } from "@/theme/tokens";
import { type } from "@/theme/typography";
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
      style={styles.card}
    >
      <View style={styles.iconPuck}>
        <Icon
          name="bell-ring"
          size={18}
          color={color.statusExpiringFg}
        />
      </View>
      <View style={styles.copy}>
        <Text style={styles.headline}>
          {item.title} — plus que {days} jours
        </Text>
        <Text style={styles.subline}>
          Dernier moment pour déclarer un souci
        </Text>
      </View>
      <Icon
        name="chevron-right"
        size={17}
        color={color.statusExpiringFg}
      />
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[5],
    backgroundColor: color.statusExpiringBg,
    paddingVertical: 13,
    paddingLeft: 13,
    paddingRight: space.padCard,
    shadowOpacity: 0,
    elevation: 0,
  },
  iconPuck: {
    width: 36,
    height: 36,
    borderRadius: radius.pill,
    backgroundColor: color.amber200,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  copy: {
    flex: 1,
    minWidth: 0,
  },
  headline: {
    ...type.body,
    fontWeight: "600",
    color: color.statusExpiringFg,
  },
  subline: {
    ...type.caption,
    color: color.amber700,
    opacity: 0.82,
    marginTop: 2,
  },
});
