import { NextRequest, NextResponse } from "next/server";
import { isLocadoraAdminAuthenticated } from "@/lib/locadora-admin-auth";
import { getLocadoraServerClient } from "@/lib/supabase-locadora-server";

type VehicleBody = {
  id?: string;
  sellerId?: string;
  tenantSlug?: string;
  slug?: string;
  title?: string;
  brand?: string;
  model?: string;
  year?: number | string;
  category?: string;
  fuel?: string;
  transmission?: string;
  mode?: string[];
  priceSale?: number | string | null;
  priceRentDaily?: number | string | null;
  location?: string;
  city?: string;
  state?: string;
  image?: string;
  featured?: boolean;
  description?: string;
  badge?: string;
  active?: boolean;
  platformCommissionPercent?: number | string | null;
};

function normalizeNumber(value: unknown) {
  if (value === null || value === undefined || value === "") {
    return null;
  }
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : null;
}

function normalizeSlug(value: string) {
  return value
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

async function ensureAdmin() {
  return await isLocadoraAdminAuthenticated();
}

export async function GET() {
  try {
    const auth = await ensureAdmin();
    if (!auth) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const supabase = getLocadoraServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase não configurado." },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("locadora_vehicles")
      .select(`
        *,
        seller:locadora_sellers (
          id,
          tenant_slug,
          company_name,
          trade_name,
          logo_text,
          tagline,
          phone,
          whatsapp
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Erro ao listar veículos." },
        { status: 500 }
      );
    }

    return NextResponse.json({ vehicles: data || [] });
  } catch (e) {
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const auth = await ensureAdmin();
    if (!auth) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = (await req.json()) as VehicleBody;

    const sellerId = body.sellerId || "";
    const tenantSlug = body.tenantSlug || "";

    if (!sellerId || !tenantSlug) {
      return NextResponse.json(
        { error: "Locadora inválida." },
        { status: 400 }
      );
    }

    const title = (body.title || "").trim();
    const brand = (body.brand || "").trim();
    const model = (body.model || "").trim();

    if (!title || !brand || !model) {
      return NextResponse.json(
        { error: "Título, marca e modelo obrigatórios." },
        { status: 400 }
      );
    }

    const year = normalizeNumber(body.year);
    if (!year) {
      return NextResponse.json(
        { error: "Ano inválido." },
        { status: 400 }
      );
    }

    const slug = normalizeSlug(body.slug || `${title}-${year}`);

    const supabase = getLocadoraServerClient();

    const { data, error } = await supabase!
      .from("locadora_vehicles")
      .insert({
        tenant_slug: tenantSlug,
        seller_id: sellerId,
        slug,
        title,
        brand,
        model,
        year,
        category: body.category || null,
        fuel: body.fuel || null,
        transmission: body.transmission || null,
        mode: body.mode || ["venda"],
        price_sale: normalizeNumber(body.priceSale),
        price_rent_daily: normalizeNumber(body.priceRentDaily),
        location: body.location || "",
        city: body.city || null,
        state: body.state || null,
        image: body.image || "",
        featured: Boolean(body.featured),
        description: body.description || "",
        badge: body.badge || null,
        platform_commission_percent: normalizeNumber(
          body.platformCommissionPercent
        ),
      })
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Erro ao salvar veículo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, vehicle: data });
  } catch (e) {
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const auth = await ensureAdmin();
    if (!auth) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = (await req.json()) as VehicleBody;

    const id = body.id || "";
    if (!id) {
      return NextResponse.json(
        { error: "ID obrigatório." },
        { status: 400 }
      );
    }

    const supabase = getLocadoraServerClient();

    const { data, error } = await supabase!
      .from("locadora_vehicles")
      .update({
        title: body.title,
        brand: body.brand,
        model: body.model,
        year: normalizeNumber(body.year),
        category: body.category,
        fuel: body.fuel,
        transmission: body.transmission,
        mode: body.mode,
        price_sale: normalizeNumber(body.priceSale),
        price_rent_daily: normalizeNumber(body.priceRentDaily),
        location: body.location,
        city: body.city,
        state: body.state,
        image: body.image,
        featured: Boolean(body.featured),
        description: body.description,
        badge: body.badge,
        platform_commission_percent: normalizeNumber(
          body.platformCommissionPercent
        ),
        active: body.active ?? true,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error(error);
      return NextResponse.json(
        { error: "Erro ao atualizar veículo." },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true, vehicle: data });
  } catch (e) {
    return NextResponse.json(
      { error: "Erro interno." },
      { status: 500 }
    );
  }
}