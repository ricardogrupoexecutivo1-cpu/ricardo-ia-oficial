import OpenAI from "openai";
import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const { message } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: message,
    });

    return NextResponse.json({
      reply: response.output_text ?? "Sem resposta.",
    });

  } catch (error) {
    console.error("Erro na API:", error);
    return NextResponse.json(
      { reply: "Erro ao processar a mensagem." },
      { status: 500 }
    );
  }
}