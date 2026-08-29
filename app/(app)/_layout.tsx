import { Stack } from "expo-router";

export default function AppLayout() {
  return (
    <Stack screenOptions={{ headerTransparent: true, headerTitle: "" }}>
      <Stack.Screen
        name="add"
        options={{ presentation: "modal", headerShown: false }}
      />
    </Stack>
  );
}
