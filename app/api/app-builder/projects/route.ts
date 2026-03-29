import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import { logRouteError, logRouteInfo } from "@/lib/aurora-guard";

export const runtime = "nodejs";

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    return null;
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function sanitizeText(value: unknown) {
  return String(value || "").trim();
}

export async function GET(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      await logRouteError({
        route: "/api/app-builder/projects",
        message: "Supabase não configurado no App Builder GET.",
      });

      return NextResponse.json(
        {
          ok: false,
          error: "Supabase não configurado.",
        },
        { status: 500 }
      );
    }

    const ownerEmail = sanitizeText(
      req.nextUrl.searchParams.get("ownerEmail") || ""
    ).toLowerCase();

    let query = supabase
      .from("app_builder_projects")
      .select("*")
      .order("created_at", { ascending: false })
      .limit(30);

    if (ownerEmail) {
      query = query.eq("owner_email", ownerEmail);
    }

    const { data, error } = await query;

    if (error) {
      await logRouteError({
        route: "/api/app-builder/projects",
        message: "Erro ao listar projetos do App Builder.",
        details: {
          error: error.message,
          ownerEmail,
        },
      });

      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    await logRouteInfo({
      route: "/api/app-builder/projects",
      message: "Projetos do App Builder listados com sucesso.",
      details: {
        count: data?.length || 0,
        ownerEmail: ownerEmail || null,
      },
    });

    return NextResponse.json({
      ok: true,
      projects: data || [],
    });
  } catch (error) {
    await logRouteError({
      route: "/api/app-builder/projects",
      message: "Falha inesperada no GET do App Builder.",
      details: {
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
    });

    return NextResponse.json(
      {
        ok: false,
        error: "Erro interno ao listar projetos.",
      },
      { status: 500 }
    );
  }
}

export async function POST(req: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();

    if (!supabase) {
      await logRouteError({
        route: "/api/app-builder/projects",
        message: "Supabase não configurado no App Builder POST.",
      });

      return NextResponse.json(
        {
          ok: false,
          error: "Supabase não configurado.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();

    const payload = {
      owner_email: sanitizeText(body?.ownerEmail).toLowerCase() || null,
      app_name: sanitizeText(body?.appName),
      app_type: sanitizeText(body?.appType) || "personalizado",
      business_goal: sanitizeText(body?.businessGoal) || null,
      target_audience: sanitizeText(body?.targetAudience) || null,
      main_color: sanitizeText(body?.mainColor) || null,
      secondary_color: sanitizeText(body?.secondaryColor) || null,
      pages_text: sanitizeText(body?.pagesText) || null,
      features_text: sanitizeText(body?.featuresText) || null,
      contact_phone: sanitizeText(body?.contactPhone) || null,
      contact_email: sanitizeText(body?.contactEmail) || null,
      brand_description: sanitizeText(body?.brandDescription) || null,
      generated_prompt: sanitizeText(body?.generatedPrompt) || null,
      status: sanitizeText(body?.status) || "draft",
      updated_at: new Date().toISOString(),
    };

    if (!payload.app_name) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nome do app é obrigatório.",
        },
        { status: 400 }
      );
    }

    const { data, error } = await supabase
      .from("app_builder_projects")
      .insert(payload)
      .select("*")
      .single();

    if (error) {
      await logRouteError({
        route: "/api/app-builder/projects",
        message: "Erro ao salvar projeto do App Builder.",
        details: {
          error: error.message,
          appName: payload.app_name,
          appType: payload.app_type,
        },
      });

      return NextResponse.json(
        {
          ok: false,
          error: error.message,
        },
        { status: 500 }
      );
    }

    await logRouteInfo({
      route: "/api/app-builder/projects",
      message: "Projeto do App Builder salvo com sucesso.",
      details: {
        projectId: data?.id || null,
        appName: payload.app_name,
        appType: payload.app_type,
      },
    });

    return NextResponse.json({
      ok: true,
      project: data,
    });
  } catch (error) {
    await logRouteError({
      route: "/api/app-builder/projects",
      message: "Falha inesperada no POST do App Builder.",
      details: {
        error: error instanceof Error ? error.message : "Erro desconhecido",
      },
    });

    return NextResponse.json(
      {
        ok: false,
        error: "Erro interno ao salvar projeto.",
      },
      { status: 500 }
    );
  }
}