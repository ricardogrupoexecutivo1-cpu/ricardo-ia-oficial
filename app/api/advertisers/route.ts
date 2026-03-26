import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type AdvertiserType =
  | "locadora"
  | "imobiliaria"
  | "corretor"
  | "banco"
  | "seguradora"
  | "correspondente"
  | "despachante";

type AdvertiserPayload = {
  advertiserType: AdvertiserType;
  companyName: string;
  contactName?: string;
  email?: string;
  whatsapp?: string;
  phone?: string;
  country?: string;
  state?: string;
  city?: string;
  municipality?: string;
  neighborhood?: string;
  postalCode?: string;
  description?: string;
};

const SUPABASE_URL =
  process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error("Variáveis do Supabase não configuradas.");
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeText(value: unknown) {
  return typeof value === "string" ? value.trim() : "";
}

function isValidAdvertiserType(value: string): value is AdvertiserType {
  return [
    "locadora",
    "imobiliaria",
    "corretor",
    "banco",
    "seguradora",
    "correspondente",
    "despachante",
  ].includes(value);
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as Partial<AdvertiserPayload>;

    const advertiserType = normalizeText(body.advertiserType);
    const companyName = normalizeText(body.companyName);
    const contactName = normalizeText(body.contactName);
    const email = normalizeText(body.email);
    const whatsapp = normalizeText(body.whatsapp);
    const phone = normalizeText(body.phone);
    const country = normalizeText(body.country) || "Brasil";
    const state = normalizeText(body.state);
    const city = normalizeText(body.city);
    const municipality = normalizeText(body.municipality);
    const neighborhood = normalizeText(body.neighborhood);
    const postalCode = normalizeText(body.postalCode);
    const description = normalizeText(body.description);

    if (!isValidAdvertiserType(advertiserType)) {
      return NextResponse.json(
        { error: "Tipo de anunciante inválido." },
        { status: 400 }
      );
    }

    if (!companyName) {
      return NextResponse.json(
        { error: "Nome da empresa é obrigatório." },
        { status: 400 }
      );
    }

    if (!email && !whatsapp) {
      return NextResponse.json(
        { error: "Informe pelo menos e-mail ou WhatsApp." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data, error } = await supabase
      .from("advertisers")
      .insert({
        advertiser_type: advertiserType,
        company_name: companyName,
        contact_name: contactName || null,
        email: email || null,
        whatsapp: whatsapp || null,
        phone: phone || null,
        country,
        state: state || null,
        city: city || null,
        municipality: municipality || null,
        neighborhood: neighborhood || null,
        postal_code: postalCode || null,
        description: description || null,
        plan: "free",
        status: "pending",
        verified: false,
        source: "aurora-anuncios",
      })
      .select("id, advertiser_type, company_name, created_at")
      .single();

    if (error) {
      console.error("Erro ao salvar advertiser:", error);

      return NextResponse.json(
        { error: "Não foi possível salvar o cadastro." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      advertiser: data,
      message: "Cadastro salvo com sucesso.",
    });
  } catch (error) {
    console.error("Erro geral em /api/advertisers:", error);

    return NextResponse.json(
      { error: "Erro interno ao processar cadastro." },
      { status: 500 }
    );
  }
}