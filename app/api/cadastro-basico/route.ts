import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getSupabaseAdmin() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url || !serviceRole) {
    return null;
  }

  return createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function getErrorMessage(error: unknown) {
  if (!error) return "Falha ao salvar cadastro básico.";

  if (typeof error === "string") return error;

  if (error instanceof Error) return error.message;

  if (typeof error === "object") {
    const err = error as {
      message?: string;
      details?: string;
      hint?: string;
      code?: string;
    };

    const parts = [err.message, err.details, err.hint, err.code].filter(Boolean);
    if (parts.length > 0) return parts.join(" | ");
  }

  return "Falha ao salvar cadastro básico.";
}

export async function POST(request: Request) {
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      return NextResponse.json(
        {
          error:
            "Variáveis SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY não configuradas.",
        },
        { status: 500 }
      );
    }

    const body = await request.json();
    const nome = String(body?.nome || "").trim();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();

    if (!nome) {
      return NextResponse.json(
        { error: "Preencha o nome." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "Preencha o e-mail." },
        { status: 400 }
      );
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return NextResponse.json(
        { error: "Digite um e-mail válido." },
        { status: 400 }
      );
    }

    const prazo = new Date();
    prazo.setDate(prazo.getDate() + 30);

    const payload = {
      user_id: null,
      nome_responsavel: nome,
      email,
      status: "rascunho",
      is_public: false,
      origem: "cadastro_basico",
      cadastro_tipo: "basico",
      cadastro_completo: false,
      prazo_conclusao: prazo.toISOString(),
      bloqueado: false,
    };

    const { data, error } = await supabase
      .from("cadastros_gerais")
      .insert(payload)
      .select("id,email,nome_responsavel")
      .single();

    if (error) {
      return NextResponse.json(
        { error: getErrorMessage(error) },
        { status: 400 }
      );
    }

    return NextResponse.json({
      ok: true,
      id: data.id,
      email: data.email,
      nome: data.nome_responsavel,
      welcomePt: `Bem-vindo, ${data.nome_responsavel}! Seu acesso inicial foi liberado com sucesso.`,
      welcomeEn: `Welcome, ${data.nome_responsavel}! Your initial access has been successfully enabled.`,
    });
  } catch (error) {
    return NextResponse.json(
      { error: getErrorMessage(error) },
      { status: 500 }
    );
  }
}