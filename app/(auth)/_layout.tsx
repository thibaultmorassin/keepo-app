import { Stack } from "expo-router";

// `headerShown: false` everywhere — login/signup build their own back
// button (`IconButton`), so the native header never gets a chance to show
// a second, native one alongside it.
export default function AuthLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
