import { Stack } from "expo-router";

// `headerShown: false` everywhere — login/signup build their own back
// button (`IconButton`), so the native header never gets a chance to show
// a second, native one alongside it. `onboarding` needs an explicit entry
// here (rather than being auto-discovered like the others) so it can be
// given the `modal` presentation, the same convention `declare`/`add` use
// under `(app)`.
export default function AuthLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" />
      <Stack.Screen name="login" />
      <Stack.Screen name="onboarding" options={{ presentation: "modal" }} />
    </Stack>
  );
}
