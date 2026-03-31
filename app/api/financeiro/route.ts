import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import {
  createFinanceEntry,
  ensureFinanceCompanySettings,
  getFinanceDashboardData,
  type CreateFinanceEntryInput,
  type FinanceDocumentType,
  type FinanceEntryStatus,
  type FinanceEntryType,
} from "@/lib/finance";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type ProfileRow = {
  id: string;
  email: string | null;
  role: string | null;
};

function getSupabaseUrl(): string {
  return process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
}

function getSupabaseAnonKey(): string {
  return process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || "";
}

function getSupabaseServiceRoleKey(): string {
  return process.env.SUPABASE_SERVICE_ROLE_KEY || "";
}

function badRequest(message: string, details?: unknown) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      details: details ?? null,
    },
    { status: 400 }
  );
}

function unauthorized(message = "Usuário não autenticado.") {
  return NextResponse.json(
    {
      ok: false,
      error: message,
    },
    { status: 401 }
  );
}

function serverError(message: string, details?: unknown) {
  return NextResponse.json(
    {
      ok: false,
      error: message,
      details: details ?? null,
    },
    { status: 500 }
  );
}

function isFinanceEntryType(value: unknown): value is FinanceEntryType {
  return value === "income" || value === "expense";
}

function isFinanceDocumentType(value: unknown): value is FinanceDocumentType {
  return (
    value === "invoice" ||
    value === "receipt" ||
    value === "service_order" ||
    value === "contract" ||
    value === "internal_note" ||
    value === "other"
  );
}

function isFinanceEntryStatus(value: unknown): value is FinanceEntryStatus {
  return (
    value === "open" ||
    value === "pending" ||
    value === "approved" ||
    value === "received" ||
    value === "paid" ||
    value === "cancelled"
  );
}

function normalizeDate(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text ? text : null;
}

function normalizeText(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const text = value.trim();
  return text ? text : null;
}

function normalizeTags(value: unknown): string[] {
  if (!Array.isArray(value)) return [];
  return value
    .map((item) => (typeof item === "string" ? item.trim() : ""))
    .filter(Boolean);
}

function buildStatus(params: {
  explicitStatus?: unknown;
  entryType: FinanceEntryType;
  dueDate?: string | null;
  settlementDate?: string | null;
}): FinanceEntryStatus {
  if (isFinanceEntryStatus(params.explicitStatus)) {
    return params.explicitStatus;
  }

  if (params.settlementDate) {
    return params.entryType === "income" ? "received" : "paid";
  }

  if (params.dueDate) {
    return "pending";
  }

  return "open";
}

function decodeBase64Url(value: string) {
  try {
    const normalized = value.replace(/-/g, "+").replace(/_/g, "/");
    const padded = normalized.padEnd(Math.ceil(normalized.length / 4) * 4, "=");
    return Buffer.from(padded, "base64").toString("utf8");
  } catch {
    return null;
  }
}

function tryExtractAccessTokenFromCookieValue(raw: string | null | undefined): string | null {
  if (!raw) return null;

  const value = raw.trim();
  if (!value) return null;

  if (value.startsWith("eyJ")) {
    return value;
  }

  try {
    const parsed = JSON.parse(value);

    if (typeof parsed === "string" && parsed.startsWith("eyJ")) {
      return parsed;
    }

    if (Array.isArray(parsed)) {
      for (const item of parsed) {
        if (typeof item === "string" && item.startsWith("eyJ")) {
          return item;
        }

        if (
          item &&
          typeof item === "object" &&
          "access_token" in item &&
          typeof (item as { access_token?: unknown }).access_token === "string"
        ) {
          return (item as { access_token: string }).access_token;
        }
      }
    }

    if (
      parsed &&
      typeof parsed === "object" &&
      "access_token" in parsed &&
      typeof (parsed as { access_token?: unknown }).access_token === "string"
    ) {
      return (parsed as { access_token: string }).access_token;
    }
  } catch {
    // segue
  }

  const decoded = decodeBase64Url(value);
  if (decoded) {
    try {
      const parsed = JSON.parse(decoded);

      if (
        parsed &&
        typeof parsed === "object" &&
        "access_token" in parsed &&
        typeof (parsed as { access_token?: unknown }).access_token === "string"
      ) {
        return (parsed as { access_token: string }).access_token;
      }

      if (Array.isArray(parsed)) {
        for (const item of parsed) {
          if (
            item &&
            typeof item === "object" &&
            "access_token" in item &&
            typeof (item as { access_token?: unknown }).access_token === "string"
          ) {
            return (item as { access_token: string }).access_token;
          }
        }
      }
    } catch {
      // segue
    }
  }

  return null;
}

function getAccessTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get("authorization");
  if (authHeader?.startsWith("Bearer ")) {
    const token = authHeader.slice("Bearer ".length).trim();
    if (token) return token;
  }

  const cookieCandidates = [
    "sb-access-token",
    "supabase-access-token",
    "access-token",
  ];

  for (const cookieName of cookieCandidates) {
    const cookieValue = request.cookies.get(cookieName)?.value;
    const token = tryExtractAccessTokenFromCookieValue(cookieValue);
    if (token) return token;
  }

  const allCookies = request.cookies.getAll();

  for (const cookie of allCookies) {
    if (
      cookie.name.includes("auth-token") ||
      cookie.name.includes("access-token") ||
      cookie.name.startsWith("sb-")
    ) {
      const token = tryExtractAccessTokenFromCookieValue(cookie.value);
      if (token) return token;
    }
  }

  return null;
}

async function getAuthenticatedProfile(request: NextRequest): Promise<ProfileRow | null> {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL ou NEXT_PUBLIC_SUPABASE_URL não configurada.");
  }

  if (!supabaseAnonKey) {
    throw new Error("NEXT_PUBLIC_SUPABASE_ANON_KEY não configurada.");
  }

  const accessToken = getAccessTokenFromRequest(request);

  if (!accessToken) {
    return null;
  }

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    },
  });

  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser(accessToken);

  if (userError || !user) {
    console.error("AUTH GET USER ERROR:", userError);
    return null;
  }

  const { data: profile, error: profileError } = await supabase
    .from("profiles")
    .select("id, email")
    .eq("id", user.id)
    .maybeSingle();

  if (profileError) {
    throw new Error(`Erro ao buscar perfil do usuário: ${profileError.message}`);
  }

  if (!profile) {
    return null;
  }

  return {
    id: profile.id,
    email: profile.email ?? null,
    role: null,
  };
}

async function getProfileWithFallback(request: NextRequest): Promise<ProfileRow | null> {
  const authenticatedProfile = await getAuthenticatedProfile(request);
  if (authenticatedProfile) {
    return authenticatedProfile;
  }

  const serviceRoleKey = getSupabaseServiceRoleKey();
  const supabaseUrl = getSupabaseUrl();

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  let body: Record<string, unknown> | null = null;
  try {
    body = await request.clone().json();
  } catch {
    body = null;
  }

  const emailFromBody =
    body && typeof body.email === "string" ? body.email.trim() : "";

  const emailFromHeader = (request.headers.get("x-user-email") || "").trim();
  const email = emailFromBody || emailFromHeader;

  if (!email) {
    return null;
  }

  const admin = createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });

  const { data: existingProfile, error: existingError } = await admin
    .from("profiles")
    .select("id, email")
    .eq("email", email)
    .maybeSingle();

  if (existingError) {
    throw new Error(`Erro ao buscar perfil por e-mail: ${existingError.message}`);
  }

  if (existingProfile) {
    return {
      id: existingProfile.id,
      email: existingProfile.email ?? null,
      role: null,
    };
  }

  const newId = crypto.randomUUID();

  const { data: createdProfile, error: createError } = await admin
    .from("profiles")
    .insert([
      {
        id: newId,
        email,
      },
    ])
    .select("id, email")
    .single();

  if (createError) {
    throw new Error(`Erro ao criar perfil automático: ${createError.message}`);
  }

  return {
    id: createdProfile.id,
    email: createdProfile.email ?? null,
    role: null,
  };
}

export async function GET(request: NextRequest) {
  try {
    const profile = await getProfileWithFallback(request);

    if (!profile) {
      return unauthorized("Usuário não autenticado e sem e-mail de fallback.");
    }

    const companyId = profile.id;

    await ensureFinanceCompanySettings({
      companyId,
      createdBy: profile.id,
    });

    const dashboard = await getFinanceDashboardData(companyId);

    return NextResponse.json({
      ok: true,
      companyId,
      userId: profile.id,
      profile,
      dashboard,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao carregar financeiro.";
    console.error("GET /api/financeiro ERROR:", error);
    return serverError(message);
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getProfileWithFallback(request);

    if (!profile) {
      return unauthorized("Usuário não autenticado e sem e-mail de fallback.");
    }

    const companyId = profile.id;

    const body = await request.json().catch(() => null);

    if (!body || typeof body !== "object") {
      return badRequest("Body inválido.");
    }

    const isCreateEntryRequest =
      "entry_type" in body ||
      "title" in body ||
      "amount" in body;

    await ensureFinanceCompanySettings({
      companyId,
      createdBy: profile.id,
    });

    if (!isCreateEntryRequest) {
      const dashboard = await getFinanceDashboardData(companyId);

      return NextResponse.json({
        ok: true,
        companyId,
        userId: profile.id,
        profile,
        dashboard,
      });
    }

    const entryType = body.entry_type;
    if (!isFinanceEntryType(entryType)) {
      return badRequest("entry_type inválido. Use income ou expense.");
    }

    const title = normalizeText(body.title);
    if (!title) {
      return badRequest("title é obrigatório.");
    }

    const amount = Number(body.amount);
    if (!Number.isFinite(amount) || amount < 0) {
      return badRequest("amount inválido.");
    }

    const documentType = isFinanceDocumentType(body.document_type)
      ? body.document_type
      : "other";

    const dueDate = normalizeDate(body.due_date);
    const settlementDate = normalizeDate(body.settlement_date);
    const issueDate = normalizeDate(body.issue_date);
    const competenceDate = normalizeDate(body.competence_date);

    const payload: CreateFinanceEntryInput = {
      company_id: companyId,
      account_id: normalizeText(body.account_id),
      category_id: normalizeText(body.category_id),
      activity_id: normalizeText(body.activity_id),
      cost_center_id: normalizeText(body.cost_center_id),
      entry_type: entryType,
      title,
      description: normalizeText(body.description),
      document_type: documentType,
      document_number: normalizeText(body.document_number),
      amount,
      currency_code: normalizeText(body.currency_code) || "BRL",
      status: buildStatus({
        explicitStatus: body.status,
        entryType,
        dueDate,
        settlementDate,
      }),
      payment_method: normalizeText(body.payment_method),
      issue_date: issueDate,
      due_date: dueDate,
      settlement_date: settlementDate,
      competence_date: competenceDate,
      company_unit: normalizeText(body.company_unit),
      vendor_name: normalizeText(body.vendor_name),
      customer_name: normalizeText(body.customer_name),
      tags: normalizeTags(body.tags),
      metadata:
        body.metadata && typeof body.metadata === "object" && !Array.isArray(body.metadata)
          ? body.metadata
          : {},
      created_by: profile.id,
      updated_by: profile.id,
    };

    const entry = await createFinanceEntry(payload);
    const dashboard = await getFinanceDashboardData(companyId);

    return NextResponse.json(
      {
        ok: true,
        message: "Lançamento financeiro criado com sucesso.",
        companyId,
        userId: profile.id,
        profile,
        entry,
        dashboard,
      },
      { status: 201 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro inesperado ao salvar lançamento.";
    console.error("POST /api/financeiro ERROR:", error);
    return serverError(message);
  }
}