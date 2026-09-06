import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { ItemRow } from "@/components/ui/ItemRow";
import { useClaimDraft } from "@/contexts/claimDraft";
import { color } from "@/theme/tokens";
import { ScrollView, Text, TextInput, View } from "@/tw";
import type { Tables } from "@/utils/database.types";
import { haptics } from "@/utils/haptics";
import { items$ } from "@/utils/SupaLegend";
import {
  categoryIcon,
  itemMeta,
  remainingLabel,
  statusOf,
} from "@/utils/warranty";
import { syncState } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import { router } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function DeclareItemPickerScreen() {
  const insets = useSafeAreaInsets();
  const { setItemId, reset } = useClaimDraft();
  const [query, setQuery] = useState("");

  const itemsState = syncState(items$);
  const itemsRecord = items$.get() as
    | Record<string, Tables<"items">>
    | undefined;

  const items = useMemo(
    () => Object.values(itemsRecord ?? {}).filter((item) => !item.deleted),
    [itemsRecord],
  );

  const shownItems = useMemo(() => {
    const trimmed = query.trim().toLowerCase();
    if (!trimmed) return items;
    return items.filter((item) => item.title.toLowerCase().includes(trimmed));
  }, [items, query]);

  const isPersistLoaded = itemsState.isPersistLoaded.get();
  const hasNoItems = isPersistLoaded && items.length === 0;
  const hasNoResults = !hasNoItems && shownItems.length === 0;

  const handleClose = useCallback(() => {
    haptics.light();
    reset();
    router.back();
  }, [reset]);

  const handlePick = useCallback(
    (id: string) => {
      haptics.light();
      setItemId(id);
      router.push("/declare/issue");
    },
    [setItemId],
  );

  return (
    <View className="flex-1 bg-app">
      <View className="gap-section bg-app px-gutter pt-5 pb-3">
        <IconButton label="Fermer" onPress={handleClose}>
          <Icon name="x" size={19} />
        </IconButton>

        <View>
          <Text className="type-display text-primary">Quel objet ?</Text>
          <Text className="type-body-lg mt-2 text-secondary">
            Choisissez ce qui a un problème.
          </Text>
        </View>

        {!hasNoItems ? (
          <View className="flex-row items-center gap-2 rounded-pill bg-sunken px-3.5 py-2.75">
            <Icon name="search" size={18} color={color.textMuted} />
            <TextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Rechercher un objet"
              placeholderTextColor={color.textMuted}
              autoCapitalize="none"
              autoCorrect={false}
              className="flex-1 font-sans text-[14.5px] text-primary"
            />
          </View>
        ) : null}
      </View>

      <ScrollView
        contentContainerClassName="gap-section px-gutter"
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
      >
        {hasNoItems ? (
          <EmptyState
            title="Rien à déclarer pour l'instant"
            body="Ajoutez d'abord un objet à votre garde."
            icon={<Icon name="shield-check" size={24} color={color.brand} />}
            action={
              <Button
                size="md"
                onPress={() => {
                  haptics.light();
                  router.replace("/add");
                }}
              >
                Ajouter un objet
              </Button>
            }
          />
        ) : hasNoResults ? (
          <Text className="type-body mt-4 text-center text-secondary">
            Aucun objet ne correspond à « {query.trim()} ».
          </Text>
        ) : (
          <View className="gap-list">
            {shownItems.map((item) => {
              const status = statusOf(item.warranty_end_date);
              return (
                <ItemRow
                  key={item.id}
                  name={item.title}
                  meta={itemMeta(item)}
                  status={status ?? "unknown"}
                  remaining={remainingLabel(item.warranty_end_date)}
                  icon={
                    <Icon
                      name={categoryIcon(item.category)}
                      size={24}
                      color={
                        status === "expiring"
                          ? color.statusExpiringFg
                          : status === "expired" || !status
                            ? color.statusExpiredFg
                            : color.statusCoveredFg
                      }
                    />
                  }
                  onPress={() => handlePick(item.id)}
                />
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default observer(DeclareItemPickerScreen);
