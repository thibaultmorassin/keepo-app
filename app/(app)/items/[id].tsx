import { SyncErrorState } from "@/components/home/HomeStates";
import { ItemDetailSkeleton } from "@/components/item/ItemDetailSkeleton";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CoverageBar } from "@/components/ui/CoverageBar";
import { DocumentRow } from "@/components/ui/DocumentRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { color, space } from "@/theme/tokens";
import { fontFamily, type } from "@/theme/typography";
import type { Tables } from "@/utils/database.types";
import { formatEuro, formatFileSize, formatShortDate } from "@/utils/format";
import { haptics } from "@/utils/haptics";
import { itemDocuments$, items$ } from "@/utils/SupaLegend";
import {
  categoryIcon,
  elapsedPct,
  itemMeta,
  statusOf,
  warrantyDurationLabel,
  warrantyHeadline,
  type WarrantyStatus,
} from "@/utils/warranty";
import { syncState } from "@legendapp/state";
import { observer } from "@legendapp/state/react";
import { LinearGradient } from "expo-linear-gradient";
import { useLocalSearchParams, useRouter } from "expo-router";
import { useCallback, useMemo, useState } from "react";
import {
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import Animated, {
  FadeIn,
  FadeInDown,
  useReducedMotion,
} from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ItemDocument = Tables<"item_documents">;

const STAGGER = 40;

const statusSkins: Record<
  WarrantyStatus | "unknown",
  { backgroundColor: string; color: string }
> = {
  covered: {
    backgroundColor: color.statusCoveredBg,
    color: color.statusCoveredFg,
  },
  expiring: {
    backgroundColor: color.statusExpiringBg,
    color: color.statusExpiringFg,
  },
  expired: {
    backgroundColor: color.statusExpiredBg,
    color: color.statusExpiredFg,
  },
  unknown: {
    backgroundColor: color.statusExpiredBg,
    color: color.statusExpiredFg,
  },
};

function documentMeta(doc: ItemDocument): string {
  const typeLabel = doc.file_type?.toUpperCase() ?? "FICHIER";
  const sizeLabel = doc.file_size ? formatFileSize(doc.file_size) : "—";
  const dateLabel = formatShortDate(doc.created_at.slice(0, 10));
  return `${typeLabel} · ${sizeLabel} · ajouté le ${dateLabel}`;
}

function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const [refreshing, setRefreshing] = useState(false);

  const itemsState = syncState(items$);
  const documentsState = syncState(itemDocuments$);

  const itemsRecord = items$.get() as
    | Record<string, Tables<"items">>
    | undefined;
  const documentsRecord = itemDocuments$.get() as
    | Record<string, ItemDocument>
    | undefined;

  const item = id ? itemsRecord?.[id] : undefined;
  const isDeleted = !!item?.deleted;

  const documents = useMemo(() => {
    if (!id) return [];
    return Object.values(documentsRecord ?? {}).filter(
      (doc) => doc.item_id === id,
    );
  }, [documentsRecord, id]);

  const isPersistLoaded =
    itemsState.isPersistLoaded.get() && documentsState.isPersistLoaded.get();
  const isLoaded = itemsState.isLoaded.get();
  const syncError = itemsState.error.get() ?? documentsState.error.get();
  const hasCachedItem = !!item && !isDeleted;

  const showLoading =
    !isPersistLoaded || (!isLoaded && !hasCachedItem && !syncError);
  const showSyncError = !!syncError && !hasCachedItem;
  const showNotFound = !showLoading && !showSyncError && (!item || isDeleted);

  const status = statusOf(item?.warranty_end_date ?? null) ?? "unknown";
  const skin = statusSkins[status];

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([itemsState.sync(), documentsState.sync()]);
    } finally {
      setRefreshing(false);
    }
  }, [documentsState, itemsState]);

  const handleBack = useCallback(() => {
    haptics.light();
    router.back();
  }, [router]);

  const handleClaim = useCallback(() => {
    haptics.heavy();
    // Claim flow not built yet.
  }, []);

  const handleQuickAction = useCallback(
    (kind: "receipt" | "manual" | "claim") => {
      if (kind === "claim") {
        handleClaim();
        return;
      }

      haptics.medium();
      // Document open / add flow not built yet.
    },
    [handleClaim],
  );

  const handleDocumentDownload = useCallback(() => {
    haptics.medium();
    // Storage download not built yet.
  }, []);

  const entering = reduceMotion
    ? (delay: number) => FadeIn.delay(delay).duration(220)
    : (delay: number) => FadeInDown.delay(delay).duration(220);

  const specRows = item
    ? [
        ["Catégorie", item.category],
        ["Prix payé", item.price != null ? formatEuro(item.price) : "—"],
        ["Magasin", item.store?.trim() || "—"],
      ]
    : [];

  return (
    <View style={styles.screen}>
      <ScrollView
        contentContainerStyle={[
          styles.content,
          {
            paddingTop: insets.top + space[11],
            paddingBottom: insets.bottom + 120,
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
        {showLoading ? <ItemDetailSkeleton /> : null}

        {showSyncError ? (
          <SyncErrorState
            onRetry={() => {
              void Promise.all([itemsState.sync(), documentsState.sync()]);
            }}
          />
        ) : null}

        {showNotFound ? (
          <EmptyState
            title="Objet introuvable"
            body="Cet objet n'existe plus ou n'est pas accessible."
            icon={<Icon name="package" size={24} color={color.brandStrong} />}
            action={
              <Button variant="secondary" onPress={handleBack}>
                Retour
              </Button>
            }
          />
        ) : null}

        {item && !isDeleted && !showLoading && !showSyncError ? (
          <>
            <Animated.View entering={FadeIn.duration(220)} style={styles.hero}>
              <View style={[styles.statusTile, skin]}>
                <Icon
                  name={categoryIcon(item.category)}
                  size={34}
                  strokeWidth={2}
                  color={skin.color}
                />
              </View>
              <View style={styles.heroCopy}>
                <Text style={styles.title}>{item.title}</Text>
                <Text style={styles.meta}>{itemMeta(item)}</Text>
              </View>
            </Animated.View>

            <Animated.View entering={entering(STAGGER)}>
              <Card tone="plain" pad={space.padCardLg}>
                <CoverageBar
                  pct={elapsedPct(item.purchase_date, item.warranty_end_date)}
                  status={status}
                  headline={warrantyHeadline(item.warranty_end_date)}
                  note={warrantyDurationLabel(
                    item.purchase_date,
                    item.warranty_end_date,
                  )}
                  from={`Achat · ${formatShortDate(item.purchase_date)}`}
                  to={
                    item.warranty_end_date
                      ? `Fin · ${formatShortDate(item.warranty_end_date)}`
                      : undefined
                  }
                />
              </Card>
            </Animated.View>

            <Animated.View
              entering={entering(STAGGER * 2)}
              style={styles.quickActions}
            >
              {(
                [
                  ["receipt", "Reçu", "plain"],
                  ["book-open", "Notice", "plain"],
                  ["triangle-alert", "Déclarer", "claim"],
                ] as const
              ).map(([iconName, label, kind]) => (
                <Card
                  key={label}
                  tone="plain"
                  onPress={() =>
                    handleQuickAction(
                      kind === "claim"
                        ? "claim"
                        : iconName === "receipt"
                          ? "receipt"
                          : "manual",
                    )
                  }
                  style={[
                    styles.quickAction,
                    kind === "claim" ? styles.quickActionClaim : null,
                  ]}
                  pad={0}
                >
                  <View
                    style={[
                      styles.quickActionIcon,
                      kind === "claim"
                        ? styles.quickActionIconClaim
                        : styles.quickActionIconPlain,
                    ]}
                  >
                    <Icon
                      name={iconName}
                      size={20}
                      color={
                        kind === "claim" ? color.textOnDark : color.brandStrong
                      }
                    />
                  </View>
                  <Text
                    style={[
                      styles.quickActionLabel,
                      kind === "claim" ? styles.quickActionLabelClaim : null,
                    ]}
                  >
                    {label}
                  </Text>
                </Card>
              ))}
            </Animated.View>

            <Animated.View entering={entering(STAGGER * 3)}>
              <Card tone="plain" pad={0} style={styles.specCard}>
                {specRows.map(([label, value], index) => (
                  <View
                    key={label}
                    style={[
                      styles.specRow,
                      index === specRows.length - 1 ? styles.specRowLast : null,
                    ]}
                  >
                    <Text style={styles.specLabel}>{label}</Text>
                    <Text style={styles.specValue}>{value}</Text>
                  </View>
                ))}
              </Card>
            </Animated.View>

            <Animated.View entering={entering(STAGGER * 4)}>
              <Text style={styles.sectionLabel}>Documents</Text>
              {documents.length > 0 ? (
                <View style={styles.documents}>
                  {documents.map((doc) => (
                    <DocumentRow
                      key={doc.id}
                      name={doc.file_name}
                      meta={documentMeta(doc)}
                      onPress={handleDocumentDownload}
                      action={
                        <IconButton
                          label="Télécharger"
                          variant="ghost"
                          size="sm"
                          onPress={handleDocumentDownload}
                        >
                          <Icon name="download" size={19} color={color.brand} />
                        </IconButton>
                      }
                    />
                  ))}
                </View>
              ) : (
                <Text style={styles.documentsEmpty}>
                  Aucun document pour cet objet
                </Text>
              )}
            </Animated.View>
          </>
        ) : null}
      </ScrollView>

      {item && !isDeleted && !showLoading && !showSyncError ? (
        <LinearGradient
          colors={[`${color.bgApp}00`, color.bgApp]}
          style={[styles.footer, { paddingBottom: insets.bottom + 18 }]}
          pointerEvents="box-none"
        >
          <Button variant="claim" size="lg" full onPress={handleClaim}>
            Déclarer un problème
          </Button>
        </LinearGradient>
      ) : null}
    </View>
  );
}

export default observer(ItemDetailScreen);

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: color.bgApp,
  },
  content: {
    paddingHorizontal: space.gutterScreen,
    gap: space[6],
  },
  nav: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  hero: {
    flexDirection: "row",
    alignItems: "center",
    gap: 15,
  },
  statusTile: {
    width: 78,
    height: 78,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
    flexShrink: 0,
  },
  heroCopy: {
    flex: 1,
    minWidth: 0,
  },
  title: {
    ...type.title,
    fontFamily: fontFamily.displayBold,
    fontWeight: "700",
    color: color.textPrimary,
  },
  meta: {
    ...type.caption,
    color: color.textSecondary,
    marginTop: 5,
  },
  quickActions: {
    flexDirection: "row",
    gap: 10,
  },
  quickAction: {
    flex: 1,
    alignItems: "center",
    gap: 8,
    paddingVertical: 15,
    paddingHorizontal: 6,
  },
  quickActionClaim: {
    backgroundColor: color.actionClaimBg,
    shadowOpacity: 0,
    elevation: 0,
  },
  quickActionIcon: {
    width: 42,
    height: 42,
    borderRadius: 999,
    alignItems: "center",
    justifyContent: "center",
  },
  quickActionIconPlain: {
    backgroundColor: color.bgSunken,
  },
  quickActionIconClaim: {
    backgroundColor: color.actionClaimSolid,
  },
  quickActionLabel: {
    ...type.caption,
    fontWeight: "600",
    color: color.textPrimary,
  },
  quickActionLabelClaim: {
    color: color.actionClaimFg,
  },
  specCard: {
    paddingHorizontal: space.padCardLg,
    paddingVertical: 6,
  },
  specRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 14,
    paddingVertical: 13,
    borderBottomWidth: 1,
    borderBottomColor: color.borderSubtle,
  },
  specRowLast: {
    borderBottomWidth: 0,
  },
  specLabel: {
    ...type.body,
    color: color.textSecondary,
  },
  specValue: {
    ...type.body,
    fontWeight: "600",
    textAlign: "right",
    flexShrink: 1,
  },
  sectionLabel: {
    ...type.micro,
    color: color.textSecondary,
    marginBottom: 9,
  },
  documents: {
    gap: space[4],
  },
  documentsEmpty: {
    ...type.caption,
    color: color.textMuted,
  },
  footer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    paddingHorizontal: space[7],
    paddingTop: 14,
  },
});
