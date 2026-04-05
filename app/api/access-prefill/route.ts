import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type TableName =
  | "cadastros_gerais"
  | "vw_cadastro_principal_por_email";

type PrefillResponse = {
  ok: true;
  found: boolean;
  source: TableName | null;
  data: {
    id: string | null;
    fullName: string;
    companyName: string;
    whatsapp: string;
    email: string;
    city: string;
    state: string;
    publicName: string;
    publicDescription: string;
    segment: string;
    coverageType: string;
    registrationType: string;
    registrationComplete: boolean;
    status: string;
    origin: string;
  } | null;
};

type ErrorResponse = {
  ok: false;
  found: false;
  error: string;
};

type GenericRow = Record<string, unknown>;

function getEnv(name: string) {
  const value = process.env[name];
  return typeof value === "string" && value.trim() ? value.trim() : "";
}

function getSupabaseServer() {
  const url =
    getEnv("SUPABASE_URL") || getEnv("NEXT_PUBLIC_SUPABASE_URL");
  const anonKey =
    getEnv("SUPABASE_SERVICE_ROLE_KEY") ||
    getEnv("NEXT_PUBLIC_SUPABASE_ANON_KEY") ||
    getEnv("SUPABASE_ANON_KEY");

  if (!url || !anonKey) {
    throw new Error(
      "Supabase não configurado. Verifique SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY/NEXT_PUBLIC_SUPABASE_ANON_KEY."
    );
  }

  return createClient(url, anonKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeEmail(value: unknown) {
  return String(value ?? "").trim().toLowerCase();
}

function getStringValue(
  row: GenericRow | null | undefined,
  keys: string[]
): string {
  if (!row) return "";

  for (const key of keys) {
    const value = row[key];

    if (typeof value === "string" && value.trim()) {
      return value.trim();
    }
  }

  return "";
}

function getBooleanValue(
  row: GenericRow | null | undefined,
  keys: string[]
): boolean {
  if (!row) return false;

  for (const key of keys) {
    const value = row[key];

    if (typeof value === "boolean") {
      return value;
    }

    if (typeof value === "string") {
      const normalized = value.trim().toLowerCase();

      if (normalized === "true" || normalized === "sim" || normalized === "1") {
        return true;
      }

      if (
        normalized === "false" ||
        normalized === "nao" ||
        normalized === "não" ||
        normalized === "0"
      ) {
        return false;
      }
    }

    if (typeof value === "number") {
      return value === 1;
    }
  }

  return false;
}

function mapRowToPrefill(row: GenericRow, source: TableName): PrefillResponse["data"] {
  return {
    id: getStringValue(row, ["id"]),
    fullName: getStringValue(row, [
      "nome_responsavel",
      "nome",
      "full_name",
      "name",
    ]),
    companyName: getStringValue(row, [
      "nome_empresa",
      "empresa",
      "company_name",
      "company",
    ]),
    whatsapp: getStringValue(row, ["whatsapp", "telefone", "phone"]),
    email: getStringValue(row, ["email"]),
    city: getStringValue(row, [
      "cidade_base",
      "cidade_publica",
      "cidade",
      "city",
    ]),
    state: getStringValue(row, [
      "estado_base",
      "estado_publico",
      "estado",
      "state",
    ]),
    publicName: getStringValue(row, [
      "nome_publico",
      "public_name",
    ]),
    publicDescription: getStringValue(row, [
      "descricao_publica_curta",
      "descricao_publica",
      "public_description",
    ]),
    segment: getStringValue(row, [
      "segmento",
      "segment",
      "main_segment",
    ]),
    coverageType: getStringValue(row, [
      "coverage_type",
      "cobertura",
    ]),
    registrationType: getStringValue(row, [
      "cadastro_tipo",
      "registration_type",
    ]),
    registrationComplete: getBooleanValue(row, [
      "cadastro_completo",
      "registration_complete",
    ]),
    status: getStringValue(row, ["status"]),
    origin: getStringValue(row, ["origem", "source"]) || source,
  };
}

async function tryFindByEmail(
  supabase: ReturnType<typeof getSupabaseServer>,
  table: TableName,
  email: string
): Promise<GenericRow | null> {
  if (!email) return null;

  const normalizedEmail = normalizeEmail(email);

  if (!normalizedEmail) return null;

  const baseSelect =
    table === "vw_cadastro_principal_por_email"
      ? "*"
      : [
          "id",
          "nome_responsavel",
          "nome_empresa",
          "whatsapp",
          "email",
          "cidade_base",
          "estado_base",
          "cidade_publica",
          "estado_publico",
          "nome_publico",
          "descricao_publica",
          "descricao_publica_curta",
          "coverage_type",
          "status",
          "origem",
          "cadastro_tipo",
          "cadastro_completo",
          "updated_at",
          "created_at",
        ].join(", ");

  const query = supabase
    .from(table)
    .select(baseSelect)
    .eq("email", normalizedEmail)
    .limit(1);

  const orderedQuery =
    table === "cadastros_gerais"
      ? query
          .order("cadastro_completo", { ascending: false })
          .order("updated_at", { ascending: false, nullsFirst: false })
          .order("created_at", { ascending: false, nullsFirst: false })
      : query;

  const { data, error } = await orderedQuery.maybeSingle();

  if (error) {
    throw new Error(`Erro ao buscar em ${table}: ${error.message}`);
  }

  return (data as GenericRow | null) ?? null;
}

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const email = normalizeEmail(searchParams.get("email"));

    if (!email) {
      return Response.json<ErrorResponse>(
        {
          ok: false,
          found: false,
          error: "Informe um e-mail válido.",
        },
        { status: 400 }
      );
    }

    const supabase = getSupabaseServer();

    const tablesInOrder: TableName[] = [
      "vw_cadastro_principal_por_email",
      "cadastros_gerais",
    ];

    for (const table of tablesInOrder) {
      const found = await tryFindByEmail(supabase, table, email);

      if (found) {
        const response: PrefillResponse = {
          ok: true,
          found: true,
          source: table,
          data: mapRowToPrefill(found, table),
        };

        return Response.json(response, {
          status: 200,
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        });
      }
    }

    const emptyResponse: PrefillResponse = {
      ok: true,
      found: false,
      source: null,
      data: null,
    };

    return Response.json(emptyResponse, {
      status: 200,
      headers: {
        "Cache-Control": "no-store, max-age=0",
      },
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Falha ao carregar prefill por e-mail.";

    return Response.json<ErrorResponse>(
      {
        ok: false,
        found: false,
        error: message,
      },
      { status: 500 }
    );
  }
}