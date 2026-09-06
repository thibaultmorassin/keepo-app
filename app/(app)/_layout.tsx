import { Stack } from "expo-router";

// Every screen below builds its own header (or none) with our own
// `IconButton` for back navigation — never the native Stack header — so
// `headerShown: false` is set once here instead of per screen.
export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="(tabbar)" />
      <Stack.Screen name="add" options={{ presentation: "modal" }} />
      <Stack.Screen name="declare" options={{ presentation: "modal" }} />
      <Stack.Screen name="claims" />
      <Stack.Screen name="items/[id]" />
    </Stack>
  );
}
