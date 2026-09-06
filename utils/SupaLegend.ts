// @ts-nocheck
import { observable } from "@legendapp/state";
import { syncState } from "@legendapp/state";
import { configureSynced } from "@legendapp/state/sync";
import { syncedSupabase } from "@legendapp/state/sync-plugins/supabase";
import { observablePersistAsyncStorage } from "@legendapp/state/persist-plugins/async-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { v4 as uuidv4 } from "uuid";
import { supabase } from "./supabase";

export const generateId = () => uuidv4();

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
        "id,title,category,store,price,currency,purchase_date,warranty_end_date,reminder_enabled,notes,user_id,created_at,updated_at,deleted",
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

export const itemDocuments$ = observable(
  customSynced({
    supabase,
    collection: "item_documents",
    select: (from) =>
      from.select(
        "id,item_id,file_name,file_size,file_type,storage_path,created_at",
      ),
    actions: ["read", "create", "delete"],
    realtime: true,
    persist: {
      name: "item_documents",
      retrySync: true,
    },
    retry: {
      infinite: true,
    },
  }),
);

/**
 * Wipes the on-disk AsyncStorage cache for all three stores on sign-out.
 *
 * This does NOT clear the in-memory value of `items$` / `claims$` /
 * `itemDocuments$` — Legend State's `clearPersist` only deletes the
 * persisted copy, and `.set({})`-ing a synced observable directly is not a
 * safe substitute: in "merge" mode it reads as "the user deleted every one
 * of these rows" and queues real delete/update calls for all of them. So a
 * previous account's rows can keep sitting in memory (or reappear from a
 * lingering realtime event) after a different account signs in on the same
 * device, for as long as the process stays alive. Every screen must read
 * these stores through `utils/ownership.ts`, which filters by the
 * currently-signed-in user, rather than trusting this to have fully reset
 * the world.
 */
export async function clearSyncedPersistence() {
  await Promise.all([
    syncState(items$).clearPersist(),
    syncState(claims$).clearPersist(),
    syncState(itemDocuments$).clearPersist(),
  ]);
}
