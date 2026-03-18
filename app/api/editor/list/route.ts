import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Variáveis NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET(req: NextRequest) {
  try {
    const email = (
      req.nextUrl.searchParams.get("email") || ""
    ).trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "E-mail não informado." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("editor_projects")
      .select(
        "id, user_email, title, design_data, preview_image_url, created_at, updated_at"
      )
      .eq("user_email", email)
      .order("created_at", { ascending: false })
      .limit(30);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Erro ao listar artes." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      projects: data || [],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno ao listar artes.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}