import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type SaveEditorBody = {
  id?: string;
  email?: string;
  title?: string;
  designData?: unknown;
  previewImageUrl?: string;
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
    const body = (await req.json()) as SaveEditorBody;

    const email = (body.email || "").trim().toLowerCase();
    const title = (body.title || "Arte Aurora").trim();
    const designData = body.designData;
    const id = (body.id || "").trim();
    const previewImageUrl = (body.previewImageUrl || "").trim() || null;

    if (!email) {
      return NextResponse.json(
        { error: "E-mail do usuário não informado." },
        { status: 400 }
      );
    }

    if (!designData || typeof designData !== "object") {
      return NextResponse.json(
        { error: "Dados do editor não enviados." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    if (id) {
      const { data, error } = await supabase
        .from("editor_projects")
        .update({
          user_email: email,
          title,
          design_data: designData,
          preview_image_url: previewImageUrl,
        })
        .eq("id", id)
        .select("id, user_email, title, preview_image_url, created_at, updated_at")
        .single();

      if (error) {
        return NextResponse.json(
          { error: error.message || "Erro ao atualizar arte." },
          { status: 500 }
        );
      }

      return NextResponse.json({
        success: true,
        mode: "updated",
        project: data,
      });
    }

    const { data, error } = await supabase
      .from("editor_projects")
      .insert({
        user_email: email,
        title,
        design_data: designData,
        preview_image_url: previewImageUrl,
      })
      .select("id, user_email, title, preview_image_url, created_at, updated_at")
      .single();

    if (error) {
      return NextResponse.json(
        { error: error.message || "Erro ao salvar arte." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      mode: "created",
      project: data,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno ao salvar arte.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}