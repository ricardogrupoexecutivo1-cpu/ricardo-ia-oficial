import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const VEHICLES_TABLE = "aurora_locadora_vehicles";

type VehicleInsertBody = {
  titulo?: string;
  marca?: string;
  modelo?: string;
  ano?: string;
  cor?: string;
  placa?: string;
  valorDiaria?: string | number;
  status?: string;
  observacoes?: string;
  ownerEmail?: string;
  owner_email?: string;
  projectId?: string;
  project_id?: string;
};

type VehicleUpdateBody = {
  id?: string;
  titulo?: string;
  marca?: string;
  modelo?: string;
  ano?: string;
  cor?: string;
  placa?: string;
  valorDiaria?: string | number;
  status?: string;
  observacoes?: string;
};

type VehicleDeleteBody = {
  id?: string;
};

type SupabaseMutationResult<T = any> = {
  data: T | null;
  error: { message: string } | null;
};

type SupabaseListResult<T = any> = {
  data: T[] | null;
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

function normalizeMoney(value: unknown) {
  if (typeof value === "number") return value;

  if (typeof value !== "string") return 0;

  const normalized = value.replace(/\./g, "").replace(",", ".").trim();
  const parsed = Number(normalized);

  if (Number.isNaN(parsed)) return 0;
  return parsed;
}

function normalizeStatus(value: unknown) {
  const current = text(value).toLowerCase();

  if (
    current === "disponivel" ||
    current === "alugado" ||
    current === "manutencao" ||
    current === "reservado"
  ) {
    return current;
  }

  return "disponivel";
}

function buildInsertPayload(body: VehicleInsertBody) {
  return {
    titulo: text(body.titulo),
    marca: text(body.marca),
    modelo: text(body.modelo),
    ano: text(body.ano),
    cor: text(body.cor),
    placa: text(body.placa).toUpperCase(),
    valor_diaria: normalizeMoney(body.valorDiaria),
    status: normalizeStatus(body.status),
    observacoes: text(body.observacoes),
    owner_email: text(body.ownerEmail) || text(body.owner_email) || null,
    project_id: text(body.projectId) || text(body.project_id) || null,
  };
}

function buildUpdatePayload(body: VehicleUpdateBody) {
  const payload: Record<string, string | number | null> = {};

  if (body.titulo !== undefined) payload.titulo = text(body.titulo);
  if (body.marca !== undefined) payload.marca = text(body.marca);
  if (body.modelo !== undefined) payload.modelo = text(body.modelo);
  if (body.ano !== undefined) payload.ano = text(body.ano);
  if (body.cor !== undefined) payload.cor = text(body.cor);
  if (body.placa !== undefined) payload.placa = text(body.placa).toUpperCase();
  if (body.valorDiaria !== undefined) {
    payload.valor_diaria = normalizeMoney(body.valorDiaria);
  }
  if (body.status !== undefined) payload.status = normalizeStatus(body.status);
  if (body.observacoes !== undefined) payload.observacoes = text(body.observacoes);

  return payload;
}

function validateInsertPayload(payload: ReturnType<typeof buildInsertPayload>) {
  const errors: string[] = [];

  if (!payload.titulo) errors.push("Título é obrigatório.");
  if (!payload.marca) errors.push("Marca é obrigatória.");
  if (!payload.modelo) errors.push("Modelo é obrigatório.");

  return errors;
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

    const ownerEmail = text(searchParams.get("ownerEmail"));
    const projectId = text(searchParams.get("projectId"));

    let query: any = supabase.from(VEHICLES_TABLE).select("*").order("created_at", {
      ascending: false,
    });

    if (ownerEmail) {
      query = query.eq("owner_email", ownerEmail);
    }

    if (projectId) {
      query = query.eq("project_id", projectId);
    }

    const result: SupabaseListResult = await withTimeout(
      query.limit(100) as PromiseLike<SupabaseListResult>,
      8000,
      "GET vehicles"
    );

    if (result.error) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error.message,
          tableUsed: VEHICLES_TABLE,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      vehicles: result.data ?? [],
      tableUsed: VEHICLES_TABLE,
    });
  } catch (error) {
    console.error("GET /api/locadora/vehicles error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao listar veículos.",
        tableUsed: VEHICLES_TABLE,
      },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as VehicleInsertBody;
    const supabase = getSupabaseAdmin();
    const payload = buildInsertPayload(body);
    const validationErrors = validateInsertPayload(payload);

    if (validationErrors.length > 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Dados inválidos.",
          validationErrors,
          tableUsed: VEHICLES_TABLE,
        },
        { status: 400 }
      );
    }

    const result: SupabaseMutationResult = await withTimeout(
      (supabase as any)
        .from(VEHICLES_TABLE)
        .insert(payload as any)
        .select("*")
        .maybeSingle() as PromiseLike<SupabaseMutationResult>,
      8000,
      "POST vehicles"
    );

    if (result.error) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error.message,
          payload,
          tableUsed: VEHICLES_TABLE,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Veículo salvo com sucesso.",
      vehicle: result.data,
      tableUsed: VEHICLES_TABLE,
    });
  } catch (error) {
    console.error("POST /api/locadora/vehicles error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao salvar veículo.",
        tableUsed: VEHICLES_TABLE,
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as VehicleUpdateBody;
    const supabase = getSupabaseAdmin();
    const id = text(body.id);

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: "ID do veículo é obrigatório para atualizar.",
          tableUsed: VEHICLES_TABLE,
        },
        { status: 400 }
      );
    }

    const payload = buildUpdatePayload(body);

    if (Object.keys(payload).length === 0) {
      return NextResponse.json(
        {
          ok: false,
          error: "Nenhum campo enviado para atualização.",
          tableUsed: VEHICLES_TABLE,
        },
        { status: 400 }
      );
    }

    const result: SupabaseMutationResult = await withTimeout(
      (supabase as any)
        .from(VEHICLES_TABLE)
        .update(payload as any)
        .eq("id", id)
        .select("*")
        .maybeSingle() as PromiseLike<SupabaseMutationResult>,
      8000,
      "PATCH vehicles"
    );

    if (result.error) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error.message,
          tableUsed: VEHICLES_TABLE,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Veículo atualizado com sucesso.",
      vehicle: result.data,
      tableUsed: VEHICLES_TABLE,
    });
  } catch (error) {
    console.error("PATCH /api/locadora/vehicles error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao atualizar veículo.",
        tableUsed: VEHICLES_TABLE,
      },
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const body = (await request.json()) as VehicleDeleteBody;
    const supabase = getSupabaseAdmin();
    const id = text(body.id);

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: "ID do veículo é obrigatório para excluir.",
          tableUsed: VEHICLES_TABLE,
        },
        { status: 400 }
      );
    }

    const result: SupabaseMutationResult = await withTimeout(
      (supabase as any)
        .from(VEHICLES_TABLE)
        .delete()
        .eq("id", id) as PromiseLike<SupabaseMutationResult>,
      8000,
      "DELETE vehicles"
    );

    if (result.error) {
      return NextResponse.json(
        {
          ok: false,
          error: result.error.message,
          tableUsed: VEHICLES_TABLE,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      message: "Veículo excluído com sucesso.",
      tableUsed: VEHICLES_TABLE,
    });
  } catch (error) {
    console.error("DELETE /api/locadora/vehicles error:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao excluir veículo.",
        tableUsed: VEHICLES_TABLE,
      },
      { status: 500 }
    );
  }
}