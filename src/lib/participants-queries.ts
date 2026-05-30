export interface Participant {
  id: string;
  trip_id: string;
  name: string;
  photo_url: string;
  message: string;
  joined_at: string;
}

export async function fetchParticipants(): Promise<Participant[]> {
  const res = await fetch("/api/participants");
  if (!res.ok) throw new Error("Failed to fetch participants");
  return res.json();
}

export async function updateParticipantProfile(
  id: string,
  patch: { photo_url?: string; message?: string },
): Promise<void> {
  const res = await fetch("/api/participants/update-profile", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ id, patch }),
  });
  if (!res.ok) throw new Error("Failed to update participant profile");
}

export async function uploadAvatar(
  deviceId: string,
  blob: Blob,
): Promise<string> {
  const formData = new FormData();
  formData.append("deviceId", deviceId);
  formData.append("file", blob);
  const res = await fetch("/api/participants/upload-avatar", {
    method: "POST",
    body: formData,
  });
  if (!res.ok) throw new Error("Failed to upload avatar");
  const { publicUrl } = await res.json();
  return publicUrl;
}
