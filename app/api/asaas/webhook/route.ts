import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type AsaasWebhookBody = {
  event?: string;
  payment?: {
    id?: string;
    customer?: string;
    value?: number;
    status?: string;
    dateCreated?: string;
    paymentDate?: string | null;
  };
};

function detectPlanByAmount(value: number | undefined): "pro" | "influencer" {
  const amount = Number(value || 0);

  if (amount >= 29 && amount < 30.5) {
    return "pro";
  }

  return "influencer";
}

function detectStatus(
  eventName: string | undefined,
  paymentStatus: string | undefined
): "pending" | "active" | "canceled" | "expired" | "overdue" {
  const event = (eventName || "").toUpperCase();
  const status = (paymentStatus || "").toUpperCase();

  if (
    event === "PAYMENT_CONFIRMED" ||
    event === "PAYMENT_RECEIVED" ||
    status === "CONFIRMED" ||
    status === "RECEIVED"
  ) {
    return "active";
  }

  if (event === "PAYMENT_OVERDUE" || status === "OVERDUE") {
    return "overdue";
  }

  if (event === "PAYMENT_DELETED" || status === "DELETED") {
    return "canceled";
  }

  if (event === "PAYMENT_REFUNDED" || status === "REFUNDED") {
    return "canceled";
  }

  return "pending";
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as AsaasWebhookBody;

    const ASAAS_API_KEY = process.env.ASAAS_API_KEY;
    const ASAAS_API_URL =
      process.env.ASAAS_API_URL || "https://api.asaas.com/v3";

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!ASAAS_API_KEY) {
      return NextResponse.json(
        { error: "ASAAS_API_KEY não configurada." },
        { status: 500 }
      );
    }

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "SUPABASE_URL ou SUPABASE_SERVICE_ROLE_KEY não configuradas." },
        { status: 500 }
      );
    }

    const eventName = body?.event;
    const payment = body?.payment;

    if (!payment?.id || !payment?.customer) {
      return NextResponse.json({ ok: true, ignored: true });
    }

    const customerResponse = await fetch(
      `${ASAAS_API_URL}/customers/${payment.customer}`,
      {
        method: "GET",
        headers: {
          accept: "application/json",
          access_token: ASAAS_API_KEY,
        },
        cache: "no-store",
      }
    );

    const customerText = await customerResponse.text();

    if (!customerResponse.ok) {
      return NextResponse.json(
        {
          error: "Erro ao buscar customer no Asaas.",
          details: customerText,
        },
        { status: 500 }
      );
    }

    const customerData = customerText ? JSON.parse(customerText) : null;
    const email = String(customerData?.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        {
          error: "O customer do Asaas não retornou email.",
          details: customerData,
        },
        { status: 500 }
      );
    }

    const plan = detectPlanByAmount(payment.value);
    const status = detectStatus(eventName, payment.status);

    const paidAt = payment.paymentDate || null;
    const amount = Number(payment.value || 0);

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const { error } = await supabase
      .from("aurora_subscriptions")
      .upsert(
        {
          email,
          plan,
          status,
          provider: "asaas",
          provider_customer_id: payment.customer,
          provider_payment_id: payment.id,
          amount,
          paid_at: paidAt,
          updated_at: new Date().toISOString(),
        },
        {
          onConflict: "email",
        }
      );

    if (error) {
      return NextResponse.json(
        {
          error: "Erro ao gravar assinatura no Supabase.",
          details: error.message,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      email,
      plan,
      status,
    });
  } catch (error) {
    console.error("Webhook Asaas error:", error);

    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro interno no webhook.",
      },
      { status: 500 }
    );
  }
}