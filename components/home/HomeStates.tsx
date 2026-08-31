import { Button } from "@/components/ui/Button";
import { Text, View } from "@/tw";
import { initialsFrom } from "@/utils/format";
import { supabase } from "@/utils/supabase";
import { useEffect, useState } from "react";

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

const BASE = "items-center gap-3 rounded-hero bg-sunken px-5 py-6";

type FilterEmptyStateProps = {
  filterLabel: string;
  onReset: () => void;
};

export function FilterEmptyState({
  filterLabel,
  onReset,
}: FilterEmptyStateProps) {
  return (
    <View className={BASE}>
      <Text className="type-body text-center text-secondary">{filterLabel}</Text>
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
    <View className={BASE}>
      <Text className="type-body text-center text-secondary">
        On n&apos;a pas pu récupérer vos garanties.
      </Text>
      <Button variant="secondary" size="sm" onPress={onRetry}>
        Réessayer
      </Button>
    </View>
  );
}
