import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ChatMessage = {
  role: "user" | "assistant" | "system";
  content: string;
};

type ChatRequestBody = {
  message?: string;
  messages?: ChatMessage[];
  email?: string;
};

function getLimitsByPlan(plan: string | null) {
  const normalized = (plan || "free").toLowerCase();

  if (normalized === "pro") {
    return {
      plan: "pro",
      messagesPerDay: -1,
    };
  }

  if (normalized === "influencer") {
    return {
      plan: "influencer",
      messagesPerDay: 200,
    };
  }

  return {
    plan: "free",
    messagesPerDay: 20,
  };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;

    const language = req.headers.get("x-language") || "pt";

    const languageLabel =
      language === "en"
        ? "English"
        : language === "es"
          ? "Español"
          : "Português";

    const userMessage = (body.message || "").trim();
    const userEmail = (body.email || "").trim().toLowerCase();
    const incomingMessages = Array.isArray(body.messages) ? body.messages : [];

    if (!userMessage) {
      return NextResponse.json(
        { error: "Mensagem não enviada." },
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
    let messagesRemaining = 20;

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

        const limits = getLimitsByPlan(isActivePaid ? subscription.plan : "free");
        currentPlan = limits.plan;

        const today = new Date().toISOString().slice(0, 10);

        const { data: usage } = await supabase
          .from("aurora_daily_usage")
          .select("id, messages_count")
          .eq("email", userEmail)
          .eq("usage_date", today)
          .maybeSingle();

        const messagesUsed = Number(usage?.messages_count || 0);

        if (
          limits.messagesPerDay !== -1 &&
          messagesUsed >= limits.messagesPerDay
        ) {
          return NextResponse.json(
            {
              error:
                "Você atingiu o limite diário do seu plano. Faça upgrade para continuar usando a Aurora IA.",
              plan: currentPlan,
              messagesRemaining: 0,
            },
            { status: 403 }
          );
        }

        if (usage?.id) {
          await supabase
            .from("aurora_daily_usage")
            .update({
              messages_count: messagesUsed + 1,
              updated_at: new Date().toISOString(),
            })
            .eq("id", usage.id);
        } else {
          await supabase.from("aurora_daily_usage").insert({
            email: userEmail,
            usage_date: today,
            messages_count: 1,
            images_count: 0,
          });
        }

        messagesRemaining =
          limits.messagesPerDay === -1
            ? -1
            : Math.max(limits.messagesPerDay - (messagesUsed + 1), 0);
      } catch (supabaseError) {
        console.error("SUPABASE CHAT WARNING:", supabaseError);
      }
    }

    const systemPrompt = `
Você é Aurora IA, uma assistente útil, moderna, objetiva e profissional.

Regras principais:
- Seu nome é sempre Aurora IA.
- Nunca diga que seu nome é RicardoIA.
- Responda sempre no idioma solicitado.
- Idioma obrigatório da resposta: ${languageLabel}.
- Se o idioma for English, responda em English.
- Se o idioma for Español, responda em Español.
- Se o idioma for Português, responda em Português.
- Nunca misture idiomas sem necessidade.
- Seja natural, útil e direta.
- Se o usuário perguntar "onde está a Aurora", explique que você é a própria Aurora IA.
`;

    const historyMessages = incomingMessages
      .filter(
        (msg) =>
          msg &&
          (msg.role === "user" ||
            msg.role === "assistant" ||
            msg.role === "system") &&
          typeof msg.content === "string" &&
          msg.content.trim() !== ""
      )
      .slice(-10)
      .map((msg) => ({
        role: msg.role,
        content: msg.content,
      }));

    const messagesForModel = [
      {
        role: "system",
        content: systemPrompt,
      },
      ...historyMessages,
      {
        role: "user",
        content: userMessage,
      },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messagesForModel,
        temperature: 0.7,
      }),
      cache: "no-store",
    });

    const rawText = await response.text();

    let data: any = null;
    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      data = { rawText };
    }

    if (!response.ok) {
      return NextResponse.json(
        {
          error: "Erro OpenAI",
          statusCode: response.status,
          details: data,
          rawText,
        },
        { status: response.status || 500 }
      );
    }

    const reply =
      data?.choices?.[0]?.message?.content?.trim() ||
      "Recebi sua mensagem, mas não consegui gerar resposta agora.";

    return NextResponse.json({
      reply,
      plan: currentPlan,
      messagesRemaining,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao processar a mensagem.",
      },
      { status: 500 }
    );
  }
}
