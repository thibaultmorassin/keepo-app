import { ScrollView, StyleSheet } from "react-native";
import { Chip } from "@/components/ui/Chip";
import { space } from "@/theme/tokens";
import type { WarrantyFilter } from "@/utils/warranty";

const FILTERS: Array<{ label: string; value: WarrantyFilter }> = [
  { label: "Tous", value: null },
  { label: "Couverts", value: "covered" },
  { label: "Bientôt", value: "expiring" },
  { label: "Expirés", value: "expired" },
];

type FilterRowProps = {
  value: WarrantyFilter;
  onChange: (value: WarrantyFilter) => void;
};

export function FilterRow({ value, onChange }: FilterRowProps) {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.content}
      style={styles.row}
    >
      {FILTERS.map((filter) => (
        <Chip
          key={filter.label}
          tone="neutral"
          selected={value === filter.value}
          onPress={() => onChange(filter.value)}
        >
          {filter.label}
        </Chip>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  row: {
    flexGrow: 0,
    marginHorizontal: -space.gutterScreen,
  },
  content: {
    gap: 7,
    paddingHorizontal: space.gutterScreen,
  },
});
