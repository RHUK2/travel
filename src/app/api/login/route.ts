import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TRIP_ID } from "@/lib/trip-data";

export async function POST(req: NextRequest) {
  const { name, passcode } = await req.json();

  const PASSCODE = process.env.PASSCODE;
  if (!PASSCODE || passcode !== PASSCODE) {
    return NextResponse.json(
      { error: "패스코드가 올바르지 않습니다" },
      { status: 401 },
    );
  }

  const { data: participant, error } = await supabase
    .from("participants")
    .select("id, name, photo_url, message")
    .eq("trip_id", TRIP_ID)
    .eq("name", name)
    .single();

  if (error || !participant) {
    return NextResponse.json(
      { error: "등록되지 않은 이름입니다" },
      { status: 401 },
    );
  }

  const token = crypto.randomUUID();

  const { error: updateError } = await supabase
    .from("participants")
    .update({ token })
    .eq("trip_id", TRIP_ID)
    .eq("id", participant.id);

  if (updateError) {
    return NextResponse.json(
      { error: "서버 오류가 발생했습니다" },
      { status: 500 },
    );
  }

  return NextResponse.json({
    id: participant.id,
    name: participant.name,
    token,
    photo_url: participant.photo_url ?? "",
    message: participant.message ?? "",
  });
}
