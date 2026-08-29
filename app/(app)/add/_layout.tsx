import { color } from "@/theme/tokens";
import { Stack } from "expo-router";

export default function AddLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.bgApp },
      }}
    >
      <Stack.Screen name="index" />
      {/* The celebration shouldn't be half-swiped away. */}
      <Stack.Screen name="success" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
