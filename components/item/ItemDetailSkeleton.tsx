import { StyleSheet, View } from "react-native";
import { color, radius, space } from "@/theme/tokens";

export function ItemDetailSkeleton() {
  return (
    <View style={styles.container}>
      <View style={styles.heroRow}>
        <View style={[styles.block, styles.tile]} />
        <View style={styles.heroCopy}>
          <View style={[styles.block, styles.title]} />
          <View style={[styles.block, styles.subtitle]} />
        </View>
      </View>
      <View style={[styles.block, styles.coverage]} />
      <View style={styles.actions}>
        <View style={[styles.block, styles.action]} />
        <View style={[styles.block, styles.action]} />
        <View style={[styles.block, styles.action]} />
      </View>
      <View style={[styles.block, styles.specs]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space[6],
  },
  heroRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  heroCopy: {
    flex: 1,
    gap: space[4],
  },
  block: {
    backgroundColor: color.bgSunken,
    borderRadius: radius.card,
  },
  tile: {
    width: 78,
    height: 78,
    borderRadius: radius.pill,
  },
  title: {
    height: 24,
    width: "80%",
  },
  subtitle: {
    height: 16,
    width: "55%",
  },
  coverage: {
    height: 88,
    borderRadius: radius.card,
  },
  actions: {
    flexDirection: "row",
    gap: 10,
  },
  action: {
    flex: 1,
    height: 96,
  },
  specs: {
    height: 156,
  },
});
