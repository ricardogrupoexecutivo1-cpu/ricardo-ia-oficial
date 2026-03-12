import { NextResponse } from "next/server";
import OpenAI from "openai";

export async function POST(req: Request) {
  try {
    const { prompt } = await req.json();

    const openai = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const completion = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: `
Crie uma campanha de marketing curta para redes sociais.

Inclua:

1 texto para Instagram
5 hashtags
uma frase de impacto

Tema: ${prompt}

Responda em português.
`,
      max_output_tokens: 300
    });

    const text = completion.output_text;

    return NextResponse.json({
      campaign: text
    });

  } catch (error: any) {
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}