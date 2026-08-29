import { supabase } from "@/utils/supabase";
import type { Tables, TablesUpdate } from "@/utils/database.types";
import { useCallback, useEffect, useState } from "react";

export type ProfilePrefs = {
  firstName: string | null;
  lastName: string | null;
  reminderDaysBefore: number;
  claimFollowupRemindersEnabled: boolean;
  storeAddRemindersEnabled: boolean;
  appNewsEnabled: boolean;
};

const PROFILE_COLUMNS =
  "first_name,last_name,reminder_days_before,claim_followup_reminders_enabled,store_add_reminders_enabled,app_news_enabled";

type ProfileRow = Pick<
  Tables<"profiles">,
  | "first_name"
  | "last_name"
  | "reminder_days_before"
  | "claim_followup_reminders_enabled"
  | "store_add_reminders_enabled"
  | "app_news_enabled"
>;

function fromRow(row: ProfileRow): ProfilePrefs {
  return {
    firstName: row.first_name,
    lastName: row.last_name,
    reminderDaysBefore: row.reminder_days_before,
    claimFollowupRemindersEnabled: row.claim_followup_reminders_enabled,
    storeAddRemindersEnabled: row.store_add_reminders_enabled,
    appNewsEnabled: row.app_news_enabled,
  };
}

export async function fetchProfilePrefs(
  userId: string,
): Promise<{ data: ProfilePrefs | null; error: string | null }> {
  const { data, error } = await supabase
    .from("profiles")
    .select(PROFILE_COLUMNS)
    .eq("id", userId)
    .maybeSingle();

  if (error) {
    return { data: null, error: "Impossible de charger votre profil." };
  }

  return { data: data ? fromRow(data) : null, error: null };
}

export async function updateProfilePrefs(
  userId: string,
  patch: Partial<ProfilePrefs>,
): Promise<{ error: string | null }> {
  const update: TablesUpdate<"profiles"> = {};

  if (patch.firstName !== undefined) update.first_name = patch.firstName;
  if (patch.lastName !== undefined) update.last_name = patch.lastName;
  if (patch.reminderDaysBefore !== undefined)
    update.reminder_days_before = patch.reminderDaysBefore;
  if (patch.claimFollowupRemindersEnabled !== undefined)
    update.claim_followup_reminders_enabled =
      patch.claimFollowupRemindersEnabled;
  if (patch.storeAddRemindersEnabled !== undefined)
    update.store_add_reminders_enabled = patch.storeAddRemindersEnabled;
  if (patch.appNewsEnabled !== undefined)
    update.app_news_enabled = patch.appNewsEnabled;

  const { error } = await supabase
    .from("profiles")
    .update(update)
    .eq("id", userId);

  return { error: error ? "La mise à jour a échoué. Réessayez." : null };
}

export function useProfilePrefs(userId?: string) {
  const [prefs, setPrefs] = useState<ProfilePrefs | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(
    async (mountedRef?: { mounted: boolean }) => {
      if (!userId) {
        setIsLoading(false);
        return;
      }

      setIsLoading(true);
      setError(null);
      const { data, error: fetchError } = await fetchProfilePrefs(userId);
      if (mountedRef && !mountedRef.mounted) return;
      setPrefs(data);
      setError(fetchError);
      setIsLoading(false);
    },
    [userId],
  );

  useEffect(() => {
    const mountedRef = { mounted: true };
    void load(mountedRef);
    return () => {
      mountedRef.mounted = false;
    };
  }, [load]);

  return { prefs, setPrefs, isLoading, error, refetch: load };
}
