import { resetClaimDraft } from "@/contexts/claimDraft";
import { color } from "@/theme/tokens";
import { Stack } from "expo-router";
import { useEffect } from "react";

// The claim draft lives in a module-level store (`@/contexts/claimDraft`),
// not component state, because navigating between the wizard's own steps
// unmounts each one — but the draft itself must not survive the modal being
// closed. This effect's cleanup is the single place that's true for every
// way the modal can go away (the close button, an iOS swipe-down, the
// Android back gesture): reset once, right here, rather than duplicating it
// at every exit point.
export default function DeclareLayout() {
  useEffect(() => {
    return () => resetClaimDraft();
  }, []);

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
