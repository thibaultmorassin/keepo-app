import { ClaimDraftProvider } from "@/contexts/claimDraft";
import { color } from "@/theme/tokens";
import { Stack } from "expo-router";

export default function DeclareLayout() {
  return (
    <ClaimDraftProvider>
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
    </ClaimDraftProvider>
  );
}
