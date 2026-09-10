import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Field } from "@/components/ui/Field";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { useSession } from "@/contexts/session";
import { color } from "@/theme/tokens";
import { SafeAreaView, ScrollView, Text, View } from "@/tw";
import { router } from "expo-router";
import { useState } from "react";
import { KeyboardAvoidingView, Platform } from "react-native";

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
            <Text className="type-micro text-secondary">Connexion</Text>
            <Text className="type-display text-primary">
              Ravi de vous revoir
            </Text>
          </View>

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
              secureTextEntry
              autoComplete="current-password"
              textContentType="password"
            />
          </Card>
        </ScrollView>

        <View className="gap-2 px-gutter pb-2">
          {error ? (
            <View className="rounded-input bg-claim-bg px-4 py-3">
              <Text className="type-body text-claim-fg">{error}</Text>
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
            size="lg"
            full
            onPress={() => router.push("/onboarding")}
          >
            Pas encore de compte ? Créer un compte
          </Button>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
