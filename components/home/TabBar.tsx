import { Button } from "@/components/ui/Button";
import { Icon, type IconName } from "@/components/ui/Icon";
import { color } from "@/theme/tokens";
import { Pressable, View } from "@/tw";
import { haptics } from "@/utils/haptics";
import clsx from "clsx";
import { LinearGradient } from "expo-linear-gradient";
import { router, usePathname } from "expo-router";

const IDLE_COLOR = "rgba(252,250,246,0.45)";

// Wrapper paddingBottom (30) + pill height (padding 7*2 + the Ajouter button's
// 40px minHeight) — the space the floating pill actually occupies from the
// bottom of the screen. Screens with their own fixed bottom content (e.g. item
// detail's claim CTA) use this to sit above it.
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
    <View
      className="absolute inset-x-0 bottom-0 px-5 pb-7.5"
      pointerEvents="box-none"
    >
      <LinearGradient
        colors={[color.bgApp, `${color.bgApp}00`]}
        style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}
        pointerEvents="none"
      />
      <View className="flex-row items-center gap-2 rounded-pill bg-inverse p-1.75 shadow-lift">
        <View className="flex-1 flex-row items-center gap-1.5">
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
              className={clsx(
                "aspect-square h-full items-center justify-center transition-all active:scale-[95%] rounded-full",
                active === item.id && "bg-on-dark/10",
              )}
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
          className="min-h-10"
        >
          Ajouter
        </Button>
      </View>
    </View>
  );
}
