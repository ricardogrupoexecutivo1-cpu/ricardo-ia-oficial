import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Variáveis do Supabase não configuradas para a rota de propostas.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Rota de propostas ativa. Sistema em constante atualização e pode haver momentos de instabilidade.",
      items: [],
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

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Variáveis do Supabase não configuradas para a rota de propostas.",
        },
        { status: 500 }
      );
    }

    const body = await request.json().catch(() => null);

    return NextResponse.json({
      ok: true,
      message:
        "Rota de propostas protegida para build e pronta para receber ajustes reais.",
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