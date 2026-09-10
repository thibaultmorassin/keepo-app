import { OnboardingFooter } from "@/components/onboarding/OnboardingFooter";
import { OnboardingStepHeader } from "@/components/onboarding/OnboardingStepHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { ComingSoonSheet } from "@/components/ui/ComingSoonSheet";
import { Field } from "@/components/ui/Field";
import { useOnboardingDraft } from "@/contexts/onboardingDraft";
import { useSession } from "@/contexts/session";
import { ScrollView, Text, View } from "@/tw";
import { haptics } from "@/utils/haptics";
import { updateProfilePrefs } from "@/utils/profile";
import { observer } from "@legendapp/state/react";
import { router } from "expo-router";
import { useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const MIN_PASSWORD_LENGTH = 8;

function OnboardingCreateAccountScreen() {
  const insets = useSafeAreaInsets();

  const { signUp, checkEmailVerified } = useSession();
  const { firstName, lastName, email, setEmail, password, setPassword } =
    useOnboardingDraft();

  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);
  const [comingSoonLabel, setComingSoonLabel] = useState<string | null>(null);

  const passwordTooShort =
    password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const canSubmit =
    email.trim().length > 0 && password.length >= MIN_PASSWORD_LENGTH;

  async function handleSubmit() {
    if (!canSubmit || loading) return;

    setLoading(true);
    setError(null);
    setNeedsEmailConfirmation(false);

    const result = await signUp(
      email.trim(),
      password,
      firstName.trim(),
      lastName.trim(),
    );
    if (result.error) {
      setError(result.error);
    } else if (result.needsEmailConfirmation) {
      setNeedsEmailConfirmation(true);
    }

    setLoading(false);
  }

  async function handleRefreshVerification() {
    if (refreshing) return;

    setRefreshing(true);
    setError(null);
    setPendingVerification(false);

    const result = await checkEmailVerified(email.trim(), password);
    if (result.error) {
      setError(result.error);
    } else if (!result.verified) {
      setPendingVerification(true);
    } else if (result.userId) {
      // First authenticated moment for this account — the wizard's captured
      // names haven't landed on `profiles` until now.
      await updateProfilePrefs(result.userId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
    }

    setRefreshing(false);
  }

  return (
    <View
      className="flex-1 bg-app"
      style={{ paddingBottom: insets.bottom + 16 }}
    >
      <View className="px-gutter pb-3 pt-5">
        <OnboardingStepHeader step={3} onBack={() => router.back()} />
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="gap-section px-gutter pb-6 pt-3"
        keyboardShouldPersistTaps="handled"
        automaticallyAdjustKeyboardInsets
        showsVerticalScrollIndicator={false}
      >
        <View className="gap-1.5">
          <Text className="type-micro text-secondary">Dernière étape</Text>
          <Text className="type-title text-primary">Créez votre compte</Text>
          <Text className="type-body text-secondary">
            Gratuit, sans carte bancaire.
          </Text>
        </View>

        {needsEmailConfirmation ? (
          <View className="gap-1.5 rounded-card bg-brand-tint p-5">
            <Text className="type-heading text-brand-strong">
              Vérifiez votre boîte mail
            </Text>
            <Text className="type-body text-brand-strong">
              On vous a envoyé un lien. Ouvrez-le pour activer votre compte.
            </Text>
            {pendingVerification ? (
              <Text className="type-caption text-brand-strong opacity-[0.82]">
                Pas encore confirmé. Ouvrez le lien reçu par email.
              </Text>
            ) : null}
          </View>
        ) : (
          <>
            <Card tone="outline" className="gap-4">
              <Field
                label="Email"
                value={email}
                onChangeText={setEmail}
                placeholder="marie@exemple.fr"
                keyboardType="email-address"
                autoCapitalize="none"
                autoComplete="email"
                autoCorrect={false}
                textContentType="emailAddress"
              />
              <Field
                label="Mot de passe"
                value={password}
                onChangeText={setPassword}
                placeholder="••••••••"
                hint="8 caractères minimum"
                secureTextEntry
                autoComplete="new-password"
                textContentType="newPassword"
              />
              {passwordTooShort ? (
                <Text className="type-caption text-claim-fg">
                  Le mot de passe doit contenir au moins 8 caractères.
                </Text>
              ) : null}
            </Card>

            <View className="flex-row items-center gap-3">
              <View className="h-px flex-1 bg-line" />
              <Text className="type-caption text-muted">ou</Text>
              <View className="h-px flex-1 bg-line" />
            </View>

            <View className="gap-2.5">
              <Button
                variant="inverse"
                size="lg"
                full
                onPress={() => {
                  haptics.light();
                  setComingSoonLabel("Apple");
                }}
              >
                Continuer avec Apple
              </Button>
              <Button
                variant="secondary"
                size="lg"
                full
                onPress={() => {
                  haptics.light();
                  setComingSoonLabel("Google");
                }}
              >
                Continuer avec Google
              </Button>
            </View>
          </>
        )}
      </ScrollView>

      <OnboardingFooter>
        {error ? (
          <View className="rounded-input bg-claim-bg px-4 py-3">
            <Text className="type-body text-claim-fg">{error}</Text>
          </View>
        ) : null}
        {!needsEmailConfirmation ? (
          <Button
            variant="primary"
            size="lg"
            full
            disabled={!canSubmit}
            loading={loading}
            onPress={handleSubmit}
          >
            Créer mon compte
          </Button>
        ) : (
          <Button
            variant="primary"
            size="lg"
            full
            loading={refreshing}
            onPress={handleRefreshVerification}
          >
            Vérifier mon email
          </Button>
        )}
      </OnboardingFooter>

      <ComingSoonSheet
        visible={!!comingSoonLabel}
        label={comingSoonLabel ?? undefined}
        onClose={() => setComingSoonLabel(null)}
      />
    </View>
  );
}

export default observer(OnboardingCreateAccountScreen);
