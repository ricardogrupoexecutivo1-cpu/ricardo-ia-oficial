import { createClient, type SupabaseClient } from "@supabase/supabase-js";

export type FinanceEntryType = "income" | "expense";

export type FinanceDocumentType =
  | "invoice"
  | "receipt"
  | "service_order"
  | "contract"
  | "internal_note"
  | "other";

export type FinanceEntryStatus =
  | "open"
  | "pending"
  | "approved"
  | "received"
  | "paid"
  | "cancelled";

export type FinanceCategoryRow = {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  color: string | null;
  icon: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type FinanceActivityRow = {
  id: string;
  company_id: string;
  category_id: string | null;
  name: string;
  description: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type FinanceCostCenterRow = {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  code: string | null;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type FinanceAccountRow = {
  id: string;
  company_id: string;
  name: string;
  description: string | null;
  account_type: string;
  currency_code: string;
  opening_balance: number;
  current_balance: number;
  is_active: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type FinanceCompanySettingsRow = {
  id: string;
  company_id: string;
  default_currency: string;
  default_locale: string;
  fiscal_document_label: string | null;
  income_label: string;
  expense_label: string;
  category_label: string;
  activity_label: string;
  cost_center_label: string;
  account_label: string;
  allow_custom_categories: boolean;
  allow_custom_activities: boolean;
  allow_custom_cost_centers: boolean;
  created_by: string | null;
  created_at: string;
  updated_at: string;
};

export type FinanceEntryRow = {
  id: string;
  company_id: string;
  account_id: string | null;
  category_id: string | null;
  activity_id: string | null;
  cost_center_id: string | null;
  entry_type: FinanceEntryType;
  title: string;
  description: string | null;
  document_type: FinanceDocumentType;
  document_number: string | null;
  amount: number;
  currency_code: string;
  status: FinanceEntryStatus;
  payment_method: string | null;
  issue_date: string | null;
  due_date: string | null;
  settlement_date: string | null;
  competence_date: string | null;
  company_unit: string | null;
  vendor_name: string | null;
  customer_name: string | null;
  tags: string[];
  metadata: Record<string, unknown>;
  created_by: string | null;
  updated_by: string | null;
  created_at: string;
  updated_at: string;
};

export type FinanceEntryViewRow = FinanceEntryRow & {
  account_name: string | null;
  category_name: string | null;
  activity_name: string | null;
  cost_center_name: string | null;
};

export type CreateFinanceEntryInput = {
  company_id: string;
  account_id?: string | null;
  category_id?: string | null;
  activity_id?: string | null;
  cost_center_id?: string | null;
  entry_type: FinanceEntryType;
  title: string;
  description?: string | null;
  document_type?: FinanceDocumentType;
  document_number?: string | null;
  amount: number;
  currency_code?: string;
  status?: FinanceEntryStatus;
  payment_method?: string | null;
  issue_date?: string | null;
  due_date?: string | null;
  settlement_date?: string | null;
  competence_date?: string | null;
  company_unit?: string | null;
  vendor_name?: string | null;
  customer_name?: string | null;
  tags?: string[];
  metadata?: Record<string, unknown>;
  created_by?: string | null;
  updated_by?: string | null;
};

export type FinanceEntryFilters = {
  companyId: string;
  entryType?: FinanceEntryType;
  status?: FinanceEntryStatus;
  accountId?: string;
  categoryId?: string;
  activityId?: string;
  costCenterId?: string;
  issueDateFrom?: string;
  issueDateTo?: string;
  dueDateFrom?: string;
  dueDateTo?: string;
  settlementDateFrom?: string;
  settlementDateTo?: string;
  search?: string;
  limit?: number;
};

function getSupabaseUrl(): string {
  return (
    process.env.SUPABASE_URL ||
    process.env.NEXT_PUBLIC_SUPABASE_URL ||
    ""
  );
}

function getSupabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

export function getFinanceAdminClient(): SupabaseClient {
  const supabaseUrl = getSupabaseUrl();
  const serviceRoleKey = getSupabaseServiceRoleKey();

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL não configurada.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeLimit(limit?: number): number {
  if (!Number.isFinite(limit)) return 50;
  return Math.min(Math.max(Number(limit), 1), 500);
}

function cleanSearch(value?: string): string | null {
  const text = value?.trim();
  return text ? text : null;
}

export async function getFinanceCompanySettings(
  companyId: string,
): Promise<FinanceCompanySettingsRow | null> {
  const supabase = getFinanceAdminClient();

  const { data, error } = await supabase
    .from("finance_company_settings")
    .select("*")
    .eq("company_id", companyId)
    .maybeSingle();

  if (error) {
    throw new Error(`Erro ao buscar finance_company_settings: ${error.message}`);
  }

  return data;
}

export async function ensureFinanceCompanySettings(params: {
  companyId: string;
  createdBy?: string | null;
  defaultCurrency?: string;
  defaultLocale?: string;
}): Promise<FinanceCompanySettingsRow> {
  const supabase = getFinanceAdminClient();

  const payload = {
    company_id: params.companyId,
    default_currency: params.defaultCurrency ?? "BRL",
    default_locale: params.defaultLocale ?? "pt-BR",
    fiscal_document_label: "Documento fiscal",
    income_label: "Entrada",
    expense_label: "Saída",
    category_label: "Categoria",
    activity_label: "Atividade",
    cost_center_label: "Centro de custo",
    account_label: "Conta",
    allow_custom_categories: true,
    allow_custom_activities: true,
    allow_custom_cost_centers: true,
    created_by: params.createdBy ?? null,
  };

  const { data, error } = await supabase
    .from("finance_company_settings")
    .upsert(payload, { onConflict: "company_id" })
    .select("*")
    .single();

  if (error) {
    throw new Error(`Erro ao garantir finance_company_settings: ${error.message}`);
  }

  return data;
}

export async function listFinanceCategories(
  companyId: string,
): Promise<FinanceCategoryRow[]> {
  const supabase = getFinanceAdminClient();

  const { data, error } = await supabase
    .from("finance_categories")
    .select("*")
    .eq("company_id", companyId)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar finance_categories: ${error.message}`);
  }

  return data ?? [];
}

export async function listFinanceActivities(
  companyId: string,
): Promise<FinanceActivityRow[]> {
  const supabase = getFinanceAdminClient();

  const { data, error } = await supabase
    .from("finance_activities")
    .select("*")
    .eq("company_id", companyId)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar finance_activities: ${error.message}`);
  }

  return data ?? [];
}

export async function listFinanceCostCenters(
  companyId: string,
): Promise<FinanceCostCenterRow[]> {
  const supabase = getFinanceAdminClient();

  const { data, error } = await supabase
    .from("finance_cost_centers")
    .select("*")
    .eq("company_id", companyId)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar finance_cost_centers: ${error.message}`);
  }

  return data ?? [];
}

export async function listFinanceAccounts(
  companyId: string,
): Promise<FinanceAccountRow[]> {
  const supabase = getFinanceAdminClient();

  const { data, error } = await supabase
    .from("finance_accounts")
    .select("*")
    .eq("company_id", companyId)
    .eq("is_active", true)
    .order("name", { ascending: true });

  if (error) {
    throw new Error(`Erro ao buscar finance_accounts: ${error.message}`);
  }

  return data ?? [];
}

export async function listFinanceEntries(
  filters: FinanceEntryFilters,
): Promise<FinanceEntryViewRow[]> {
  const supabase = getFinanceAdminClient();

  let query = supabase
    .from("finance_entries_view")
    .select("*")
    .eq("company_id", filters.companyId)
    .order("created_at", { ascending: false })
    .limit(normalizeLimit(filters.limit));

  if (filters.entryType) {
    query = query.eq("entry_type", filters.entryType);
  }

  if (filters.status) {
    query = query.eq("status", filters.status);
  }

  if (filters.accountId) {
    query = query.eq("account_id", filters.accountId);
  }

  if (filters.categoryId) {
    query = query.eq("category_id", filters.categoryId);
  }

  if (filters.activityId) {
    query = query.eq("activity_id", filters.activityId);
  }

  if (filters.costCenterId) {
    query = query.eq("cost_center_id", filters.costCenterId);
  }

  if (filters.issueDateFrom) {
    query = query.gte("issue_date", filters.issueDateFrom);
  }

  if (filters.issueDateTo) {
    query = query.lte("issue_date", filters.issueDateTo);
  }

  if (filters.dueDateFrom) {
    query = query.gte("due_date", filters.dueDateFrom);
  }

  if (filters.dueDateTo) {
    query = query.lte("due_date", filters.dueDateTo);
  }

  if (filters.settlementDateFrom) {
    query = query.gte("settlement_date", filters.settlementDateFrom);
  }

  if (filters.settlementDateTo) {
    query = query.lte("settlement_date", filters.settlementDateTo);
  }

  const search = cleanSearch(filters.search);
  if (search) {
    query = query.or(
      [
        `title.ilike.%${search}%`,
        `description.ilike.%${search}%`,
        `document_number.ilike.%${search}%`,
        `account_name.ilike.%${search}%`,
        `category_name.ilike.%${search}%`,
        `activity_name.ilike.%${search}%`,
        `cost_center_name.ilike.%${search}%`,
        `company_unit.ilike.%${search}%`,
        `vendor_name.ilike.%${search}%`,
        `customer_name.ilike.%${search}%`,
      ].join(","),
    );
  }

  const { data, error } = await query;

  if (error) {
    throw new Error(`Erro ao buscar finance_entries_view: ${error.message}`);
  }

  return data ?? [];
}

export async function createFinanceEntry(
  input: CreateFinanceEntryInput,
): Promise<FinanceEntryRow> {
  const supabase = getFinanceAdminClient();

  const safeAmount = Number(input.amount);
  if (!Number.isFinite(safeAmount) || safeAmount < 0) {
    throw new Error("Valor inválido para lançamento financeiro.");
  }

  const payload = {
    company_id: input.company_id,
    account_id: input.account_id ?? null,
    category_id: input.category_id ?? null,
    activity_id: input.activity_id ?? null,
    cost_center_id: input.cost_center_id ?? null,
    entry_type: input.entry_type,
    title: input.title.trim(),
    description: input.description?.trim() || null,
    document_type: input.document_type ?? "other",
    document_number: input.document_number?.trim() || null,
    amount: safeAmount,
    currency_code: input.currency_code ?? "BRL",
    status: input.status ?? "open",
    payment_method: input.payment_method?.trim() || null,
    issue_date: input.issue_date || null,
    due_date: input.due_date || null,
    settlement_date: input.settlement_date || null,
    competence_date: input.competence_date || null,
    company_unit: input.company_unit?.trim() || null,
    vendor_name: input.vendor_name?.trim() || null,
    customer_name: input.customer_name?.trim() || null,
    tags: input.tags ?? [],
    metadata: input.metadata ?? {},
    created_by: input.created_by ?? null,
    updated_by: input.updated_by ?? input.created_by ?? null,
  };

  const { data, error } = await supabase
    .from("finance_entries")
    .insert(payload)
    .select("*")
    .single();

  if (error) {
    throw new Error(`Erro ao criar finance_entries: ${error.message}`);
  }

  return data;
}

export async function getFinanceDashboardData(companyId: string) {
  const [
    settings,
    categories,
    activities,
    costCenters,
    accounts,
    entries,
  ] = await Promise.all([
    getFinanceCompanySettings(companyId),
    listFinanceCategories(companyId),
    listFinanceActivities(companyId),
    listFinanceCostCenters(companyId),
    listFinanceAccounts(companyId),
    listFinanceEntries({
      companyId,
      limit: 100,
    }),
  ]);

  const summary = entries.reduce(
    (acc, item) => {
      if (item.entry_type === "income") {
        acc.income += Number(item.amount || 0);
      } else {
        acc.expense += Number(item.amount || 0);
      }

      if (item.status === "open") acc.openCount += 1;
      if (item.status === "pending" || item.status === "approved") acc.pendingCount += 1;
      if (item.status === "received" || item.status === "paid") acc.settledCount += 1;

      return acc;
    },
    {
      income: 0,
      expense: 0,
      openCount: 0,
      pendingCount: 0,
      settledCount: 0,
    },
  );

  return {
    settings,
    categories,
    activities,
    costCenters,
    accounts,
    entries,
    summary: {
      ...summary,
      balance: summary.income - summary.expense,
      categoriesCount: categories.length,
      activitiesCount: activities.length,
      costCentersCount: costCenters.length,
      accountsCount: accounts.length,
    },
  };
}