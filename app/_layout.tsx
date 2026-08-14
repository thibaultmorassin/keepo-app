import { Stack } from "expo-router";
import { useFonts } from "expo-font";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from "@expo-google-fonts/bricolage-grotesque";
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
} from "@expo-google-fonts/instrument-sans";
import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";
import { SessionProvider, useSession } from "@/contexts/session";
import { SplashScreenController } from "@/components/SplashScreenController";
import { color } from "@/theme/tokens";

function RootNavigator() {
  const { session } = useSession();

  return (
    <Stack
      screenOptions={{
        headerShown: false,
        contentStyle: { backgroundColor: color.bgApp },
      }}
    >
      <Stack.Protected guard={!session}>
        <Stack.Screen name="(auth)" />
      </Stack.Protected>
      <Stack.Protected guard={!!session}>
        <Stack.Screen name="(app)" />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    BricolageGrotesque_600SemiBold,
    BricolageGrotesque_700Bold,
    InstrumentSans_400Regular,
    InstrumentSans_500Medium,
    InstrumentSans_600SemiBold,
    DMMono_400Regular,
  });

  return (
    <SafeAreaProvider>
      <SessionProvider>
        <SplashScreenController fontsLoaded={fontsLoaded} />
        {fontsLoaded ? <RootNavigator /> : null}
      </SessionProvider>
    </SafeAreaProvider>
  );
}
