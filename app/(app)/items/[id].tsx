import { SyncErrorState } from "@/components/home/HomeStates";
import clsx from "clsx";
import { ItemDetailSkeleton } from "@/components/item/ItemDetailSkeleton";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { CoverageBar } from "@/components/ui/CoverageBar";
import { DocumentRow } from "@/components/ui/DocumentRow";
import { EmptyState } from "@/components/ui/EmptyState";
import { Icon } from "@/components/ui/Icon";
import { IconButton } from "@/components/ui/IconButton";
import { ReceiptPreviewModal } from "@/components/ui/ReceiptPreviewModal";
import { ScreenBackButton } from "@/components/ui/ScreenBackButton";
import { ScreenMenuButton } from "@/components/ui/ScreenMenuButton";
import { useSession } from "@/contexts/session";
import { color } from "@/theme/tokens";
import { ScrollView, Text, View } from "@/tw";
import { Animated } from "@/tw/animated";
import { claimIssueGroupIcon, claimStatus, claimStatusLabel } from "@/utils/claims";
import type { Tables } from "@/utils/database.types";
import { formatEuro, formatFileSize, formatShortDate } from "@/utils/format";
import { haptics } from "@/utils/haptics";
import { deleteItem } from "@/utils/items";
import { ownedClaims, ownedDocuments, ownedItems } from "@/utils/ownership";
import { type PickedReceipt, downloadReceiptFile } from "@/utils/receipts";
import { claims$, itemDocuments$, items$ } from "@/utils/SupaLegend";
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
  ActionSheetIOS,
  ActivityIndicator,
  Alert,
  Platform,
  RefreshControl,
} from "react-native";
import { FadeIn, FadeInDown, useReducedMotion } from "react-native-reanimated";
import { useSafeAreaInsets } from "react-native-safe-area-context";

type ItemDocument = Tables<"item_documents">;
type Claim = Tables<"claims">;

const STAGGER = 40;

const statusTiles: Record<WarrantyStatus | "unknown", string> = {
  covered: "bg-covered-bg",
  expiring: "bg-expiring-bg",
  expired: "bg-expired-bg",
  unknown: "bg-expired-bg",
};

/** The category icon takes a colour value, not a class. */
const statusIconColors: Record<WarrantyStatus | "unknown", string> = {
  covered: color.statusCoveredFg,
  expiring: color.statusExpiringFg,
  expired: color.statusExpiredFg,
  unknown: color.statusExpiredFg,
};

function documentMeta(doc: ItemDocument): string {
  const typeLabel = doc.file_type?.toUpperCase() ?? "FICHIER";
  const sizeLabel = doc.file_size ? formatFileSize(doc.file_size) : "—";
  // `created_at` can be briefly absent on a row that was just created locally
  // and hasn't round-tripped through Supabase yet.
  const dateLabel = doc.created_at
    ? formatShortDate(doc.created_at.slice(0, 10))
    : "à l'instant";
  return `${typeLabel} · ${sizeLabel} · ajouté le ${dateLabel}`;
}

function ItemDetailScreen() {
  const router = useRouter();
  const { id } = useLocalSearchParams<{ id: string }>();
  const insets = useSafeAreaInsets();
  const reduceMotion = useReducedMotion();
  const { session } = useSession();
  const [refreshing, setRefreshing] = useState(false);
  const [previewReceipt, setPreviewReceipt] = useState<PickedReceipt | null>(
    null,
  );
  const [previewOpen, setPreviewOpen] = useState(false);
  const [openingDocId, setOpeningDocId] = useState<string | null>(null);
  const [openError, setOpenError] = useState<string | null>(null);

  const itemsState = syncState(items$);
  const documentsState = syncState(itemDocuments$);
  const claimsState = syncState(claims$);

  const itemsRecord = ownedItems(session?.user.id);
  const documentsRecord = ownedDocuments(itemsRecord);
  const claimsRecord = ownedClaims(session?.user.id);

  const item = id ? itemsRecord?.[id] : undefined;
  const isDeleted = !!item?.deleted;

  const documents = useMemo(() => {
    if (!id) return [];
    return Object.values(documentsRecord ?? {}).filter(
      (doc) => doc.item_id === id,
    );
  }, [documentsRecord, id]);

  const claims = useMemo(() => {
    if (!id) return [];
    return Object.values(claimsRecord ?? {})
      .filter((claim) => claim.item_id === id && !claim.deleted)
      .sort((a, b) =>
        (b.sent_at ?? b.created_at ?? "").localeCompare(
          a.sent_at ?? a.created_at ?? "",
        ),
      );
  }, [claimsRecord, id]);

  const isPersistLoaded =
    itemsState.isPersistLoaded.get() &&
    documentsState.isPersistLoaded.get() &&
    claimsState.isPersistLoaded.get();
  const isLoaded = itemsState.isLoaded.get();
  const syncError =
    itemsState.error.get() ?? documentsState.error.get() ?? claimsState.error.get();
  const hasCachedItem = !!item && !isDeleted;

  const showLoading =
    !isPersistLoaded || (!isLoaded && !hasCachedItem && !syncError);
  const showSyncError = !!syncError && !hasCachedItem;
  const showNotFound = !showLoading && !showSyncError && (!item || isDeleted);

  const status = statusOf(item?.warranty_end_date ?? null) ?? "unknown";
  const statusTile = statusTiles[status];
  const statusIconColor = statusIconColors[status];

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        itemsState.sync(),
        documentsState.sync(),
        claimsState.sync(),
      ]);
    } finally {
      setRefreshing(false);
    }
  }, [claimsState, documentsState, itemsState]);

  const handleBack = useCallback(() => {
    haptics.light();
    router.back();
  }, [router]);

  const handleClaim = useCallback(() => {
    haptics.heavy();
    if (!item) return;
    router.push({ pathname: "/declare/issue", params: { itemId: item.id } });
  }, [item, router]);

  const handleEdit = useCallback(() => {
    if (!item) return;
    haptics.light();
    router.push({ pathname: "/add/manual", params: { id: item.id } });
  }, [item, router]);

  const handleDelete = useCallback(() => {
    if (!item) return;
    Alert.alert(
      "Supprimer cet objet ?",
      "Cette action est irréversible. Son historique de réclamations reste consultable depuis les réclamations en cours.",
      [
        { text: "Annuler", style: "cancel" },
        {
          text: "Supprimer",
          style: "destructive",
          onPress: () => {
            haptics.medium();
            deleteItem(item);
            router.back();
          },
        },
      ],
    );
  }, [item, router]);

  const handleMenu = useCallback(() => {
    if (!item) return;

    if (Platform.OS === "ios") {
      ActionSheetIOS.showActionSheetWithOptions(
        {
          options: ["Modifier", "Supprimer", "Annuler"],
          destructiveButtonIndex: 1,
          cancelButtonIndex: 2,
        },
        (index) => {
          if (index === 0) handleEdit();
          else if (index === 1) handleDelete();
        },
      );
      return;
    }

    Alert.alert("Cet objet", undefined, [
      { text: "Modifier", onPress: handleEdit },
      { text: "Supprimer", style: "destructive", onPress: handleDelete },
      { text: "Annuler", style: "cancel" },
    ]);
  }, [item, handleEdit, handleDelete]);

  const handleOpenDocument = useCallback(async (doc: ItemDocument) => {
    if (openingDocId) return;

    haptics.medium();
    setOpenError(null);
    setOpeningDocId(doc.id);

    try {
      const uri = await downloadReceiptFile(doc);
      setPreviewReceipt({
        uri,
        name: doc.file_name,
        size: doc.file_size,
        mimeType: doc.file_type,
      });
      setPreviewOpen(true);
    } catch {
      setOpenError("Impossible d'ouvrir ce document. Réessayez.");
    } finally {
      setOpeningDocId(null);
    }
  }, [openingDocId]);

  const handleQuickAction = useCallback(
    (kind: "receipt" | "manual" | "claim") => {
      if (kind === "claim") {
        handleClaim();
        return;
      }

      if (kind === "receipt") {
        // The most recently added document stands in for "the receipt" —
        // same convention as the claim message screen.
        const latest = documents
          .slice()
          .sort((a, b) =>
            (b.created_at ?? "").localeCompare(a.created_at ?? ""),
          )[0];
        if (latest) {
          void handleOpenDocument(latest);
          return;
        }
      }

      haptics.medium();
      // "Notice" (product manual) add flow not built yet.
    },
    [documents, handleClaim, handleOpenDocument],
  );

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
    <View className="flex-1 bg-app">
      <ScrollView
        contentContainerClassName="gap-4 px-gutter"
        contentContainerStyle={{
          paddingTop: insets.top + 56,
          paddingBottom: insets.bottom + 120,
        }}
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
              void Promise.all([
                itemsState.sync(),
                documentsState.sync(),
                claimsState.sync(),
              ]);
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
            <Animated.View
              entering={FadeIn.duration(220)}
              className="flex-row items-center gap-[15px]"
            >
              <View
                className={`size-[78px] shrink-0 items-center justify-center rounded-full ${statusTile}`}
              >
                <Icon
                  name={categoryIcon(item.category)}
                  size={34}
                  strokeWidth={2}
                  color={statusIconColor}
                />
              </View>
              <View className="min-w-0 flex-1">
                <Text className="type-title font-display-bold font-bold text-primary">
                  {item.title}
                </Text>
                <Text className="type-caption mt-[5px] text-secondary">
                  {itemMeta(item)}
                </Text>
              </View>
            </Animated.View>

            <Animated.View entering={entering(STAGGER)}>
              <Card tone="plain" pad={20}>
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
              className="flex-row gap-2.5"
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
                  className={clsx(
                    "flex-1 items-center gap-2 px-1.5 py-[15px]",
                    kind === "claim" && "bg-claim-bg shadow-none",
                  )}
                  pad={0}
                >
                  <View
                    className={clsx(
                      "size-[42px] items-center justify-center rounded-full",
                      kind === "claim" ? "bg-claim-solid" : "bg-sunken",
                    )}
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
                    className={clsx(
                      "type-caption-semibold",
                      kind === "claim" ? "text-claim-fg" : "text-primary",
                    )}
                  >
                    {label}
                  </Text>
                </Card>
              ))}
            </Animated.View>

            <Animated.View entering={entering(STAGGER * 3)}>
              <Card tone="plain" pad={0} className="px-card-lg py-1.5">
                {specRows.map(([label, value], index) => (
                  <View
                    key={label}
                    className={clsx(
                      "flex-row justify-between gap-3.5 py-[13px]",
                      index < specRows.length - 1 && "border-b border-line",
                    )}
                  >
                    <Text className="type-body text-secondary">{label}</Text>
                    <Text className="type-body-semibold shrink text-right">
                      {value}
                    </Text>
                  </View>
                ))}
              </Card>
            </Animated.View>

            <Animated.View entering={entering(STAGGER * 4)}>
              <Text className="type-micro mb-[9px] text-secondary">Documents</Text>
              {documents.length > 0 ? (
                <View className="gap-2">
                  {documents.map((doc) => {
                    const opening = openingDocId === doc.id;
                    return (
                      <DocumentRow
                        key={doc.id}
                        name={doc.file_name}
                        meta={documentMeta(doc)}
                        onPress={() => void handleOpenDocument(doc)}
                        action={
                          <IconButton
                            label="Ouvrir le document"
                            variant="ghost"
                            size="sm"
                            onPress={() => void handleOpenDocument(doc)}
                          >
                            {opening ? (
                              <ActivityIndicator
                                size="small"
                                color={color.brand}
                              />
                            ) : (
                              <Icon
                                name="download"
                                size={19}
                                color={color.brand}
                              />
                            )}
                          </IconButton>
                        }
                      />
                    );
                  })}
                </View>
              ) : (
                <Text className="type-caption text-muted">
                  Aucun document pour cet objet
                </Text>
              )}
              {openError ? (
                <Text className="type-caption mt-2 text-claim-fg">
                  {openError}
                </Text>
              ) : null}
            </Animated.View>

            <Animated.View entering={entering(STAGGER * 5)}>
              <Text className="type-micro mb-[9px] text-secondary">
                Réclamations
              </Text>
              {claims.length > 0 ? (
                <View className="gap-2">
                  {claims.map((claim) => {
                    const claimStatusValue = claimStatus(claim);
                    const dateIso = claim.sent_at ?? claim.created_at;
                    return (
                      <View
                        key={claim.id}
                        className="flex-row items-center gap-3 rounded-card bg-card p-3 shadow-sm"
                      >
                        <View className="size-10 shrink-0 items-center justify-center rounded-full bg-claim-bg">
                          <Icon
                            name={claimIssueGroupIcon(claim.issue_group)}
                            size={18}
                            color={color.brandStrong}
                          />
                        </View>
                        <View className="min-w-0 flex-1">
                          <Text
                            className="type-body-semibold text-primary"
                            numberOfLines={1}
                          >
                            {claim.issue}
                          </Text>
                          <Text
                            className="type-caption mt-0.5 text-muted"
                            numberOfLines={1}
                          >
                            {claim.recipient}
                            {dateIso
                              ? ` · ${formatShortDate(dateIso.slice(0, 10))}`
                              : ""}
                          </Text>
                        </View>
                        <Badge
                          status={
                            claimStatusValue === "resolved"
                              ? "covered"
                              : "claim"
                          }
                        >
                          {claimStatusLabel(claimStatusValue)}
                        </Badge>
                      </View>
                    );
                  })}
                </View>
              ) : (
                <Text className="type-caption text-muted">
                  Aucune réclamation pour cet objet
                </Text>
              )}
            </Animated.View>
          </>
        ) : null}
      </ScrollView>

      {item && !isDeleted && !showLoading && !showSyncError ? (
        <LinearGradient
          colors={[`${color.bgApp}00`, color.bgApp]}
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            bottom: 0,
            paddingHorizontal: 20,
            paddingTop: 14,
            paddingBottom: insets.bottom + 18,
          }}
          pointerEvents="box-none"
        >
          <Button variant="claim" size="lg" full onPress={handleClaim}>
            Déclarer un problème
          </Button>
        </LinearGradient>
      ) : null}

      <ReceiptPreviewModal
        visible={previewOpen}
        onClose={() => setPreviewOpen(false)}
        receipt={previewReceipt}
      />

      <ScreenBackButton onPress={handleBack} />
      {item && !isDeleted && !showLoading && !showSyncError ? (
        <ScreenMenuButton onPress={handleMenu} />
      ) : null}
    </View>
  );
}

export default observer(ItemDetailScreen);

