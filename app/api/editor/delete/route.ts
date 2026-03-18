import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type DeleteEditorBody = {
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
    const body = (await req.json()) as DeleteEditorBody;
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

    const { error } = await supabase
      .from("editor_projects")
      .delete()
      .eq("id", id)
      .eq("user_email", email);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Erro ao excluir projeto." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      deletedId: id,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno ao excluir projeto.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}