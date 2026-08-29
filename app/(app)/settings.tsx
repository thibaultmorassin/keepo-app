import {
  SyncErrorState,
  useProfileInitials,
} from "@/components/home/HomeStates";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ComingSoonSheet } from "@/components/ui/ComingSoonSheet";
import { SegmentedControl } from "@/components/ui/SegmentedControl";
import { SettingsRow } from "@/components/ui/SettingsRow";
import { Switch } from "@/components/ui/Switch";
import { useSession } from "@/contexts/session";
import { color, space } from "@/theme/tokens";
import { fontFamily, type } from "@/theme/typography";
import { haptics } from "@/utils/haptics";
import {
  type ProfilePrefs,
  updateProfilePrefs,
  useProfilePrefs,
} from "@/utils/profile";
import Constants from "expo-constants";
import { router } from "expo-router";
import { useCallback, useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
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
    <View style={styles.skeleton}>
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

  const handleBack = useCallback(() => {
    haptics.light();
    router.back();
  }, []);

  const handleLogout = useCallback(async () => {
    haptics.medium();
    await signOut();
  }, [signOut]);

  const showLoading = isLoading && !prefs;
  const showSyncError = !!error && !prefs;

  const fullName = [prefs?.firstName, prefs?.lastName]
    .filter(Boolean)
    .join(" ");

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + space[11],
            paddingBottom: insets.bottom + 120,
          },
        ]}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.header}>
          <View style={styles.headerCopy}>
            <Text style={styles.eyebrow}>VOTRE COMPTE</Text>
            <Text style={styles.title}>Réglages</Text>
          </View>
        </View>

        {showLoading ? <SettingsSkeleton /> : null}

        {showSyncError ? (
          <SyncErrorState onRetry={() => void refetch()} />
        ) : null}

        {prefs && !showLoading && !showSyncError ? (
          <>
            <Card tone="plain" size="hero" style={styles.accountCard}>
              <View style={styles.avatar}>
                <Text style={styles.avatarInitials}>{initials}</Text>
              </View>
              <View style={styles.accountCopy}>
                <Text numberOfLines={1} style={styles.accountName}>
                  {fullName || "Votre compte"}
                </Text>
                <Text numberOfLines={1} style={styles.accountEmail}>
                  {session?.user.email}
                </Text>
              </View>
              <Badge status="free">Gratuit</Badge>
            </Card>

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>IDENTITÉ</Text>
              <Card pad={0} style={styles.rowsCard}>
                <View style={styles.rowWrapper}>
                  <SettingsRow
                    label="E-mail"
                    value={session?.user.email ?? "—"}
                    onPress={() => {
                      haptics.light();
                      setComingSoonLabel("E-mail");
                    }}
                  />
                </View>
                <View style={[styles.rowWrapper, styles.rowWrapperLast]}>
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

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>NOTIFICATIONS</Text>

              <Card
                pad={0}
                style={[
                  styles.rowsCard,
                  {
                    gap: space[6],
                    paddingTop: space[6],
                    paddingBottom: space[7],
                  },
                ]}
              >
                <View style={[{ gap: space[4] }]}>
                  <Text style={styles.groupLabel}>
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

            <View style={styles.section}>
              <Text style={styles.sectionLabel}>AIDE</Text>
              <Card pad={0} style={styles.rowsCard}>
                {AIDE_ROWS.map((row, index) => (
                  <View
                    key={row.label}
                    style={[
                      styles.rowWrapper,
                      index === AIDE_ROWS.length - 1
                        ? styles.rowWrapperLast
                        : null,
                    ]}
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

            <Text style={styles.version}>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[5],
    paddingTop: space[5],
  },
  headerCopy: {
    flex: 1,
  },
  eyebrow: {
    ...type.micro,
    color: color.textSecondary,
  },
  title: {
    ...type.display,
    color: color.textPrimary,
    marginTop: 3,
  },
  skeleton: {
    paddingVertical: space[10],
    alignItems: "center",
  },
  accountCard: {
    flexDirection: "row",
    alignItems: "center",
    gap: space[5],
  },
  avatar: {
    width: 48,
    height: 48,
    borderRadius: 999,
    backgroundColor: color.brandTint,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  avatarInitials: {
    ...type.heading,
    color: color.brandStrong,
    fontSize: 16,
    lineHeight: 19,
  },
  accountCopy: {
    flex: 1,
    minWidth: 0,
  },
  accountName: {
    ...type.body,
    fontFamily: fontFamily.sansSemiBold,
    fontWeight: "600",
    color: color.textPrimary,
  },
  accountEmail: {
    ...type.caption,
    color: color.textSecondary,
    marginTop: 2,
  },
  section: {
    gap: space[4],
  },
  sectionLabel: {
    ...type.micro,
    color: color.textSecondary,
  },
  rowsCard: {
    paddingHorizontal: space.padCardLg,
    paddingVertical: 6,
  },
  rowWrapper: {
    borderBottomWidth: 1,
    borderBottomColor: color.borderSubtle,
  },
  rowWrapperLast: {
    borderBottomWidth: 0,
  },
  group: {
    gap: space[4],
  },
  groupLabel: {
    ...type.body,
    fontWeight: "500",
    color: color.textPrimary,
  },
  version: {
    ...type.caption,
    color: color.textMuted,
    textAlign: "center",
  },
});
