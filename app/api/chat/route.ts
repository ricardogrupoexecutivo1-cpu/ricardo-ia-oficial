import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

function buildPrompt(message: string) {
  return `
Imagem ultra realista, cinematográfica, alta qualidade.

${message}

Detalhes:
- iluminação profissional
- composição cinematográfica
- textura realista
- 4k, ultra detalhado
`;
}

async function generateImage(prompt: string) {
  return openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "512x512",
  });
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const message = body.message;
    const email = body.email || null;

    if (!message) {
      return NextResponse.json({ error: "Mensagem vazia" }, { status: 400 });
    }

    // 🔥 FORÇADO: sempre gera imagem
    const imageResponse = await generateImage(buildPrompt(message));

    const imageUrl = imageResponse.data?.[0]?.url || null;

    if (!imageUrl) {
      return NextResponse.json({
        reply: "Não consegui gerar a imagem.",
        imageUrl: null,
      });
    }

    // salvar no banco
    await supabase.from("generated_images").insert({
      prompt: message,
      image_url: imageUrl,
      image_page_url: imageUrl,
      user_email: email,
      source: "chat",
    });

    return NextResponse.json({
      reply: "Imagem gerada com sucesso.",
      imageUrl,
      imagePageUrl: imageUrl,
    });
  } catch (error) {
    console.error(error);

    return NextResponse.json({
      error: "Erro ao gerar imagem",
    });
  }
}