import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function POST(req: NextRequest) {
  const { itemId, userId, patch, current } = await req.json();
  const { error } = await supabase.from("personal_states").upsert(
    {
      item_id: itemId,
      user_id: userId,
      is_done: current?.is_done ?? false,
      memo: current?.memo ?? "",
      value: current?.value ?? "",
      ...patch,
    },
    { onConflict: "item_id,user_id" },
  );
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
