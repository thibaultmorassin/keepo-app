import * as Haptics from "expo-haptics";
import { Platform } from "react-native";

async function impact(style: Haptics.ImpactFeedbackStyle) {
  if (Platform.OS === "web") return;

  try {
    await Haptics.impactAsync(style);
  } catch {
    // Haptics unavailable on this device.
  }
}

export const haptics = {
  light: () => impact(Haptics.ImpactFeedbackStyle.Light),
  medium: () => impact(Haptics.ImpactFeedbackStyle.Medium),
  heavy: () => impact(Haptics.ImpactFeedbackStyle.Heavy),
};
