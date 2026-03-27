import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type Payload = {
  nome?: string;
  cpfCnpj?: string;
  telefone?: string;
  whatsapp?: string;
  email?: string;
  cidade?: string;
  estado?: string;
  endereco?: string;
  observacoes?: string;
};

function getSupabaseAdmin() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !key) {
    throw new Error(
      "Variáveis do Supabase não configuradas. Verifique SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function clean(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

export async function GET() {
  try {
    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("locadora_clientes")
      .select(
        "id, created_at, nome, cpf_cnpj, telefone, whatsapp, email, cidade, estado, endereco, observacoes, active, published, approved"
      )
      .order("created_at", { ascending: false })
      .limit(200);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      items: Array.isArray(data) ? data : [],
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao listar clientes.",
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Payload;

    const nome = clean(body.nome);
    const cpf_cnpj = clean(body.cpfCnpj);
    const telefone = clean(body.telefone);
    const whatsapp = clean(body.whatsapp);
    const email = clean(body.email);
    const cidade = clean(body.cidade);
    const estado = clean(body.estado).toUpperCase();
    const endereco = clean(body.endereco);
    const observacoes = clean(body.observacoes);

    if (!nome) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nome do cliente é obrigatório.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("locadora_clientes")
      .insert({
        nome,
        cpf_cnpj,
        telefone,
        whatsapp,
        email,
        cidade,
        estado,
        endereco,
        observacoes,
        active: true,
        published: true,
        approved: true,
      })
      .select("id, nome, created_at")
      .single();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      item: data,
      message: "Cliente cadastrado com sucesso.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro inesperado ao cadastrar cliente.",
      },
      { status: 500 }
    );
  }
}