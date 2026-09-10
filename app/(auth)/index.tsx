import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import type { IconName } from "@/components/ui/Icon";
import { Icon } from "@/components/ui/Icon";
import { color } from "@/theme/tokens";
import { ScrollView, Text, View } from "@/tw";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const VALUE_ROWS: { icon: IconName; label: string }[] = [
  { icon: "receipt", label: "Le reçu ne se perd plus" },
  { icon: "bell-ring", label: "Un rappel avant la fin de la garantie" },
  { icon: "shield-check", label: "La réclamation rédigée pour vous" },
];

export default function LandingScreen() {
  const { top, bottom } = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-app">
      <ScrollView
        contentContainerClassName="grow gap-section px-gutter pb-[180px]"
        contentContainerStyle={{ paddingTop: top + 24 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1.5">
          <Text className="type-micro text-secondary">Keepo</Text>
          <Text className="type-display text-primary">
            Vos garanties, au chaud
          </Text>
          <Text className="type-body mt-1 text-secondary">
            On garde vos reçus, on surveille les dates, et on écrit la
            réclamation quand ça casse.
          </Text>
        </View>

        <Card tone="brand" size="hero" className="relative overflow-hidden">
          <View className="absolute -right-11.5 -top-11.5 size-42.5 rounded-pill bg-on-dark/12" />
          <View className="relative gap-1.5">
            <Text className="type-micro text-on-dark opacity-[0.82]">
              Votre tranquillité
            </Text>
            <Text className="type-title font-display-bold text-[24px]/[28px] text-on-dark">
              Tous vos achats,{"\n"}un seul endroit
            </Text>
            <Text className="type-body text-on-dark opacity-[0.88]">
              Scannez ou saisissez un reçu en magasin. On s&apos;occupe du
              reste.
            </Text>
          </View>
        </Card>

        <View className="gap-list">
          {VALUE_ROWS.map((row) => (
            <View
              key={row.label}
              className="flex-row items-center gap-3 rounded-tile bg-card px-4 py-3.5 shadow-sm"
            >
              <View className="size-10 items-center justify-center rounded-full bg-brand-tint">
                <Icon name={row.icon} size={20} color={color.brandStrong} />
              </View>
              <Text className="type-body flex-1 text-primary">{row.label}</Text>
            </View>
          ))}
        </View>
      </ScrollView>

      <LinearGradient
        colors={["transparent", color.paper3]}
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          height: 200,
          opacity: 0.5,
        }}
        pointerEvents="box-none"
      />
      <View
        className="absolute inset-x-0 gap-2 px-gutter pb-2"
        style={{ bottom }}
      >
        <Button
          variant="primary"
          size="lg"
          full
          onPress={() => router.push("/onboarding")}
        >
          Créer un compte
        </Button>
        <Button
          variant="secondary"
          size="lg"
          full
          onPress={() => router.push("/login")}
        >
          J&apos;ai déjà un compte
        </Button>
      </View>
    </View>
  );
}
