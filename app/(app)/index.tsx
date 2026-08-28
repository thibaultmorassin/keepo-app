import { CoverageHero } from "@/components/home/CoverageHero";
import { ExpiringAlert } from "@/components/home/ExpiringAlert";
import { FilterRow } from "@/components/home/FilterRow";
import { HomeHeader } from "@/components/home/HomeHeader";
import { HomeSkeleton } from "@/components/home/HomeSkeleton";
import {
  FilterEmptyState,
  SyncErrorState,
  useProfileInitials,
} from "@/components/home/HomeStates";
import { TabBar } from "@/components/home/TabBar";
import { Button } from "@/components/ui/Button";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { ItemRow } from "@/components/ui/ItemRow";
import { useSession } from "@/contexts/session";
import { color, space } from "@/theme/tokens";
import { claims$, items$ } from "@/utils/SupaLegend";
import type { Tables } from "@/utils/database.types";
import {
  categoryIcon,
  deriveHomeStats,
  filterItems,
  itemMeta,
  remainingLabel,
  statusOf,
  type WarrantyFilter,
} from "@/utils/warranty";
import { syncState } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import { type Href, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const FILTER_EMPTY_LABELS: Record<Exclude<WarrantyFilter, null>, string> = {
  covered: "Aucun objet couvert.",
  expiring: "Aucune garantie bientôt expirée.",
  expired: "Aucun objet expiré.",
};

function HomeScreen() {
  const router = useRouter();
  const insets = useSafeAreaInsets();
  const { session } = useSession();
  const [filter, setFilter] = useState<WarrantyFilter>(null);
  const [refreshing, setRefreshing] = useState(false);

  const itemsState = syncState(items$);
  const claimsState = syncState(claims$);

  const itemsRecord = items$.get() as
    | Record<string, Tables<"items">>
    | undefined;
  const claimsRecord = claims$.get() as
    | Record<string, Tables<"claims">>
    | undefined;

  const items = useMemo(
    () => Object.values(itemsRecord ?? {}).filter((item) => !item.deleted),
    [itemsRecord],
  );

  const openClaims = useMemo(
    () =>
      Object.values(claimsRecord ?? {}).filter(
        (claim) => !claim.deleted && claim.resolved_at == null,
      ).length,
    [claimsRecord],
  );

  const stats = useMemo(
    () => deriveHomeStats(items, openClaims),
    [items, openClaims],
  );

  const shownItems = useMemo(() => filterItems(items, filter), [items, filter]);

  const initials = useProfileInitials(session?.user.id, session?.user.email);

  const isPersistLoaded = itemsState.isPersistLoaded.get();
  const isLoaded = itemsState.isLoaded.get();
  const syncError = itemsState.error.get();
  const hasCachedItems = items.length > 0;

  const showLoading =
    !isPersistLoaded || (!isLoaded && !hasCachedItems && !syncError);
  const showSyncError = !!syncError && !hasCachedItems;
  const showEmpty = !showLoading && !showSyncError && items.length === 0;

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([itemsState.sync(), claimsState.sync()]);
    } finally {
      setRefreshing(false);
    }
  }, [itemsState, claimsState]);

  const handleOpenItem = useCallback(
    (itemId: string) => {
      router.push(`/items/${itemId}` as Href);
    },
    [router],
  );

  const handleAdd = useCallback(() => {
    // Add flow not built yet.
  }, []);

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + 14,
            paddingBottom: insets.bottom + 112,
          },
        ]}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor={color.brand}
          />
        }
        showsVerticalScrollIndicator={false}
      >
        <HomeHeader initials={initials} />

        {showLoading ? <HomeSkeleton /> : null}

        {showSyncError ? (
          <SyncErrorState onRetry={() => itemsState.sync()} />
        ) : null}

        {showEmpty ? (
          <EmptyState
            title="Rien à couvrir pour l'instant"
            body="Ajoutez votre premier achat, on surveille la garantie pour vous."
            icon={<Icon name="shield-check" size={28} color={color.brand} />}
            action={
              <Button size="md" onPress={handleAdd}>
                Ajouter un objet
              </Button>
            }
          />
        ) : null}

        {!showLoading && !showSyncError && !showEmpty ? (
          <>
            <CoverageHero
              totalCoveredValue={stats.totalCoveredValue}
              totalItems={stats.totalItems}
              openClaims={stats.openClaims}
              coveredCount={stats.coveredCount}
              expiringCount={stats.expiringCount}
              expiredCount={stats.expiredCount}
              onFilterChange={setFilter}
            />

            {stats.expiringItem ? (
              <ExpiringAlert
                item={stats.expiringItem}
                onPress={() => handleOpenItem(stats.expiringItem!.id)}
              />
            ) : null}

            <FilterRow value={filter} onChange={setFilter} />

            {shownItems.length > 0 ? (
              <View style={styles.list}>
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
                      onPress={() => handleOpenItem(item.id)}
                    />
                  );
                })}
              </View>
            ) : (
              <FilterEmptyState
                filterLabel={
                  filter
                    ? FILTER_EMPTY_LABELS[filter]
                    : "Aucun objet à afficher."
                }
                onReset={() => setFilter(null)}
              />
            )}
          </>
        ) : null}
      </ScrollView>

      <TabBar onAdd={handleAdd} />
    </View>
  );
}

export default observer(HomeScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.bgApp,
  },
  content: {
    paddingHorizontal: space.gutterScreen,
    gap: space.gapSection,
  },
  list: {
    gap: space.gapList,
  },
});
