import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !supabaseServiceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, supabaseServiceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET() {
  return NextResponse.json({
    ok: true,
    route: "/api/locadora/importar",
    message:
      "Rota ativa. Sistema em constante atualização e pode haver momentos de instabilidade.",
  });
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Variáveis do Supabase não configuradas na Vercel para esta rota.",
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);

    return NextResponse.json({
      ok: true,
      message:
        "Rota de importação preparada com proteção de ambiente. Sistema em constante atualização e pode haver momentos de instabilidade.",
      received: body,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno inesperado.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}