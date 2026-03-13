import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ImageRequestBody = {
  prompt?: string;
  email?: string;
};

function getLimitsByPlan(plan: string | null) {
  const normalized = (plan || "free").toLowerCase();

  if (normalized === "pro") {
    return {
      plan: "pro",
      imagesPerDay: -1,
    };
  }

  if (normalized === "influencer") {
    return {
      plan: "influencer",
      imagesPerDay: 20,
    };
  }

  return {
    plan: "free",
    imagesPerDay: 3,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ImageRequestBody;
    const prompt = (body.prompt || "").trim();
    const userEmail = (body.email || "").trim().toLowerCase();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt da imagem não enviado." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;
    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    let currentPlan = "free";
    let imagesRemaining = 3;

    const canUseSupabase =
      !!SUPABASE_URL && !!SUPABASE_SERVICE_ROLE_KEY && !!userEmail;

    if (canUseSupabase) {
      try {
        const supabase = createClient(
          SUPABASE_URL!,
          SUPABASE_SERVICE_ROLE_KEY!,
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
          .eq("email", userEmail)
          .maybeSingle();

        const isActivePaid =
          !!subscription &&
          subscription.status === "active" &&
          (subscription.plan === "pro" || subscription.plan === "influencer");

        const limits = getLimitsByPlan(isActivePaid ? subscription?.plan : "free");
        currentPlan = limits.plan;

        const today = new Date().toISOString().slice(0, 10);

        const { data: usage } = await supabase
          .from("aurora_daily_usage")
          .select("id, images_count")
          .eq("email", userEmail)
          .eq("usage_date", today)
          .maybeSingle();

        const imagesUsed = Number(usage?.images_count || 0);

        if (limits.imagesPerDay !== -1 && imagesUsed >= limits.imagesPerDay) {
          return NextResponse.json(
            {
              error:
                "Você atingiu o limite diário de imagens do seu plano. Faça upgrade para continuar usando a Aurora IA.",
              plan: currentPlan,
              imagesRemaining: 0,
            },
            { status: 403 }
          );
        }

        if (usage?.id) {
          await supabase
            .from("aurora_daily_usage")
            .update({
              images_count: imagesUsed + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", usage.id);
        } else {
          await supabase.from("aurora_daily_usage").insert({
            email: userEmail,
            usage_date: today,
            messages_count: 0,
            images_count: 1,
          });
        }

        imagesRemaining =
          limits.imagesPerDay === -1
            ? -1
            : Math.max(limits.imagesPerDay - (imagesUsed + 1), 0);
      } catch (supabaseError) {
        console.error("SUPABASE IMAGE WARNING:", supabaseError);
      }
    }

    const response = await fetch("https://api.openai.com/v1/images/generations", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
        quality: "medium",
        output_format: "png",
      }),
      cache: "no-store",
    });

    const rawText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: rawText || "A API de imagem retornou erro sem texto.",
          statusCode: response.status,
        },
        { status: response.status || 500 }
      );
    }

    let data: any = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      return NextResponse.json(
        {
          error: "Resposta da API não veio em JSON.",
          rawText,
        },
        { status: 500 }
      );
    }

    const imageBase64 = data?.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json(
        {
          error: "A API respondeu, mas não retornou b64_json.",
          rawText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageBase64,
      mimeType: "image/png",
      plan: currentPlan,
      imagesRemaining,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao gerar imagem.",
      },
      { status: 500 }
    );
  }
}
