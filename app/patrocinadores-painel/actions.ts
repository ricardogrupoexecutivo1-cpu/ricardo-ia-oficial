"use server";

import { createClient } from "@supabase/supabase-js";

export type UpdatePatrocinadorStatusResult = {
  ok: boolean;
  error?: string;
  message?: string;
  sponsor?: Record<string, unknown> | null;
};

export type UpdatePatrocinadorCobrancaResult = {
  ok: boolean;
  error?: string;
  message?: string;
  sponsor?: Record<string, unknown> | null;
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

function normalizeLink(value: unknown): string {
  const raw = String(value ?? "").trim();
  if (!raw) return "";

  if (raw.startsWith("http://") || raw.startsWith("https://")) {
    return raw;
  }

  return "";
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function updatePatrocinadorStatusAction(
  sponsorId: string,
  requestedStatus: string,
): Promise<UpdatePatrocinadorStatusResult> {
  try {
    const id = String(sponsorId ?? "").trim();
    const nextStatus = mapStatus(requestedStatus);

    if (!id) {
      return {
        ok: false,
        error: "ID do patrocinador não informado.",
      };
    }

    const supabase = getSupabaseAdmin();
    const updateData = buildUpdateData(nextStatus);
    const maxAttempts = 3;
    let lastError: unknown = null;

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const { data, error } = await supabase
          .from("sponsor_leads")
          .update(updateData)
          .eq("id", id)
          .select("*")
          .single();

        if (error) {
          throw new Error(
            error.message || "Falha ao atualizar status do patrocinador.",
          );
        }

        return {
          ok: true,
          message: "Status comercial atualizado com sucesso.",
          sponsor: (data as Record<string, unknown>) ?? null,
        };
      } catch (error) {
        lastError = error;

        console.error(
          `❌ ERRO AO ATUALIZAR PATROCINADOR | tentativa ${attempt}/3`,
          {
            sponsorId: id,
            nextStatus,
            error,
          },
        );

        if (attempt < maxAttempts) {
          await sleep(700 * attempt);
        }
      }
    }

    const message =
      lastError instanceof Error
        ? lastError.message
        : "Falha ao atualizar patrocinador após múltiplas tentativas.";

    return {
      ok: false,
      error: message,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao atualizar patrocinador.";

    return {
      ok: false,
      error: message,
    };
  }
}

export async function updatePatrocinadorCobrancaAction(
  sponsorId: string,
  asaasPaymentLink: string,
): Promise<UpdatePatrocinadorCobrancaResult> {
  try {
    const id = String(sponsorId ?? "").trim();
    const link = normalizeLink(asaasPaymentLink);

    if (!id) {
      return {
        ok: false,
        error: "ID do patrocinador não informado.",
      };
    }

    if (!link) {
      return {
        ok: false,
        error: "Informe um link Asaas válido começando com http:// ou https://",
      };
    }

    const supabase = getSupabaseAdmin();
    const now = new Date().toISOString();
    const maxAttempts = 3;
    let lastError: unknown = null;

    const updateData: Record<string, unknown> = {
      asaas_payment_link: link,
      payment_link: link,
      updated_at: now,
    };

    for (let attempt = 1; attempt <= maxAttempts; attempt += 1) {
      try {
        const { data, error } = await supabase
          .from("sponsor_leads")
          .update(updateData)
          .eq("id", id)
          .select("*")
          .single();

        if (error) {
          throw new Error(
            error.message || "Falha ao salvar link de cobrança.",
          );
        }

        return {
          ok: true,
          message: "Link de cobrança salvo com sucesso.",
          sponsor: (data as Record<string, unknown>) ?? null,
        };
      } catch (error) {
        lastError = error;

        console.error(
          `❌ ERRO AO SALVAR COBRANÇA DO PATROCINADOR | tentativa ${attempt}/3`,
          {
            sponsorId: id,
            link,
            error,
          },
        );

        if (attempt < maxAttempts) {
          await sleep(700 * attempt);
        }
      }
    }

    const message =
      lastError instanceof Error
        ? lastError.message
        : "Falha ao salvar cobrança após múltiplas tentativas.";

    return {
      ok: false,
      error: message,
    };
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao salvar cobrança.";

    return {
      ok: false,
      error: message,
    };
  }
}