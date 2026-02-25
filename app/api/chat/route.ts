import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

const VERSION = "ptbr-check-390a561";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY;

    console.log("API VERSION:", VERSION);

    if (!apiKey) {
      return NextResponse.json(
        { reply: "OPENAI_API_KEY ausente na Vercel (Production).", version: VERSION },
        { status: 500 }
      );
    }

    const body = await req.json().catch(() => ({} as any));
    const message = typeof body?.message === "string" ? body.message : "";

    if (!message) {
      return NextResponse.json(
        { reply: "Body inválido. Envie { message: string }.", version: VERSION },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      instructions:
        "Responda sempre em português do Brasil (pt-BR), sem inglês. Se o usuário disser 'olá', responda em português.",
      input: message,
    });

    return new Response(
      JSON.stringify({
        reply: response.output_text ?? "Sem resposta.",
        version: VERSION,
      }),
      { status: 200, headers: { "Content-Type": "application/json; charset=utf-8" } }
    );
  } catch (error: any) {
    return NextResponse.json(
      { reply: error?.message || "Erro interno.", version: VERSION },
      { status: error?.status || 500 }
    );
  }
}