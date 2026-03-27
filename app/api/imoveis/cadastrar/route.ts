import { NextRequest, NextResponse } from "next/server";
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

function asString(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await req.json();

    const name = asString(body.name) || "Imobiliária Aurora";
    const city = asString(body.city);
    const state = asString(body.state);
    const whatsapp = asString(body.whatsapp);
    const email = asString(body.email);

    const payload = {
      name,
      city,
      state,
      whatsapp,
      email,
      active: true,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("imoveis_leads")
      .insert([payload])
      .select("*");

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          payload,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      item: Array.isArray(data) ? data[0] ?? null : null,
      message: "Cadastro de imobiliária enviado com sucesso.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro ao cadastrar imobiliária.",
      },
      { status: 500 }
    );
  }
}