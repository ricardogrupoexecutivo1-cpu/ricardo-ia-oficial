import { NextResponse } from "next/server";
import { supabase } from "@/lib/supabase";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function jsonNoStore(body: unknown, init?: ResponseInit) {
  const res = NextResponse.json(body, init);

  res.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");

  return res;
}

export async function GET() {
  return jsonNoStore({
    ok: true,
    message: "API funcionando",
  });
}

export async function POST(req: Request) {
  try {
    const body = await req.json();

    console.log("DADOS RECEBIDOS:", body);

    const { data, error } = await supabase
      .from("cadastros_gerais")
      .insert([
        {
          nome_responsavel: body.nomeResponsavel,
          nome_empresa: body.nomeEmpresa,
          whatsapp: body.whatsapp,
          email: body.email,
          site: body.site,
          instagram: body.instagram,
          coverage_type: body.coverageType,
          estado_base: body.estadoBase,
          regiao_base: body.regiaoBase,
          cidade_base: body.cidadeBase,
          observacao_cobertura: body.observacaoCobertura,
          atendimento_tipo: body.atendimentoTipo,
          descricao_publica: body.descricao,
          nome_publico: body.nomePublico,
          descricao_publica_curta: body.descricaoPublicaCurta,
          cidade_publica: body.cidadePublica,
          estado_publico: body.estadoPublico,
          mostrar_nome_publico: body.mostrarNomePublico,
          mostrar_descricao_publica: body.mostrarDescricaoPublica,
          mostrar_cidade_publica: body.mostrarCidadePublica,
          mostrar_estado_publico: body.mostrarEstadoPublico,
          mostrar_segmentos_publicos: body.mostrarSegmentosPublicos,
          mostrar_produtos_publicos: body.mostrarProdutosPublicos,
        },
      ]);

    if (error) {
      console.error("ERRO SUPABASE:", error);
      return jsonNoStore(
        { ok: false, error: error.message },
        { status: 500 }
      );
    }

    return jsonNoStore({
      ok: true,
      message: "Cadastro salvo com sucesso",
      data,
    });
  } catch (error) {
    console.error("ERRO NO POST:", error);

    return jsonNoStore(
      { ok: false, error: "Erro ao processar cadastro" },
      { status: 500 }
    );
  }
}