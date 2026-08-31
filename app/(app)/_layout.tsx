import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerTransparent: true, headerTitle: "" }}>
      <Stack.Screen name="(tabbar)" options={{ headerShown: false }} />
      <Stack.Screen
        name="add"
        options={{ presentation: "modal", headerShown: false }}
      />
      <Stack.Screen
        name="declare"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}
