import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { useSession } from "@/contexts/session";
import { color, space } from "@/theme/tokens";
import { type } from "@/theme/typography";
import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const MIN_PASSWORD_LENGTH = 8;

export default function SignupScreen() {
  const { signUp, checkEmailVerified } = useSession();

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
    email.trim().length > 0 && password.length >= MIN_PASSWORD_LENGTH;

  async function handleSubmit() {
    if (!canSubmit || loading) return;

    setLoading(true);
    setError(null);
    setNeedsEmailConfirmation(false);

    const result = await signUp(email.trim(), password);
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
    }

    setRefreshing(false);
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <KeyboardAvoidingView
        style={styles.flex}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.topRow}>
            <IconButton
              label="Retour"
              variant="surface"
              onPress={() => router.back()}
            >
              <Icon name="chevron-left" size={20} color={color.textPrimary} />
            </IconButton>
          </View>

          <View style={styles.header}>
            <Text style={styles.eyebrow}>Inscription</Text>
            <Text style={styles.title}>Créer un compte</Text>
            <Text style={styles.body}>
              Une minute, et le premier reçu est à l&apos;abri.
            </Text>
          </View>

          {needsEmailConfirmation ? (
            <View style={styles.confirmationBox}>
              <Text style={styles.confirmationTitle}>
                Vérifiez votre boîte mail
              </Text>
              <Text style={styles.confirmationBody}>
                On vous a envoyé un lien. Ouvrez-le pour activer votre compte.
              </Text>
              {pendingVerification ? (
                <Text style={styles.pendingText}>
                  Pas encore confirmé. Ouvrez le lien reçu par email.
                </Text>
              ) : null}
            </View>
          ) : (
            <Card tone="outline" style={styles.formCard}>
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
                <Text style={styles.inlineError}>
                  Le mot de passe doit contenir au moins 8 caractères.
                </Text>
              ) : null}
            </Card>
          )}
        </ScrollView>

        <View style={styles.footer}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
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

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: color.bgApp,
  },
  flex: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: space.gutterScreen,
    paddingTop: space[4],
    paddingBottom: space[8],
    gap: space.gapSection,
  },
  topRow: {
    alignSelf: "flex-start",
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
  },
  formCard: {
    gap: space[6],
  },
  inlineError: {
    ...type.caption,
    color: color.actionClaimFg,
  },
  confirmationBox: {
    backgroundColor: color.brandTint,
    borderRadius: 22,
    padding: space[7],
    gap: space[3],
  },
  confirmationTitle: {
    ...type.heading,
    color: color.brandStrong,
  },
  confirmationBody: {
    ...type.body,
    color: color.brandStrong,
  },
  pendingText: {
    ...type.caption,
    color: color.brandStrong,
    opacity: 0.82,
  },
  footer: {
    paddingHorizontal: space.gutterScreen,
    paddingBottom: space[4],
    gap: space[4],
  },
  errorBox: {
    backgroundColor: color.actionClaimBg,
    borderRadius: 14,
    paddingVertical: space[5],
    paddingHorizontal: space[6],
  },
  errorText: {
    ...type.body,
    color: color.actionClaimFg,
  },
});
