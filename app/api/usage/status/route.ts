import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

function getLimitsByPlan(plan: string | null) {
  const normalized = (plan || "free").toLowerCase();

  if (normalized === "pro") {
    return {
      plan: "pro",
      messagesPerDay: -1,
      imagesPerDay: -1,
    };
  }

  if (normalized === "influencer") {
    return {
      plan: "influencer",
      messagesPerDay: 200,
      imagesPerDay: 20,
    };
  }

  return {
    plan: "free",
    messagesPerDay: 20,
    imagesPerDay: 3,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "Email não enviado." },
        { status: 400 }
      );
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Variáveis do Supabase não configuradas." },
        { status: 500 }
      );
    }

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

    const { data: subscription } = await supabase
      .from("aurora_subscriptions")
      .select("plan, status")
      .eq("email", email)
      .maybeSingle();

    const isActivePaid =
      subscription &&
      subscription.status === "active" &&
      (subscription.plan === "pro" || subscription.plan === "influencer");

    const limits = getLimitsByPlan(isActivePaid ? subscription?.plan : "free");

    const today = new Date().toISOString().slice(0, 10);

    const { data: usage } = await supabase
      .from("aurora_daily_usage")
      .select("messages_count, images_count")
      .eq("email", email)
      .eq("usage_date", today)
      .maybeSingle();

    const messagesUsed = Number(usage?.messages_count || 0);
    const imagesUsed = Number(usage?.images_count || 0);

    const messagesRemaining =
      limits.messagesPerDay === -1
        ? -1
        : Math.max(limits.messagesPerDay - messagesUsed, 0);

    const imagesRemaining =
      limits.imagesPerDay === -1
        ? -1
        : Math.max(limits.imagesPerDay - imagesUsed, 0);

    return NextResponse.json({
      plan: limits.plan,
      messagesUsed,
      imagesUsed,
      messagesRemaining,
      imagesRemaining,
      limits,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro interno.",
      },
      { status: 500 }
    );
  }
}