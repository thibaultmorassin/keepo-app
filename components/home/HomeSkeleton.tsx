import { View } from "@/tw";

export function HomeSkeleton() {
  return (
    <View className="gap-section">
      <View className="h-49 rounded-hero bg-sunken" />
      <View className="h-18 rounded-card bg-sunken" />
      <View className="h-18 rounded-card bg-sunken" />
      <View className="h-18 rounded-card bg-sunken" />
    </View>
  );
}
