import { NextRequest, NextResponse } from "next/server";
import { isLocadoraAdminAuthenticated } from "@/lib/locadora-admin-auth";
import {
  createSellerInDb,
  listSellersFromDbOrMock,
} from "@/lib/locadora-db";
import { getLocadoraServerClient } from "@/lib/supabase-locadora-server";

type SellerBody = {
  id?: string;
  tenantSlug?: string;
  companyName?: string;
  tradeName?: string;
  type?: "locadora" | "revenda" | "parceiro";
  logoText?: string;
  tagline?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  state?: string;
  active?: boolean;
  featured?: boolean;

  // compatibilidade com o admin atual
  name?: string;
};

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .replace(/-{2,}/g, "-");
}

function normalizeSellerInput(body: SellerBody) {
  const tradeName = (body.tradeName || body.name || "").trim();
  const companyName = (body.companyName || tradeName).trim();
  const tenantSlug = (body.tenantSlug || slugify(tradeName)).trim();
  const type = body.type || "locadora";
  const logoText = (body.logoText || "").trim().toUpperCase().slice(0, 6);
  const tagline = (body.tagline || "").trim();
  const phone = (body.phone || "").trim();
  const whatsapp = (body.whatsapp || "").trim();
  const city = (body.city || "").trim();
  const state = (body.state || "").trim().toUpperCase();
  const active = typeof body.active === "boolean" ? body.active : true;
  const featured = typeof body.featured === "boolean" ? body.featured : false;

  return {
    tradeName,
    companyName,
    tenantSlug,
    type,
    logoText,
    tagline,
    phone,
    whatsapp,
    city,
    state,
    active,
    featured,
  };
}

async function ensureAdmin() {
  const authenticated = await isLocadoraAdminAuthenticated();
  return authenticated;
}

export async function GET() {
  try {
    const authenticated = await ensureAdmin();

    if (!authenticated) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const result = await listSellersFromDbOrMock();

    return NextResponse.json({
      sellers: result.sellers || [],
      mode: result.mode,
    });
  } catch (error) {
    console.error("Erro geral ao listar locadoras:", error);
    return NextResponse.json(
      { error: "Erro interno ao listar locadoras." },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const authenticated = await ensureAdmin();

    if (!authenticated) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = (await req.json()) as SellerBody;
    const payload = normalizeSellerInput(body);

    if (!payload.tradeName) {
      return NextResponse.json(
        { error: "Informe o nome da locadora." },
        { status: 400 }
      );
    }

    if (!payload.companyName) {
      return NextResponse.json(
        { error: "Informe a razão social ou nome da empresa." },
        { status: 400 }
      );
    }

    if (!payload.tenantSlug) {
      return NextResponse.json(
        { error: "Não foi possível gerar o slug da locadora." },
        { status: 400 }
      );
    }

    if (!payload.logoText) {
      return NextResponse.json(
        { error: "Informe a sigla/logo da locadora." },
        { status: 400 }
      );
    }

    const result = await createSellerInDb({
      tenantSlug: payload.tenantSlug,
      companyName: payload.companyName,
      tradeName: payload.tradeName,
      type: payload.type,
      tagline: payload.tagline || undefined,
      phone: payload.phone || undefined,
      whatsapp: payload.whatsapp || undefined,
      logoText: payload.logoText,
      city: payload.city || undefined,
      state: payload.state || undefined,
      active: payload.active,
      featured: payload.featured,
    });

    return NextResponse.json({
      success: true,
      seller: result.seller,
      mode: result.mode,
    });
  } catch (error) {
    console.error("Erro geral ao cadastrar locadora:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao cadastrar locadora.",
      },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const authenticated = await ensureAdmin();

    if (!authenticated) {
      return NextResponse.json({ error: "Não autorizado." }, { status: 401 });
    }

    const body = (await req.json()) as SellerBody;
    const id = (body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "ID da locadora não informado." },
        { status: 400 }
      );
    }

    const payload = normalizeSellerInput(body);

    if (!payload.tradeName) {
      return NextResponse.json(
        { error: "Informe o nome da locadora." },
        { status: 400 }
      );
    }

    if (!payload.companyName) {
      return NextResponse.json(
        { error: "Informe a razão social ou nome da empresa." },
        { status: 400 }
      );
    }

    if (!payload.tenantSlug) {
      return NextResponse.json(
        { error: "Informe o slug da locadora." },
        { status: 400 }
      );
    }

    if (!payload.logoText) {
      return NextResponse.json(
        { error: "Informe a sigla/logo da locadora." },
        { status: 400 }
      );
    }

    const supabase = getLocadoraServerClient();

    if (!supabase) {
      return NextResponse.json(
        { error: "Supabase não configurado no servidor." },
        { status: 500 }
      );
    }

    const { data, error } = await supabase
      .from("locadora_sellers")
      .update({
        tenant_slug: payload.tenantSlug,
        company_name: payload.companyName,
        trade_name: payload.tradeName,
        type: payload.type,
        tagline: payload.tagline || null,
        phone: payload.phone || null,
        whatsapp: payload.whatsapp || null,
        logo_text: payload.logoText,
        city: payload.city || null,
        state: payload.state || null,
        active: payload.active,
        featured: payload.featured,
      })
      .eq("id", id)
      .select("*")
      .single();

    if (error) {
      console.error("Erro ao editar locadora:", error);
      return NextResponse.json(
        { error: error.message || "Erro ao editar locadora." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      seller: data,
      mode: "database",
    });
  } catch (error) {
    console.error("Erro geral ao editar locadora:", error);
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao editar locadora.",
      },
      { status: 500 }
    );
  }
}