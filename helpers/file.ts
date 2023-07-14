import { supabaseClient } from "@/lib/supabase";

export function getFileExtension(fileName: string): string {
  const parts = fileName.split(".");
  if (parts.length > 1) {
    return parts[parts.length - 1];
  }
  return "";
}

export function getFileUrl(bucketName: string, filePath: string) {
  return supabaseClient.storage.from(bucketName).getPublicUrl(filePath).data.publicUrl;
}
