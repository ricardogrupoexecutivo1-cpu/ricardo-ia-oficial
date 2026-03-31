import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type JsonRecord = Record<string, unknown>;

type CompanyRow = {
  id: string;
  email?: string | null;
  created_at?: string | null;
};

type AccountRow = {
  id: string;
  company_id: string;
  name: string;
  type: string;
  currency: string | null;
  initial_balance: number | null;
  current_balance: number | null;
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
const ACCOUNTS_TABLE = "finance_accounts";
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

  if (raw === "caixa") return "cash";
  if (raw === "banco") return "bank";
  if (raw === "pix") return "pix";
  if (raw === "cartao") return "card";
  if (raw === "cartão") return "card";
  if (raw === "digital") return "digital";
  if (raw === "investimento") return "investment";
  if (raw === "outros") return "other";

  if (
    raw === "cash" ||
    raw === "bank" ||
    raw === "pix" ||
    raw === "card" ||
    raw === "digital" ||
    raw === "investment" ||
    raw === "other"
  ) {
    return raw;
  }

  return "cash";
}

function normalizeCurrency(value: unknown): string {
  const raw = normalizeText(value).toUpperCase();
  return raw || "BRL";
}

function normalizeColor(value: unknown): string {
  const raw = normalizeText(value);
  if (!raw) return "#f59e0b";

  const isHex = /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(raw);
  return isHex ? raw : "#f59e0b";
}

function normalizeNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const text = String(value ?? "")
    .trim()
    .replace(/\s/g, "")
    .replace(/\./g, "")
    .replace(",", ".");

  const parsed = Number(text);
  return Number.isFinite(parsed) ? parsed : 0;
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
      "Nenhuma empresa encontrada para o e-mail informado. Cadastre ou vincule a empresa antes de criar contas.",
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

    const accountsResult = await supabase
      .from(ACCOUNTS_TABLE)
      .select(
        "id, company_id, name, type, currency, initial_balance, current_balance, color, description, is_active, sort_order, created_at, updated_at",
      )
      .eq("company_id", companyResolved.companyId)
      .order("sort_order", { ascending: true })
      .order("name", { ascending: true });

    if (accountsResult.error) {
      return json(
        {
          ok: false,
          error: accountsResult.error.message,
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
      items: accountsResult.data satisfies AccountRow[],
      message:
        "Contas financeiras carregadas com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao carregar contas.",
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
    const currency = normalizeCurrency(body.currency);
    const initialBalance = normalizeNumber(body.initial_balance);
    const currentBalance =
      body.current_balance === undefined || body.current_balance === null
        ? initialBalance
        : normalizeNumber(body.current_balance);
    const color = normalizeColor(body.color);
    const description = normalizeText(body.description);
    const sortOrder = normalizeSortOrder(body.sort_order);
    const isActive =
      typeof body.is_active === "boolean" ? body.is_active : true;

    if (!name) {
      return json(
        {
          ok: false,
          error: "Informe o nome da conta.",
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

    const existingAccount = await supabase
      .from(ACCOUNTS_TABLE)
      .select("id, name")
      .eq("company_id", companyResolved.companyId)
      .ilike("name", name)
      .limit(1)
      .maybeSingle<{ id: string; name: string }>();

    if (existingAccount.error) {
      return json(
        {
          ok: false,
          error: `Erro ao validar conta existente: ${existingAccount.error.message}`,
        },
        500,
      );
    }

    if (existingAccount.data?.id) {
      return json(
        {
          ok: false,
          error: "Já existe uma conta com esse nome para esta empresa.",
          existingId: existingAccount.data.id,
        },
        409,
      );
    }

    const insertResult = await supabase
      .from(ACCOUNTS_TABLE)
      .insert({
        company_id: companyResolved.companyId,
        name,
        type,
        currency,
        initial_balance: initialBalance,
        current_balance: currentBalance,
        color,
        description: description || null,
        is_active: isActive,
        sort_order: sortOrder,
      })
      .select(
        "id, company_id, name, type, currency, initial_balance, current_balance, color, description, is_active, sort_order, created_at, updated_at",
      )
      .single<AccountRow>();

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
          "Conta criada com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
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
            : "Erro interno ao criar conta.",
      },
      500,
    );
  }
}