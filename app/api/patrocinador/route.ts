import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getSupabaseAdmin() {
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

function asText(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function asOptionalText(value: unknown) {
  const text = asText(value);
  return text.length ? text : null;
}

function asBoolean(value: unknown) {
  if (typeof value === "boolean") return value;
  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    return normalized === "true" || normalized === "1" || normalized === "yes";
  }
  return false;
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null);

    const companyName = asText(body?.company_name || body?.companyName);
    const contactName = asText(
      body?.contact_name || body?.contactName || body?.responsible_name || body?.responsibleName,
    );
    const responsibleName = asText(
      body?.responsible_name || body?.responsibleName || body?.contact_name || body?.contactName,
    );
    const whatsapp = asOptionalText(body?.whatsapp);
    const email = asText(body?.email);
    const segment = asText(body?.segment);
    const plan = asText(body?.plan || body?.plan_name || body?.planName);
    const website = asOptionalText(body?.website || body?.site_url || body?.siteUrl);
    const logoUrl = asOptionalText(body?.logo_url || body?.logoUrl);
    const campaignDescription = asOptionalText(
      body?.campaign_description || body?.campaignDescription,
    );
    const acceptedTerms = asBoolean(
      body?.accepted_terms ?? body?.terms_accepted ?? body?.acceptedTerms,
    );
    const notes = asOptionalText(body?.notes || body?.observations);

    if (!companyName) {
      return NextResponse.json(
        { ok: false, error: "Nome da empresa é obrigatório." },
        { status: 400 },
      );
    }

    if (!contactName) {
      return NextResponse.json(
        { ok: false, error: "Nome do responsável é obrigatório." },
        { status: 400 },
      );
    }

    if (!email) {
      return NextResponse.json(
        { ok: false, error: "E-mail é obrigatório." },
        { status: 400 },
      );
    }

    if (!segment) {
      return NextResponse.json(
        { ok: false, error: "Segmento é obrigatório." },
        { status: 400 },
      );
    }

    if (!plan) {
      return NextResponse.json(
        { ok: false, error: "Plano é obrigatório." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseAdmin();

    const payload = {
      company_name: companyName,
      contact_name: contactName,
      responsible_name: responsibleName || contactName,
      whatsapp,
      email,
      segment,
      plan,
      plan_name: plan,
      website,
      site_url: website,
      campaign_description: campaignDescription,
      logo_url: logoUrl,
      accepted_terms: acceptedTerms,
      terms_accepted: acceptedTerms,
      notes,
      observations: notes,
      status: "lead",
    };

    const { data, error } = await supabase
      .from("sponsor_leads")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: "Não foi possível salvar o lead comercial.",
          details: error.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Lead comercial salvo com sucesso.",
      sponsor: data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno inesperado.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}