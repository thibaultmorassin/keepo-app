import { useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "@/components/ui/Button";
import { color, radius, space } from "@/theme/tokens";
import { type } from "@/theme/typography";
import { supabase } from "@/utils/supabase";
import { initialsFrom } from "@/utils/format";

export function useProfileInitials(userId?: string, email?: string | null) {
  const [initials, setInitials] = useState(() => initialsFrom(null, null, email));

  useEffect(() => {
    if (!userId) {
      setInitials(initialsFrom(null, null, email));
      return;
    }

    let mounted = true;

    supabase
      .from("profiles")
      .select("first_name,last_name")
      .eq("id", userId)
      .maybeSingle()
      .then(({ data }) => {
        if (!mounted) return;
        setInitials(initialsFrom(data?.first_name, data?.last_name, email));
      });

    return () => {
      mounted = false;
    };
  }, [userId, email]);

  return initials;
}

type FilterEmptyStateProps = {
  filterLabel: string;
  onReset: () => void;
};

export function FilterEmptyState({
  filterLabel,
  onReset,
}: FilterEmptyStateProps) {
  return (
    <View style={styles.base}>
      <Text style={styles.title}>{filterLabel}</Text>
      <Button variant="ghost" size="sm" onPress={onReset}>
        Voir tous les objets
      </Button>
    </View>
  );
}

type SyncErrorStateProps = {
  onRetry: () => void;
};

export function SyncErrorState({ onRetry }: SyncErrorStateProps) {
  return (
    <View style={styles.base}>
      <Text style={styles.title}>
        On n&apos;a pas pu récupérer vos garanties.
      </Text>
      <Button variant="secondary" size="sm" onPress={onRetry}>
        Réessayer
      </Button>
    </View>
  );
}

const styles = StyleSheet.create({
  base: {
    alignItems: "center",
    gap: space[5],
    paddingHorizontal: space[7],
    paddingVertical: space[8],
    borderRadius: radius.hero,
    backgroundColor: color.bgSunken,
  },
  title: {
    ...type.body,
    color: color.textSecondary,
    textAlign: "center",
  },
});
