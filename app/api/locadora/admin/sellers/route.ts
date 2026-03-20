import { NextRequest, NextResponse } from "next/server";
import { getLocadoraServerClient } from "@/lib/supabase-locadora-server";

type SellerBody = {
  id?: string;
  name?: string;
  logoText?: string;
  tagline?: string;
  phone?: string;
  whatsapp?: string;
  city?: string;
  state?: string;
  active?: boolean;
};

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
      .from("locadora_sellers")
      .select("*")
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Erro ao listar locadoras:", error);
      return NextResponse.json(
        { error: "Erro ao listar locadoras." },
        { status: 500 }
      );
    }

    return NextResponse.json({ sellers: data || [] });
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
    const body = (await req.json()) as SellerBody;

    const name = (body.name || "").trim();
    const logoText = (body.logoText || "").trim().toUpperCase();
    const tagline = (body.tagline || "").trim();
    const phone = (body.phone || "").trim();
    const whatsapp = (body.whatsapp || "").trim();
    const city = (body.city || "").trim();
    const state = (body.state || "").trim().toUpperCase();

    if (!name) {
      return NextResponse.json(
        { error: "Informe o nome da locadora." },
        { status: 400 }
      );
    }

    if (!logoText) {
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
      .insert({
        name,
        logo_text: logoText,
        tagline: tagline || null,
        phone: phone || null,
        whatsapp: whatsapp || null,
        city: city || null,
        state: state || null,
        active: true,
      })
      .select()
      .single();

    if (error) {
      console.error("Erro ao cadastrar locadora:", error);
      return NextResponse.json(
        { error: "Erro ao cadastrar locadora." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      seller: data,
    });
  } catch (error) {
    console.error("Erro geral ao cadastrar locadora:", error);
    return NextResponse.json(
      { error: "Erro interno ao cadastrar locadora." },
      { status: 500 }
    );
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = (await req.json()) as SellerBody;

    const id = (body.id || "").trim();

    if (!id) {
      return NextResponse.json(
        { error: "ID da locadora não informado." },
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

    const payload = {
      name: (body.name || "").trim(),
      logo_text: (body.logoText || "").trim().toUpperCase(),
      tagline: ((body.tagline || "").trim() || null),
      phone: ((body.phone || "").trim() || null),
      whatsapp: ((body.whatsapp || "").trim() || null),
      city: ((body.city || "").trim() || null),
      state: ((body.state || "").trim().toUpperCase() || null),
      active: typeof body.active === "boolean" ? body.active : true,
    };

    if (!payload.name) {
      return NextResponse.json(
        { error: "Informe o nome da locadora." },
        { status: 400 }
      );
    }

    if (!payload.logo_text) {
      return NextResponse.json(
        { error: "Informe a sigla/logo da locadora." },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("locadora_sellers")
      .update(payload)
      .eq("id", id)
      .select()
      .single();

    if (error) {
      console.error("Erro ao editar locadora:", error);
      return NextResponse.json(
        { error: "Erro ao editar locadora." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      seller: data,
    });
  } catch (error) {
    console.error("Erro geral ao editar locadora:", error);
    return NextResponse.json(
      { error: "Erro interno ao editar locadora." },
      { status: 500 }
    );
  }
}