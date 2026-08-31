import { Link, Pressable, Text, View } from "@/tw";
import { formatEyebrowDate } from "@/utils/format";

type HomeHeaderProps = {
  initials: string;
};

export function HomeHeader({ initials }: HomeHeaderProps) {
  return (
    <View className="shrink-0 flex-row items-start gap-3">
      <View className="flex-1">
        <Text className="type-micro text-secondary">{formatEyebrowDate()}</Text>
        <Text className="type-display mt-0.75 text-primary">Vos garanties</Text>
      </View>
      <Link href="/settings" asChild>
        <Pressable
          className="size-10.5 shrink-0 items-center justify-center rounded-full bg-brand-tint"
          hitSlop={10}
        >
          <Text className="type-heading text-[15px]/[18px] text-brand-strong">
            {initials}
          </Text>
        </Pressable>
      </Link>
    </View>
  );
}
