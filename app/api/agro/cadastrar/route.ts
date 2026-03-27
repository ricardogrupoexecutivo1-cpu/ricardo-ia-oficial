import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type AgroRegisterPayload = {
  companyName?: string;
  companyCity?: string;
  companyState?: string;
  companyWhatsapp?: string;
  companyEmail?: string;

  contactName?: string;
  contactRole?: string;
  contactWhatsapp?: string;
  contactEmail?: string;

  category?: string;
  title?: string;
  description?: string;
  listingCity?: string;
  listingState?: string;

  coverageType?: "local" | "regional" | "state" | "national";
  maxRadiusKm?: string;
  deliveryAvailable?: boolean;
  pickupAvailable?: boolean;

  latitude?: string;
  longitude?: string;
};

function getSupabaseAdmin() {
  const url =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !serviceRoleKey) {
    throw new Error(
      "SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY são obrigatórias."
    );
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizePhone(value?: string | null) {
  if (!value) return null;
  const digits = value.replace(/\D/g, "");
  return digits || null;
}

function normalizeText(value?: string | null) {
  if (!value) return null;
  const trimmed = value.trim();
  return trimmed || null;
}

function normalizeSlug(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

function toNullableNumber(value?: string | null) {
  if (!value || !value.trim()) return null;
  const parsed = Number(value.replace(",", "."));
  return Number.isFinite(parsed) ? parsed : null;
}

function isValidRole(role?: string | null) {
  return [
    "owner",
    "manager",
    "sales",
    "buyer",
    "support",
    "finance",
    "custom",
  ].includes(role ?? "");
}

function isValidCategory(category?: string | null) {
  return ["compradores", "fornecedores", "insumos", "servicos"].includes(
    category ?? ""
  );
}

function isValidCoverageType(coverageType?: string | null) {
  return ["local", "regional", "state", "national"].includes(
    coverageType ?? ""
  );
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as AgroRegisterPayload;

    const companyName = normalizeText(body.companyName);
    const companyCity = normalizeText(body.companyCity);
    const companyState = normalizeText(body.companyState);
    const companyWhatsapp = normalizePhone(body.companyWhatsapp);
    const companyEmail = normalizeText(body.companyEmail);

    const contactName = normalizeText(body.contactName);
    const contactRole = normalizeText(body.contactRole);
    const contactWhatsapp = normalizePhone(body.contactWhatsapp);
    const contactEmail = normalizeText(body.contactEmail);

    const category = normalizeText(body.category);
    const title = normalizeText(body.title);
    const description = normalizeText(body.description);
    const listingCity = normalizeText(body.listingCity);
    const listingState = normalizeText(body.listingState);

    const coverageType = normalizeText(body.coverageType);
    const maxRadiusKm = toNullableNumber(body.maxRadiusKm);
    const latitude = toNullableNumber(body.latitude);
    const longitude = toNullableNumber(body.longitude);

    const deliveryAvailable = Boolean(body.deliveryAvailable);
    const pickupAvailable = Boolean(body.pickupAvailable);

    if (!companyName) {
      return NextResponse.json(
        { error: "Nome da empresa é obrigatório." },
        { status: 400 }
      );
    }

    if (!companyCity || !companyState) {
      return NextResponse.json(
        { error: "Cidade e estado da empresa são obrigatórios." },
        { status: 400 }
      );
    }

    if (!companyWhatsapp) {
      return NextResponse.json(
        { error: "WhatsApp da empresa é obrigatório." },
        { status: 400 }
      );
    }

    if (!contactName || !contactWhatsapp) {
      return NextResponse.json(
        { error: "Contato principal e WhatsApp do contato são obrigatórios." },
        { status: 400 }
      );
    }

    if (!isValidRole(contactRole)) {
      return NextResponse.json(
        { error: "Função do contato inválida." },
        { status: 400 }
      );
    }

    if (!category || !isValidCategory(category)) {
      return NextResponse.json(
        { error: "Categoria do anúncio inválida." },
        { status: 400 }
      );
    }

    if (!title || !description) {
      return NextResponse.json(
        { error: "Título e descrição do anúncio são obrigatórios." },
        { status: 400 }
      );
    }

    if (!listingCity || !listingState) {
      return NextResponse.json(
        { error: "Cidade e estado do anúncio são obrigatórios." },
        { status: 400 }
      );
    }

    if (!coverageType || !isValidCoverageType(coverageType)) {
      return NextResponse.json(
        { error: "Tipo de cobertura inválido." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const slugBase = normalizeSlug(companyName);
    const slug = `${slugBase}-${Date.now()}`;

    const { data: companyInsert, error: companyError } = await supabase
      .from("companies")
      .insert({
        name: companyName,
        slug,
        module: "agro",
        category: category,
        city: companyCity,
        state: companyState,
        country: "Brasil",
        whatsapp: companyWhatsapp,
        email: companyEmail,
        is_active: true,
      })
      .select("id, name")
      .single();

    if (companyError || !companyInsert) {
      console.error("Erro ao inserir company:", companyError);
      return NextResponse.json(
        { error: "Não foi possível salvar a empresa." },
        { status: 500 }
      );
    }

    const companyId = companyInsert.id;

    const { data: contactInsert, error: contactError } = await supabase
      .from("company_contacts")
      .insert({
        company_id: companyId,
        name: contactName,
        role: contactRole,
        whatsapp: contactWhatsapp,
        email: contactEmail,
        is_primary: true,
        is_active: true,
      })
      .select("id, name")
      .single();

    if (contactError || !contactInsert) {
      console.error("Erro ao inserir contact:", contactError);
      return NextResponse.json(
        { error: "Empresa salva, mas não foi possível salvar o contato." },
        { status: 500 }
      );
    }

    const contactId = contactInsert.id;

    const { data: listingInsert, error: listingError } = await supabase
      .from("listings")
      .insert({
        company_id: companyId,
        contact_id: contactId,
        module: "agro",
        category,
        title,
        description,
        city: listingCity,
        state: listingState,
        country: "Brasil",
        delivery_available: deliveryAvailable,
        pickup_available: pickupAvailable,
        is_active: true,
        is_featured: false,
      })
      .select("id, title")
      .single();

    if (listingError || !listingInsert) {
      console.error("Erro ao inserir listing:", listingError);
      return NextResponse.json(
        { error: "Empresa e contato salvos, mas não foi possível salvar o anúncio." },
        { status: 500 }
      );
    }

    const listingId = listingInsert.id;

    const { error: locationError } = await supabase.from("listing_locations").insert({
      listing_id: listingId,
      country: "Brasil",
      state: listingState,
      city: listingCity,
      latitude,
      longitude,
      coverage_type: coverageType,
      max_radius_km: maxRadiusKm,
      serves_states: listingState ? [listingState] : [],
      serves_nationally: coverageType === "national",
      delivery_available: deliveryAvailable,
      pickup_available: pickupAvailable,
    });

    if (locationError) {
      console.error("Erro ao inserir location:", locationError);
      return NextResponse.json(
        { error: "Cadastro principal salvo, mas não foi possível salvar a localização." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Cadastro realizado com sucesso.",
      companyId,
      contactId,
      listingId,
    });
  } catch (error) {
    console.error("Erro interno em /api/agro/cadastrar:", error);

    return NextResponse.json(
      { error: "Erro interno ao processar o cadastro AGRO." },
      { status: 500 }
    );
  }
}