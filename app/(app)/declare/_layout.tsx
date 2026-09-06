import { color } from "@/theme/tokens";
import { Stack } from "expo-router";

// No provider wraps this stack: the claim draft lives in a module-level
// store (`@/contexts/claimDraft`), not component state, precisely so it
// survives this whole modal unmounting when the user closes it partway
// through — see that file for why.
export default function DeclareLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.bgApp },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="issue" />
      <Stack.Screen name="details" />
      <Stack.Screen name="message" />
      {/* The celebration shouldn't be half-swiped away. */}
      <Stack.Screen name="success" options={{ gestureEnabled: false }} />
    </Stack>
  );
}
