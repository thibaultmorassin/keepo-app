import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { useSession } from "@/contexts/session";
import { color } from "@/theme/tokens";
import { SafeAreaView, ScrollView, Text, View } from "@/tw";
import { updateProfilePrefs } from "@/utils/profile";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

const MIN_PASSWORD_LENGTH = 8;

export default function SignupScreen() {
  const { signUp, checkEmailVerified } = useSession();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [needsEmailConfirmation, setNeedsEmailConfirmation] = useState(false);
  const [pendingVerification, setPendingVerification] = useState(false);

  const passwordTooShort =
    password.length > 0 && password.length < MIN_PASSWORD_LENGTH;
  const canSubmit =
    firstName.trim().length > 0 &&
    lastName.trim().length > 0 &&
    email.trim().length > 0 &&
    password.length >= MIN_PASSWORD_LENGTH;

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
      // First authenticated moment for this account — the signup form's
      // names haven't landed on `profiles` until now.
      await updateProfilePrefs(result.userId, {
        firstName: firstName.trim(),
        lastName: lastName.trim(),
      });
    }

    setRefreshing(false);
  }

  return (
    <SafeAreaView className="flex-1 bg-app">
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerClassName="gap-section px-gutter pb-6 pt-2"
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View className="self-start">
            <IconButton
              label="Retour"
              variant="surface"
              onPress={() => router.back()}
            >
              <Icon name="chevron-left" size={20} color={color.textPrimary} />
            </IconButton>
          </View>

          <View className="gap-1.5">
            <Text className="type-micro text-secondary">Inscription</Text>
            <Text className="type-display text-primary">Créer un compte</Text>
            <Text className="type-body text-secondary">
              Une minute, et le premier reçu est à l&apos;abri.
            </Text>
          </View>

          {needsEmailConfirmation ? (
            <View className="gap-1.5 rounded-[22px] bg-brand-tint p-5">
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
            <Card tone="outline" className="gap-4">
              <View className="flex-row gap-2.5">
                <Field
                  label="Prénom"
                  value={firstName}
                  onChangeText={setFirstName}
                  placeholder="Marie"
                  autoCapitalize="words"
                  autoComplete="given-name"
                  textContentType="givenName"
                  className="min-w-0 flex-1"
                />
                <Field
                  label="Nom"
                  value={lastName}
                  onChangeText={setLastName}
                  placeholder="Dupont"
                  autoCapitalize="words"
                  autoComplete="family-name"
                  textContentType="familyName"
                  className="min-w-0 flex-1"
                />
              </View>
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
          )}
        </ScrollView>

        <View className="gap-2 px-gutter pb-2">
          {error ? (
            <View className="rounded-[14px] bg-claim-bg px-4 py-3">
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
          <Button
            variant="ghost"
            size="lg"
            full
            onPress={() => router.push("/login")}
          >
            J&apos;ai déjà un compte
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

