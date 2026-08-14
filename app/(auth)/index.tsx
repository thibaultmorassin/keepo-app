import { router } from "expo-router";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import type { IconName } from "@/components/ui/Icon";
import { color, radius, shadowStyle, space } from "@/theme/tokens";
import { type } from "@/theme/typography";

const VALUE_ROWS: { icon: IconName; label: string }[] = [
  { icon: "receipt", label: "Le reçu ne se perd plus" },
  { icon: "bell-ring", label: "Un rappel avant la fin de la garantie" },
  { icon: "shield-check", label: "La réclamation rédigée pour vous" },
];

export default function LandingScreen() {
  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <Text style={styles.eyebrow}>Keepo</Text>
          <Text style={styles.title}>Vos garanties, au chaud</Text>
          <Text style={styles.body}>
            On garde vos reçus, on surveille les dates, et on écrit la
            réclamation quand ça casse.
          </Text>
        </View>

        <Card tone="brand" size="hero" style={styles.heroCard}>
          <View style={styles.heroCircle} />
          <View style={styles.heroContent}>
            <Text style={styles.heroEyebrow}>Votre tranquillité</Text>
            <Text style={styles.heroTitle}>
              Tous vos achats,{"\n"}un seul endroit
            </Text>
            <Text style={styles.heroBody}>
              Scannez ou saisissez un reçu en magasin. On s&apos;occupe du
              reste.
            </Text>
          </View>
        </Card>

        <View style={styles.valueList}>
          {VALUE_ROWS.map((row) => (
            <View key={row.label} style={styles.valueRow}>
              <View style={styles.valueIcon}>
                <Icon name={row.icon} size={20} color={color.brandStrong} />
              </View>
              <Text style={styles.valueLabel}>{row.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <LinearGradient
        colors={["transparent", color.bgApp]}
        locations={[0, 0.62]}
        style={styles.footerGradient}
        pointerEvents="box-none"
      >
        <View style={styles.footer}>
          <Button
            variant="primary"
            size="lg"
            full
            onPress={() => router.push("/signup")}
          >
            Créer un compte
          </Button>
          <Button
            variant="ghost"
            size="md"
            full
            onPress={() => router.push("/login")}
          >
            J&apos;ai déjà un compte
          </Button>
        </View>
      </LinearGradient>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.bgApp,
  },
  scrollContent: {
    paddingHorizontal: space.gutterScreen,
    paddingTop: space[8],
    paddingBottom: 180,
    gap: space.gapSection,
  },
  header: {
    gap: space[3],
  },
  eyebrow: {
    ...type.micro,
    color: color.textSecondary,
  },
  title: {
    ...type.display,
    color: color.textPrimary,
  },
  body: {
    ...type.body,
    color: color.textSecondary,
    marginTop: space[2],
  },
  heroCard: {
    overflow: "hidden",
    position: "relative",
  },
  heroCircle: {
    position: "absolute",
    right: -46,
    top: -46,
    width: 170,
    height: 170,
    borderRadius: radius.pill,
    backgroundColor: color.heroCircle,
  },
  heroContent: {
    position: "relative",
    gap: space[3],
  },
  heroEyebrow: {
    ...type.micro,
    color: color.textOnDark,
    opacity: 0.82,
  },
  heroTitle: {
    ...type.title,
    color: color.textOnDark,
    fontFamily: type.display.fontFamily,
    fontSize: 24,
    lineHeight: 28,
  },
  heroBody: {
    ...type.body,
    color: color.textOnDark,
    opacity: 0.88,
  },
  valueList: {
    gap: space.gapList,
  },
  valueRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[5],
    backgroundColor: color.bgCard,
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: space[6],
    ...shadowStyle.sm,
  },
  valueIcon: {
    width: 40,
    height: 40,
    borderRadius: 999,
    backgroundColor: color.brandTint,
    alignItems: "center",
    justifyContent: "center",
  },
  valueLabel: {
    ...type.body,
    color: color.textPrimary,
    flex: 1,
  },
  footerGradient: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingTop: space[10],
  },
  footer: {
    paddingHorizontal: space.gutterScreen,
    paddingBottom: space[7],
    gap: space[4],
  },
});
