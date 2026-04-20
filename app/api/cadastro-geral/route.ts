import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const DB_TIMEOUT_MS = 12000;

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

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function normalizeEmail(value: unknown) {
  return normalizeText(value).toLowerCase();
}

function normalizeBoolean(value: unknown, fallback = false) {
  return typeof value === "boolean" ? value : fallback;
}

function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  label: string
): Promise<T> {
  return new Promise<T>((resolve, reject) => {
    const timer = setTimeout(() => {
      reject(new Error(`${label} demorou mais que ${ms}ms.`));
    }, ms);

    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (error) => {
        clearTimeout(timer);
        reject(error);
      }
    );
  });
}

function getServiceSupabase() {
  const url = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!url) {
    throw new Error("SUPABASE_URL não configurada.");
  }

  if (!serviceKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  return createClient(url, serviceKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function findCadastroByEmail(
  supabase: ReturnType<typeof getServiceSupabase>,
  email: string
) {
  const finalEmail = normalizeEmail(email);

  if (!finalEmail) {
    return { data: null, error: null };
  }

  return await withTimeout(
    supabase
      .from("cadastros_gerais")
      .select("*")
      .eq("email", finalEmail)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle(),
    DB_TIMEOUT_MS,
    "Busca de cadastro por e-mail"
  );
}

export async function GET(req: Request) {
  const startedAt = Date.now();

  try {
    const supabase = getServiceSupabase();
    const url = new URL(req.url);

    const emailFromQuery = normalizeEmail(url.searchParams.get("email"));
    const emailHint = normalizeEmail(req.headers.get("x-cadastro-email-hint"));
    const finalEmail = emailFromQuery || emailHint;

    if (!finalEmail) {
      return jsonNoStore({
        ok: true,
        cadastro: null,
        mode: "not_found",
        tookMs: Date.now() - startedAt,
      });
    }

    const found = await findCadastroByEmail(supabase, finalEmail);

    if (found.error) {
      return jsonNoStore(
        {
          ok: false,
          error: found.error.message || "Erro ao buscar cadastro por e-mail.",
          tookMs: Date.now() - startedAt,
        },
        { status: 500 }
      );
    }

    return jsonNoStore({
      ok: true,
      cadastro: found.data || null,
      mode: found.data ? "found_by_email" : "not_found",
      tookMs: Date.now() - startedAt,
    });
  } catch (error: any) {
    console.error("GET /api/cadastro-geral falhou:", error);

    return jsonNoStore(
      {
        ok: false,
        error: error?.message || "Erro inesperado no GET do cadastro geral.",
        tookMs: Date.now() - startedAt,
      },
      { status: 500 }
    );
  }
}

export async function POST(req: Request) {
  const startedAt = Date.now();

  try {
    const supabase = getServiceSupabase();
    const body = await req.json();

    const finalEmail = normalizeEmail(body?.email);

    if (!finalEmail) {
      return jsonNoStore(
        {
          ok: false,
          error: "Informe um e-mail válido antes de salvar.",
          tookMs: Date.now() - startedAt,
        },
        { status: 400 }
      );
    }

    const payload = {
      nome_responsavel: normalizeText(body?.nomeResponsavel),
      nome_empresa: normalizeText(body?.nomeEmpresa),
      whatsapp: normalizeText(body?.whatsapp),
      email: finalEmail,
      site: normalizeText(body?.site),
      instagram: normalizeText(body?.instagram),

      coverage_type: normalizeText(body?.coverageType) || "brasil",
      estado_base: normalizeText(body?.estadoBase),
      regiao_base: normalizeText(body?.regiaoBase),
      cidade_base: normalizeText(body?.cidadeBase),
      observacao_cobertura: normalizeText(body?.observacaoCobertura),
      atendimento_tipo: normalizeText(body?.atendimentoTipo) || "todos",

      descricao_publica: normalizeText(body?.descricao),

      status: "rascunho",
      is_public: false,
      origem: "cadastro_geral",

      nome_publico: normalizeText(body?.nomePublico),
      descricao_publica_curta: normalizeText(body?.descricaoPublicaCurta),
      cidade_publica: normalizeText(body?.cidadePublica),
      estado_publico: normalizeText(body?.estadoPublico),

      mostrar_nome_publico: normalizeBoolean(body?.mostrarNomePublico, true),
      mostrar_descricao_publica: normalizeBoolean(
        body?.mostrarDescricaoPublica,
        true
      ),
      mostrar_cidade_publica: normalizeBoolean(body?.mostrarCidadePublica, true),
      mostrar_estado_publico: normalizeBoolean(body?.mostrarEstadoPublico, true),
      mostrar_segmentos_publicos: normalizeBoolean(
        body?.mostrarSegmentosPublicos,
        true
      ),
      mostrar_produtos_publicos: normalizeBoolean(
        body?.mostrarProdutosPublicos,
        true
      ),

      cadastro_tipo: "completo",
      cadastro_completo: true,
      prazo_conclusao: null,
      bloqueado: false,
      tipo_pessoa: null,
      documento_privado: null,
    };

    const existing = await findCadastroByEmail(supabase, finalEmail);

    if (existing.error) {
      return jsonNoStore(
        {
          ok: false,
          error:
            existing.error.message ||
            "Erro ao localizar cadastro existente por e-mail.",
          tookMs: Date.now() - startedAt,
        },
        { status: 500 }
      );
    }

    if (existing.data?.id) {
      const updateResult = await withTimeout(
        supabase
          .from("cadastros_gerais")
          .update(payload)
          .eq("id", existing.data.id),
        DB_TIMEOUT_MS,
        "Update do cadastro por e-mail"
      );

      if (updateResult.error) {
        return jsonNoStore(
          {
            ok: false,
            error:
              updateResult.error.message ||
              "Erro ao atualizar cadastro por e-mail.",
            tookMs: Date.now() - startedAt,
          },
          { status: 500 }
        );
      }

      return jsonNoStore({
        ok: true,
        cadastro: null,
        mode: "update_by_email",
        tookMs: Date.now() - startedAt,
      });
    }

    const insertResult = await withTimeout(
      supabase.from("cadastros_gerais").insert(payload),
      DB_TIMEOUT_MS,
      "Insert do cadastro geral"
    );

    if (insertResult.error) {
      return jsonNoStore(
        {
          ok: false,
          error: insertResult.error.message || "Erro ao inserir cadastro geral.",
          tookMs: Date.now() - startedAt,
        },
        { status: 500 }
      );
    }

    return jsonNoStore({
      ok: true,
      cadastro: null,
      mode: "insert",
      tookMs: Date.now() - startedAt,
    });
  } catch (error: any) {
    console.error("POST /api/cadastro-geral falhou:", error);

    return jsonNoStore(
      {
        ok: false,
        error: error?.message || "Erro inesperado no POST do cadastro geral.",
        tookMs: Date.now() - startedAt,
      },
      { status: 500 }
    );
  }
}