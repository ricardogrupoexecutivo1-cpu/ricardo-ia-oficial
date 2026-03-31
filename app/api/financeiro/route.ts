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

function badRequest(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 400 });
}

function unauthorized() {
  return NextResponse.json(
    { ok: false, error: "Usuário não autenticado." },
    { status: 401 },
  );
}

function serverError(message: string) {
  return NextResponse.json({ ok: false, error: message }, { status: 500 });
}

async function getAuthenticatedProfile(request: NextRequest): Promise<ProfileRow | null> {
  const supabaseUrl = getSupabaseUrl();
  const supabaseAnonKey = getSupabaseAnonKey();

  const token =
    request.headers.get("authorization")?.replace("Bearer ", "") ||
    request.cookies.get("sb-access-token")?.value;

  if (!token) return null;

  const supabase = createClient(supabaseUrl, supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${token}` } },
  });

  const { data: { user } } = await supabase.auth.getUser(token);
  if (!user) return null;

  const { data } = await supabase
    .from("profiles")
    .select("id, email, role")
    .eq("id", user.id)
    .single();

  return data as ProfileRow;
}

export async function GET(request: NextRequest) {
  try {
    const profile = await getAuthenticatedProfile(request);
    if (!profile) return unauthorized();

    // 🔥 REGRA NOVA
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
    return serverError("Erro ao carregar financeiro.");
  }
}

export async function POST(request: NextRequest) {
  try {
    const profile = await getAuthenticatedProfile(request);
    if (!profile) return unauthorized();

    const companyId = profile.id;

    const body = await request.json();

    if (!body.title) return badRequest("title obrigatório");
    if (!body.amount) return badRequest("amount obrigatório");

    const payload: CreateFinanceEntryInput = {
      company_id: companyId,
      entry_type: body.entry_type || "expense",
      title: body.title,
      amount: Number(body.amount),
      category_id: body.category_id || null,
      activity_id: body.activity_id || null,
      account_id: body.account_id || null,
      cost_center_id: body.cost_center_id || null,
      description: body.description || null,
      document_type: (body.document_type as FinanceDocumentType) || "other",
      document_number: body.document_number || null,
      currency_code: body.currency_code || "BRL",
      payment_method: body.payment_method || null,
      issue_date: body.issue_date || null,
      due_date: body.due_date || null,
      settlement_date: body.settlement_date || null,
      competence_date: body.competence_date || null,
      company_unit: body.company_unit || null,
      created_by: profile.id,
      updated_by: profile.id,
    };

    await ensureFinanceCompanySettings({
      companyId,
      createdBy: profile.id,
    });

    const entry = await createFinanceEntry(payload);
    const dashboard = await getFinanceDashboardData(companyId);

    return NextResponse.json({
      ok: true,
      entry,
      dashboard,
    });
  } catch (error) {
    return serverError("Erro ao salvar lançamento.");
  }
}