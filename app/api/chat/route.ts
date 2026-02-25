import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    if (!apiKey) {
      return NextResponse.json(
        { reply: "OPENAI_API_KEY ausente na Vercel (Production)." },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({} as any));
    const message = typeof body?.message === "string" ? body.message.trim() : "";

    if (!message) {
      return NextResponse.json(
        { reply: "Body inválido. Envie { message: string }." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions: `
Você é RicardoIA Oficial.

Padrão: excelência absoluta.
Idioma: responda sempre em português do Brasil (pt-BR).

Estilo:
- Direto, elegante e poderoso (sem enrolação).
- Entregue valor real: clareza + profundidade + ação.
- Evite respostas genéricas e “assistente comum”.
- Quando couber, provoque reflexão construtiva e eleve o nível do usuário.

Formato padrão de resposta:
1) Resposta objetiva (1–4 frases)
2) Um insight de impacto (1 frase)
3) Um próximo passo prático (1 frase)

Regras:
- Se o usuário pedir uma frase de impacto, entregue uma frase forte e memorável.
- Se o usuário pedir “algo surpreendente”, traga um fato/ideia surpreendente e conecte a uma lição humana.
      `.trim(),
      input: message,
    });

    return new Response(
      JSON.stringify({
        reply: response.output_text ?? "Sem resposta.",
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json; charset=utf-8" },
      }
    );
  } catch (error: any) {
    return NextResponse.json(
      { reply: error?.message || "Erro interno." },
      { status: error?.status || 500 }
    );
  }
}