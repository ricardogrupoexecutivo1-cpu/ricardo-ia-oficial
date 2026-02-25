import OpenAI from "openai";
import { NextResponse } from "next/server";

export const runtime = "nodejs";

export async function POST(req: Request) {
  try {
    const apiKey = process.env.OPENAI_API_KEY || "";

    console.log("OPENAI_API_KEY prefix:", apiKey.slice(0, 8));

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

    return NextResponse.json({
      reply: response.output_text ?? "Sem resposta.",
    });
  } catch (error: any) {
    const status = typeof error?.status === "number" ? error.status : 500;
    console.error("Erro na API:", error?.message || error);
    return NextResponse.json(
      { reply: error?.message || "Erro ao processar a mensagem." },
      { status }
    );
  }
}