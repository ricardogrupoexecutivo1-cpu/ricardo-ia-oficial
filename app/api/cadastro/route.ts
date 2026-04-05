import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabase() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const key = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !key) {
    return null;
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function asText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function asArrayText(value: unknown) {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeWhatsapp(value: string) {
  return value.replace(/\D+/g, "");
}

function uniqueTextList(values: string[]) {
  return [...new Set(values.map((item) => item.trim()).filter(Boolean))];
}

export async function POST(req: Request) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return NextResponse.json(
        {
          ok: false,
          error:
            "Supabase não configurado. Verifique SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const responsavel = asText(body?.responsavel);
    const empresa = asText(body?.empresa);
    const cnpj = asText(body?.cnpj);
    const whatsappRaw = asText(body?.whatsapp);
    const emailRaw = asText(body?.email);
    const descricao = asText(body?.descricao);
    const abrangencia = asText(body?.abrangencia);
    const segmentoPersonalizado = asText(body?.segmentoPersonalizado);
    const atividadePersonalizada = asText(body?.atividadePersonalizada);

    const areas = asArrayText(body?.area);
    const atividades = asArrayText(body?.atividades);

    const areaFinal = uniqueTextList([
      ...areas,
      ...(segmentoPersonalizado ? [segmentoPersonalizado] : []),
    ]).join(", ");

    const atividadesFinal = uniqueTextList([
      ...atividades,
      ...(atividadePersonalizada ? [atividadePersonalizada] : []),
    ]).join(", ");

    if (!responsavel) {
      return NextResponse.json(
        { ok: false, error: "Informe o nome do responsável." },
        { status: 400 }
      );
    }

    if (!empresa) {
      return NextResponse.json(
        { ok: false, error: "Informe o nome da empresa." },
        { status: 400 }
      );
    }

    if (!whatsappRaw) {
      return NextResponse.json(
        { ok: false, error: "Informe o WhatsApp." },
        { status: 400 }
      );
    }

    if (!emailRaw) {
      return NextResponse.json(
        { ok: false, error: "Informe o e-mail." },
        { status: 400 }
      );
    }

    const email = normalizeEmail(emailRaw);
    const whatsapp = normalizeWhatsapp(whatsappRaw);
    const now = new Date().toISOString();

    if (!whatsapp) {
      return NextResponse.json(
        { ok: false, error: "WhatsApp inválido." },
        { status: 400 }
      );
    }

    const cadastroPublico = {
      responsavel,
      empresa,
      whatsapp,
      email,
      area: areaFinal,
      atividades: atividadesFinal,
      abrangencia,
      descricao,
      created_at: now,
    };

    const cadastroPrivado = {
      responsavel,
      empresa,
      cnpj,
      whatsapp,
      email,
      area: areaFinal,
      atividades: atividadesFinal,
      abrangencia,
      descricao,
      created_at: now,
    };

    console.log("CADASTRO PUBLICO:", cadastroPublico);
    console.log("CADASTRO PRIVADO:", cadastroPrivado);

    const { data: publicoSalvo, error: errPublico } = await supabase
      .from("cadastros")
      .insert([cadastroPublico])
      .select()
      .single();

    if (errPublico) {
      console.error("ERRO AO SALVAR cadastros:", errPublico);

      return NextResponse.json(
        {
          ok: false,
          error: `Erro ao salvar cadastro principal: ${errPublico.message}`,
          where: "cadastros",
          details: errPublico,
        },
        { status: 500 }
      );
    }

    let privadoSalvo = null;
    let privateWarning: string | null = null;

    const { data: privadoData, error: errPrivado } = await supabase
      .from("cadastros_privados")
      .insert([cadastroPrivado])
      .select()
      .single();

    if (errPrivado) {
      console.error("ERRO AO SALVAR cadastros_privados:", errPrivado);
      privateWarning = `Cadastro principal salvo, mas o espelho privado falhou: ${errPrivado.message}`;
    } else {
      privadoSalvo = privadoData;
    }

    return NextResponse.json({
      ok: true,
      message: privateWarning
        ? "Cadastro principal salvo com alerta no espelho privado."
        : "Cadastro salvo com segurança.",
      warning: privateWarning,
      data: {
        publico: publicoSalvo,
        privado: privadoSalvo,
        empresa,
        responsavel,
        abrangencia,
        whatsapp,
        email,
      },
    });
  } catch (error) {
    console.error("ERRO GERAL /api/cadastro:", error);

    const message =
      error instanceof Error ? error.message : "Erro inesperado no cadastro.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}