import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";

const supabaseAnonKey =
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";

function getSupabase() {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error("Variáveis do Supabase não configuradas.");
  }

  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export async function GET() {
  try {
    const supabase = getSupabase();

    const { data, error } = await supabase
      .from("locadora_motoristas")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      items: data ?? [],
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao listar motoristas.";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    const nome = normalizeText(body?.nome);
    const cidadeResidencia = normalizeText(body?.cidade_residencia);
    const estado = normalizeText(body?.estado);
    const cnhNumero = normalizeText(body?.cnh_numero);
    const cnhCategoria = normalizeText(body?.cnh_categoria);
    const cnhValidade = normalizeText(body?.cnh_validade);
    const telefone = normalizeText(body?.telefone);
    const email = normalizeText(body?.email);
    const filial = normalizeText(body?.filial);
    const status = normalizeText(body?.status) || "ativo";
    const observacoes = normalizeText(body?.observacoes);

    if (!nome) {
      return NextResponse.json(
        { ok: false, error: "Nome é obrigatório." },
        { status: 400 }
      );
    }

    if (!cidadeResidencia) {
      return NextResponse.json(
        { ok: false, error: "Cidade de residência é obrigatória." },
        { status: 400 }
      );
    }

    const supabase = getSupabase();

    const payload = {
      nome,
      cidade_residencia: cidadeResidencia,
      estado: estado || null,
      cnh_numero: cnhNumero || null,
      cnh_categoria: cnhCategoria || null,
      cnh_validade: cnhValidade || null,
      telefone: telefone || null,
      email: email || null,
      filial: filial || null,
      status,
      observacoes: observacoes || null,
    };

    const { data, error } = await supabase
      .from("locadora_motoristas")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      item: data,
      message: "Motorista cadastrado com sucesso.",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao salvar motorista.";

    return NextResponse.json(
      { ok: false, error: message },
      { status: 500 }
    );
  }
}