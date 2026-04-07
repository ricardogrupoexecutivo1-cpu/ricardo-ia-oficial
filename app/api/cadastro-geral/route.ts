import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabaseUrl =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";

const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

if (!supabaseUrl) {
  throw new Error("SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL is required");
}

if (!supabaseServiceRoleKey) {
  throw new Error("SUPABASE_SERVICE_ROLE_KEY is required");
}

const supabaseAdmin = createClient(supabaseUrl, supabaseServiceRoleKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

type AuthContext = {
  authUserId: string | null;
  authEmail: string | null;
  source: "auth" | "fallback";
};

const KNOWN_COLUMNS = new Set<string>([
  "id",
  "user_id",
  "email",
  "nome_responsavel",
  "nome_empresa",
  "whatsapp",
  "site",
  "instagram",
  "perfil_empresa",
  "perfil_profissional",
  "perfil_fornecedor",
  "perfil_prestador",
  "perfil_comprador",
  "perfil_parceiro",
  "perfil_operacao",
  "perfil_autonomo",
  "perfil_representante",
  "perfil_motorista",
  "coverage_type",
  "tipo_cobertura",
  "estado_base",
  "regiao_base",
  "cidade_base",
  "atendimento_tipo",
  "tipo_atendimento",
  "observacao_cobertura",
  "segmentos",
  "segmentos_extras",
  "segmentos_especificos",
  "produtos_servicos",
  "produtos_servicos_extras",
  "descricao_principal",
  "descricao_publica_interna",
  "nome_publico",
  "cidade_publica",
  "estado_publico",
  "descricao_publica_curta",
  "mostrar_nome_publico",
  "mostrar_descricao_publica",
  "mostrar_cidade_publica",
  "mostrar_estado_publico",
  "mostrar_segmentos_publicos",
  "mostrar_produtos_publicos",
  "status",
  "is_public",
  "origem",
  "tipo",
  "cadastro_completo",
  "created_at",
  "updated_at",
]);

let cachedColumns: Set<string> | null = null;

function normalizeEmail(value: unknown) {
  return String(value || "")
    .trim()
    .toLowerCase();
}

function normalizeText(value: unknown) {
  return String(value || "").trim();
}

function normalizeNullableText(value: unknown) {
  const text = String(value || "").trim();
  return text || null;
}

function normalizeBoolean(value: unknown) {
  return value === true;
}

function normalizeStringArray(value: unknown) {
  if (Array.isArray(value)) {
    return value
      .map((item) => String(item || "").trim())
      .filter(Boolean);
  }

  if (typeof value === "string") {
    return value
      .split(",")
      .map((item) => item.trim())
      .filter(Boolean);
  }

  return [];
}

function normalizeCoverageType(value: unknown) {
  const raw = String(value || "")
    .trim()
    .toLowerCase();

  if (!raw) return "brasil";
  if (
    raw === "brasil" ||
    raw === "brasil inteiro" ||
    raw === "nacional" ||
    raw === "nacional/brasil"
  ) {
    return "brasil";
  }
  if (raw === "estadual" || raw === "estado") return "estadual";
  if (raw === "regional" || raw === "região" || raw === "regiao") {
    return "regional";
  }
  if (raw === "municipal" || raw === "cidade") return "municipal";
  if (raw === "multilocal" || raw === "multi-local" || raw === "multi local") {
    return "multilocal";
  }

  return "brasil";
}

function coverageTypeToLabel(value: string) {
  switch (value) {
    case "brasil":
      return "Brasil";
    case "estadual":
      return "Estadual";
    case "regional":
      return "Regional";
    case "municipal":
      return "Municipal";
    case "multilocal":
      return "Multilocal";
    default:
      return "Brasil";
  }
}

function normalizeAttendanceType(value: unknown) {
  const raw = String(value || "")
    .trim()
    .toLowerCase();

  return raw === "especificos" ? "especificos" : "todos";
}

function normalizeStatus(value: unknown) {
  const raw = String(value || "")
    .trim()
    .toLowerCase();

  if (!raw) return "rascunho";

  if (
    raw === "rascunho" ||
    raw === "draft" ||
    raw === "drafts" ||
    raw === "private_draft" ||
    raw === "privado" ||
    raw === "private"
  ) {
    return "rascunho";
  }

  if (raw === "publicado" || raw === "published") return "publicado";
  if (raw === "ativo" || raw === "active") return "ativo";
  if (raw === "inativo" || raw === "inactive") return "inativo";

  return "rascunho";
}

function hasMeaningfulValue(value: any) {
  if (value === null || value === undefined) return false;
  if (typeof value === "string") return value.trim().length > 0;
  if (typeof value === "boolean") return value === true;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

function mergePreferExisting(
  existing: Record<string, any> | null | undefined,
  incoming: Record<string, any>
) {
  if (!existing) return incoming;

  const merged: Record<string, any> = { ...incoming };

  for (const [key, incomingValue] of Object.entries(incoming)) {
    const existingValue = existing[key];

    if (hasMeaningfulValue(incomingValue)) {
      merged[key] = incomingValue;
      continue;
    }

    if (hasMeaningfulValue(existingValue)) {
      merged[key] = existingValue;
    }
  }

  return merged;
}

function getCadastroScore(row: Record<string, any>) {
  const scoreFields = [
    "nome_responsavel",
    "nome_empresa",
    "whatsapp",
    "email",
    "site",
    "instagram",
    "estado_base",
    "regiao_base",
    "cidade_base",
    "observacao_cobertura",
    "descricao_principal",
    "descricao_publica_interna",
    "nome_publico",
    "descricao_publica_curta",
    "cidade_publica",
    "estado_publico",
  ];

  const booleanFields = [
    "perfil_empresa",
    "perfil_profissional",
    "perfil_fornecedor",
    "perfil_prestador",
    "perfil_comprador",
    "perfil_parceiro",
    "perfil_operacao",
    "perfil_autonomo",
    "perfil_representante",
    "perfil_motorista",
    "mostrar_nome_publico",
    "mostrar_descricao_publica",
    "mostrar_cidade_publica",
    "mostrar_estado_publico",
    "mostrar_segmentos_publicos",
    "mostrar_produtos_publicos",
    "cadastro_completo",
  ];

  const arrayFields = [
    "segmentos",
    "segmentos_extras",
    "segmentos_especificos",
    "produtos_servicos",
    "produtos_servicos_extras",
  ];

  let score = 0;

  for (const field of scoreFields) {
    if (hasMeaningfulValue(row?.[field])) score += 3;
  }

  for (const field of booleanFields) {
    if (row?.[field] === true) score += 2;
  }

  for (const field of arrayFields) {
    if (Array.isArray(row?.[field]) && row[field].length > 0) {
      score += Math.min(row[field].length, 5);
    }
  }

  if (normalizeStatus(row?.status) === "ativo") score += 4;
  if (normalizeStatus(row?.status) === "publicado") score += 3;
  if (row?.user_id) score += 4;
  if (row?.updated_at) score += 1;

  return score;
}

function sortCadastrosByBest(a: Record<string, any>, b: Record<string, any>) {
  const scoreDiff = getCadastroScore(b) - getCadastroScore(a);
  if (scoreDiff !== 0) return scoreDiff;

  const aTime = a?.updated_at ? new Date(a.updated_at).getTime() : 0;
  const bTime = b?.updated_at ? new Date(b.updated_at).getTime() : 0;

  return bTime - aTime;
}

async function getAvailableColumns() {
  if (cachedColumns) return cachedColumns;

  const rpcAttempt = await supabaseAdmin.rpc("get_table_columns", {
    table_name_input: "cadastros_gerais",
  });

  if (!rpcAttempt.error && Array.isArray(rpcAttempt.data) && rpcAttempt.data.length) {
    cachedColumns = new Set(
      rpcAttempt.data
        .map((item: any) => String(item?.column_name || "").trim())
        .filter((name: string) => name && KNOWN_COLUMNS.has(name))
    );
    return cachedColumns;
  }

  const fallback = await supabaseAdmin
    .from("cadastros_gerais")
    .select("*")
    .limit(1);

  if (!fallback.error && Array.isArray(fallback.data)) {
    const firstRow =
      fallback.data.length > 0 && fallback.data[0] ? fallback.data[0] : {};
    cachedColumns = new Set(
      Object.keys(firstRow).filter((name) => KNOWN_COLUMNS.has(name))
    );
    return cachedColumns;
  }

  cachedColumns = new Set(KNOWN_COLUMNS);
  return cachedColumns;
}

function filterPayloadByColumns(
  payload: Record<string, any>,
  availableColumns: Set<string>
) {
  const filtered: Record<string, any> = {};

  for (const [key, value] of Object.entries(payload)) {
    if (availableColumns.has(key)) {
      filtered[key] = value;
    }
  }

  return filtered;
}

async function getAuthContext(req: NextRequest): Promise<AuthContext> {
  try {
    const authHeader = req.headers.get("authorization") || "";
    const token = authHeader.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length).trim()
      : "";

    if (!token) {
      return {
        authUserId: null,
        authEmail: null,
        source: "fallback",
      };
    }

    const {
      data: { user },
      error,
    } = await supabaseAdmin.auth.getUser(token);

    if (error || !user) {
      return {
        authUserId: null,
        authEmail: null,
        source: "fallback",
      };
    }

    return {
      authUserId: user.id || null,
      authEmail: normalizeEmail(user.email),
      source: "auth",
    };
  } catch {
    return {
      authUserId: null,
      authEmail: null,
      source: "fallback",
    };
  }
}

async function listCadastrosForRead(params: {
  authUserId?: string | null;
  email?: string | null;
}) {
  const authUserId = params.authUserId || null;
  const email = normalizeEmail(params.email);

  const results: Record<string, any>[] = [];
  const seenIds = new Set<string>();

  if (authUserId) {
    const byUserId = await supabaseAdmin
      .from("cadastros_gerais")
      .select("*")
      .eq("user_id", authUserId)
      .order("updated_at", { ascending: false })
      .limit(20);

    if (byUserId.error) {
      throw new Error(`Erro ao buscar cadastro por user_id: ${byUserId.error.message}`);
    }

    for (const row of byUserId.data || []) {
      const id = String(row?.id || "");
      if (id && !seenIds.has(id)) {
        seenIds.add(id);
        results.push(row);
      }
    }
  }

  if (email) {
    const byEmail = await supabaseAdmin
      .from("cadastros_gerais")
      .select("*")
      .eq("email", email)
      .order("updated_at", { ascending: false })
      .limit(20);

    if (byEmail.error) {
      throw new Error(`Erro ao buscar cadastro por e-mail: ${byEmail.error.message}`);
    }

    for (const row of byEmail.data || []) {
      const id = String(row?.id || "");
      if (id && !seenIds.has(id)) {
        seenIds.add(id);
        results.push(row);
      }
    }
  }

  results.sort(sortCadastrosByBest);
  return results;
}

async function findBestCadastroForRead(params: {
  authUserId?: string | null;
  email?: string | null;
}) {
  const rows = await listCadastrosForRead(params);

  if (rows.length > 0) {
    return {
      data: rows[0],
      mode: rows[0]?.user_id ? ("best_user_or_email" as const) : ("best_email" as const),
      candidates: rows.length,
    };
  }

  return {
    data: null,
    mode: "none" as const,
    candidates: 0,
  };
}

async function findCadastroForWrite(params: {
  authUserId?: string | null;
  email?: string | null;
}) {
  const authUserId = params.authUserId || null;
  const email = normalizeEmail(params.email);

  if (authUserId) {
    const byUserId = await supabaseAdmin
      .from("cadastros_gerais")
      .select("*")
      .eq("user_id", authUserId)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (byUserId.error) {
      throw new Error(`Erro ao localizar cadastro para escrita por user_id: ${byUserId.error.message}`);
    }

    if (byUserId.data) {
      return {
        data: byUserId.data,
        mode: "user_id" as const,
      };
    }
  }

  if (email) {
    const byEmail = await supabaseAdmin
      .from("cadastros_gerais")
      .select("*")
      .eq("email", email)
      .order("updated_at", { ascending: false })
      .limit(1)
      .maybeSingle();

    if (byEmail.error) {
      throw new Error(`Erro ao localizar cadastro para escrita por e-mail: ${byEmail.error.message}`);
    }

    if (byEmail.data) {
      return {
        data: byEmail.data,
        mode: "email" as const,
      };
    }
  }

  return {
    data: null,
    mode: "none" as const,
  };
}

function buildPayload(body: Record<string, any>, auth: AuthContext) {
  const emailFromBody = normalizeEmail(body.email);
  const finalEmail = auth.authEmail || emailFromBody;

  const perfisSelecionados = normalizeStringArray(
    body.perfisSelecionados || body.perfis_selecionados
  );

  const segmentos = normalizeStringArray(body.segmentos);
  const produtos = normalizeStringArray(
    body.produtos || body.produtos_servicos
  );
  const segmentosEspecificos = normalizeStringArray(
    body.segmentosEspecificos || body.segmentos_especificos
  );

  const normalizedCoverageType = normalizeCoverageType(
    body.coverageType || body.coverage_type || body.tipo_cobertura
  );

  const normalizedAttendanceType = normalizeAttendanceType(
    body.atendimentoTipo || body.atendimento_tipo || body.tipo_atendimento
  );

  const normalizedStatus = normalizeStatus(body.status);

  const descricaoBase = normalizeNullableText(
    body.descricao || body.descricao_principal || body.descricao_publica_interna
  );

  const payload: Record<string, any> = {
    user_id: auth.authUserId || null,
    email: finalEmail || null,

    nome_responsavel: normalizeNullableText(
      body.nomeResponsavel || body.nome_responsavel
    ),
    nome_empresa: normalizeNullableText(
      body.nomeEmpresa || body.nome_empresa
    ),
    whatsapp: normalizeNullableText(body.whatsapp),
    site: normalizeNullableText(body.site),
    instagram: normalizeNullableText(body.instagram),

    perfil_empresa:
      perfisSelecionados.includes("Empresa") ||
      normalizeBoolean(body.perfil_empresa),
    perfil_profissional:
      perfisSelecionados.includes("Profissional") ||
      normalizeBoolean(body.perfil_profissional),
    perfil_fornecedor:
      perfisSelecionados.includes("Fornecedor") ||
      normalizeBoolean(body.perfil_fornecedor),
    perfil_prestador:
      perfisSelecionados.includes("Prestador de serviço") ||
      perfisSelecionados.includes("Prestador de servico") ||
      normalizeBoolean(body.perfil_prestador),
    perfil_comprador:
      perfisSelecionados.includes("Comprador") ||
      normalizeBoolean(body.perfil_comprador),
    perfil_parceiro:
      perfisSelecionados.includes("Parceiro") ||
      normalizeBoolean(body.perfil_parceiro),
    perfil_operacao:
      perfisSelecionados.includes("Operação") ||
      perfisSelecionados.includes("Operacao") ||
      normalizeBoolean(body.perfil_operacao),
    perfil_autonomo: normalizeBoolean(body.perfil_autonomo),
    perfil_representante:
      perfisSelecionados.includes("Representante comercial") ||
      normalizeBoolean(body.perfil_representante),
    perfil_motorista:
      perfisSelecionados.includes("Motorista / Condutor") ||
      normalizeBoolean(body.perfil_motorista),

    coverage_type: normalizedCoverageType,
    tipo_cobertura: coverageTypeToLabel(normalizedCoverageType),
    estado_base: normalizeNullableText(body.estadoBase || body.estado_base),
    regiao_base: normalizeNullableText(body.regiaoBase || body.regiao_base),
    cidade_base: normalizeNullableText(body.cidadeBase || body.cidade_base),
    atendimento_tipo: normalizedAttendanceType,
    tipo_atendimento: normalizedAttendanceType,
    observacao_cobertura: normalizeNullableText(
      body.observacaoCobertura || body.observacao_cobertura
    ),

    segmentos,
    segmentos_extras: segmentos,
    segmentos_especificos: segmentosEspecificos,
    produtos_servicos: produtos,
    produtos_servicos_extras: produtos,

    descricao_principal: descricaoBase,
    descricao_publica_interna: descricaoBase,

    nome_publico: normalizeNullableText(body.nomePublico || body.nome_publico),
    cidade_publica: normalizeNullableText(
      body.cidadePublica || body.cidade_publica
    ),
    estado_publico: normalizeNullableText(
      body.estadoPublico || body.estado_publico
    ),
    descricao_publica_curta: normalizeNullableText(
      body.descricaoPublicaCurta || body.descricao_publica_curta
    ),

    mostrar_nome_publico: normalizeBoolean(
      body.mostrarNomePublico ?? body.mostrar_nome_publico
    ),
    mostrar_descricao_publica: normalizeBoolean(
      body.mostrarDescricaoPublica ?? body.mostrar_descricao_publica
    ),
    mostrar_cidade_publica: normalizeBoolean(
      body.mostrarCidadePublica ?? body.mostrar_cidade_publica
    ),
    mostrar_estado_publico: normalizeBoolean(
      body.mostrarEstadoPublico ?? body.mostrar_estado_publico
    ),
    mostrar_segmentos_publicos: normalizeBoolean(
      body.mostrarSegmentosPublicos ?? body.mostrar_segmentos_publicos
    ),
    mostrar_produtos_publicos: normalizeBoolean(
      body.mostrarProdutosPublicos ?? body.mostrar_produtos_publicos
    ),

    status: normalizedStatus,
    is_public: normalizeBoolean(body.is_public),
    origem: normalizeText(body.origem || "cadastro_geral"),
    tipo: normalizeText(body.tipo || "completo"),
    cadastro_completo: true,
    updated_at: new Date().toISOString(),
  };

  if (!body.id) {
    payload.created_at = new Date().toISOString();
  }

  return payload;
}

export async function GET(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);
    const url = new URL(req.url);

    const emailParam = normalizeEmail(
      url.searchParams.get("email") || req.headers.get("x-cadastro-email-hint")
    );
    const finalEmail = auth.authEmail || emailParam;

    const found = await findBestCadastroForRead({
      authUserId: auth.authUserId,
      email: finalEmail,
    });

    return NextResponse.json({
      ok: true,
      cadastro: found.data,
      strategy: found.mode,
      candidates: found.candidates,
      auth: {
        source: auth.source,
        user_id: auth.authUserId,
        email: auth.authEmail,
      },
      requested_email: finalEmail || null,
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Erro ao buscar cadastro geral.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await getAuthContext(req);
    const body = (await req.json()) as Record<string, any>;
    const availableColumns = await getAvailableColumns();

    const rawPayload = buildPayload(body, auth);

    if (!rawPayload.email) {
      return NextResponse.json(
        {
          ok: false,
          error: "E-mail é obrigatório para salvar o cadastro geral.",
        },
        { status: 400 }
      );
    }

    const existing = await findCadastroForWrite({
      authUserId: auth.authUserId,
      email: rawPayload.email,
    });

    const mergedPayload = mergePreferExisting(existing.data, rawPayload);
    const payload = filterPayloadByColumns(mergedPayload, availableColumns);

    if (availableColumns.has("coverage_type")) {
      payload.coverage_type = normalizeCoverageType(payload.coverage_type);
    }

    if (availableColumns.has("tipo_cobertura")) {
      payload.tipo_cobertura = coverageTypeToLabel(
        normalizeCoverageType(payload.coverage_type || payload.tipo_cobertura)
      );
    }

    if (availableColumns.has("atendimento_tipo")) {
      payload.atendimento_tipo = normalizeAttendanceType(payload.atendimento_tipo);
    }

    if (availableColumns.has("tipo_atendimento")) {
      payload.tipo_atendimento = normalizeAttendanceType(
        payload.tipo_atendimento || payload.atendimento_tipo
      );
    }

    if (availableColumns.has("status")) {
      payload.status = normalizeStatus(payload.status);
    }

    payload.updated_at = new Date().toISOString();

    if (existing.data?.id) {
      const updatePayload = { ...payload };
      delete updatePayload.created_at;

      const writeResult = await supabaseAdmin
        .from("cadastros_gerais")
        .update(updatePayload)
        .eq("id", existing.data.id);

      if (writeResult.error) {
        throw new Error(writeResult.error.message);
      }

      return NextResponse.json({
        ok: true,
        cadastro: {
          ...existing.data,
          ...updatePayload,
          id: existing.data.id,
        },
        mode: "update",
        picked_existing_id: existing.data.id,
        auth: {
          source: auth.source,
          user_id: auth.authUserId,
          email: auth.authEmail,
        },
        message: auth.authUserId
          ? "Cadastro salvo com vínculo ao usuário autenticado."
          : "Cadastro salvo com fallback por e-mail.",
      });
    }

    const insertResult = await supabaseAdmin
      .from("cadastros_gerais")
      .insert(payload)
      .select("*")
      .single();

    if (insertResult.error) {
      throw new Error(insertResult.error.message);
    }

    return NextResponse.json({
      ok: true,
      cadastro: insertResult.data,
      mode: "insert",
      picked_existing_id: null,
      auth: {
        source: auth.source,
        user_id: auth.authUserId,
        email: auth.authEmail,
      },
      message: auth.authUserId
        ? "Cadastro salvo com vínculo ao usuário autenticado."
        : "Cadastro salvo com fallback por e-mail.",
    });
  } catch (error: any) {
    return NextResponse.json(
      {
        ok: false,
        error: error?.message || "Erro ao salvar cadastro geral.",
      },
      { status: 500 }
    );
  }
}