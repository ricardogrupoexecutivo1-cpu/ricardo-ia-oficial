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
    const message = typeof body?.message === "string" ? body.message : "";

    if (!message) {
      return NextResponse.json(
        { reply: "Body inválido. Envie { message: string }." },
        { status: 400 }
      );
    }

    const openai = new OpenAI({ apiKey });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
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