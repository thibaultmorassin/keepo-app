import { Button } from "@/components/ui/Button";
import { Icon } from "@/components/ui/Icon";
import { color, radius, shadowStyle, space } from "@/theme/tokens";
import { LinearGradient } from "expo-linear-gradient";
import { StyleSheet, View } from "react-native";

type TabBarProps = {
  onAdd?: () => void;
};

export function TabBar({ onAdd }: TabBarProps) {
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
          <Icon
            name="layout-grid"
            size={21}
            color={color.textOnDark}
            accessibilityLabel="Accueil"
          />
          <Icon
            name="shield-check"
            size={21}
            color="rgba(252,250,246,0.45)"
            accessibilityLabel="Garanties"
          />
          <Icon
            name="settings"
            size={21}
            color="rgba(252,250,246,0.45)"
            accessibilityLabel="Réglages"
          />
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
