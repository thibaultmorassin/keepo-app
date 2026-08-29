import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { color, radius, shadowStyle, space } from "@/theme/tokens";
import { LinearGradient } from "expo-linear-gradient";
import { Pressable, StyleSheet, View } from "react-native";

const IDLE_COLOR = "rgba(252,250,246,0.45)";

// Wrapper paddingBottom (30) + pill height (paddingVertical 7*2 + the
// Ajouter button's 40px minHeight) — the space the floating pill actually
// occupies from the bottom of the screen. Screens with their own fixed
// bottom content (e.g. item detail's claim CTA) use this to sit above it.
export const TAB_BAR_HEIGHT = 84;

type TabBarProps = {
  onAdd?: () => void;
  onHome?: () => void;
  onSettings?: () => void;
  active?: "home" | "settings";
};

export function TabBar({ onAdd, onHome, onSettings, active }: TabBarProps) {
  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <LinearGradient
        colors={[color.bgApp, `${color.bgApp}00`]}
        // locations={[0.58, 1]}
        style={styles.gradient}
        pointerEvents="none"
      />
      <View style={styles.pill}>
        <View style={styles.icons}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Accueil"
            onPress={onHome}
          >
            <Icon
              name="layout-grid"
              size={21}
              color={active === "home" ? color.textOnDark : IDLE_COLOR}
              accessibilityLabel="Accueil"
            />
          </Pressable>
          <Pressable accessibilityRole="button" accessibilityLabel="Garanties">
            <Icon
              name="shield-check"
              size={21}
              color={IDLE_COLOR}
              accessibilityLabel="Garanties"
            />
          </Pressable>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Réglages"
            onPress={onSettings}
          >
            <Icon
              name="settings"
              size={21}
              color={active === "settings" ? color.textOnDark : IDLE_COLOR}
              accessibilityLabel="Réglages"
            />
          </Pressable>
        </View>
        <Button
          size="lg"
          icon={
            <Icon
              name="plus"
              size={17}
              strokeWidth={3}
              color={color.textOnDark}
            />
          }
          onPress={onAdd}
          style={styles.addButton}
        >
          Ajouter
        </Button>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: 20,
    paddingBottom: 30,
  },
  gradient: {
    ...StyleSheet.absoluteFill,
  },
  pill: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[4],
    paddingVertical: 7,
    paddingLeft: 20,
    paddingRight: 7,
    borderRadius: radius.pill,
    backgroundColor: color.bgInverse,
    ...shadowStyle.lift,
  },
  icons: {
    flex: 1,
    flexDirection: "row",
    gap: 22,
    alignItems: "center",
  },
  addButton: {
    minHeight: 40,
  },
});
