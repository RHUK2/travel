import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TRIP_ID } from "@/lib/trip-data";

export async function POST(req: NextRequest) {
  const { userId } = await req.json();

  if (!userId) {
    return NextResponse.json({ error: "잘못된 요청입니다" }, { status: 400 });
  }

  const { data: participant, error: fetchError } = await supabase
    .from("participants")
    .select("photo_url")
    .eq("trip_id", TRIP_ID)
    .eq("id", userId)
    .single();

  if (fetchError || !participant) {
    return NextResponse.json({ error: "참여자를 찾을 수 없습니다" }, { status: 404 });
  }

  if (participant.photo_url) {
    const path = participant.photo_url.split("/avatars/")[1];
    if (path) await supabase.storage.from("avatars").remove([path]);
  }

  const { error: updateError } = await supabase
    .from("participants")
    .update({ photo_url: "", message: "", token: "" })
    .eq("trip_id", TRIP_ID)
    .eq("id", userId);

  if (updateError) {
    return NextResponse.json({ error: "서버 오류가 발생했습니다" }, { status: 500 });
  }

  return NextResponse.json({ ok: true });
}
