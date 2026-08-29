import type { TablesInsert } from "@/utils/database.types";
import { generateId, itemDocuments$ } from "@/utils/SupaLegend";
import { supabase } from "@/utils/supabase";
import * as DocumentPicker from "expo-document-picker";
import { File } from "expo-file-system";
import * as ImagePicker from "expo-image-picker";

const BUCKET = "receipts";

const documentsStore = itemDocuments$ as unknown as Record<
  string,
  { set: (value: TablesInsert<"item_documents">) => void }
>;

export type PickedReceipt = {
  uri: string;
  name: string;
  size: number | null;
  mimeType: string | null;
};

function fallbackName(uri: string, mimeType: string | null): string {
  const fromUri = uri.split("/").pop()?.split("?")[0];
  if (fromUri && fromUri.includes(".")) return fromUri;

  const extension = mimeType?.split("/")[1] ?? "jpg";
  return `recu.${extension}`;
}

/** Photograph a receipt. Returns null if the user backs out. */
export async function pickReceiptFromCamera(): Promise<PickedReceipt | null> {
  const result = await ImagePicker.launchCameraAsync({
    mediaTypes: ["images"],
    quality: 0.7,
  });
  if (result.canceled) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.fileName ?? fallbackName(asset.uri, asset.mimeType ?? null),
    size: asset.fileSize ?? null,
    mimeType: asset.mimeType ?? null,
  };
}

/** Pick a receipt photo from the library. Returns null if the user backs out. */
export async function pickReceiptFromLibrary(): Promise<PickedReceipt | null> {
  const result = await ImagePicker.launchImageLibraryAsync({
    mediaTypes: ["images"],
    quality: 0.7,
  });
  if (result.canceled) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.fileName ?? fallbackName(asset.uri, asset.mimeType ?? null),
    size: asset.fileSize ?? null,
    mimeType: asset.mimeType ?? null,
  };
}

/** Pick a receipt file — PDFs mostly. Returns null if the user backs out. */
export async function pickReceiptDocument(): Promise<PickedReceipt | null> {
  const result = await DocumentPicker.getDocumentAsync({
    type: ["application/pdf", "image/*"],
    copyToCacheDirectory: true,
  });
  if (result.canceled) return null;

  const asset = result.assets[0];
  return {
    uri: asset.uri,
    name: asset.name || fallbackName(asset.uri, asset.mimeType ?? null),
    size: asset.size ?? null,
    mimeType: asset.mimeType ?? null,
  };
}

/** Strips anything that would make an awkward storage key. */
function safeName(name: string): string {
  return name
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9._-]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80);
}

/** File extension, uppercased, for the `DocumentRow` meta line. */
export function receiptKindLabel(receipt: PickedReceipt): string {
  const extension = receipt.name.split(".").pop()?.toUpperCase();
  if (extension && extension.length <= 4) return extension;
  return receipt.mimeType?.split("/")[1]?.toUpperCase() ?? "FICHIER";
}

/**
 * Uploads the receipt to the private bucket, then records it in
 * `item_documents`. Unlike the item write this is *not* offline-capable, so
 * callers save the item first and let this run in the background.
 */
export async function uploadReceipt(
  userId: string,
  itemId: string,
  receipt: PickedReceipt,
): Promise<void> {
  const bytes = await new File(receipt.uri).bytes();
  const path = `${userId}/${itemId}/${safeName(receipt.name)}`;

  const { error } = await supabase.storage
    .from(BUCKET)
    .upload(path, bytes, {
      contentType: receipt.mimeType ?? "application/octet-stream",
      upsert: true,
    });

  if (error) throw error;

  const id = generateId();
  documentsStore[id].set({
    id,
    item_id: itemId,
    file_name: receipt.name,
    file_size: receipt.size ?? bytes.byteLength,
    file_type: receipt.mimeType,
    storage_path: path,
  });
}
