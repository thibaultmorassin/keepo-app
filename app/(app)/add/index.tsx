import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { color, radius, space } from "@/theme/tokens";
import { fontFamily, type } from "@/theme/typography";
import { haptics } from "@/utils/haptics";
import { router } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useReducedMotion,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const STAGGER = 40;
const FORWARDING_ADDRESS = "recu@keepo.app";

export default function AddChoiceScreen() {
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();

  const entering = reduceMotion
    ? (delay: number) => FadeIn.delay(delay).duration(220)
    : (delay: number) => FadeInDown.delay(delay).duration(220);

  const handleClose = useCallback(() => {
    haptics.light();
    router.back();
  }, []);

  const handleManual = useCallback(() => {
    haptics.light();
    router.push("/add/manual");
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: space[7],
            paddingBottom: insets.bottom + space[10],
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={entering(0)}>
          <IconButton label="Fermer" onPress={handleClose}>
            <Icon name="x" size={19} />
          </IconButton>
        </Animated.View>

        <Animated.View entering={entering(STAGGER)}>
          <Text style={styles.title}>Nouvel objet</Text>
          <Text style={styles.subtitle}>
            Le mieux, c&apos;est de le faire dans le magasin, ticket encore en
            main.
          </Text>
        </Animated.View>

        {/* Scan is designed but gated behind Pro — deliberately not pressable,
            so it never gives press feedback and then does nothing. */}
        <Animated.View entering={entering(STAGGER * 2)}>
          <Card tone="brand" size="hero" style={styles.scanCard}>
            <View style={styles.scanCircle} />
            <View style={styles.optionRow}>
              <View style={styles.optionIconInverse}>
                <Icon name="scan-line" size={24} color={color.textOnDark} />
              </View>
              <View style={styles.optionCopy}>
                <View style={styles.optionTitleRow}>
                  <Text style={[styles.optionTitle, styles.optionTitleOnDark]}>
                    Scanner le reçu
                  </Text>
                  <Badge
                    status="inverse"
                    icon={
                      <Icon
                        name="lock"
                        size={10}
                        strokeWidth={3}
                        color={color.textOnDark}
                      />
                    }
                  >
                    Pro
                  </Badge>
                </View>
                <Text style={[styles.optionBody, styles.optionBodyOnDark]}>
                  On lit le magasin, la date, le prix et la durée — vous
                  n&apos;avez plus qu&apos;à vérifier.
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={entering(STAGGER * 3)}>
          <Card tone="plain" size="hero" onPress={handleManual}>
            <View style={styles.optionRow}>
              <View style={styles.optionIconTint}>
                <Icon name="pencil" size={23} color={color.brandStrong} />
              </View>
              <View style={styles.optionCopy}>
                <Text style={styles.optionTitle}>Saisir à la main</Text>
                <Text style={styles.optionBody}>
                  Six champs, une minute. Vous pourrez ajouter le reçu plus
                  tard.
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={entering(STAGGER * 4)} style={styles.forward}>
          <Icon name="mail" size={19} color={color.brand} />
          <Text style={styles.forwardText}>
            Ou transférez le mail de confirmation à{" "}
            <Text style={styles.forwardAddress}>{FORWARDING_ADDRESS}</Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.bgApp,
  },
  content: {
    paddingHorizontal: space.gutterScreen,
    gap: space.gapSection,
  },
  title: {
    ...type.display,
    color: color.textPrimary,
  },
  subtitle: {
    ...type.bodyLg,
    color: color.textSecondary,
    marginTop: space[4],
    maxWidth: 290,
  },
  scanCard: {
    overflow: "hidden",
  },
  scanCircle: {
    position: "absolute",
    right: -40,
    bottom: -50,
    width: 150,
    height: 150,
    borderRadius: radius.pill,
    backgroundColor: "rgba(252,250,246,0.13)",
  },
  optionRow: {
    flexDirection: "row",
    gap: 14,
  },
  optionIconInverse: {
    width: 48,
    height: 48,
    flexShrink: 0,
    borderRadius: radius.pill,
    backgroundColor: "rgba(252,250,246,0.2)",
    alignItems: "center",
    justifyContent: "center",
  },
  optionIconTint: {
    width: 48,
    height: 48,
    flexShrink: 0,
    borderRadius: radius.pill,
    backgroundColor: color.brandTint,
    alignItems: "center",
    justifyContent: "center",
  },
  optionCopy: {
    flex: 1,
    minWidth: 0,
  },
  optionTitleRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[4],
    flexWrap: "wrap",
  },
  optionTitle: {
    fontFamily: fontFamily.displayBold,
    fontSize: 19,
    lineHeight: 23,
    fontWeight: "700",
    letterSpacing: -0.285,
    color: color.textPrimary,
  },
  optionTitleOnDark: {
    color: color.textOnDark,
  },
  optionBody: {
    ...type.body,
    color: color.textSecondary,
    marginTop: 5,
  },
  optionBodyOnDark: {
    color: color.textOnDark,
    opacity: 0.9,
  },
  forward: {
    flexDirection: "row",
    alignItems: "center",
    gap: 11,
    paddingVertical: 14,
    paddingHorizontal: space[6],
    borderRadius: radius.card,
    borderWidth: 1,
    borderStyle: "dashed",
    borderColor: color.borderStrong,
  },
  forwardText: {
    ...type.body,
    color: color.textSecondary,
    flex: 1,
  },
  forwardAddress: {
    fontFamily: fontFamily.sansSemiBold,
    fontWeight: "600",
    color: color.brandStrong,
  },
});
