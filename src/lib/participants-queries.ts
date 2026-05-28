import { supabase } from "./supabase";
import { TRIP_ID } from "./trip-data";

export interface Participant {
  id: string;
  trip_id: string;
  name: string;
  photo_url: string;
  message: string;
  joined_at: string;
}

export async function fetchParticipants(): Promise<Participant[]> {
  const { data, error } = await supabase
    .from("participants")
    .select("*")
    .eq("trip_id", TRIP_ID)
    .order("joined_at");
  if (error) throw error;
  return (data ?? []) as Participant[];
}

export async function upsertParticipant(
  p: Omit<Participant, "trip_id" | "joined_at">,
): Promise<void> {
  const { error } = await supabase
    .from("participants")
    .upsert({ trip_id: TRIP_ID, ...p }, { onConflict: "trip_id,id" });
  if (error) throw error;
}

export async function deleteAvatar(photoUrl: string): Promise<void> {
  const path = photoUrl.split("/avatars/")[1];
  if (!path) return;
  await supabase.storage.from("avatars").remove([path]);
}

export async function deleteParticipant(id: string): Promise<void> {
  const { error } = await supabase
    .from("participants")
    .delete()
    .eq("trip_id", TRIP_ID)
    .eq("id", id);
  if (error) throw error;
}

export async function uploadAvatar(deviceId: string, blob: Blob): Promise<string> {
  const ext = blob.type === "image/png" ? "png" : blob.type === "image/webp" ? "webp" : "jpg";
  const path = `${deviceId}.${ext}`;
  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, blob, { upsert: true, contentType: blob.type });
  if (error) throw error;
  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return data.publicUrl;
}
