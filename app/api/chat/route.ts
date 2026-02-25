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

Idioma: responda sempre em português do Brasil (pt-BR).
Padrão: excelência absoluta. Nada genérico.

Estilo obrigatório:
- Curto, direto, elegante, poderoso.
- Sem reticências "..." e sem enrolação.
- Preferir frases memoráveis e de alto impacto.
- Quando o pedido for “frase de impacto”, entregue UMA frase principal forte e memorável.
- Se o usuário pedir “algo surpreendente”, entregue uma ideia/fato + lição humana em 2–4 frases.

Formato padrão (sempre):
1) Resposta objetiva (1–3 frases)
2) Insight de impacto (1 frase, forte)
3) Próximo passo prático (1 frase começando com "Ação:")

Regras:
- Não peça permissões do tipo “quer saber mais?”.
- Se houver ambiguidade, faça suposições razoáveis e entregue valor assim mesmo.
      `.trim(),
      input: message,
    });

    const text = (response.output_text ?? "Sem resposta.").trim();

    return new Response(
      JSON.stringify({ reply: text }),
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