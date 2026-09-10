import { View } from "@/tw";
import { KeyboardStickyView } from "react-native-keyboard-controller";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export function OnboardingFooter({
  children,
  ...props
}: React.ComponentProps<typeof KeyboardStickyView>) {
  const insets = useSafeAreaInsets();

  return (
    <KeyboardStickyView
      {...props}
      offset={{ closed: 0, opened: insets.bottom }}
    >
      <View className="gap-2 px-gutter pt-3">{children}</View>
    </KeyboardStickyView>
  );
}
