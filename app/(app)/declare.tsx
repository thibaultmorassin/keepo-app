import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { color, space } from "@/theme/tokens";
import { type } from "@/theme/typography";
import { haptics } from "@/utils/haptics";
import { router } from "expo-router";
import { useCallback } from "react";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DeclareScreen() {
  const insets = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    haptics.light();
    router.back();
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
        <IconButton label="Fermer" onPress={handleClose}>
          <Icon name="x" size={19} />
        </IconButton>

        <Text style={styles.title}>Déclarer un problème</Text>
        <Text style={styles.subtitle}>Bientôt disponible.</Text>
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
  },
});
