import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type JsonRecord = Record<string, unknown>;

type CompanyRow = {
  id: string;
  email?: string | null;
  created_at?: string | null;
};

type CategoryRow = {
  id: string;
  company_id: string;
  name: string;
  type: string;
  color: string | null;
  description: string | null;
  is_active: boolean | null;
  sort_order: number | null;
  created_at: string | null;
  updated_at?: string | null;
};

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "";

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const DEFAULT_FALLBACK_EMAIL = "grupoexecutivoservice1@gmail.com";
const CATEGORIES_TABLE = "finance_categories";
const COMPANIES_TABLE = "companies";

function json(data: JsonRecord, status = 200): NextResponse<JsonRecord> {
  return NextResponse.json(data, { status });
}

function normalizeEmail(value: unknown): string {
  return String(value || "").trim().toLowerCase();
}

function normalizeText(value: unknown): string {
  return String(value || "").trim();
}

function normalizeType(value: unknown): string {
  const raw = normalizeText(value).toLowerCase();

  if (raw === "receita") return "income";
  if (raw === "despesa") return "expense";
  if (raw === "investimento") return "investment";
  if (raw === "transferencia") return "transfer";
  if (raw === "transferência") return "transfer";

  if (
    raw === "income" ||
    raw === "expense" ||
    raw === "investment" ||
    raw === "transfer"
  ) {
    return raw;
  }

  return "expense";
}

function normalizeColor(value: unknown): string {
  const raw = normalizeText(value);
  if (!raw) return "#22c55e";

  const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw);
  return isHex ? raw : "#22c55e";
}

function normalizeSortOrder(value: unknown): number {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
}

function getSupabase(): SupabaseClient | null {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function resolveCompanyId(
  supabase: SupabaseClient,
  email: string,
): Promise<{ companyId: string | null; error?: string; strategy?: string }> {
  const normalizedEmail = normalizeEmail(email);

  if (normalizedEmail) {
    const byEmail = await supabase
      .from(COMPANIES_TABLE)
      .select("id, email, created_at")
      .ilike("email", normalizedEmail)
      .order("created_at", { ascending: false })
      .limit(1)
      .maybeSingle<CompanyRow>();

    if (byEmail.error) {
      return {
        companyId: null,
        error: `Erro ao localizar empresa por e-mail: ${byEmail.error.message}`,
      };
    }

    if (byEmail.data?.id) {
      return {
        companyId: byEmail.data.id,
        strategy: "email",
      };
    }
  }

  const latestCompany = await supabase
    .from(COMPANIES_TABLE)
    .select("id, email, created_at")
    .order("created_at", { ascending: false })
    .limit(1)
    .maybeSingle<CompanyRow>();

  if (latestCompany.error) {
    return {
      companyId: null,
      error: `Erro ao localizar empresa mais recente: ${latestCompany.error.message}`,
    };
  }

  if (latestCompany.data?.id && normalizedEmail === DEFAULT_FALLBACK_EMAIL) {
    return {
      companyId: latestCompany.data.id,
      strategy: "latest_company_fallback",
    };
  }

  return {
    companyId: null,
    error:
      "Nenhuma empresa encontrada para o e-mail informado. Cadastre ou vincule a empresa antes de criar categorias.",
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return json(
        {
          ok: false,
          error:
            "Variáveis do Supabase não configuradas. Verifique SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
        },
        500,
      );
    }

    const { searchParams } = new URL(request.url);

    const rawEmail =
      searchParams.get("email") ||
      searchParams.get("userEmail") ||
      DEFAULT_FALLBACK_EMAIL;

    const email = normalizeEmail(rawEmail);

    const companyResolved = await resolveCompanyId(supabase, email);

    if (!companyResolved.companyId) {
      return json(
        {
          ok: false,
          error: companyResolved.error || "Empresa não encontrada.",
          email,
          items: [],
        },
        404,
      );
    }

    const categoriesResult = await supabase
      .from(CATEGORIES_TABLE)
      .select(
        "id, company_id, name, type, color, description, is_active, sort_order, created_at, updated_at",
      )
      .eq("company_id", companyResolved.companyId)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (categoriesResult.error) {
      return json(
        {
          ok: false,
          error: categoriesResult.error.message,
          email,
          companyId: companyResolved.companyId,
          items: [],
        },
        500,
      );
    }

    return json({
      ok: true,
      email,
      companyId: companyResolved.companyId,
      strategy: companyResolved.strategy || null,
      items: categoriesResult.data satisfies CategoryRow[],
      message:
        "Categorias financeiras carregadas com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao carregar categorias.",
      },
      500,
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabase();

    if (!supabase) {
      return json(
        {
          ok: false,
          error:
            "Variáveis do Supabase não configuradas. Verifique SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY.",
        },
        500,
      );
    }

    const body = (await request.json()) as JsonRecord;

    const email = normalizeEmail(body.email || DEFAULT_FALLBACK_EMAIL);
    const name = normalizeText(body.name);
    const type = normalizeType(body.type);
    const color = normalizeColor(body.color);
    const description = normalizeText(body.description);
    const sortOrder = normalizeSortOrder(body.sort_order);
    const isActive =
      typeof body.is_active === "boolean" ? body.is_active : true;

    if (!name) {
      return json(
        {
          ok: false,
          error: "Informe o nome da categoria.",
        },
        400,
      );
    }

    const companyResolved = await resolveCompanyId(supabase, email);

    if (!companyResolved.companyId) {
      return json(
        {
          ok: false,
          error: companyResolved.error || "Empresa não encontrada.",
          email,
        },
        404,
      );
    }

    const existingCategory = await supabase
      .from(CATEGORIES_TABLE)
      .select("id, name")
      .eq("company_id", companyResolved.companyId)
      .ilike("name", name)
      .limit(1)
      .maybeSingle<{ id: string; name: string }>();

    if (existingCategory.error) {
      return json(
        {
          ok: false,
          error: `Erro ao validar categoria existente: ${existingCategory.error.message}`,
        },
        500,
      );
    }

    if (existingCategory.data?.id) {
      return json(
        {
          ok: false,
          error: "Já existe uma categoria com esse nome para esta empresa.",
          existingId: existingCategory.data.id,
        },
        409,
      );
    }

    const insertResult = await supabase
      .from(CATEGORIES_TABLE)
      .insert({
        company_id: companyResolved.companyId,
        name,
        type,
        color,
        description: description || null,
        is_active: isActive,
        sort_order: sortOrder,
      })
      .select(
        "id, company_id, name, type, color, description, is_active, sort_order, created_at, updated_at",
      )
      .single<CategoryRow>();

    if (insertResult.error) {
      return json(
        {
          ok: false,
          error: insertResult.error.message,
        },
        500,
      );
    }

    return json(
      {
        ok: true,
        message:
          "Categoria criada com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
        strategy: companyResolved.strategy || null,
        item: insertResult.data,
      },
      201,
    );
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao criar categoria.",
      },
      500,
    );
  }
}