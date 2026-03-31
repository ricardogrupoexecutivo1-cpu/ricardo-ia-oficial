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
  name?: string | null;
  initial_balance?: number | null;
  current_balance?: number | null;
  is_active?: boolean | null;
};

type EntryRow = {
  id: string;
  company_id: string;
  account_id: string | null;
  type?: string | null;
  entry_type?: string | null;
  amount?: number | null;
  status?: string | null;
  is_active?: boolean | null;
};

const SUPABASE_URL =
  process.env.SUPABASE_URL ||
  process.env.NEXT_PUBLIC_SUPABASE_URL ||
  "";

const SUPABASE_SERVICE_ROLE_KEY =
  process.env.SUPABASE_SERVICE_ROLE_KEY || "";

const DEFAULT_FALLBACK_EMAIL = "grupoexecutivoservice1@gmail.com";
const COMPANIES_TABLE = "companies";
const ACCOUNTS_TABLE = "finance_accounts";
const ENTRIES_TABLE = "finance_entries";

function json(data: JsonRecord, status = 200) {
  return NextResponse.json(data, { status });
}

function normalizeEmail(value: unknown): string {
  return String(value || "").trim().toLowerCase();
}

function normalizeType(value: unknown): "income" | "expense" | "transfer" {
  const raw = String(value || "").trim().toLowerCase();

  if (raw === "entrada") return "income";
  if (raw === "saída" || raw === "saida") return "expense";
  if (raw === "transferência" || raw === "transferencia") return "transfer";
  if (raw === "income" || raw === "expense" || raw === "transfer") return raw;

  return "expense";
}

function normalizeStatus(value: unknown): "paid" | "pending" | "cancelled" {
  const raw = String(value || "").trim().toLowerCase();

  if (raw === "pendente") return "pending";
  if (raw === "cancelado") return "cancelled";
  if (raw === "pending" || raw === "paid" || raw === "cancelled") return raw;

  return "paid";
}

function normalizeNumber(value: unknown): number {
  if (typeof value === "number" && Number.isFinite(value)) {
    return value;
  }

  const parsed = Number(value || 0);
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
      "Nenhuma empresa encontrada para o e-mail informado. Cadastre ou vincule a empresa antes de reconciliar saldos.",
  };
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

    const body = (await request.json().catch(() => ({}))) as JsonRecord;
    const email = normalizeEmail(body.email || DEFAULT_FALLBACK_EMAIL);

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

    const accountsResult = await supabase
      .from(ACCOUNTS_TABLE)
      .select("id, company_id, name, initial_balance, current_balance, is_active")
      .eq("company_id", companyResolved.companyId)
      .order("created_at", { ascending: true });

    if (accountsResult.error) {
      return json(
        {
          ok: false,
          error: `Erro ao carregar contas: ${accountsResult.error.message}`,
        },
        500,
      );
    }

    const entriesResult = await supabase
      .from(ENTRIES_TABLE)
      .select("id, company_id, account_id, type, entry_type, amount, status, is_active")
      .eq("company_id", companyResolved.companyId);

    if (entriesResult.error) {
      return json(
        {
          ok: false,
          error: `Erro ao carregar lançamentos: ${entriesResult.error.message}`,
        },
        500,
      );
    }

    const accounts = (accountsResult.data || []) as AccountRow[];
    const entries = (entriesResult.data || []) as EntryRow[];

    const activeEntries = entries.filter((item) => {
      if (!item.account_id) return false;
      if (item.is_active === false) return false;

      const status = normalizeStatus(item.status);
      if (status !== "paid") return false;

      const type = normalizeType(item.type || item.entry_type);
      if (type === "transfer") return false;

      return true;
    });

    const entryTotalsByAccount = new Map<string, number>();

    for (const item of activeEntries) {
      const accountId = String(item.account_id || "");
      const amount = normalizeNumber(item.amount);
      const type = normalizeType(item.type || item.entry_type);

      const current = entryTotalsByAccount.get(accountId) || 0;
      const next =
        type === "income"
          ? current + amount
          : type === "expense"
            ? current - amount
            : current;

      entryTotalsByAccount.set(accountId, next);
    }

    const updatedAccounts: Array<{
      id: string;
      name: string;
      initial_balance: number;
      previous_balance: number;
      reconciled_balance: number;
      delta: number;
    }> = [];

    for (const account of accounts) {
      const initialBalance = normalizeNumber(account.initial_balance);
      const previousBalance = normalizeNumber(account.current_balance);
      const entriesImpact = entryTotalsByAccount.get(account.id) || 0;
      const reconciledBalance = initialBalance + entriesImpact;

      const updateResult = await supabase
        .from(ACCOUNTS_TABLE)
        .update({
          current_balance: reconciledBalance,
        })
        .eq("id", account.id)
        .eq("company_id", companyResolved.companyId);

      if (updateResult.error) {
        return json(
          {
            ok: false,
            error: `Erro ao atualizar saldo da conta "${account.name || account.id}": ${updateResult.error.message}`,
          },
          500,
        );
      }

      updatedAccounts.push({
        id: account.id,
        name: String(account.name || "Conta sem nome"),
        initial_balance: initialBalance,
        previous_balance: previousBalance,
        reconciled_balance: reconciledBalance,
        delta: reconciledBalance - previousBalance,
      });
    }

    const totalPreviousBalance = updatedAccounts.reduce(
      (acc, item) => acc + item.previous_balance,
      0,
    );

    const totalReconciledBalance = updatedAccounts.reduce(
      (acc, item) => acc + item.reconciled_balance,
      0,
    );

    return json({
      ok: true,
      email,
      companyId: companyResolved.companyId,
      strategy: companyResolved.strategy || null,
      updatedAccounts,
      summary: {
        accounts_reconciled: updatedAccounts.length,
        total_previous_balance: totalPreviousBalance,
        total_reconciled_balance: totalReconciledBalance,
        total_delta: totalReconciledBalance - totalPreviousBalance,
      },
      message:
        "Reconciliação histórica concluída com sucesso. Os saldos atuais das contas foram recalculados com base no saldo inicial e nos lançamentos pagos ativos. Sistema em constante atualização e pode haver momentos de instabilidade durante melhorias.",
    });
  } catch (error) {
    return json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao reconciliar saldos.",
      },
      500,
    );
  }
}