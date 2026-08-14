import { useEffect } from "react";
import { SplashScreen } from "expo-router";
import { useSession } from "@/contexts/session";

SplashScreen.preventAutoHideAsync();

type SplashScreenControllerProps = {
  fontsLoaded: boolean;
};

export function SplashScreenController({
  fontsLoaded,
}: SplashScreenControllerProps) {
  const { isLoading } = useSession();

  useEffect(() => {
    if (!isLoading && fontsLoaded) {
      SplashScreen.hideAsync();
    }
  }, [fontsLoaded, isLoading]);

  return null;
}
