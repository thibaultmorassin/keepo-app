import { Chip } from "@/components/ui/Chip";
import { ScrollView } from "@/tw";
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
      // bleed past the screen gutter so chips can scroll edge to edge
      className="grow-0 -mx-gutter"
      contentContainerClassName="gap-[7px] px-gutter"
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
