import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type DuplicateEditorBody = {
  id?: string;
  email?: string;
};

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

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

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as DuplicateEditorBody;
    const id = (body.id || "").trim();
    const email = (body.email || "").trim().toLowerCase();

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

    const supabase = getSupabaseAdmin();

    const { data: original, error: fetchError } = await supabase
      .from("editor_projects")
      .select("id, user_email, title, design_data")
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
      typeof original.title === "string" && original.title.trim()
        ? original.title.trim()
        : "Arte Aurora";

    const { data: created, error: createError } = await supabase
      .from("editor_projects")
      .insert({
        user_email: email,
        title: `${originalTitle} (cópia)`,
        design_data: original.design_data,
      })
      .select("id, user_email, title, design_data, created_at, updated_at")
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
      error instanceof Error ? error.message : "Erro interno ao duplicar projeto.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}