import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

function getLimitsByPlan(plan: string | null) {
  const normalized = (plan || "free").toLowerCase();

  // 🔥 PREMIUM (ILIMITADO TOTAL)
  if (normalized === "premium") {
    return {
      plan: "premium",
      messagesPerDay: -1,
      imagesPerDay: -1,
    };
  }

  // 🔥 PRO (LIMITE ALTO)
  if (normalized === "pro") {
    return {
      plan: "pro",
      messagesPerDay: -1,
      imagesPerDay: 100,
    };
  }

  // 🔥 FUTUROS PLANOS
  if (normalized === "influencer") {
    return {
      plan: "influencer",
      messagesPerDay: 200,
      imagesPerDay: 50,
    };
  }

  // 🔥 FREE
  return {
    plan: "free",
    messagesPerDay: 20,
    imagesPerDay: 3,
  };
}

function isImageRequest(text: string) {
  const value = text.toLowerCase();

  return (
    value.includes("crie uma imagem") ||
    value.includes("gere uma imagem") ||
    value.includes("criar imagem") ||
    value.includes("gerar imagem") ||
    value.includes("faça uma imagem") ||
    value.includes("imagem de") ||
    value.includes("desenhe") ||
    value.includes("create an image") ||
    value.includes("generate an image") ||
    value.includes("image of")
  );
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

export async function POST(req: NextRequest) {
  try {
    if (!supabaseUrl || !supabaseAnonKey) {
      return NextResponse.json(
        { error: "Supabase não configurado." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const message = String(body?.message || "").trim();
    const email = String(body?.email || "").trim().toLowerCase();

    if (!message) {
      return NextResponse.json(
        { error: "Mensagem não informada." },
        { status: 400 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    // 🔎 Buscar perfil
    const { data: profile } = await supabase
      .from("profiles")
      .select("plan, plan_status, plan_expires_at")
      .eq("email", email)
      .maybeSingle();

    const plan = (profile?.plan || "free").toLowerCase();
    const planStatus = (profile?.plan_status || "inactive").toLowerCase();
    const expiresAt = profile?.plan_expires_at;

    const isActivePlan =
      plan !== "free" &&
      planStatus === "active" &&
      !!expiresAt &&
      new Date(expiresAt).getTime() > Date.now();

    const finalPlan = isActivePlan ? plan : "free";

    const limits = getLimitsByPlan(finalPlan);

    // 📊 Contagem de hoje
    const startOfDay = startOfDayIso();

    const { count: messagesCount } = await supabase
      .from("chat_messages")
      .select("id", { count: "exact", head: true })
      .eq("user_email", email)
      .gte("created_at", startOfDay);

    const { count: imagesCount } = await supabase
      .from("generated_images")
      .select("id", { count: "exact", head: true })
      .eq("user_email", email)
      .gte("created_at", startOfDay);

    const messagesUsed = Number(messagesCount || 0);
    const imagesUsed = Number(imagesCount || 0);

    // 🚫 BLOQUEIOS
    if (
      limits.messagesPerDay >= 0 &&
      messagesUsed >= limits.messagesPerDay
    ) {
      return NextResponse.json({
        error: "Limite de mensagens atingido hoje.",
      });
    }

    const isImage = isImageRequest(message);

    if (
      isImage &&
      limits.imagesPerDay >= 0 &&
      imagesUsed >= limits.imagesPerDay
    ) {
      return NextResponse.json({
        error: "Limite de imagens atingido hoje.",
      });
    }

    // 🧠 RESPOSTA IA
    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é a Aurora IA, focada em negócios, marketing e criação de valor.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const text = completion.choices[0]?.message?.content || "Erro ao responder.";

    // 💾 Salvar mensagem
    await supabase.from("chat_messages").insert({
      user_email: email,
      role: "user",
      content: message,
    });

    await supabase.from("chat_messages").insert({
      user_email: email,
      role: "assistant",
      content: text,
    });

    return NextResponse.json({
      reply: text,
      plan: finalPlan,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: "Erro interno no chat.",
        details: error instanceof Error ? error.message : "Erro desconhecido.",
      },
      { status: 500 }
    );
  }
}