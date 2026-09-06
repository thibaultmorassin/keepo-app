import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { useSession } from "@/contexts/session";
import { color } from "@/theme/tokens";
import { Pressable, ScrollView, Text, View } from "@/tw";
import type { Tables } from "@/utils/database.types";
import {
  claimIssueGroupIcon,
  daysSinceSentLabel,
} from "@/utils/claims";
import { haptics } from "@/utils/haptics";
import { ownedClaims, ownedItems } from "@/utils/ownership";
import { claims$, items$ } from "@/utils/SupaLegend";
import { syncState } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import { router } from "expo-router";
import { useMemo } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type Claim = Tables<"claims">;

/**
 * Every claim in the store was already sent (see `createClaim`) — "pending"
 * simply means it hasn't been marked resolved yet, i.e. still waiting on a
 * reply from the seller or manufacturer.
 */
function isPending(claim: Claim): boolean {
  return !claim.deleted && claim.sent_at != null && claim.resolved_at == null;
}

function ClaimsScreen() {
  const insets = useSafeAreaInsets();
  const { session } = useSession();

  const claimsState = syncState(claims$);
  const itemsState = syncState(items$);

  const claimsRecord = ownedClaims(session?.user.id);
  const itemsRecord = ownedItems(session?.user.id);

  const pendingClaims = useMemo(() => {
    return Object.values(claimsRecord ?? {})
      .filter(isPending)
      .sort((a, b) => (b.sent_at ?? "").localeCompare(a.sent_at ?? ""));
  }, [claimsRecord]);

  const isPersistLoaded =
    claimsState.isPersistLoaded.get() && itemsState.isPersistLoaded.get();

  const handleBack = () => {
    haptics.light();
    router.back();
  };

  const handleOpenClaim = (claim: Claim) => {
    haptics.light();
    router.push(`/items/${claim.item_id}`);
  };

  return (
    <View className="flex-1 bg-app">
      <ScrollView
        contentContainerClassName="gap-4 px-gutter"
        contentContainerStyle={{
          paddingTop: insets.top + 20,
          paddingBottom: insets.bottom + 40,
        }}
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-center gap-3">
          <IconButton label="Retour" onPress={handleBack}>
            <Icon name="chevron-left" size={19} />
          </IconButton>
          <Text className="type-heading flex-1 text-primary">
            Réclamations en cours
          </Text>
        </View>

        {!isPersistLoaded ? null : pendingClaims.length === 0 ? (
          <EmptyState
            title="Aucune réclamation en cours"
            body="Les réclamations envoyées et en attente de réponse apparaîtront ici."
            icon={<Icon name="mail" size={24} color={color.brandStrong} />}
            action={null}
          />
        ) : (
          <View className="gap-2">
            {pendingClaims.map((claim) => {
              const item = itemsRecord?.[claim.item_id];
              return (
                <Pressable
                  key={claim.id}
                  accessibilityRole="button"
                  className="flex-row items-center gap-3 rounded-card bg-card p-3 shadow-sm active:opacity-80"
                  onPress={() => handleOpenClaim(claim)}
                >
                  <View className="size-11 shrink-0 items-center justify-center rounded-full bg-claim-bg">
                    <Icon
                      name={claimIssueGroupIcon(claim.issue_group)}
                      size={19}
                      color={color.brandStrong}
                    />
                  </View>
                  <View className="min-w-0 flex-1">
                    <Text
                      className="type-body-semibold text-primary"
                      numberOfLines={1}
                    >
                      {item?.title ?? "Objet supprimé"}
                    </Text>
                    <Text
                      className="type-caption mt-0.5 text-muted"
                      numberOfLines={1}
                    >
                      {claim.issue} · {claim.recipient}
                    </Text>
                    {claim.sent_at ? (
                      <Text className="type-caption mt-0.5 text-secondary">
                        {daysSinceSentLabel(claim.sent_at)}
                      </Text>
                    ) : null}
                  </View>
                  <Icon
                    name="chevron-right"
                    size={18}
                    color={color.textMuted}
                  />
                </Pressable>
              );
            })}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

export default observer(ClaimsScreen);
