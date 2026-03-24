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

function normalizeTitle(value: string) {
  const cleaned = value.replace(/\s+/g, " ").trim();
  return cleaned || "Arte Aurora";
}

function normalizeId(value: string) {
  return value.trim();
}

function normalizePreviewImageUrl(value: string) {
  const cleaned = value.trim();
  return cleaned || null;
}

function isValidEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isPlainObject(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function safeJsonSize(value: unknown) {
  try {
    return JSON.stringify(value).length;
  } catch {
    return 0;
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as SaveEditorBody;

    const email = normalizeEmail(body.email || "");
    const title = normalizeTitle(body.title || "Arte Aurora");
    const designData = body.designData;
    const id = normalizeId(body.id || "");
    const previewImageUrl = normalizePreviewImageUrl(body.previewImageUrl || "");

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

    if (!isPlainObject(designData)) {
      return NextResponse.json(
        { error: "Dados do editor não enviados ou inválidos." },
        { status: 400 }
      );
    }

    if (title.length > 120) {
      return NextResponse.json(
        { error: "Título muito longo. Use até 120 caracteres." },
        { status: 400 }
      );
    }

    if (previewImageUrl && previewImageUrl.length > 2_000_000) {
      return NextResponse.json(
        { error: "Miniatura muito grande para salvar." },
        { status: 400 }
      );
    }

    const designDataSize = safeJsonSize(designData);

    if (designDataSize <= 2) {
      return NextResponse.json(
        { error: "Dados do editor vazios." },
        { status: 400 }
      );
    }

    if (designDataSize > 2_000_000) {
      return NextResponse.json(
        { error: "Os dados do projeto ficaram grandes demais para salvar." },
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