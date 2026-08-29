import { TabBar } from "@/components/home/TabBar";
import { haptics } from "@/utils/haptics";
import { Stack, usePathname, useRouter } from "expo-router";
import { View } from "react-native";

export default function AppLayout() {
  const pathname = usePathname();
  const router = useRouter();

  // The "add" flow is a modal with its own form/footer — the tab bar has no
  // place there.
  const showTabBar = !pathname.startsWith("/add");
  const active =
    pathname === "/settings"
      ? "settings"
      : pathname === "/"
        ? "home"
        : undefined;

  return (
    <View style={{ flex: 1 }}>
      <Stack screenOptions={{ headerTransparent: true, headerTitle: "" }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen
          name="add"
          options={{ presentation: "modal", headerShown: false }}
        />
      </Stack>

      {showTabBar ? (
        <TabBar
          active={active}
          onHome={() => {
            haptics.light();
            router.push("/");
          }}
          onSettings={() => {
            haptics.light();
            router.push("/settings");
          }}
          onAdd={() => {
            haptics.light();
            router.push("/add");
          }}
        />
      ) : null}
    </View>
  );
}
