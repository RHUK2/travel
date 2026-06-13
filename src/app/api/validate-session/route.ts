import { supabase } from "@/lib/supabase";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { userId, token } = await req.json();

  if (!userId || !token) {
    return NextResponse.json({ valid: false }, { status: 400 });
  }

  const { data, error } = await supabase
    .from("participants")
    .select("token")
    .eq("id", userId)
    .single();

  if (error || !data || data.token !== token) {
    return NextResponse.json({ valid: false });
  }

  return NextResponse.json({ valid: true });
}
