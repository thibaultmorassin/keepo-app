import { StyleSheet, View } from "react-native";
import { color, radius, space } from "@/theme/tokens";

export function HomeSkeleton() {
  return (
    <View style={styles.container}>
      <View style={[styles.block, styles.hero]} />
      <View style={[styles.block, styles.row]} />
      <View style={[styles.block, styles.row]} />
      <View style={[styles.block, styles.row]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: space.gapSection,
  },
  block: {
    backgroundColor: color.bgSunken,
    borderRadius: radius.card,
  },
  hero: {
    height: 196,
    borderRadius: radius.hero,
  },
  row: {
    height: 72,
  },
});
