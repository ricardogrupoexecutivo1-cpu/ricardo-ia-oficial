import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";

const ASAAS_WEBHOOK_TOKEN = process.env.ASAAS_WEBHOOK_TOKEN || "";
const SUPABASE_URL =
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL || "";
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || "";

function getSupabaseAdmin() {
  if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
    return null;
  }

  return createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeEmail(value: unknown): string | null {
  if (typeof value !== "string") return null;
  const email = value.trim().toLowerCase();
  return email || null;
}

export async function POST(request: Request) {
  try {
    const incomingToken =
      request.headers.get("asaas-access-token") ||
      request.headers.get("Asaas-Access-Token") ||
      "";

    if (!ASAAS_WEBHOOK_TOKEN) {
      return NextResponse.json(
        { ok: false, error: "ASAAS_WEBHOOK_TOKEN não configurado." },
        { status: 500 }
      );
    }

    if (!incomingToken || incomingToken !== ASAAS_WEBHOOK_TOKEN) {
      return NextResponse.json(
        { ok: false, error: "Token inválido." },
        { status: 401 }
      );
    }

    const payload = await request.json();

    const event =
      typeof payload?.event === "string" ? payload.event.trim() : null;

    const paymentId =
      typeof payload?.payment?.id === "string"
        ? payload.payment.id.trim()
        : null;

    const customerEmail =
      normalizeEmail(payload?.payment?.customerEmail) ||
      normalizeEmail(payload?.payment?.billingAddress?.email) ||
      normalizeEmail(payload?.customer?.email);

    const value =
      typeof payload?.payment?.value === "number"
        ? payload.payment.value
        : typeof payload?.payment?.value === "string"
        ? Number(payload.payment.value)
        : null;

    const status =
      typeof payload?.payment?.status === "string"
        ? payload.payment.status.trim()
        : null;

    const supabase = getSupabaseAdmin();

    if (supabase) {
      try {
        await supabase.from("asaas_webhooks").insert({
          received_at: new Date().toISOString(),
          event,
          payment_id: paymentId,
          customer_email: customerEmail,
          payment_value: Number.isFinite(value as number) ? value : null,
          payment_status: status,
          raw_payload: payload,
        });
      } catch (dbError) {
        console.error("Falha ao registrar webhook no banco:", dbError);
      }
    }

    console.log("ASAAS WEBHOOK RECEBIDO", {
      event,
      paymentId,
      customerEmail,
      value,
      status,
    });

    return NextResponse.json({
      ok: true,
      received: true,
      event,
      paymentId,
      customerEmail,
    });
  } catch (error) {
    console.error("Erro no webhook Asaas:", error);

    return NextResponse.json(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno no webhook.",
      },
      { status: 500 }
    );
  }
}