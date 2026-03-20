import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getLimitsByPlan(plan: string | null) {
  const normalized = (plan || "free").toLowerCase();

  if (normalized === "total" || normalized === "agency") {
    return {
      plan: normalized,
      messagesPerDay: -1,
      imagesPerDay: -1,
    };
  }

  if (normalized === "creator") {
    return {
      plan: "creator",
      messagesPerDay: -1,
      imagesPerDay: 300,
    };
  }

  if (normalized === "developer" || normalized === "developer_starter") {
    return {
      plan: "developer_starter",
      messagesPerDay: -1,
      imagesPerDay: 200,
    };
  }

  if (normalized === "developer_pro") {
    return {
      plan: "developer_pro",
      messagesPerDay: -1,
      imagesPerDay: 1000,
    };
  }

  if (normalized === "pro") {
    return {
      plan: "pro",
      messagesPerDay: -1,
      imagesPerDay: 100,
    };
  }

  return {
    plan: "free",
    messagesPerDay: -1,
    imagesPerDay: 3,
  };
}

function startOfDayIso() {
  const now = new Date();
  const start = new Date(
    now.getFullYear(),
    now.getMonth(),
    now.getDate(),
    0,
    0,
    0,
    0
  );
  return start.toISOString();
}

export async function GET(req: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Variáveis do Supabase não configuradas." },
        { status: 500 }
      );
    }

    const email = (req.nextUrl.searchParams.get("email") || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "E-mail não informado." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("email, plan, bonus_images, plan_status, plan_expires_at, last_payment_at")
      .eq("email", email)
      .maybeSingle();

    if (profileError) {
      return NextResponse.json(
        { error: profileError.message },
        { status: 500 }
      );
    }

    const plan = (profile?.plan || "free").toLowerCase();
    const planStatus = (profile?.plan_status || "inactive").toLowerCase();
    const planExpiresAt = profile?.plan_expires_at || null;
    const bonusImages = Number(profile?.bonus_images || 0);

    const limits = getLimitsByPlan(plan);

    let imagesUsedToday = 0;

    const { count: imagesCount, error: imagesError } = await supabase
      .from("generated_images")
      .select("id", { count: "exact", head: true })
      .eq("user_email", email)
      .gte("created_at", startOfDayIso());

    if (!imagesError) {
      imagesUsedToday = Number(imagesCount || 0);
    }

    const imagesRemaining =
      limits.imagesPerDay < 0
        ? -1
        : Math.max(limits.imagesPerDay + bonusImages - imagesUsedToday, 0);

    const isActivePlan =
      plan !== "free" &&
      planStatus === "active" &&
      !!planExpiresAt &&
      new Date(planExpiresAt).getTime() > Date.now();

    return NextResponse.json({
      email,
      plan: isActivePlan ? plan : "free",
      planStatus,
      planExpiresAt,
      lastPaymentAt: profile?.last_payment_at || null,
      bonusImages,
      messagesRemaining: null,
      imagesRemaining:
        isActivePlan || plan === "free" ? imagesRemaining : 3 + bonusImages,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao carregar dados do usuário.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}