import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { color, radius, shadowStyle, space } from "@/theme/tokens";
import { haptics } from "@/utils/haptics";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname } from "expo-router";
import { Pressable, StyleSheet, View } from "react-native";

const IDLE_COLOR = "rgba(252,250,246,0.45)";

// Wrapper paddingBottom (30) + pill height (paddingVertical 7*2 + the
// Ajouter button's 40px minHeight) — the space the floating pill actually
// occupies from the bottom of the screen. Screens with their own fixed
// bottom content (e.g. item detail's claim CTA) use this to sit above it.
export const TAB_BAR_HEIGHT = 84;

type TabId = "home" | "declaration" | "settings";

export function TabBar() {
  const pathname = usePathname();
  const active: TabId = pathname === "/settings" ? "settings" : "home";

  const items: {
    id: TabId;
    label: string;
    icon: IconName;
    onPress: () => void;
  }[] = [
    {
      id: "home",
      label: "Accueil",
      icon: "layout-grid",
      onPress: () => {
        if (pathname !== "/") router.dismissTo("/");
      },
    },
    {
      id: "declaration",
      label: "Déclaration",
      icon: "shield-check",
      onPress: () => router.push("/declare"),
    },
    {
      id: "settings",
      label: "Réglages",
      icon: "settings",
      onPress: () => {
        if (pathname !== "/settings") router.push("/settings");
      },
    },
  ];

  return (
    <View style={styles.wrapper} pointerEvents="box-none">
      <LinearGradient
        colors={[color.bgApp, `${color.bgApp}00`]}
        style={styles.gradient}
        pointerEvents="none"
      />
      <View style={styles.pill}>
        <View style={styles.icons}>
          {items.map((item) => (
            <Pressable
              key={item.id}
              accessibilityRole="button"
              accessibilityLabel={item.label}
              onPress={() => {
                haptics.light();
                item.onPress();
              }}
              hitSlop={10}
              style={StyleSheet.flatten([
                styles.iconButton,
                active === item.id && styles.iconButtonActive,
              ])}
            >
              <Icon
                name={item.icon}
                size={22}
                color={active === item.id ? color.textOnDark : IDLE_COLOR}
                accessibilityLabel={item.label}
              />
            </Pressable>
          ))}
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
          onPress={() => {
            haptics.light();
            router.push("/add");
          }}
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
    padding: space[3] + 1,
    borderRadius: radius.pill,
    backgroundColor: color.bgInverse,
    ...shadowStyle.lift,
  },
  icons: {
    flex: 1,
    flexDirection: "row",
    gap: space[3],
    alignItems: "center",
  },
  iconButton: {
    aspectRatio: 1,
    height: "100%",
    borderRadius: 999,
    justifyContent: "center",
    alignItems: "center",
  },
  iconButtonActive: {
    backgroundColor: "rgba(252,250,246,0.1)",
  },
  addButton: {
    minHeight: 40,
  },
});
