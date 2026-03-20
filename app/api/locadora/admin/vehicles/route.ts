import { NextRequest, NextResponse } from "next/server";
import { getLocadoraServerClient } from "@/lib/supabase-locadora-server";

type VehicleBody = {
  id?: string;
  sellerId?: string;
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
  image?: string;
  featured?: boolean;
  description?: string;
  badge?: string;
  active?: boolean;
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

export async function GET() {
  try {
    const supabase = getLocadoraServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase não configurado no servidor." },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("locadora_vehicles")
      .select(`
        *,
        seller:locadora_sellers (
          id,
          name,
          logo_text,
          tagline,
          phone,
          whatsapp
        )
      `)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao listar veículos admin:", error);
      return NextResponse.json(
        { error: "Erro ao listar veículos." },
        { status: 500 }
      );
    }

    return NextResponse.json({ vehicles: data || [] });
  } catch (error) {
    console.error("Erro geral ao listar veículos admin:", error);
    return NextResponse.json(
      { error: "Erro interno ao listar veículos." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as VehicleBody;

    const sellerId = (body.sellerId || "").trim();
    const title = (body.title || "").trim();
    const brand = (body.brand || "").trim();
    const model = (body.model || "").trim();
    const category = (body.category || "").trim();
    const fuel = (body.fuel || "").trim();
    const transmission = (body.transmission || "").trim();
    const location = (body.location || "").trim();
    const image = (body.image || "").trim();
    const description = (body.description || "").trim();
    const badge = (body.badge || "").trim();
    const featured = Boolean(body.featured);

    const year = normalizeNumber(body.year);
    const priceSale = normalizeNumber(body.priceSale);
    const priceRentDaily = normalizeNumber(body.priceRentDaily);

    const mode = Array.isArray(body.mode)
      ? body.mode
          .map((item) => String(item).trim().toLowerCase())
          .filter(Boolean)
      : [];

    if (!sellerId) {
      return NextResponse.json(
        { error: "Selecione a locadora." },
        { status: 400 }
      );
    }

    if (!title || !brand || !model) {
      return NextResponse.json(
        { error: "Informe título, marca e modelo." },
        { status: 400 }
      );
    }

    if (!year) {
      return NextResponse.json(
        { error: "Informe o ano do veículo." },
        { status: 400 }
      );
    }

    if (!category || !fuel || !transmission || !location || !image || !description) {
      return NextResponse.json(
        { error: "Preencha categoria, combustível, câmbio, local, imagem e descrição." },
        { status: 400 }
      );
    }

    if (!mode.length) {
      return NextResponse.json(
        { error: "Selecione pelo menos uma modalidade: venda e/ou aluguel." },
        { status: 400 }
      );
    }

    const slugBase = (body.slug || "").trim() || `${title}-${year}`;
    const slug = normalizeSlug(slugBase);

    const supabase = getLocadoraServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase não configurado no servidor." },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("locadora_vehicles")
      .insert({
        seller_id: sellerId,
        slug,
        title,
        brand,
        model,
        year,
        category,
        fuel,
        transmission,
        mode,
        price_sale: priceSale,
        price_rent_daily: priceRentDaily,
        location,
        image,
        featured,
        description,
        badge: badge || null,
        active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao cadastrar veículo:", error);
      return NextResponse.json(
        { error: "Erro ao cadastrar veículo. Verifique se o slug não ficou repetido." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle: data,
    });
  } catch (error) {
    console.error("Erro geral ao cadastrar veículo:", error);
    return NextResponse.json(
      { error: "Erro interno ao cadastrar veículo." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as VehicleBody;

    const id = (body.id || "").trim();
    const sellerId = (body.sellerId || "").trim();
    const title = (body.title || "").trim();
    const brand = (body.brand || "").trim();
    const model = (body.model || "").trim();
    const category = (body.category || "").trim();
    const fuel = (body.fuel || "").trim();
    const transmission = (body.transmission || "").trim();
    const location = (body.location || "").trim();
    const image = (body.image || "").trim();
    const description = (body.description || "").trim();
    const badge = (body.badge || "").trim();
    const featured = Boolean(body.featured);
    const active = typeof body.active === "boolean" ? body.active : true;

    const year = normalizeNumber(body.year);
    const priceSale = normalizeNumber(body.priceSale);
    const priceRentDaily = normalizeNumber(body.priceRentDaily);

    const mode = Array.isArray(body.mode)
      ? body.mode
          .map((item) => String(item).trim().toLowerCase())
          .filter(Boolean)
      : [];

    if (!id) {
      return NextResponse.json(
        { error: "ID do veículo não informado." },
        { status: 400 }
      );
    }

    if (!sellerId) {
      return NextResponse.json(
        { error: "Selecione a locadora." },
        { status: 400 }
      );
    }

    if (!title || !brand || !model) {
      return NextResponse.json(
        { error: "Informe título, marca e modelo." },
        { status: 400 }
      );
    }

    if (!year) {
      return NextResponse.json(
        { error: "Informe o ano do veículo." },
        { status: 400 }
      );
    }

    if (!category || !fuel || !transmission || !location || !image || !description) {
      return NextResponse.json(
        { error: "Preencha categoria, combustível, câmbio, local, imagem e descrição." },
        { status: 400 }
      );
    }

    if (!mode.length) {
      return NextResponse.json(
        { error: "Selecione pelo menos uma modalidade: venda e/ou aluguel." },
        { status: 400 }
      );
    }

    const slugBase = (body.slug || "").trim() || `${title}-${year}`;
    const slug = normalizeSlug(slugBase);

    const supabase = getLocadoraServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase não configurado no servidor." },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("locadora_vehicles")
      .update({
        seller_id: sellerId,
        slug,
        title,
        brand,
        model,
        year,
        category,
        fuel,
        transmission,
        mode,
        price_sale: priceSale,
        price_rent_daily: priceRentDaily,
        location,
        image,
        featured,
        description,
        badge: badge || null,
        active,
      })
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao editar veículo:", error);
      return NextResponse.json(
        { error: "Erro ao editar veículo. Verifique se o slug não ficou repetido." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      vehicle: data,
    });
  } catch (error) {
    console.error("Erro geral ao editar veículo:", error);
    return NextResponse.json(
      { error: "Erro interno ao editar veículo." },
      { status: 500 }
    );
  }
}