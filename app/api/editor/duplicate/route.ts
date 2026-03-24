import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type DuplicateEditorBody = {
  id?: string;
  email?: string;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL?.trim();
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim();

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error(
      "Variáveis NEXT_PUBLIC_SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas."
    );
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function normalizeId(value: string) {
  return value.trim();
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function buildCopyTitle(title: string) {
  const cleaned = title.replace(/\s+/g, " ").trim() || "Arte Aurora";
  const copyTitle = `${cleaned} (cópia)`;

  if (copyTitle.length <= 140) {
    return copyTitle;
  }

  return `${cleaned.slice(0, 130).trim()} (cópia)`;
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DuplicateEditorBody;

    const id = normalizeId(body.id || "");
    const email = normalizeEmail(body.email || "");

    if (!id) {
      return NextResponse.json(
        { error: "ID do projeto não informado." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "E-mail do usuário não informado." },
        { status: 400 }
      );
    }

    if (!isValidEmail(email)) {
      return NextResponse.json(
        { error: "E-mail inválido." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: original, error: fetchError } = await supabase
      .from("editor_projects")
      .select("id, user_email, title, design_data, preview_image_url")
      .eq("id", id)
      .eq("user_email", email)
      .single();

    if (fetchError || !original) {
      return NextResponse.json(
        { error: fetchError?.message || "Projeto original não encontrado." },
        { status: 404 }
      );
    }

    const originalTitle =
      typeof original.title === "string" ? original.title : "Arte Aurora";

    const duplicatedTitle = buildCopyTitle(originalTitle);

    const { data: created, error: createError } = await supabase
      .from("editor_projects")
      .insert({
        user_email: email,
        title: duplicatedTitle,
        design_data: original.design_data,
        preview_image_url: original.preview_image_url || null,
      })
      .select(
        "id, user_email, title, design_data, preview_image_url, created_at, updated_at"
      )
      .single();

    if (createError) {
      return NextResponse.json(
        { error: createError.message || "Erro ao duplicar projeto." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      project: created,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao duplicar projeto.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}