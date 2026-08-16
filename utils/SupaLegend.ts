// @ts-nocheck
import { observable } from "@legendapp/state";
import { syncState } from "@legendapp/state";
import { configureSynced } from "@legendapp/state/sync";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { observablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase";

const generateId = () => uuidv4();

const customSynced = configureSynced(syncedSupabase, {
  persist: {
    plugin: observablePersistAsyncStorage({
      AsyncStorage,
    }),
  },
  generateId,
  supabase,
  changesSince: "last-sync",
  fieldCreatedAt: "created_at",
  fieldUpdatedAt: "updated_at",
  fieldDeleted: "deleted",
});

export const items$ = observable(
  customSynced({
    supabase,
    collection: "items",
    select: (from) =>
      from.select(
        "id,title,category,store,price,currency,purchase_date,warranty_end_date,notes,user_id,created_at,updated_at,deleted",
      ),
    actions: ["read", "create", "update", "delete"],
    realtime: true,
    persist: {
      name: "items",
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  }),
);

export const claims$ = observable(
  customSynced({
    supabase,
    collection: "claims",
    select: (from) =>
      from.select(
        "id,user_id,item_id,issue_group,issue,since,description,recipient,tone,message,sent_at,follow_up_at,resolved_at,created_at,updated_at,deleted",
      ),
    actions: ["read", "create", "update", "delete"],
    realtime: true,
    persist: {
      name: "claims",
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  }),
);

export async function clearSyncedPersistence() {
  await Promise.all([
    syncState(items$).clearPersist(),
    syncState(claims$).clearPersist(),
  ]);
}
