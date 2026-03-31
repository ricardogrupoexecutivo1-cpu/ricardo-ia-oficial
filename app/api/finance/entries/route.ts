import { NextRequest, NextResponse } from "next/server";
import { createClient, type SupabaseClient } from "@supabase/supabase-js";

type JsonRecord = Record<string, unknown>;

type CompanyRow = {
  id: string;
  email?: string | null;
  created_at?: string | null;
};

type EntryRow = {
  id: string;
  company_id: string;
  title?: string | null;
  type: string | null;
  entry_type?: string | null;
  entry_date: string;
  amount: number;
  description: string | null;
  notes: string | null;
  category_id: string | null;
  activity_id: string | null;
  account_id: string | null;
  cost_center_id: string | null;
  reference_code: string | null;
  status: string | null;
  is_active: boolean | null;
  created_at: string | null;
  updated_at?: string | null;
};

type AccountBalanceRow = {
  id: string;
  company_id: string;
  current_balance: number | null;
};

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "";

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const DEFAULT_FALLBACK_EMAIL = "grupoexecutivoservice1@gmail.com";
const ENTRIES_TABLE = "finance_entries";
const COMPANIES_TABLE = "companies";
const ACCOUNTS_TABLE = "finance_accounts";

function json(data: JsonRecord, status = 200): NextResponse<JsonRecord> {
  return NextResponse.json(data, { status });
}

function normalizeEmail(value: unknown): string {
  return String(value || "").trim().toLowerCase();
}

function normalizeText(value: unknown): string {
  return String(value || "").trim();
}

function normalizeNullableText(value: unknown): string | null {
  const raw = normalizeText(value);
  return raw || null;
}

function normalizeNullableId(value: unknown): string | null {
  const raw = String(value || "").trim();
  return raw || null;
}

function normalizeType(value: unknown): string {
  const raw = normalizeText(value).toLowerCase();

  if (raw === "entrada") return "income";
  if (raw === "saída" || raw === "saida") return "expense";
  if (raw === "transferência" || raw === "transferencia") return "transfer";

  if (raw === "income" || raw === "expense" || raw === "transfer") {
    return raw;
  }

  return "expense";
}

function normalizeStatus(value: unknown): string {
  const raw = normalizeText(value).toLowerCase();

  if (raw === "pendente") return "pending";
  if (raw === "pago") return "paid";
  if (raw === "cancelado") return "cancelled";

  if (raw === "pending" || raw === "paid" || raw === "cancelled") {
    return raw;
  }

  return "paid";
}

function normalizeDate(value: unknown): string {
  const raw = normalizeText(value);

  if (!raw) {
    return new Date().toISOString().slice(0, 10);
  }

  const parsed = new Date(raw);
  if (Number.isNaN(parsed.getTime())) {
    return new Date().toISOString().slice(0, 10);
  }

  return parsed.toISOString().slice(0, 10);
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

function buildTitle(
  description: string | null,
  type: string,
  referenceCode: string | null,
): string {
  const base =
    description?.trim() ||
    (type === "income"
      ? "Entrada financeira"
      : type === "transfer"
        ? "Transferência financeira"
        : "Saída financeira");

  if (referenceCode) {
    return `${base} - ${referenceCode}`.slice(0, 200);
  }

  return base.slice(0, 200);
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
      "Nenhuma empresa encontrada para o e-mail informado. Cadastre ou vincule a empresa antes de criar lançamentos.",
  };
}

async function applyAccountBalanceDelta(params: {
  supabase: SupabaseClient;
  companyId: string;
  accountId: string | null;
  type: string;
  amount: number;
}): Promise<{ ok: true } | { ok: false; error: string }> {
  const { supabase, companyId, accountId, type, amount } = params;

  if (!accountId) {
    return { ok: true };
  }

  if (!amount || amount <= 0) {
    return { ok: true };
  }

  if (type === "transfer") {
    return { ok: true };
  }

  const accountResult = await supabase
    .from(ACCOUNTS_TABLE)
    .select("id, company_id, current_balance")
    .eq("id", accountId)
    .eq("company_id", companyId)
    .maybeSingle<AccountBalanceRow>();

  if (accountResult.error) {
    return {
      ok: false,
      error: `Erro ao localizar conta para atualizar saldo: ${accountResult.error.message}`,
    };
  }

  if (!accountResult.data?.id) {
    return {
      ok: false,
      error: "Conta não encontrada para atualizar saldo automático.",
    };
  }

  const currentBalance = Number(accountResult.data.current_balance || 0);
  const nextBalance =
    type === "income"
      ? currentBalance + amount
      : type === "expense"
        ? currentBalance - amount
        : currentBalance;

  const updateResult = await supabase
    .from(ACCOUNTS_TABLE)
    .update({
      current_balance: nextBalance,
    })
    .eq("id", accountId)
    .eq("company_id", companyId);

  if (updateResult.error) {
    return {
      ok: false,
      error: `Erro ao atualizar saldo da conta: ${updateResult.error.message}`,
    };
  }

  return { ok: true };
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

    const entriesResult = await supabase
      .from(ENTRIES_TABLE)
      .select(
        "id, company_id, title, type, entry_type, entry_date, amount, description, notes, category_id, activity_id, account_id, cost_center_id, reference_code, status, is_active, created_at, updated_at",
      )
      .eq("company_id", companyResolved.companyId)
      .order("entry_date", { ascending: false })
      .order("created_at", { ascending: false });

    if (entriesResult.error) {
      return json(
        {
          ok: false,
          error: entriesResult.error.message,
          email,
          companyId: companyResolved.companyId,
          items: [],
        },
        500,
      );
    }

    const normalizedItems = (entriesResult.data || []).map((item: EntryRow) => ({
      ...item,
      type: item.type || item.entry_type || "expense",
    }));

    return json({
      ok: true,
      email,
      companyId: companyResolved.companyId,
      strategy: companyResolved.strategy || null,
      items: normalizedItems,
      message:
        "Lançamentos financeiros carregados com sucesso. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao carregar lançamentos.",
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
    const type = normalizeType(body.type);
    const entryDate = normalizeDate(body.entry_date);
    const amount = normalizeNumber(body.amount);
    const description = normalizeNullableText(body.description);
    const notes = normalizeNullableText(body.notes);
    const categoryId = normalizeNullableId(body.category_id);
    const activityId = normalizeNullableId(body.activity_id);
    const accountId = normalizeNullableId(body.account_id);
    const costCenterId = normalizeNullableId(body.cost_center_id);
    const referenceCode = normalizeNullableText(body.reference_code);
    const status = normalizeStatus(body.status);
    const isActive =
      typeof body.is_active === "boolean" ? body.is_active : true;

    if (!amount || amount <= 0) {
      return json(
        {
          ok: false,
          error: "Informe um valor válido maior que zero.",
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

    const title = buildTitle(description, type, referenceCode);

    const insertPayload = {
      company_id: companyResolved.companyId,
      title,
      type,
      entry_type: type,
      entry_date: entryDate,
      amount,
      description,
      notes,
      category_id: categoryId,
      activity_id: activityId,
      account_id: accountId,
      cost_center_id: costCenterId,
      reference_code: referenceCode,
      status,
      is_active: isActive,
    };

    const insertResult = await supabase
      .from(ENTRIES_TABLE)
      .insert(insertPayload)
      .select(
        "id, company_id, title, type, entry_type, entry_date, amount, description, notes, category_id, activity_id, account_id, cost_center_id, reference_code, status, is_active, created_at, updated_at",
      )
      .single<EntryRow>();

    if (insertResult.error) {
      return json(
        {
          ok: false,
          error: insertResult.error.message,
          payload: insertPayload,
        },
        500,
      );
    }

    const balanceResult = await applyAccountBalanceDelta({
      supabase,
      companyId: companyResolved.companyId,
      accountId,
      type,
      amount,
    });

    if (!balanceResult.ok) {
      return json(
        {
          ok: false,
          error: balanceResult.error,
          payload: insertPayload,
          createdEntryId: insertResult.data.id,
        },
        500,
      );
    }

    return json(
      {
        ok: true,
        message:
          "Lançamento criado com sucesso e saldo da conta atualizado automaticamente. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
        strategy: companyResolved.strategy || null,
        item: {
          ...insertResult.data,
          type: insertResult.data.type || insertResult.data.entry_type || type,
        },
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
            : "Erro interno ao criar lançamento.",
      },
      500,
    );
  }
}