import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

function getAdminClient() {
  const supabaseUrl =
    process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL;

  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl) {
    throw new Error("Supabase URL não configurada.");
  }

  if (!serviceRoleKey) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeBoolean(value: unknown) {
  if (typeof value === "boolean") {
    return value;
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();

    if (normalized === "true") return true;
    if (normalized === "false") return false;
  }

  return null;
}

export async function PATCH(
  request: NextRequest,
  context: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await context.params;

    if (!id) {
      return NextResponse.json(
        {
          ok: false,
          error: "ID do patrocinador não informado.",
        },
        { status: 400 },
      );
    }

    const body = await request.json().catch(() => null);

    const accepted = normalizeBoolean(body?.accepted);

    if (accepted !== true) {
      return NextResponse.json(
        {
          ok: false,
          error: "É necessário confirmar o aceite das regras comerciais.",
        },
        { status: 400 },
      );
    }

    const acceptedByName =
      typeof body?.acceptedByName === "string"
        ? body.acceptedByName.trim()
        : "";

    const acceptedByEmail =
      typeof body?.acceptedByEmail === "string"
        ? body.acceptedByEmail.trim()
        : "";

    const acceptedByWhatsapp =
      typeof body?.acceptedByWhatsapp === "string"
        ? body.acceptedByWhatsapp.trim()
        : "";

    const notes =
      typeof body?.notes === "string"
        ? body.notes.trim()
        : "";

    const supabase = getAdminClient();

    const { data: existingSponsor, error: findError } = await supabase
      .from("sponsor_leads")
      .select("*")
      .eq("id", id)
      .single();

    if (findError || !existingSponsor) {
      return NextResponse.json(
        {
          ok: false,
          error: "Lead de patrocinador não encontrado.",
          details: findError?.message ?? null,
        },
        { status: 404 },
      );
    }

    const now = new Date().toISOString();

    const currentNotes =
      typeof existingSponsor.observations === "string"
        ? existingSponsor.observations.trim()
        : "";

    const acceptanceLogParts = [
      "Aceite das regras comerciais confirmado.",
      acceptedByName ? `Responsável: ${acceptedByName}` : "",
      acceptedByEmail ? `E-mail: ${acceptedByEmail}` : "",
      acceptedByWhatsapp ? `WhatsApp: ${acceptedByWhatsapp}` : "",
      notes ? `Observações do aceite: ${notes}` : "",
      `Data do aceite: ${now}`,
    ].filter(Boolean);

    const mergedObservations = [currentNotes, acceptanceLogParts.join(" | ")]
      .filter(Boolean)
      .join("\n\n");

    const updatePayload: Record<string, unknown> = {
      terms_accepted: true,
      terms_accepted_at: now,
      accepted_by_name: acceptedByName || null,
      accepted_by_email: acceptedByEmail || null,
      accepted_by_whatsapp: acceptedByWhatsapp || null,
      observations: mergedObservations || null,
      updated_at: now,
    };

    if (!existingSponsor.status || existingSponsor.status === "lead") {
      updatePayload.status = "em_analise";
    }

    const { data: updatedSponsor, error: updateError } = await supabase
      .from("sponsor_leads")
      .update(updatePayload)
      .eq("id", id)
      .select("*")
      .single();

    if (updateError) {
      return NextResponse.json(
        {
          ok: false,
          error: "Não foi possível registrar o aceite das regras comerciais.",
          details: updateError.message,
        },
        { status: 500 },
      );
    }

    return NextResponse.json({
      ok: true,
      message:
        "Aceite das regras comerciais registrado com sucesso. O lead foi preparado para análise comercial.",
      sponsor: updatedSponsor,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno inesperado.";

    return NextResponse.json(
      {
        ok: false,
        error: message,
      },
      { status: 500 },
    );
  }
}