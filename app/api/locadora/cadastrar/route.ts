import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

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

function asString(value: unknown) {
  if (value === null || value === undefined) return null;
  const text = String(value).trim();
  return text.length ? text : null;
}

function asNumber(value: unknown) {
  if (value === null || value === undefined || value === "") return null;
  const n = Number(value);
  return Number.isFinite(n) ? n : null;
}

function asBoolean(value: unknown) {
  if (typeof value === "boolean") return value;

  if (typeof value === "string") {
    const v = value.trim().toLowerCase();
    if (["true", "1", "sim", "yes", "on"].includes(v)) return true;
    if (["false", "0", "nao", "não", "no", "off"].includes(v)) return false;
  }

  if (typeof value === "number") {
    if (value === 1) return true;
    if (value === 0) return false;
  }

  return false;
}

function makeLogoText(companyName: string | null, title: string | null) {
  const base = (companyName || title || "LOC").trim();
  const cleaned = base
    .replace(/\s+/g, " ")
    .trim();

  if (!cleaned) return "LOC";

  const words = cleaned.split(" ").filter(Boolean);

  if (words.length === 1) {
    return words[0].slice(0, 3).toUpperCase();
  }

  return words
    .slice(0, 2)
    .map((word) => word.charAt(0).toUpperCase())
    .join("");
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await req.json();

    const companyName = asString(body.company_name);
    const title = asString(body.title);
    const name = companyName || title || "Cadastro Locadora";
    const logoText = makeLogoText(companyName, title);

    const payload = {
      name,
      logo_text: logoText,

      company_name: companyName,
      company_whatsapp: asString(body.company_whatsapp),
      company_city: asString(body.company_city),
      company_state: asString(body.company_state),
      company_email: asString(body.company_email),

      contact_name: asString(body.contact_name),
      contact_role: asString(body.contact_role),
      contact_whatsapp: asString(body.contact_whatsapp),
      contact_email: asString(body.contact_email),

      category: asString(body.category),
      title,
      description: asString(body.description),
      city: asString(body.city),
      state: asString(body.state),

      coverage_type: asString(body.coverage_type),
      coverage_radius_km: asNumber(body.coverage_radius_km),
      latitude: asNumber(body.latitude),
      longitude: asNumber(body.longitude),

      delivery_available: asBoolean(body.delivery_available),
      pickup_available: asBoolean(body.pickup_available),

      active: true,
      published: true,
      approved: true,
    };

    const { data, error } = await supabase
      .from("locadora_sellers")
      .insert([payload])
      .select("*");

    if (error) {
      return NextResponse.json(
        {
          ok: false,
          error: error.message,
          payload,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      item: Array.isArray(data) ? data[0] ?? null : null,
      message: "Cadastro salvo com sucesso na locadora.",
    });
  } catch (error) {
    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro ao cadastrar locadora.",
      },
      { status: 500 }
    );
  }
}