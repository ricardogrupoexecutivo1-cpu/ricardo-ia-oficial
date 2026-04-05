import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type SearchMode = "smart" | "email" | "nome" | "empresa" | "whatsapp";

type BaseCadastroRow = {
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

type RelatedSimpleRow = {
  cadastro_id: string;
  nome: string | null;
};

type AreaCoberturaRow = {
  cadastro_id: string;
  coverage_type: string | null;
  pais: string | null;
  estado: string | null;
  regiao: string | null;
  cidade: string | null;
  observacao: string | null;
};

type AuditCadastro = BaseCadastroRow & {
  perfis: RelatedSimpleRow[];
  segmentos: RelatedSimpleRow[];
  produtos_servicos: RelatedSimpleRow[];
  segmentos_atendidos: RelatedSimpleRow[];
  areas_cobertura: AreaCoberturaRow[];
};

function getEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function getSupabaseAdmin() {
  const url =
    getEnv("SUPABASE_URL") || getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const key =
    getEnv("SUPABASE_SERVICE_ROLE_KEY") || getEnv("SUPABASE_ANON_KEY");

  if (!url || !key) {
    throw new Error(
      "Supabase não configurado no backend. Verifique SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(url, key, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeText(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .trim()
    .toLowerCase();
}

function normalizeDigits(value: unknown) {
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

function smartMatch(row: BaseCadastroRow, term: string) {
  const textTerm = normalizeText(term);
  const digitTerm = normalizeDigits(term);

  if (!textTerm && !digitTerm) return true;

  const textCandidates = [
    row.nome_responsavel,
    row.nome_empresa,
    row.email,
    row.nome_publico,
    row.cidade_base,
    row.estado_base,
    row.cidade_publica,
    row.estado_publico,
    row.origem,
    row.cadastro_tipo,
  ]
    .map(normalizeText)
    .filter(Boolean);

  const digitCandidates = [row.whatsapp].map(normalizeDigits).filter(Boolean);

  const textFound = textTerm
    ? textCandidates.some((value) => value.includes(textTerm))
    : false;

  const digitFound = digitTerm
    ? digitCandidates.some((value) => value.includes(digitTerm))
    : false;

  return textFound || digitFound;
}

function modeMatch(row: BaseCadastroRow, term: string, mode: SearchMode) {
  if (!term.trim()) return true;

  const textTerm = normalizeText(term);
  const digitTerm = normalizeDigits(term);

  switch (mode) {
    case "email":
      return normalizeText(row.email).includes(textTerm);
    case "nome":
      return (
        normalizeText(row.nome_responsavel).includes(textTerm) ||
        normalizeText(row.nome_publico).includes(textTerm)
      );
    case "empresa":
      return normalizeText(row.nome_empresa).includes(textTerm);
    case "whatsapp":
      return normalizeDigits(row.whatsapp).includes(digitTerm);
    case "smart":
    default:
      return smartMatch(row, term);
  }
}

function buildCadastroTipo(row: BaseCadastroRow) {
  if (row.cadastro_completo === true) return "completo";
  return row.cadastro_tipo || "basico";
}

function groupByCadastroId<T extends { cadastro_id: string }>(rows: T[]) {
  const map = new Map<string, T[]>();

  for (const row of rows) {
    const current = map.get(row.cadastro_id) || [];
    current.push(row);
    map.set(row.cadastro_id, current);
  }

  return map;
}

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as {
      term?: unknown;
      mode?: unknown;
    };

    const term = typeof body.term === "string" ? body.term.trim() : "";
    const mode: SearchMode = isSearchMode(body.mode) ? body.mode : "smart";

    const supabase = getSupabaseAdmin();

    const baseSelect = [
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
    ].join(", ");

    const { data: baseData, error: baseError } = await supabase
      .from("cadastros_gerais")
      .select(baseSelect)
      .order("updated_at", { ascending: false, nullsFirst: false })
      .order("created_at", { ascending: false, nullsFirst: false });

    if (baseError) {
      throw new Error(`Erro ao ler cadastros_gerais: ${baseError.message}`);
    }

    const cadastrosBase = (baseData || []) as BaseCadastroRow[];

    const filtrados = cadastrosBase.filter((row) => modeMatch(row, term, mode));
    const ids = filtrados.map((row) => row.id);

    let perfis: RelatedSimpleRow[] = [];
    let segmentos: RelatedSimpleRow[] = [];
    let produtosServicos: RelatedSimpleRow[] = [];
    let segmentosAtendidos: RelatedSimpleRow[] = [];
    let areasCobertura: AreaCoberturaRow[] = [];

    if (ids.length > 0) {
      const [
        perfisRes,
        segmentosRes,
        produtosRes,
        atendidosRes,
        coberturaRes,
      ] = await Promise.all([
        supabase
          .from("cadastro_perfis")
          .select("cadastro_id, nome:perfil")
          .in("cadastro_id", ids),
        supabase
          .from("cadastro_segmentos")
          .select("cadastro_id, nome")
          .in("cadastro_id", ids),
        supabase
          .from("cadastro_produtos_servicos")
          .select("cadastro_id, nome")
          .in("cadastro_id", ids),
        supabase
          .from("cadastro_segmentos_atendidos")
          .select("cadastro_id, nome")
          .in("cadastro_id", ids),
        supabase
          .from("cadastro_areas_cobertura")
          .select(
            "cadastro_id, coverage_type, pais, estado, regiao, cidade, observacao"
          )
          .in("cadastro_id", ids),
      ]);

      if (perfisRes.error) {
        throw new Error(`Erro ao ler cadastro_perfis: ${perfisRes.error.message}`);
      }
      if (segmentosRes.error) {
        throw new Error(
          `Erro ao ler cadastro_segmentos: ${segmentosRes.error.message}`
        );
      }
      if (produtosRes.error) {
        throw new Error(
          `Erro ao ler cadastro_produtos_servicos: ${produtosRes.error.message}`
        );
      }
      if (atendidosRes.error) {
        throw new Error(
          `Erro ao ler cadastro_segmentos_atendidos: ${atendidosRes.error.message}`
        );
      }
      if (coberturaRes.error) {
        throw new Error(
          `Erro ao ler cadastro_areas_cobertura: ${coberturaRes.error.message}`
        );
      }

      perfis = (perfisRes.data || []) as RelatedSimpleRow[];
      segmentos = (segmentosRes.data || []) as RelatedSimpleRow[];
      produtosServicos = (produtosRes.data || []) as RelatedSimpleRow[];
      segmentosAtendidos = (atendidosRes.data || []) as RelatedSimpleRow[];
      areasCobertura = (coberturaRes.data || []) as AreaCoberturaRow[];
    }

    const perfisMap = groupByCadastroId(perfis);
    const segmentosMap = groupByCadastroId(segmentos);
    const produtosMap = groupByCadastroId(produtosServicos);
    const atendidosMap = groupByCadastroId(segmentosAtendidos);
    const coberturaMap = groupByCadastroId(areasCobertura);

    const cadastros: AuditCadastro[] = filtrados.map((row) => ({
      ...row,
      cadastro_tipo: buildCadastroTipo(row),
      perfis: perfisMap.get(row.id) || [],
      segmentos: segmentosMap.get(row.id) || [],
      produtos_servicos: produtosMap.get(row.id) || [],
      segmentos_atendidos: atendidosMap.get(row.id) || [],
      areas_cobertura: coberturaMap.get(row.id) || [],
    }));

    const totals = {
      total: cadastros.length,
      publicos: cadastros.filter((item) => item.is_public).length,
      privados: cadastros.filter((item) => !item.is_public).length,
      rascunhos: cadastros.filter(
        (item) => normalizeText(item.status || "rascunho") === "rascunho"
      ).length,
      ativos: cadastros.filter(
        (item) => normalizeText(item.status) === "ativo"
      ).length,
    };

    return Response.json({
      ok: true,
      mode,
      term,
      totals,
      cadastros,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao auditar os cadastros reais do Guardião.";

    return Response.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}