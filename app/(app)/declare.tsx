import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { ScrollView, Text, View } from "@/tw";
import { haptics } from "@/utils/haptics";
import { router } from "expo-router";
import { useCallback } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function DeclareScreen() {
  const insets = useSafeAreaInsets();

  const handleClose = useCallback(() => {
    haptics.light();
    router.back();
  }, []);

  return (
    <View className="flex-1 bg-app">
      <ScrollView
        contentContainerClassName="gap-section px-gutter pt-5"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        showsVerticalScrollIndicator={false}
      >
        <IconButton label="Fermer" onPress={handleClose}>
          <Icon name="x" size={19} />
        </IconButton>

        <Text className="type-display text-primary">Déclarer un problème</Text>
        <Text className="type-body-lg text-secondary">Bientôt disponible.</Text>
      </ScrollView>
    </View>
  );
}

