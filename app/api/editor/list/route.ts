import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

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

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function normalizeLimit(value: string | null) {
  const parsed = Number(value);

  if (!Number.isFinite(parsed)) {
    return 30;
  }

  return Math.min(Math.max(Math.floor(parsed), 1), 100);
}

export async function GET(req: NextRequest) {
  try {
    const email = normalizeEmail(req.nextUrl.searchParams.get("email") || "");
    const limit = normalizeLimit(req.nextUrl.searchParams.get("limit"));

    if (!email) {
      return NextResponse.json(
        { error: "E-mail não informado." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "E-mail inválido." },
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
      .order("updated_at", { ascending: false })
      .limit(limit);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Erro ao listar artes." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      count: Array.isArray(data) ? data.length : 0,
      projects: Array.isArray(data) ? data : [],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno ao listar artes.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}