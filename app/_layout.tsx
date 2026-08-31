import "@/global.css";

import { SplashScreenController } from "@/components/SplashScreenController";
import { SessionProvider, useSession } from "@/contexts/session";
import { color } from "@/theme/tokens";
import {
  BricolageGrotesque_600SemiBold,
  BricolageGrotesque_700Bold,
} from "@expo-google-fonts/bricolage-grotesque";
import { DMMono_400Regular } from "@expo-google-fonts/dm-mono";
import {
  InstrumentSans_400Regular,
  InstrumentSans_500Medium,
  InstrumentSans_600SemiBold,
} from "@expo-google-fonts/instrument-sans";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import { KeyboardProvider } from "react-native-keyboard-controller";
import { SafeAreaProvider } from "react-native-css/components/react-native-safe-area-context";

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
      <KeyboardProvider>
        <SessionProvider>
          <SplashScreenController fontsLoaded={fontsLoaded} />
          {fontsLoaded ? <RootNavigator /> : null}
        </SessionProvider>
      </KeyboardProvider>
    </SafeAreaProvider>
  );
}
