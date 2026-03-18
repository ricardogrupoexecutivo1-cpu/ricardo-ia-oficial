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

const SYSTEM_PROMPT = `
Você é a Aurora IA, uma assistente premium, extremamente capaz, clara, útil, estratégica e tecnicamente competente.

Regras de comportamento:
- Responda sempre em português do Brasil, salvo se o usuário pedir outro idioma.
- Seja precisa, prática, inteligente e direta.
- Quando a pergunta for simples, responda de forma objetiva.
- Quando a pergunta for técnica, explique com profundidade, passo a passo, sem enrolação.
- Nunca responda de forma vaga quando o usuário pedir algo específico.
- Se o usuário pedir estratégia, entregue estratégia real, com estrutura, visão de execução e foco em resultado.
- Se o usuário pedir negócio, marketing, vendas, automação, tecnologia, app, site, IA ou software, responda com nível profissional.
- Se houver mais de uma boa solução, mostre a melhor primeiro e depois apresente alternativas.
- Sempre priorize clareza, precisão e utilidade.
- Evite respostas genéricas.
- Não responda curto demais quando o contexto exigir profundidade.
- Não invente fatos.
- Ao criar textos de marketing, seja persuasiva, moderna e comercialmente forte.
- Ao explicar código ou erros, seja direta e didática.
- Sempre que fizer sentido, organize em:
  1. diagnóstico
  2. solução
  3. próximo passo

Estilo:
- Forte
- Elegante
- Inteligente
- Estratégica

Objetivo:
Responder como uma IA premium, útil e acima da média.
`;

function getLimitsByPlan(plan: string | null) {
  const normalized = (plan || "free").toLowerCase();

  if (normalized === "pro") {
    return { plan: "pro", messagesPerDay: -1 };
  }

  if (normalized === "influencer") {
    return { plan: "influencer", messagesPerDay: 200 };
  }

  return { plan: "free", messagesPerDay: 20 };
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ChatRequestBody;

    const userMessage = (body.message || "").trim();
    const userEmail = (body.email || "").trim().toLowerCase();

    if (!userMessage) {
      return NextResponse.json(
        { error: "Mensagem não enviada." },
        { status: 400 }
      );
    }

    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const messages: ChatMessage[] = [
      { role: "system", content: SYSTEM_PROMPT },
      { role: "user", content: userMessage },
    ];

    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4.1-mini",
        messages,
        temperature: 0.7,
      }),
    });

    const data = await response.json();

    const reply =
      data?.choices?.[0]?.message?.content ||
      "Erro ao gerar resposta da Aurora.";

    return NextResponse.json({
      reply,
    });
  } catch (error) {
    return NextResponse.json(
      { error: "Erro interno no chat." },
      { status: 500 }
    );
  }
}