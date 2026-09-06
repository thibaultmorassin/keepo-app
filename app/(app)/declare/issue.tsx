import { ClaimStepHeader } from "@/components/claim/ClaimStepHeader";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { Icon } from "@/components/ui/Icon";
import { OptionRow } from "@/components/ui/OptionRow";
import { useClaimDraft } from "@/contexts/claimDraft";
import { color } from "@/theme/tokens";
import { ScrollView, Text, View } from "@/tw";
import { ISSUES } from "@/utils/claims";
import type { Tables } from "@/utils/database.types";
import { haptics } from "@/utils/haptics";
import { items$ } from "@/utils/SupaLegend";
import { observer } from "@legendapp/state/react";
import { LinearGradient } from "expo-linear-gradient";
import { router, useLocalSearchParams } from "expo-router";
import { useCallback, useEffect, useState } from "react";
import { useSafeAreaInsets } from "react-native-safe-area-context";

function ClaimIssueScreen() {
  const insets = useSafeAreaInsets();
  const { itemId: paramItemId } = useLocalSearchParams<{ itemId?: string }>();
  const { itemId, setItemId, issue, setIssue } = useClaimDraft();

  // An issue already chosen for this exact item, captured once at this
  // screen's first mount — resuming past this step. Deliberately not the
  // live `issue`: after the user changes it below on this same still-mounted
  // instance (e.g. coming back here via the back button), this must stay
  // put, or the guard below would keep skipping forward and trap them.
  // Also deliberately null when a *different* item was just passed in via
  // `itemId` param — the sync effect below is about to reset `issue` to
  // null for that item anyway, so trusting the pre-switch value here would
  // wrongly skip forward with stale facts.
  const [resumeIssue] = useState(() =>
    !paramItemId || paramItemId === itemId ? issue : null,
  );
  const [isInitializing, setIsInitializing] = useState(true);

  useEffect(() => {
    if (paramItemId && paramItemId !== itemId) setItemId(paramItemId);
  }, [paramItemId, itemId, setItemId]);

  useEffect(() => {
    if (resumeIssue) router.push("/declare/details");
    setIsInitializing(false);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const itemsRecord = items$.get() as
    | Record<string, Tables<"items">>
    | undefined;
  const item = itemId ? itemsRecord?.[itemId] : undefined;

  const handleContinue = useCallback(() => {
    haptics.light();
    router.push("/declare/details");
  }, []);

  // About to redirect away (see the effect above) — render nothing rather
  // than flash the issue picker for a frame. Only true for the initial
  // render, never again once mounted, so a later back-visit shows this
  // screen for real.
  if (isInitializing && resumeIssue) {
    return <View className="flex-1 bg-app" />;
  }

  return (
    <View className="flex-1 bg-app">
      <View className="bg-app px-gutter pt-5 pb-3">
        <ClaimStepHeader
          step={1}
          itemName={item?.title ?? ""}
          onBack={() => router.back()}
        />
      </View>

      <ScrollView
        contentContainerClassName="gap-section px-gutter pt-3"
        contentContainerStyle={{
          paddingBottom: insets.bottom + 130,
        }}
        showsVerticalScrollIndicator={false}
      >
        <Text className="type-title text-primary">
          Qu&apos;est-ce qui ne va pas ?
        </Text>

        {ISSUES.map((group) => (
          <Card key={group.title} tone="sunken" className="gap-3">
            <View className="flex-row items-center gap-2.5">
              <View className="size-8 items-center justify-center rounded-pill bg-card">
                <Icon
                  name={group.icon}
                  size={16}
                  strokeWidth={2.6}
                  color={color.brandStrong}
                />
              </View>
              <Text className="type-heading text-primary">{group.title}</Text>
            </View>
            <View className="gap-1.5">
              {group.options.map((option) => (
                <OptionRow
                  key={option}
                  label={option}
                  selected={issue === option}
                  onSelect={() => setIssue(group.title, option)}
                />
              ))}
            </View>
          </Card>
        ))}
      </ScrollView>

      <LinearGradient
        colors={[`${color.bgApp}00`, color.bgApp]}
        locations={[0, 0.62]}
        pointerEvents="box-none"
        style={{
          position: "absolute",
          left: 0,
          right: 0,
          bottom: 0,
          paddingHorizontal: 18,
          paddingTop: 20,
          paddingBottom: insets.bottom + 24,
        }}
      >
        <Button
          variant="primary"
          size="lg"
          full
          disabled={!issue}
          onPress={handleContinue}
        >
          Continuer
        </Button>
      </LinearGradient>
    </View>
  );
}

export default observer(ClaimIssueScreen);
