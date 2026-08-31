import { View } from "@/tw";

const BLOCK = "bg-sunken rounded-card";

export function ItemDetailSkeleton() {
  return (
    <View className="gap-4">
      <View className="flex-row items-center gap-3.75">
        <View className="size-19.5 rounded-pill bg-sunken" />
        <View className="flex-1 gap-2">
          <View className={`${BLOCK} h-6 w-4/5`} />
          <View className={`${BLOCK} h-4 w-[55%]`} />
        </View>
      </View>
      <View className={`${BLOCK} h-22`} />
      <View className="flex-row gap-2.5">
        <View className={`${BLOCK} h-24 flex-1`} />
        <View className={`${BLOCK} h-24 flex-1`} />
        <View className={`${BLOCK} h-24 flex-1`} />
      </View>
      <View className={`${BLOCK} h-39`} />
    </View>
  );
}
