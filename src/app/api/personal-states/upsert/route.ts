import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";
import { TRIP_ID } from "@/lib/trip-data";

export async function POST(req: NextRequest) {
  const { itemId, userId, patch, current } = await req.json();
  const { error } = await supabase.from("personal_states").upsert(
    {
      trip_id: TRIP_ID,
      item_id: itemId,
      user_id: userId,
      memo: current?.memo ?? "",
      value: current?.value ?? "",
      ...patch,
    },
    { onConflict: "trip_id,item_id,user_id" },
  );
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
