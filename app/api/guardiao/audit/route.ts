import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchMode = "smart" | "email" | "nome" | "empresa" | "whatsapp";

type CadastroRow = {
  id: string;
  nome_responsavel: string | null;
  nome_empresa: string | null;
  email: string | null;
  whatsapp: string | null;
  cidade_base: string | null;
  estado_base: string | null;
  cidade_publica: string | null;
  estado_publico: string | null;
  nome_publico: string | null;
  coverage_type: string | null;
  atendimento_tipo: string | null;
  status: string | null;
  is_public: boolean | null;
  origem: string | null;
  cadastro_tipo: string | null;
  cadastro_completo: boolean | null;
  created_at: string | null;
  updated_at: string | null;
};

type GenericRow = Record<string, unknown>;

type AuditBody = {
  term?: unknown;
  mode?: unknown;
};

function json(body: unknown, init?: number | ResponseInit): NextResponse {
  if (typeof init === "number") {
    return NextResponse.json(body, { status: init });
  }

  return NextResponse.json(body, init);
}

function normalizeText(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function onlyDigits(value: unknown) {
  return String(value ?? "").replace(/\D/g, "");
}

function isSearchMode(value: unknown): value is SearchMode {
  return (
    value === "smart" ||
    value === "email" ||
    value === "nome" ||
    value === "empresa" ||
    value === "whatsapp"
  );
}

function getSupabaseServerClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL não encontrado.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não encontrada.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function getCadastroId(row: GenericRow): string {
  const possible =
    row.cadastro_id ??
    row.cadastroId ??
    row.cadastro ??
    row.id_cadastro ??
    row.cadastros_gerais_id ??
    "";

  return String(possible || "");
}

function extractBestText(row: GenericRow): string {
  const preferredKeys = [
    "nome",
    "title",
    "titulo",
    "perfil",
    "segmento",
    "produto",
    "servico",
    "servico_nome",
    "produto_nome",
    "descricao",
    "description",
    "label",
    "valor",
    "texto",
    "observacao",
    "tipo",
    "coverage_type",
    "cidade",
    "estado",
    "regiao",
    "pais",
  ];

  for (const key of preferredKeys) {
    const value = row[key];
    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  for (const [key, value] of Object.entries(row)) {
    if (
      key !== "id" &&
      key !== "cadastro_id" &&
      key !== "created_at" &&
      key !== "updated_at" &&
      typeof value === "string" &&
      value.trim()
    ) {
      return value.trim();
    }
  }

  return "";
}

function buildVocabulary(rows: GenericRow[]) {
  return rows
    .map((row) => extractBestText(row))
    .filter((value) => value.length > 0)
    .map((value) => normalizeText(value));
}

function buildCoverageVocabulary(rows: GenericRow[]) {
  return rows.flatMap((row) => {
    const values = [
      row.coverage_type,
      row.pais,
      row.estado,
      row.regiao,
      row.cidade,
      row.observacao,
      row.descricao,
      row.nome,
      extractBestText(row),
    ];

    return values
      .filter(
        (value) => typeof value === "string" && String(value).trim().length > 0,
      )
      .map((value) => normalizeText(value));
  });
}

function splitSearchWords(term: string) {
  return normalizeText(term)
    .split(/\s+/)
    .map((word) => word.trim())
    .filter((word) => word.length > 1);
}

function removeIgnoredWords(words: string[]) {
  const ignored = new Set([
    "ltda",
    "ltda.",
    "me",
    "mei",
    "eireli",
    "sa",
    "s.a",
    "de",
    "da",
    "do",
    "das",
    "dos",
    "e",
  ]);

  const filtered = words.filter((word) => !ignored.has(word));
  return filtered.length > 0 ? filtered : words;
}

function textIncludesAllWords(text: string, words: string[]) {
  if (!words.length) return true;
  return words.every((word) => text.includes(word));
}

function shouldUseWhatsappMatch(
  rawTerm: string,
  digitTerm: string,
  mode: SearchMode,
) {
  if (mode === "whatsapp") {
    return digitTerm.length >= 2;
  }

  if (mode !== "smart") {
    return false;
  }

  const normalized = String(rawTerm ?? "").trim();

  const nonDigitLength = normalized.replace(/[\d\s().\-+]/g, "").length;
  return digitTerm.length >= 3 && nonDigitLength === 0;
}

function matchesSearch(
  row: CadastroRow,
  term: string,
  mode: SearchMode,
  related: {
    perfis: GenericRow[];
    segmentos: GenericRow[];
    produtos: GenericRow[];
    segmentosAtendidos: GenericRow[];
    areas: GenericRow[];
  },
) {
  if (!term.trim()) return true;

  const normalizedTerm = normalizeText(term);
  const digitTerm = onlyDigits(term);

  const nomeResponsavel = normalizeText(row.nome_responsavel);
  const nomeEmpresa = normalizeText(row.nome_empresa);
  const nomePublico = normalizeText(row.nome_publico);
  const email = normalizeText(row.email);
  const whatsapp = onlyDigits(row.whatsapp);
  const cidadeBase = normalizeText(row.cidade_base);
  const estadoBase = normalizeText(row.estado_base);
  const cidadePublica = normalizeText(row.cidade_publica);
  const estadoPublico = normalizeText(row.estado_publico);
  const origem = normalizeText(row.origem);
  const cadastroTipo = normalizeText(row.cadastro_tipo);
  const atendimentoTipo = normalizeText(row.atendimento_tipo);

  const vocabularyBlob = [
    ...buildVocabulary(related.perfis),
    ...buildVocabulary(related.segmentos),
    ...buildVocabulary(related.produtos),
    ...buildVocabulary(related.segmentosAtendidos),
    ...buildCoverageVocabulary(related.areas),
  ];

  const fullText = [
    nomeResponsavel,
    nomeEmpresa,
    nomePublico,
    email,
    cidadeBase,
    estadoBase,
    cidadePublica,
    estadoPublico,
    origem,
    cadastroTipo,
    atendimentoTipo,
    ...vocabularyBlob,
  ]
    .filter(Boolean)
    .join(" ");

  const words = removeIgnoredWords(splitSearchWords(term));
  const allowWhatsappMatch = shouldUseWhatsappMatch(term, digitTerm, mode);

  if (mode === "email") {
    return email.includes(normalizedTerm);
  }

  if (mode === "nome") {
    return textIncludesAllWords(
      [nomeResponsavel, nomePublico].filter(Boolean).join(" "),
      words,
    );
  }

  if (mode === "empresa") {
    return textIncludesAllWords(
      [nomeEmpresa, nomePublico].filter(Boolean).join(" "),
      words,
    );
  }

  if (mode === "whatsapp") {
    return digitTerm.length >= 2 && whatsapp.includes(digitTerm);
  }

  if (allowWhatsappMatch && whatsapp.includes(digitTerm)) {
    return true;
  }

  if (normalizedTerm && fullText.includes(normalizedTerm)) {
    return true;
  }

  return textIncludesAllWords(fullText, words);
}

function mapRelated(rows: GenericRow[]) {
  return rows.map((row) => ({
    cadastro_id: getCadastroId(row),
    nome: extractBestText(row) || null,
    raw: row,
  }));
}

export async function POST(request: NextRequest) {
  try {
    const body = (await request.json().catch(() => null)) as AuditBody | null;

    if (!body || typeof body !== "object") {
      return json({ ok: false, error: "Body inválido." }, 400);
    }

    const term = String(body.term ?? "").trim();
    const mode: SearchMode = isSearchMode(body.mode) ? body.mode : "smart";

    const supabase = getSupabaseServerClient();

    const { data: baseRows, error: baseError } = await supabase
      .from("cadastros_gerais")
      .select(
        [
          "id",
          "nome_responsavel",
          "nome_empresa",
          "email",
          "whatsapp",
          "cidade_base",
          "estado_base",
          "cidade_publica",
          "estado_publico",
          "nome_publico",
          "coverage_type",
          "atendimento_tipo",
          "status",
          "is_public",
          "origem",
          "cadastro_tipo",
          "cadastro_completo",
          "created_at",
          "updated_at",
        ].join(","),
      )
      .order("created_at", { ascending: false })
      .limit(1000);

    if (baseError) {
      throw new Error(`Erro ao ler cadastros_gerais: ${baseError.message}`);
    }

    const cadastros = ((baseRows ?? []) as unknown as CadastroRow[]).filter(
      (item) => item && typeof item.id === "string",
    );

    if (cadastros.length === 0) {
      return json({
        ok: true,
        mode,
        term,
        totals: {
          total: 0,
          publicos: 0,
          privados: 0,
          rascunhos: 0,
          ativos: 0,
        },
        cadastros: [],
      });
    }

    const cadastroIds = cadastros.map((item) => item.id);

    const [
      perfisResp,
      segmentosResp,
      produtosResp,
      segmentosAtendidosResp,
      areasResp,
    ] = await Promise.all([
      supabase.from("cadastro_perfis").select("*").in("cadastro_id", cadastroIds),
      supabase
        .from("cadastro_segmentos")
        .select("*")
        .in("cadastro_id", cadastroIds),
      supabase
        .from("cadastro_produtos_servicos")
        .select("*")
        .in("cadastro_id", cadastroIds),
      supabase
        .from("cadastro_segmentos_atendidos")
        .select("*")
        .in("cadastro_id", cadastroIds),
      supabase
        .from("cadastro_areas_cobertura")
        .select("*")
        .in("cadastro_id", cadastroIds),
    ]);

    if (perfisResp.error) {
      throw new Error(`Erro ao ler cadastro_perfis: ${perfisResp.error.message}`);
    }

    if (segmentosResp.error) {
      throw new Error(
        `Erro ao ler cadastro_segmentos: ${segmentosResp.error.message}`,
      );
    }

    if (produtosResp.error) {
      throw new Error(
        `Erro ao ler cadastro_produtos_servicos: ${produtosResp.error.message}`,
      );
    }

    if (segmentosAtendidosResp.error) {
      throw new Error(
        `Erro ao ler cadastro_segmentos_atendidos: ${segmentosAtendidosResp.error.message}`,
      );
    }

    if (areasResp.error) {
      throw new Error(
        `Erro ao ler cadastro_areas_cobertura: ${areasResp.error.message}`,
      );
    }

    const perfis = (perfisResp.data ?? []) as GenericRow[];
    const segmentos = (segmentosResp.data ?? []) as GenericRow[];
    const produtos = (produtosResp.data ?? []) as GenericRow[];
    const segmentosAtendidos = (segmentosAtendidosResp.data ?? []) as GenericRow[];
    const areas = (areasResp.data ?? []) as GenericRow[];

    const completos = cadastros.map((row) => ({
      ...row,
      perfis: mapRelated(perfis.filter((item) => getCadastroId(item) === row.id)),
      segmentos: mapRelated(
        segmentos.filter((item) => getCadastroId(item) === row.id),
      ),
      produtos_servicos: mapRelated(
        produtos.filter((item) => getCadastroId(item) === row.id),
      ),
      segmentos_atendidos: mapRelated(
        segmentosAtendidos.filter((item) => getCadastroId(item) === row.id),
      ),
      areas_cobertura: areas.filter((item) => getCadastroId(item) === row.id),
    }));

    const filtrados = completos.filter((row) =>
      matchesSearch(row, term, mode, {
        perfis: row.perfis ?? [],
        segmentos: row.segmentos ?? [],
        produtos: row.produtos_servicos ?? [],
        segmentosAtendidos: row.segmentos_atendidos ?? [],
        areas: row.areas_cobertura ?? [],
      }),
    );

    const totals = {
      total: filtrados.length,
      publicos: filtrados.filter((item) => item.is_public).length,
      privados: filtrados.filter((item) => !item.is_public).length,
      rascunhos: filtrados.filter(
        (item) => (item.status || "rascunho").toLowerCase() === "rascunho",
      ).length,
      ativos: filtrados.filter(
        (item) => (item.status || "").toLowerCase() === "ativo",
      ).length,
    };

    return json({
      ok: true,
      mode,
      term,
      totals,
      cadastros: filtrados,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro inesperado ao auditar cadastros no Guardião.";

    console.error("POST /api/guardiao/audit ERROR:", error);

    return json(
      {
        ok: false,
        error: message,
      },
      500,
    );
  }
}