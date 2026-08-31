import { Badge } from "@/components/ui/Badge";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { color } from "@/theme/tokens";
import { ScrollView, Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import { haptics } from "@/utils/haptics";
import { router } from "expo-router";
import { useCallback } from "react";
import { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";
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
    <View className="flex-1 bg-app">
      <ScrollView
        contentContainerClassName="gap-section px-gutter pt-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <Animated.View entering={entering(0)}>
          <IconButton label="Fermer" onPress={handleClose}>
            <Icon name="x" size={19} />
          </IconButton>
        </Animated.View>

        <Animated.View entering={entering(STAGGER)}>
          <Text className="type-display text-primary">Nouvel objet</Text>
          <Text className="type-body-lg mt-2 max-w-[290px] text-secondary">
            Le mieux, c&apos;est de le faire dans le magasin, ticket encore en
            main.
          </Text>
        </Animated.View>

        {/* Scan is designed but gated behind Pro — deliberately not pressable,
            so it never gives press feedback and then does nothing. */}
        <Animated.View entering={entering(STAGGER * 2)}>
          <Card tone="brand" size="hero" className="overflow-hidden">
            <View className="absolute -bottom-[50px] -right-10 size-[150px] rounded-pill bg-on-dark/13" />
            <View className="flex-row gap-3.5">
              <View className="size-12 shrink-0 items-center justify-center rounded-pill bg-on-dark/20">
                <Icon name="scan-line" size={24} color={color.textOnDark} />
              </View>
              <View className="min-w-0 flex-1">
                <View className="flex-row flex-wrap items-center gap-2">
                  <Text className="font-display-bold text-[19px]/[23px] font-bold tracking-[-0.285px] text-on-dark">
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
                <Text className="type-body mt-[5px] text-on-dark opacity-90">
                  On lit le magasin, la date, le prix et la durée — vous
                  n&apos;avez plus qu&apos;à vérifier.
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View entering={entering(STAGGER * 3)}>
          <Card tone="plain" size="hero" onPress={handleManual}>
            <View className="flex-row gap-3.5">
              <View className="size-12 shrink-0 items-center justify-center rounded-pill bg-brand-tint">
                <Icon name="pencil" size={23} color={color.brandStrong} />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="font-display-bold text-[19px]/[23px] font-bold tracking-[-0.285px] text-primary">Saisir à la main</Text>
                <Text className="type-body mt-[5px] text-secondary">
                  Six champs, une minute. Vous pourrez ajouter le reçu plus
                  tard.
                </Text>
              </View>
            </View>
          </Card>
        </Animated.View>

        <Animated.View
          entering={entering(STAGGER * 4)}
          className="flex-row items-center gap-[11px] rounded-card border border-dashed border-line-strong px-4 py-3.5"
        >
          <Icon name="mail" size={19} color={color.brand} />
          <Text className="type-body flex-1 text-secondary">
            Ou transférez le mail de confirmation à{" "}
            <Text className="font-sans-semibold font-semibold text-brand-strong">
              {FORWARDING_ADDRESS}
            </Text>
          </Text>
        </Animated.View>
      </ScrollView>
    </View>
  );
}

