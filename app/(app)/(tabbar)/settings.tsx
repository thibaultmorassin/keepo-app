import {
  SyncErrorState,
  useProfileInitials,
} from "@/components/home/HomeStates";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ComingSoonSheet } from "@/components/ui/ComingSoonSheet";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { ScreenBackButton } from "@/components/ui/ScreenBackButton";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { Switch } from "@/components/ui/Switch";
import { useSession } from "@/contexts/session";
import { color } from "@/theme/tokens";
import { ScrollView, Text, View } from "@/tw";
import { haptics } from "@/utils/haptics";
import {
  type ProfilePrefs,
  updateProfilePrefs,
  useProfilePrefs,
} from "@/utils/profile";
import Constants from "expo-constants";
import { useCallback, useState } from "react";
import { ActivityIndicator, Alert } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const REMINDER_OPTIONS = ["7j", "30j", "60j", "90j"] as const;
type ReminderLabel = (typeof REMINDER_OPTIONS)[number];
const REMINDER_TO_LABEL: Record<number, ReminderLabel> = {
  7: "7j",
  30: "30j",
  60: "60j",
  90: "90j",
};
const LABEL_TO_REMINDER: Record<ReminderLabel, number> = {
  "7j": 7,
  "30j": 30,
  "60j": 60,
  "90j": 90,
};

const AIDE_ROWS = [
  { icon: "life-buoy", label: "Centre d'aide" },
  {
    icon: "message-circle",
    label: "Écrire à l'équipe",
    meta: "Réponse en 1 jour",
  },
  { icon: "shield-check", label: "Vos droits de garantie en France" },
  { icon: "download", label: "Exporter tous vos reçus" },
  { icon: "file-text", label: "Confidentialité et conditions" },
] as const;

function SettingsSkeleton() {
  return (
    <View className="items-center py-10">
      <ActivityIndicator color={color.brand} />
    </View>
  );
}

export default function SettingsScreen() {
  const insets = useSafeAreaInsets();
  const { session, signOut } = useSession();
  const userId = session?.user.id;

  const { prefs, setPrefs, isLoading, error, refetch } =
    useProfilePrefs(userId);
  const initials = useProfileInitials(userId, session?.user.email);

  const [comingSoonLabel, setComingSoonLabel] = useState<string | null>(null);

  const updatePref = useCallback(
    <K extends keyof ProfilePrefs>(key: K, value: ProfilePrefs[K]) => {
      if (!prefs || !userId) return;
      const previous = prefs;
      setPrefs({ ...prefs, [key]: value });
      void updateProfilePrefs(userId, {
        [key]: value,
      } as Partial<ProfilePrefs>).then(({ error: updateError }) => {
        if (updateError) setPrefs(previous);
      });
    },
    [prefs, userId, setPrefs],
  );

  const handleLogout = useCallback(async () => {
    haptics.medium();
    Alert.alert(
      "Déconnexion",
      "Êtes-vous sûr de vouloir vous déconnecter de l'application ?",
      [
        {
          text: "Annuler",
          onPress: () => {
            return;
          },
        },
        {
          text: "Se déconnecter",
          onPress: async () => {
            await signOut();
          },
          style: "destructive",
        },
      ],
    );
  }, [signOut]);

  const showLoading = isLoading && !prefs;
  const showSyncError = !!error && !prefs;

  const fullName = [prefs?.firstName, prefs?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <View className="flex-1 bg-app">
      <ScrollView
        contentContainerClassName="gap-section px-gutter"
        contentContainerStyle={{
          paddingTop: insets.top + 56,
          paddingBottom: insets.bottom + 120,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3 pt-3">
          <View className="flex-1">
            <Text className="type-micro text-secondary">VOTRE COMPTE</Text>
            <Text className="type-display mt-[3px] text-primary">Réglages</Text>
          </View>
        </View>

        {showLoading ? <SettingsSkeleton /> : null}

        {showSyncError ? (
          <SyncErrorState onRetry={() => void refetch()} />
        ) : null}

        {prefs && !showLoading && !showSyncError ? (
          <>
            <Card tone="plain" size="hero" className="flex-row items-center gap-3">
              <View className="size-12 shrink-0 items-center justify-center rounded-full bg-brand-tint">
                <Text className="type-heading text-[16px]/[19px] text-brand-strong">
                  {initials}
                </Text>
              </View>
              <View className="min-w-0 flex-1">
                <Text
                  numberOfLines={1}
                  className="type-body-semibold text-primary"
                >
                  {fullName || "Votre compte"}
                </Text>
                <Text
                  numberOfLines={1}
                  className="type-caption mt-0.5 text-secondary"
                >
                  {session?.user.email}
                </Text>
              </View>
              <Badge status="free">Gratuit</Badge>
            </Card>

            <View className="gap-2">
              <Text className="type-micro text-secondary">IDENTITÉ</Text>
              <Card pad={0} className="px-card-lg py-1.5">
                <View className="border-b border-line">
                  <SettingsRow
                    label="E-mail"
                    value={session?.user.email ?? "—"}
                    onPress={() => {
                      haptics.light();
                      setComingSoonLabel("E-mail");
                    }}
                  />
                </View>
                <View>
                  <SettingsRow
                    label="Mot de passe"
                    onPress={() => {
                      haptics.light();
                      setComingSoonLabel("Mot de passe");
                    }}
                  />
                </View>
              </Card>
            </View>

            <View className="gap-2">
              <Text className="type-micro text-secondary">NOTIFICATIONS</Text>

              <Card pad={0} className="gap-4 px-card-lg pb-5 pt-4">
                <View className="gap-2">
                  <Text className="type-body-medium text-primary">
                    Me prévenir avant la fin d&apos;une garantie
                  </Text>
                  <SegmentedControl
                    options={REMINDER_OPTIONS}
                    value={REMINDER_TO_LABEL[prefs.reminderDaysBefore] ?? null}
                    onChange={(label) => {
                      haptics.light();
                      updatePref(
                        "reminderDaysBefore",
                        LABEL_TO_REMINDER[label],
                      );
                    }}
                  />
                </View>
                <Card tone="tint">
                  <Switch
                    value={prefs.claimFollowupRemindersEnabled}
                    onValueChange={(next) => {
                      haptics.light();
                      updatePref("claimFollowupRemindersEnabled", next);
                    }}
                    label="Relance des réclamations"
                    description="Si le magasin n'a pas répondu sous 7 jours"
                  />
                </Card>

                <Card tone="tint">
                  <Switch
                    value={prefs.storeAddRemindersEnabled}
                    onValueChange={(next) => {
                      haptics.light();
                      updatePref("storeAddRemindersEnabled", next);
                    }}
                    label="Rappel d'ajout en magasin"
                    description="Une seule fois, le jour d'un achat détecté"
                  />
                </Card>

                <Card tone="tint">
                  <Switch
                    value={prefs.appNewsEnabled}
                    onValueChange={(next) => {
                      haptics.light();
                      updatePref("appNewsEnabled", next);
                    }}
                    label="Nouveautés de l'app"
                    description="Deux ou trois fois par an, pas plus"
                  />
                </Card>
              </Card>
            </View>

            <View className="gap-2">
              <Text className="type-micro text-secondary">AIDE</Text>
              <Card pad={0} className="px-card-lg py-1.5">
                {AIDE_ROWS.map((row, index) => (
                  <View
                    key={row.label}
                    className={
                      index === AIDE_ROWS.length - 1 ? "" : "border-b border-line"
                    }
                  >
                    <SettingsRow
                      icon={row.icon}
                      label={row.label}
                      meta={"meta" in row ? row.meta : undefined}
                      onPress={() => {
                        haptics.light();
                        setComingSoonLabel(row.label);
                      }}
                    />
                  </View>
                ))}
              </Card>
            </View>

            <Button
              variant="secondary"
              size="lg"
              full
              onPress={() => void handleLogout()}
            >
              Se déconnecter
            </Button>

            <Text className="type-caption text-center text-muted">
              Keepo {Constants.expoConfig?.version ?? "1.0.0"}
            </Text>
          </>
        ) : null}
      </ScrollView>

      <ComingSoonSheet
        visible={!!comingSoonLabel}
        label={comingSoonLabel ?? undefined}
        onClose={() => setComingSoonLabel(null)}
      />

      <ScreenBackButton />
    </View>
  );
}

