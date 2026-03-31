import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const MODULES_TABLE = "app_builder_modules";

type ModulesQueryResult = {
  data: any[] | null;
  error: { message: string } | null;
};

function getEnv(name: string) {
  return process.env[name]?.trim() || "";
}

function getSupabaseAdmin() {
  const supabaseUrl =
    getEnv("SUPABASE_URL") || getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const serviceRole =
    getEnv("SUPABASE_SERVICE_ROLE_KEY") || getEnv("SUPABASE_SERVICE_ROLE");

  if (!supabaseUrl || !serviceRole) {
    throw new Error(
      "Variáveis do Supabase não configuradas: SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );
  }

  return createClient(supabaseUrl, serviceRole, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function text(value: unknown) {
  if (typeof value !== "string") return "";
  return value.trim();
}

function slugify(value: string) {
  return text(value)
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
}

async function withTimeout<T>(
  promise: PromiseLike<T>,
  ms: number,
  label: string
): Promise<T> {
  return await Promise.race([
    Promise.resolve(promise),
    new Promise<T>((_, reject) =>
      setTimeout(() => reject(new Error(`Timeout após ${ms}ms em ${label}`)), ms)
    ),
  ]);
}

function splitCsvLike(value: string) {
  return value
    .split(",")
    .map((item) => item.trim())
    .filter(Boolean);
}

function buildBaseModules(input: {
  projectId: string;
  ownerEmail: string;
  appName: string;
  pagesText: string;
  featuresText: string;
  appType: string;
  targetAudience: string;
  businessGoal: string;
  mainColor: string;
  secondaryColor: string;
  contactPhone: string;
  contactEmail: string;
  brandDescription: string;
}) {
  const pageNames = splitCsvLike(input.pagesText);
  const featureNames = splitCsvLike(input.featuresText);

  const modules: Array<{
    project_id: string;
    owner_email: string | null;
    module_name: string;
    module_slug: string;
    route_path: string;
    payload: any;
  }> = [];

  for (const pageName of pageNames) {
    const slug = slugify(pageName);

    if (!slug) continue;

    modules.push({
      project_id: input.projectId,
      owner_email: input.ownerEmail || null,
      module_name: pageName,
      module_slug: slug,
      route_path: `/${slug}`,
      payload: {
        type: "page",
        appName: input.appName,
        pageName,
        slug,
        route: `/${slug}`,
        appType: input.appType,
        targetAudience: input.targetAudience,
        businessGoal: input.businessGoal,
        mainColor: input.mainColor,
        secondaryColor: input.secondaryColor,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail,
        brandDescription: input.brandDescription,
      },
    });
  }

  for (const featureName of featureNames) {
    const slug = slugify(featureName);

    if (!slug) continue;

    const alreadyExists = modules.some((item) => item.module_slug === slug);
    if (alreadyExists) continue;

    modules.push({
      project_id: input.projectId,
      owner_email: input.ownerEmail || null,
      module_name: featureName,
      module_slug: slug,
      route_path: `/${slug}`,
      payload: {
        type: "feature",
        appName: input.appName,
        featureName,
        slug,
        route: `/${slug}`,
        appType: input.appType,
        targetAudience: input.targetAudience,
        businessGoal: input.businessGoal,
        mainColor: input.mainColor,
        secondaryColor: input.secondaryColor,
        contactPhone: input.contactPhone,
        contactEmail: input.contactEmail,
        brandDescription: input.brandDescription,
      },
    });
  }

  return modules;
}

export async function GET(request: Request) {
  try {
    const supabase = getSupabaseAdmin();
    const { searchParams } = new URL(request.url);

    const projectId = text(searchParams.get("projectId"));
    const ownerEmail = text(searchParams.get("ownerEmail"));

    let query: any = supabase
      .from(MODULES_TABLE)
      .select("*")
      .order("created_at", { ascending: false });

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    if (ownerEmail) {
      query = query.eq("owner_email", ownerEmail);
    }

    const result: ModulesQueryResult = await withTimeout(
      query.limit(100) as PromiseLike<ModulesQueryResult>,
      8000,
      "GET /api/app-builder/modules"
    );

    if (result.error) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error.message,
          tableUsed: MODULES_TABLE,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      modules: result.data ?? [],
      tableUsed: MODULES_TABLE,
    });
  } catch (error) {
    console.error("GET /api/app-builder/modules error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao listar módulos.",
        tableUsed: MODULES_TABLE,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const supabase = getSupabaseAdmin();
    const body = await request.json();

    const projectId = text(body?.projectId);
    const ownerEmail = text(body?.ownerEmail).toLowerCase();
    const appName = text(body?.appName);
    const appType = text(body?.appType) || "personalizado";
    const targetAudience = text(body?.targetAudience);
    const businessGoal = text(body?.businessGoal);
    const mainColor = text(body?.mainColor) || "#00d084";
    const secondaryColor = text(body?.secondaryColor) || "#0b1220";
    const pagesText = text(body?.pagesText);
    const featuresText = text(body?.featuresText);
    const contactPhone = text(body?.contactPhone);
    const contactEmail = text(body?.contactEmail);
    const brandDescription = text(body?.brandDescription);

    if (!projectId) {
      return NextResponse.json(
        {
          ok: false,
          error: "Project ID é obrigatório para gerar módulos.",
        },
        { status: 400 }
      );
    }

    if (!appName) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nome do app é obrigatório.",
        },
        { status: 400 }
      );
    }

    if (!pagesText && !featuresText) {
      return NextResponse.json(
        {
          ok: false,
          error: "Preencha páginas desejadas ou funcionalidades desejadas.",
        },
        { status: 400 }
      );
    }

    const modulesToCreate = buildBaseModules({
      projectId,
      ownerEmail,
      appName,
      pagesText,
      featuresText,
      appType,
      targetAudience,
      businessGoal,
      mainColor,
      secondaryColor,
      contactPhone,
      contactEmail,
      brandDescription,
    });

    if (modulesToCreate.length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nenhum módulo válido foi gerado.",
        },
        { status: 400 }
      );
    }

    const existingResult: ModulesQueryResult = await withTimeout(
      supabase
        .from(MODULES_TABLE)
        .select("project_id,module_slug")
        .eq("project_id", projectId) as PromiseLike<ModulesQueryResult>,
      8000,
      "SELECT módulos existentes"
    );

    if (existingResult.error) {
      return NextResponse.json(
        {
          ok: false,
          error: existingResult.error.message,
        },
        { status: 500 }
      );
    }

    const existingSlugs = new Set(
      (existingResult.data || []).map((item: any) => item.module_slug)
    );

    const filteredModules = modulesToCreate.filter(
      (item) => !existingSlugs.has(item.module_slug)
    );

    if (filteredModules.length === 0) {
      return NextResponse.json({
        ok: true,
        created: 0,
        skipped: modulesToCreate.length,
        modules: [],
        message: "Todos os módulos já existiam para este projeto.",
      });
    }

    const insertResult = await withTimeout(
      supabase
        .from(MODULES_TABLE)
        .insert(filteredModules)
        .select("*") as PromiseLike<ModulesQueryResult>,
      8000,
      "INSERT módulos"
    );

    if (insertResult.error) {
      return NextResponse.json(
        {
          ok: false,
          error: insertResult.error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      created: filteredModules.length,
      skipped: modulesToCreate.length - filteredModules.length,
      modules: insertResult.data || [],
      message: "Estrutura técnica gerada com sucesso.",
    });
  } catch (error) {
    console.error("POST /api/app-builder/modules error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao gerar módulos.",
      },
      { status: 500 }
    );
  }
}