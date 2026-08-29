import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { color, space } from "@/theme/tokens";
import { type } from "@/theme/typography";
import { formatEuro } from "@/utils/format";
import { openClaimsLabel, WarrantyFilter } from "@/utils/warranty";
import { Pressable, StyleSheet, Text, View } from "react-native";

type CoverageHeroProps = {
  totalCoveredValue: number;
  totalItems: number;
  openClaims: number;
  coveredCount: number;
  expiringCount: number;
  expiredCount: number;
  onFilterChange: (filter: WarrantyFilter) => void;
};

export function CoverageHero({
  totalCoveredValue,
  totalItems,
  openClaims,
  coveredCount,
  expiringCount,
  expiredCount,
  onFilterChange,
}: CoverageHeroProps) {
  return (
    <Card tone="brand" size="hero" style={styles.card}>
      <View style={styles.circle} />
      <View style={styles.content}>
        <Text style={styles.eyebrow}>Valeur encore couverte</Text>
        <Text style={styles.total}>{formatEuro(totalCoveredValue)}</Text>
        <Text style={styles.summary}>
          sur {totalItems} objets suivis · {openClaimsLabel(openClaims)}
        </Text>
        <View style={styles.stats}>
          <Pressable
            onPress={() => onFilterChange("covered")}
            style={({ pressed }) => [
              styles.statTile,
              pressed && styles.statTileActive,
            ]}
          >
            <StatTile
              value={String(coveredCount)}
              label={coveredCount > 0 ? "Couverts" : "Couvert"}
            />
          </Pressable>
          <Pressable
            onPress={() => onFilterChange("expiring")}
            style={({ pressed }) => [
              styles.statTile,
              pressed && styles.statTileActive,
            ]}
          >
            <StatTile value={String(expiringCount)} label="Bientôt" />
          </Pressable>
          <Pressable
            onPress={() => onFilterChange("expired")}
            style={({ pressed }) => [
              styles.statTile,
              pressed && styles.statTileActive,
            ]}
          >
            <StatTile
              value={String(expiredCount)}
              label={expiredCount > 0 ? "Expirés" : "Expirée"}
            />
          </Pressable>
        </View>
      </View>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    overflow: "hidden",
    position: "relative",
  },
  circle: {
    position: "absolute",
    right: -46,
    top: -46,
    width: 170,
    height: 170,
    borderRadius: 999,
    backgroundColor: color.heroCircle,
  },
  content: {
    position: "relative",
  },
  eyebrow: {
    ...type.micro,
    color: color.textOnDark,
    opacity: 0.82,
  },
  total: {
    ...type.hero,
    color: color.textOnDark,
    marginTop: 6,
  },
  summary: {
    ...type.body,
    color: color.textOnDark,
    opacity: 0.88,
    marginTop: 4,
  },
  stats: {
    flexDirection: "row",
    gap: space[4],
    marginTop: 18,
  },
  statTile: {
    flex: 1,
    flexShrink: 0,
  },
  statTileActive: {
    transform: [{ scale: 0.98 }],
  },
});
