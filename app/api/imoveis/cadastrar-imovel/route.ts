import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !serviceRole) {
    throw new Error("Variáveis do Supabase não configuradas.");
  }

  return createClient(url, serviceRole);
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await req.json();

    // Apenas os campos que existem na tabela imoveis_leads
    const payload = {
      name: body.name || body.titulo || "Imóvel sem título",
      city: body.city || body.cidade,
      state: body.state || body.estado,
      active: true,
      created_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from("imoveis_leads")
      .insert([payload])
      .select();

    if (error) {
      console.error("Erro Supabase:", error);
      return NextResponse.json({ 
        ok: false, 
        error: error.message 
      }, { status: 500 });
    }

    return NextResponse.json({
      ok: true,
      message: "Imóvel cadastrado com sucesso",
      data,
    });

  } catch (error: any) {
    console.error("Erro na API:", error);
    return NextResponse.json({ 
      ok: false, 
      error: error.message || "Erro interno" 
    }, { status: 500 });
  }
}