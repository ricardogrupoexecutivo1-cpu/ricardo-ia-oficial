import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

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