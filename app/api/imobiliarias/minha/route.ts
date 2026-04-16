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

    // Busca o cadastro mais recente (o último que você fez)
    const { data, error } = await supabase
      .from("imoveis_leads")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(1);

    if (error) {
      console.error("Erro Supabase:", error);
      return NextResponse.json({ ok: false, error: error.message });
    }

    if (!data || data.length === 0) {
      return NextResponse.json({ ok: false, error: "Nenhuma imobiliária encontrada" });
    }

    return NextResponse.json({
      ok: true,
      data: data[0],
    });

  } catch (error: any) {
    console.error("Erro na API:", error);
    return NextResponse.json({ ok: false, error: error.message || "Erro interno" });
  }
}