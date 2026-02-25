import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

function cleanText(s: string) {
  return s.replace(/\s+\.\.\.\s*$/g, "").replace(/\s{2,}/g, " ").trim();
}

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
      max_output_tokens: 180,
      instructions: `
Você é RicardoIA Oficial.
Responda sempre em pt-BR.
Curto, direto, elegante e impactante.
Formato:
1) Resposta objetiva (1–2 frases)
2) Insight (1 frase)
3) Ação: (1 frase)
Sem reticências "...".
      `.trim(),
      input: message,
    });

    const reply = cleanText(response.output_text ?? "Sem resposta.");

    return new Response(JSON.stringify({ reply }), {
      status: 200,
      headers: { "Content-Type": "application/json; charset=utf-8" },
    });
  } catch (error: any) {
    const status = typeof error?.status === "number" ? error.status : 500;
    const msg = typeof error?.message === "string" ? error.message : "Erro interno.";
    return NextResponse.json({ reply: msg }, { status });
  }
}