import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const webhookToken = process.env.ASAAS_WEBHOOK_TOKEN;

function getSupabaseAdmin() {
  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Supabase env ausente no servidor.");
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

function normalizeEmail(value: unknown) {
  return String(value || "").trim().toLowerCase();
}

function getPlanFromValue(value: number) {
  if (value >= 29.9) return "premium";
  if (value >= 9.9) return "pro";
  return "free";
}

function extractEmail(payload: any) {
  const candidates = [
    payload?.payment?.customerEmail,
    payload?.payment?.billingCustomer?.email,
    payload?.payment?.customer?.email,
    payload?.customer?.email,
  ];

  for (const item of candidates) {
    const email = normalizeEmail(item);
    if (email) return email;
  }

  return "";
}

function extractValue(payload: any) {
  const raw =
    payload?.payment?.value ??
    payload?.payment?.netValue ??
    payload?.value ??
    0;

  const value = Number(raw);
  return Number.isFinite(value) ? value : 0;
}

export async function POST(req: NextRequest) {
  try {
    const receivedToken =
      req.headers.get("asaas-access-token") ||
      req.headers.get("Asaas-Access-Token") ||
      req.headers.get("authorization") ||
      "";

    if (!webhookToken) {
      console.error("ASAAS_WEBHOOK_TOKEN não configurado.");
      return NextResponse.json(
        { error: "Webhook token não configurado." },
        { status: 500 }
      );
    }

    const cleanedReceivedToken = String(receivedToken)
      .replace(/^Bearer\s+/i, "")
      .trim();

    if (cleanedReceivedToken !== webhookToken.trim()) {
      console.error("Token de webhook inválido.");
      return NextResponse.json(
        { error: "Token inválido." },
        { status: 401 }
      );
    }

    const body = await req.json();

    console.log("Webhook Asaas recebido:", JSON.stringify(body));

    const event = String(body?.event || "").trim().toUpperCase();

    if (event !== "PAYMENT_CONFIRMED" && event !== "PAYMENT_RECEIVED") {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const email = extractEmail(body);
    const value = extractValue(body);
    const plan = getPlanFromValue(value);

    if (!email) {
      console.error("Webhook sem email:", body);
      return NextResponse.json(
        { error: "Email não encontrado no webhook." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: existingProfile, error: profileFetchError } = await supabase
      .from("profiles")
      .select("id, email, plan")
      .eq("email", email)
      .maybeSingle();

    if (profileFetchError) {
      console.error("Erro buscando profile:", profileFetchError);
      return NextResponse.json(
        { error: "Erro ao buscar profile." },
        { status: 500 }
      );
    }

    if (!existingProfile) {
      console.error("Profile não encontrado para:", email);
      return NextResponse.json(
        { error: "Profile não encontrado para o email." },
        { status: 404 }
      );
    }

    const now = new Date();
    const expiresAt = new Date();
    expiresAt.setDate(now.getDate() + 30);

    const nowIso = now.toISOString();
    const expiresAtIso = expiresAt.toISOString();

    const { error: updateError } = await supabase
      .from("profiles")
      .update({
        plan,
        plan_status: "active",
        plan_expires_at: expiresAtIso,
        last_payment_at: nowIso,
      })
      .eq("id", existingProfile.id);

    if (updateError) {
      console.error("Erro atualizando plan no profiles:", updateError);
      return NextResponse.json(
        { error: "Erro ao atualizar plano." },
        { status: 500 }
      );
    }

    const { error: subscriptionError } = await supabase
      .from("aurora_subscriptions")
      .upsert(
        {
          email,
          plan,
          status: "active",
          provider: "asaas",
          updated_at: nowIso,
        },
        {
          onConflict: "email",
        }
      );

    if (subscriptionError) {
      console.error(
        "Erro ao atualizar aurora_subscriptions:",
        subscriptionError
      );
      return NextResponse.json(
        {
          error: "Erro ao atualizar assinatura.",
          details: subscriptionError.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      email,
      plan,
      event,
    });
  } catch (error) {
    console.error("Erro no webhook Asaas:", error);

    return NextResponse.json(
      {
        error: "Erro interno no webhook.",
        details: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}