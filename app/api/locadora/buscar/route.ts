import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type GenericRow = Record<string, unknown>;

function getSupabaseAdmin() {
  const url =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL || "";
  const serviceRole = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!url || !serviceRole) {
    throw new Error("Variáveis do Supabase não configuradas.");
  }

  return createClient(url, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeText(value: unknown) {
  return String(value ?? "")
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .trim();
}

function asString(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

function asNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(String(value).replace(",", "."));
  return Number.isFinite(n) ? n : null;
}

function asBoolean(value: unknown) {
  if (typeof value === "boolean") return value;

  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (["true", "1", "sim", "yes", "on"].includes(v)) return true;
    if (["false", "0", "nao", "não", "no", "off"].includes(v)) return false;
  }

  return null;
}

function firstString(row: GenericRow, keys: string[]) {
  for (const key of keys) {
    const value = asString(row[key]);
    if (value) return value;
  }
  return null;
}

function firstNumber(row: GenericRow, keys: string[]) {
  for (const key of keys) {
    const value = asNumber(row[key]);
    if (value !== null) return value;
  }
  return null;
}

function firstBoolean(row: GenericRow, keys: string[]) {
  for (const key of keys) {
    const value = asBoolean(row[key]);
    if (value !== null) return value;
  }
  return null;
}

function readCategories(row: GenericRow) {
  const possible = [row["categories"], row["segmentos"], row["tipos"]];

  for (const value of possible) {
    if (Array.isArray(value)) {
      return value.map((item) => String(item)).filter(Boolean);
    }

    if (typeof value === "string" && value.trim()) {
      return value
        .split(",")
        .map((item) => item.trim())
        .filter(Boolean);
    }
  }

  const single = firstString(row, ["category", "categoria", "segment", "tipo"]);
  return single ? [single] : [];
}

function normalizeCategory(raw: string) {
  const v = normalizeText(raw);

  if (
    v.includes("seminovo") ||
    v.includes("semi novo") ||
    v.includes("carro") ||
    v.includes("veiculo") ||
    v.includes("veículo")
  ) {
    return "seminovos";
  }

  if (v.includes("motorista") || v.includes("condutor")) {
    return "motoristas";
  }

  if (v.includes("cegonh") || v.includes("transporte")) {
    return "cegonheiros";
  }

  if (v.includes("comprador") || v.includes("compra")) {
    return "compradores";
  }

  if (
    v.includes("fornecedor") ||
    v.includes("peca") ||
    v.includes("peça") ||
    v.includes("insumo") ||
    v.includes("acessorio") ||
    v.includes("acessório")
  ) {
    return "fornecedores";
  }

  return v;
}

function rowCategory(row: GenericRow) {
  return firstString(row, [
    "category",
    "categoria",
    "segment",
    "tipo",
    "seller_type",
    "profile_type",
  ]);
}

function rowMatchesCategory(row: GenericRow, category: string) {
  if (!category) return true;

  const target = normalizeCategory(category);

  const single = normalizeCategory(rowCategory(row) ?? "");
  if (single === target) return true;

  const categories = readCategories(row);
  if (categories.some((item) => normalizeCategory(item) === target)) {
    return true;
  }

  const haystack = normalizeText(
    [
      firstString(row, [
        "company_name",
        "empresa",
        "business_name",
        "name",
        "nome",
        "title",
        "titulo",
      ]),
      firstString(row, ["description", "descricao", "descrição", "tagline"]),
      rowCategory(row),
      categories.join(" "),
    ].join(" ")
  );

  return haystack.includes(target);
}

function rowMatchesQuery(row: GenericRow, query: string) {
  if (!query) return true;

  const text = normalizeText(
    [
      firstString(row, [
        "company_name",
        "empresa",
        "business_name",
        "name",
        "nome",
        "title",
        "titulo",
      ]),
      firstString(row, ["description", "descricao", "descrição", "tagline"]),
      rowCategory(row),
      readCategories(row).join(" "),
      firstString(row, [
        "contact_name",
        "responsavel",
        "responsável",
        "owner_name",
        "nome_contato",
      ]),
      firstString(row, [
        "contact_phone",
        "phone",
        "telefone",
        "celular",
        "contact_whatsapp",
        "company_whatsapp",
        "whatsapp",
      ]),
      firstString(row, ["email", "contact_email", "company_email"]),
      firstString(row, ["city", "cidade", "company_city"]),
      firstString(row, ["state", "estado", "uf", "company_state"]),
      firstString(row, ["neighborhood", "bairro"]),
      firstString(row, ["address", "endereco", "endereço"]),
      firstString(row, ["coverage_type"]),
    ].join(" ")
  );

  return text.includes(normalizeText(query));
}

function rowMatchesLocation(row: GenericRow, city: string, state: string) {
  const rowCity = normalizeText(
    firstString(row, ["city", "cidade", "company_city"])
  );
  const rowState = normalizeText(
    firstString(row, ["state", "estado", "uf", "company_state"])
  );

  if (city && rowCity !== normalizeText(city)) return false;
  if (state && rowState !== normalizeText(state)) return false;

  return true;
}

function rowIsVisible(row: GenericRow) {
  const active = firstBoolean(row, ["active", "ativo"]);
  const published = firstBoolean(row, ["published", "publicado"]);
  const approved = firstBoolean(row, ["approved", "aprovado"]);

  if (active === false) return false;
  if (published === false) return false;
  if (approved === false) return false;

  return true;
}

function toPublicItem(row: GenericRow) {
  return {
    id: firstString(row, ["id"]) ?? crypto.randomUUID(),
    created_at: firstString(row, ["created_at", "createdAt", "data_criacao"]),

    name: firstString(row, ["name", "nome"]),
    logo_text: firstString(row, ["logo_text"]),
    tagline: firstString(row, ["tagline"]),

    company_name: firstString(row, [
      "company_name",
      "empresa",
      "business_name",
      "name",
      "nome",
    ]),
    company_whatsapp: firstString(row, ["company_whatsapp", "whatsapp"]),
    company_city: firstString(row, ["company_city", "city", "cidade"]),
    company_state: firstString(row, ["company_state", "state", "estado", "uf"]),
    company_email: firstString(row, ["company_email", "email"]),

    business_name: firstString(row, ["business_name"]),
    title: firstString(row, ["title", "titulo"]),
    description: firstString(row, ["description", "descricao", "descrição"]),

    category: rowCategory(row),
    categories: readCategories(row),

    contact_name: firstString(row, [
      "contact_name",
      "responsavel",
      "responsável",
      "owner_name",
      "nome_contato",
    ]),
    contact_phone: firstString(row, ["contact_phone", "phone", "telefone", "celular"]),
    contact_whatsapp: firstString(row, ["contact_whatsapp", "whatsapp"]),
    contact_email: firstString(row, ["contact_email", "email"]),

    whatsapp: firstString(row, ["whatsapp", "company_whatsapp", "contact_whatsapp"]),
    email: firstString(row, ["email", "company_email", "contact_email"]),

    city: firstString(row, ["city", "cidade", "company_city"]),
    state: firstString(row, ["state", "estado", "uf", "company_state"]),
    neighborhood: firstString(row, ["neighborhood", "bairro"]),
    address: firstString(row, ["address", "endereco", "endereço"]),
    zipcode: firstString(row, ["zipcode", "cep"]),

    coverage_type: firstString(row, ["coverage_type"]),
    coverage_radius_km: firstNumber(row, ["coverage_radius_km"]),

    latitude: firstNumber(row, ["latitude", "lat"]),
    longitude: firstNumber(row, ["longitude", "lng", "long"]),

    delivery_available: firstBoolean(row, [
      "delivery_available",
      "entrega_disponivel",
      "entrega",
    ]),
    pickup_available: firstBoolean(row, [
      "pickup_available",
      "retirada_disponivel",
      "retirada",
    ]),

    logo_url: firstString(row, ["logo_url", "logo"]),
    image_url: firstString(row, ["image_url", "image", "foto_url", "photo_url"]),
  };
}

export async function GET(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);

    const category = searchParams.get("category")?.trim() || "";
    const q = searchParams.get("q")?.trim() || "";
    const city = searchParams.get("city")?.trim() || "";
    const state = searchParams.get("state")?.trim() || "";
    const limitRaw = Number(searchParams.get("limit") || "60");
    const limit = Number.isFinite(limitRaw)
      ? Math.max(1, Math.min(limitRaw, 200))
      : 60;

    const { data, error } = await supabase
      .from("locadora_sellers")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(300);

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message || "Erro ao consultar locadora_sellers.",
        },
        { status: 500 }
      );
    }

    const rows = Array.isArray(data) ? (data as GenericRow[]) : [];

    const items = rows
      .filter(rowIsVisible)
      .filter((row) => rowMatchesCategory(row, category))
      .filter((row) => rowMatchesQuery(row, q))
      .filter((row) => rowMatchesLocation(row, city, state))
      .slice(0, limit)
      .map(toPublicItem);

    return NextResponse.json({
      ok: true,
      total: items.length,
      filters: {
        category,
        q,
        city,
        state,
        limit,
      },
      items,
      message:
        "Sistema em constante atualização e expansão. Podem ocorrer momentos de instabilidade durante melhorias, ajustes e novos lançamentos.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao buscar registros da locadora.",
      },
      { status: 500 }
    );
  }
}