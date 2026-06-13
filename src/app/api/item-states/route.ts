import { NextRequest, NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const { data, error } = await supabase.from("item_states").select("*");
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json(data ?? []);
}

export async function POST(req: NextRequest) {
  const { itemId, patch, current } = await req.json();
  const { error } = await supabase.from("item_states").upsert(
    {
      item_id: itemId,
      is_done: current?.is_done ?? false,
      ...patch,
    },
    { onConflict: "item_id" },
  );
  if (error)
    return NextResponse.json({ error: error.message }, { status: 500 });
  return NextResponse.json({ ok: true });
}
