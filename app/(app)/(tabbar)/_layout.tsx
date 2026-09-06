import { TabBar } from "@/components/home/TabBar";
import { Stack } from "expo-router";
import { View } from "@/tw";

// Every route in this group gets the floating tab bar — that's the whole
// point of the group. Screens that shouldn't show it (item detail, add,
// declare) simply live outside of it, as siblings on the parent Stack.
export default function TabBarGroupLayout() {
  return (
    <View className="flex-1">
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" />
        <Stack.Screen name="settings" />
      </Stack>

      <TabBar />
    </View>
  );
}
