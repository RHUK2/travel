import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { photoUrl } = await req.json();
  const path = photoUrl.split("/avatars/")[1];
  if (!path) return NextResponse.json({ ok: true });
  await supabase.storage.from("avatars").remove([path]);
  return NextResponse.json({ ok: true });
}
