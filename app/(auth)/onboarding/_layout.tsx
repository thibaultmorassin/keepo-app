import { resetOnboardingDraft } from "@/contexts/onboardingDraft";
import { color } from "@/theme/tokens";
import { Stack } from "expo-router";
import { useEffect } from "react";

// The onboarding draft lives in a module-level store
// (`@/contexts/onboardingDraft`), not component state, because navigating
// between the wizard's own steps unmounts each one — but the draft itself
// must not survive the modal being closed. This effect's cleanup is the
// single place that's true for every way the modal can go away (the close
// button on step 1, an iOS swipe-down, the Android back gesture, and a
// successful signup unmounting the whole `(auth)` group): reset once,
// right here, rather than duplicating it at every exit point.
export default function OnboardingLayout() {
  useEffect(() => {
    return () => resetOnboardingDraft();
  }, []);

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.bgApp },
      }}
    >
      <Stack.Screen name="index" />
      <Stack.Screen name="how-it-works" />
      <Stack.Screen name="personalize" />
      <Stack.Screen name="name" />
      <Stack.Screen name="create-account" />
    </Stack>
  );
}
