import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

type RouteContext = {
  params: Promise<{
    id: string;
  }>;
};

type StatusPayload = {
  status?: string | null;
};

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

  if (!supabaseUrl) {
    throw new Error("SUPABASE_URL/NEXT_PUBLIC_SUPABASE_URL não encontrado.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não encontrada.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
    global: {
      fetch: (...args) => fetch(...args),
    },
  });
}

function normalizeStatus(value: unknown): string {
  return String(value ?? "")
    .trim()
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}

function mapStatus(value: unknown): string {
  const normalized = normalizeStatus(value);

  if (!normalized) return "lead";

  if (normalized === "lead" || normalized === "novo") {
    return "lead";
  }

  if (
    normalized === "em_analise" ||
    normalized === "em analise" ||
    normalized === "analise" ||
    normalized === "emanalise"
  ) {
    return "em_analise";
  }

  if (normalized === "aprovado" || normalized === "approved") {
    return "aprovado";
  }

  if (
    normalized === "aguardando_pagamento" ||
    normalized === "aguardando pagamento" ||
    normalized === "waiting_payment" ||
    normalized === "waitingpayment" ||
    normalized === "pending_payment" ||
    normalized === "pendingpayment"
  ) {
    return "aguardando_pagamento";
  }

  if (normalized === "pago" || normalized === "paid") {
    return "pago";
  }

  if (normalized === "ativo" || normalized === "active") {
    return "ativo";
  }

  if (
    normalized === "recusado" ||
    normalized === "rejeitado" ||
    normalized === "cancelado" ||
    normalized === "cancelled" ||
    normalized === "denied"
  ) {
    return "recusado";
  }

  if (normalized === "inativo" || normalized === "inactive") {
    return "inativo";
  }

  return "lead";
}

function buildUpdateData(status: string) {
  const now = new Date().toISOString();

  const updateData: Record<string, unknown> = {
    status,
    updated_at: now,
  };

  if (status === "em_analise") {
    updateData.analyzed_at = now;
  }

  if (
    status === "aprovado" ||
    status === "aguardando_pagamento" ||
    status === "pago" ||
    status === "ativo"
  ) {
    updateData.approved_at = now;
  }

  if (status === "aguardando_pagamento") {
    updateData.payment_status = "waiting";
  }

  if (status === "pago") {
    updateData.payment_status = "paid";
    updateData.paid_at = now;
  }

  if (status === "ativo") {
    updateData.payment_status = "paid";
    updateData.activated_at = now;
  }

  if (status === "recusado" || status === "inativo") {
    updateData.cancelled_at = now;
  }

  return updateData;
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function updateSponsorStatusWithRetry(
  sponsorId: string,
  nextStatus: string,
) {
  const supabase = getSupabaseAdmin();
  const updateData = buildUpdateData(nextStatus);
  const maxAttempts = 3;
  let lastError: unknown = null;

  for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
    try {
      const { data, error } = await supabase
        .from("sponsor_leads")
        .update(updateData)
        .eq("id", sponsorId)
        .select("*")
        .single();

      if (error) {
        throw new Error(error.message || "Falha ao atualizar patrocinador.");
      }

      return data;
    } catch (error) {
      lastError = error;

      console.error(
        `❌ ERRO AO ATUALIZAR PATROCINADOR | tentativa ${attempt}/${maxAttempts}`,
        {
          sponsorId,
          nextStatus,
          error,
        },
      );

      if (attempt < maxAttempts) {
        await sleep(700 * attempt);
      }
    }
  }

  throw lastError instanceof Error
    ? lastError
    : new Error("Falha ao atualizar patrocinador após múltiplas tentativas.");
}

export async function POST(request: NextRequest, context: RouteContext) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        { ok: false, error: "ID do patrocinador não informado." },
        { status: 400 },
      );
    }

    const body = (await request.json().catch(() => null)) as StatusPayload | null;
    const nextStatus = mapStatus(body?.status);

    const data = await updateSponsorStatusWithRetry(id, nextStatus);

    return NextResponse.json({
      ok: true,
      message: "Status comercial atualizado com sucesso.",
      sponsor: data,
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao atualizar patrocinador.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}

export async function PATCH(request: NextRequest, context: RouteContext) {
  return POST(request, context);
}