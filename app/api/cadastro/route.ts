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
    const whatsapp = asText(body?.whatsapp);
    const email = asText(body?.email);
    const descricao = asText(body?.descricao);
    const abrangencia = asText(body?.abrangencia);
    const segmentoPersonalizado = asText(body?.segmentoPersonalizado);
    const atividadePersonalizada = asText(body?.atividadePersonalizada);

    const areas = asArrayText(body?.area);
    const atividades = asArrayText(body?.atividades);

    const areaFinal = [...areas, ...(segmentoPersonalizado ? [segmentoPersonalizado] : [])]
      .filter(Boolean)
      .join(", ");

    const atividadesFinal = [
      ...atividades,
      ...(atividadePersonalizada ? [atividadePersonalizada] : []),
    ]
      .filter(Boolean)
      .join(", ");

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

    if (!whatsapp) {
      return NextResponse.json(
        { ok: false, error: "Informe o WhatsApp." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "Informe o e-mail." },
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
      created_at: new Date().toISOString(),
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
      created_at: new Date().toISOString(),
    };

    console.log("CADASTRO PUBLICO:", cadastroPublico);
    console.log("CADASTRO PRIVADO:", cadastroPrivado);

    const { error: errPublico } = await supabase
      .from("cadastros")
      .insert([cadastroPublico]);

    if (errPublico) {
      console.error("ERRO AO SALVAR cadastros:", errPublico);

      return NextResponse.json(
        {
          ok: false,
          error: `Erro ao salvar cadastro público: ${errPublico.message}`,
          details: errPublico,
        },
        { status: 500 }
      );
    }

    const { error: errPrivado } = await supabase
      .from("cadastros_privados")
      .insert([cadastroPrivado]);

    if (errPrivado) {
      console.error("ERRO AO SALVAR cadastros_privados:", errPrivado);

      return NextResponse.json(
        {
          ok: false,
          error: `Erro ao salvar cadastro privado: ${errPrivado.message}`,
          details: errPrivado,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Cadastro salvo com segurança.",
      data: {
        empresa,
        responsavel,
        abrangencia,
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