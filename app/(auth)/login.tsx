import { useState } from "react";
import { router } from "expo-router";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { useSession } from "@/contexts/session";
import { color, space } from "@/theme/tokens";
import { type } from "@/theme/typography";

export default function LoginScreen() {
  const { signIn } = useSession();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const canSubmit = email.trim().length > 0 && password.length > 0;

  async function handleSubmit() {
    if (!canSubmit || loading) return;

    setLoading(true);
    setError(null);

    const result = await signIn(email.trim(), password);
    if (result.error) {
      setError(result.error);
    }

    setLoading(false);
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
            <Text style={styles.eyebrow}>Connexion</Text>
            <Text style={styles.title}>Ravi de vous revoir</Text>
          </View>

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
              secureTextEntry
              autoComplete="current-password"
              textContentType="password"
            />
          </Card>
        </ScrollView>

        <View style={styles.footer}>
          {error ? (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          ) : null}
          <Button
            variant="primary"
            size="lg"
            full
            disabled={!canSubmit}
            loading={loading}
            onPress={handleSubmit}
          >
            Se connecter
          </Button>
          <Button
            variant="ghost"
            size="md"
            full
            onPress={() => router.push("/signup")}
          >
            Pas encore de compte ? Créer un compte
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
  formCard: {
    gap: space[6],
  },
  footer: {
    paddingHorizontal: space.gutterScreen,
    paddingBottom: space[7],
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
