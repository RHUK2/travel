import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const deviceId = formData.get("deviceId") as string;
  const file = formData.get("file") as File;

  const ext =
    file.type === "image/png"
      ? "png"
      : file.type === "image/webp"
        ? "webp"
        : "jpg";
  const path = `${deviceId}.${ext}`;
  const buffer = await file.arrayBuffer();

  const { error } = await supabase.storage
    .from("avatars")
    .upload(path, buffer, { upsert: true, contentType: file.type });
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });

  const { data } = supabase.storage.from("avatars").getPublicUrl(path);
  return NextResponse.json({ publicUrl: `${data.publicUrl}?v=${Date.now()}` });
}
