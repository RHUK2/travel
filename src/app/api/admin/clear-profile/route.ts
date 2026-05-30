import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TRIP_ID } from "@/lib/trip-data";

export async function POST(req: NextRequest) {
  const { targetId, adminPassword } = await req.json();

  const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
  if (!ADMIN_PASSWORD || adminPassword !== ADMIN_PASSWORD) {
    return NextResponse.json(
      { error: "어드민 비밀번호가 올바르지 않습니다" },
      { status: 401 },
    );
  }

  const { data: participant, error: fetchError } = await supabase
    .from("participants")
    .select("photo_url")
    .eq("trip_id", TRIP_ID)
    .eq("id", targetId)
    .single();

  if (fetchError || !participant) {
    return NextResponse.json(
      { error: "참여자를 찾을 수 없습니다" },
      { status: 404 },
    );
  }

  if (participant.photo_url) {
    const path = participant.photo_url.split("/avatars/")[1];
    if (path) await supabase.storage.from("avatars").remove([path]);
  }

  const { error: updateError } = await supabase
    .from("participants")
    .update({ photo_url: "", message: "", token: "" })
    .eq("trip_id", TRIP_ID)
    .eq("id", targetId);

  if (updateError) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }

  return NextResponse.json({ ok: true });
}
