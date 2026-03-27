import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !serviceRole) {
    throw new Error("Variáveis do Supabase não configuradas.");
  }

  return createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("locadora_sellers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message || "Erro ao consultar locadora_sellers.",
        },
        { status: 500 }
      );
    }

    const rows = Array.isArray(data) ? data : [];
    const sampleColumns = rows.length ? Object.keys(rows[0] ?? {}) : [];

    return NextResponse.json({
      ok: true,
      total: rows.length,
      sample_columns: sampleColumns,
      items: rows,
      message:
        "Leitura bruta da locadora sem filtros públicos para diagnóstico real.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno no admin-debug da locadora.",
      },
      { status: 500 }
    );
  }
}