import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type PrefillResponse = {
  ok: boolean;
  found: boolean;
  sourceTable: string;
  data: {
    fullName: string;
    companyName: string;
    whatsapp: string;
    city: string;
    state: string;
    segment: string;
    slug: string;
    status: string;
    email: string;
    coverageType: string;
    registrationType: string;
    registrationComplete: string;
    sourceOrigin: string;
    completionDeadline: string;
  } | null;
  error?: string;
};

function getAdminClient() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

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

function getStringValue(row: Record<string, unknown>, keys: string[]) {
  for (const key of keys) {
    const value = row[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }

    if (typeof value === "number") {
      return String(value);
    }

    if (typeof value === "boolean") {
      return value ? "true" : "false";
    }
  }

  return "";
}

function normalizeRow(row: Record<string, unknown>, sourceTable: string) {
  return {
    sourceTable,
    data: {
      fullName: getStringValue(row, [
        "nome_responsavel",
        "full_name",
        "nome_completo",
        "name",
        "nome",
        "display_name",
      ]),
      companyName: getStringValue(row, [
        "nome_empresa",
        "company_name",
        "empresa",
        "company",
        "business_name",
        "marca",
      ]),
      whatsapp: getStringValue(row, [
        "whatsapp",
        "phone",
        "telefone",
        "telefone_principal",
        "celular",
      ]),
      city: getStringValue(row, [
        "cidade_base",
        "cidade_publica",
        "city",
        "cidade",
      ]),
      state: getStringValue(row, [
        "estado_base",
        "estado_publico",
        "state",
        "estado",
        "uf",
      ]),
      segment: getStringValue(row, [
        "segment",
        "segmento",
        "industry",
        "setor",
        "coverage_type",
        "cadastro_tipo",
      ]),
      slug: getStringValue(row, [
        "slug",
        "public_slug",
      ]),
      status: getStringValue(row, [
        "status",
        "cadastro_status",
        "profile_status",
        "situacao",
      ]),
      email: getStringValue(row, ["email"]),
      coverageType: getStringValue(row, ["coverage_type"]),
      registrationType: getStringValue(row, ["cadastro_tipo"]),
      registrationComplete: getStringValue(row, ["cadastro_completo"]),
      sourceOrigin: getStringValue(row, ["origem"]),
      completionDeadline: getStringValue(row, ["prazo_conclusao"]),
    },
  };
}

async function tryFindByEmail(
  supabase: ReturnType<typeof createClient>,
  table: string,
  email: string
) {
  try {
    const { data, error } = await supabase
      .from(table)
      .select("*")
      .eq("email", email)
      .limit(1);

    if (error || !data || !data.length) {
      return null;
    }

    const row = data[0] as Record<string, unknown>;
    return normalizeRow(row, table);
  } catch {
    return null;
  }
}

export async function GET(request: NextRequest) {
  try {
    const email = request.nextUrl.searchParams.get("email")?.trim().toLowerCase() || "";

    if (!email) {
      const response: PrefillResponse = {
        ok: false,
        found: false,
        sourceTable: "",
        data: null,
        error: "E-mail não informado.",
      };

      return NextResponse.json(response, { status: 400 });
    }

    const supabase = getAdminClient();

    if (!supabase) {
      const response: PrefillResponse = {
        ok: false,
        found: false,
        sourceTable: "",
        data: null,
        error: "SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configurados.",
      };

      return NextResponse.json(response, { status: 500 });
    }

    const tablesInOrder = [
      "cadastros_gerais",
      "profiles",
    ];

    for (const table of tablesInOrder) {
      const found = await tryFindByEmail(supabase, table, email);

      if (found) {
        const response: PrefillResponse = {
          ok: true,
          found: true,
          sourceTable: found.sourceTable,
          data: found.data,
        };

        return NextResponse.json(response, { status: 200 });
      }
    }

    const response: PrefillResponse = {
      ok: true,
      found: false,
      sourceTable: "",
      data: null,
    };

    return NextResponse.json(response, { status: 200 });
  } catch (error: any) {
    const response: PrefillResponse = {
      ok: false,
      found: false,
      sourceTable: "",
      data: null,
      error: error?.message || "Erro interno ao buscar pré-cadastro.",
    };

    return NextResponse.json(response, { status: 500 });
  }
}