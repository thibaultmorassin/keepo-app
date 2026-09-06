import { Card } from "@/components/ui/Card";
import { StatTile } from "@/components/ui/StatTile";
import { Pressable, Text, View } from "@/tw";
import { formatEuro } from "@/utils/format";
import { openClaimsLabel, WarrantyFilter } from "@/utils/warranty";

type CoverageHeroProps = {
  totalCoveredValue: number;
  totalItems: number;
  openClaims: number;
  coveredCount: number;
  expiringCount: number;
  expiredCount: number;
  onFilterChange: (filter: WarrantyFilter) => void;
  onOpenClaims?: () => void;
};

const TILE = "flex-1 shrink-0 active:scale-[0.98]";

export function CoverageHero({
  totalCoveredValue,
  totalItems,
  openClaims,
  coveredCount,
  expiringCount,
  expiredCount,
  onFilterChange,
  onOpenClaims,
}: CoverageHeroProps) {
  return (
    <Card tone="brand" size="hero" className="relative overflow-hidden">
      <View className="absolute -right-11.5 -top-11.5 size-42.5 rounded-full bg-on-dark/12" />
      <View className="relative">
        <Text className="type-micro text-on-dark opacity-[0.82]">
          Valeur encore couverte
        </Text>
        <Text className="type-hero mt-1.5 text-on-dark">
          {formatEuro(totalCoveredValue)}
        </Text>
        <Text className="type-body mt-1 text-on-dark opacity-[0.88]">
          sur {totalItems} objets suivis ·{" "}
          {openClaims > 0 && onOpenClaims ? (
            <Text
              className="type-body font-sans-semibold font-semibold text-on-dark underline"
              onPress={onOpenClaims}
            >
              {openClaimsLabel(openClaims)}
            </Text>
          ) : (
            openClaimsLabel(openClaims)
          )}
        </Text>
        <View className="mt-[18px] flex-row gap-2">
          <Pressable onPress={() => onFilterChange("covered")} className={TILE}>
            <StatTile
              value={String(coveredCount)}
              label={coveredCount > 0 ? "Couverts" : "Couvert"}
            />
          </Pressable>
          <Pressable
            onPress={() => onFilterChange("expiring")}
            className={TILE}
          >
            <StatTile value={String(expiringCount)} label="Bientôt" />
          </Pressable>
          <Pressable onPress={() => onFilterChange("expired")} className={TILE}>
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
