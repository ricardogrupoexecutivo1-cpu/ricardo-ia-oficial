import { NextRequest, NextResponse } from "next/server";

type ImageRequestBody = {
  prompt?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ImageRequestBody;
    const prompt = (body.prompt || "").trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt da imagem não enviado." },
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

    const response = await fetch("https://api.openai.com/v1/images", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-image-1",
        prompt,
        size: "1024x1024",
        quality: "medium",
        output_format: "png",
      }),
      cache: "no-store",
    });

    const data = await response.json();

    if (!response.ok) {
      console.error("OpenAI image error:", data);

      return NextResponse.json(
        {
          error: "Erro ao gerar imagem.",
          details: data,
        },
        { status: 500 }
      );
    }

    const imageBase64 = data?.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json(
        { error: "A API não retornou imagem." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageBase64,
      mimeType: "image/png",
    });
  } catch (error) {
    console.error("API /api/image error:", error);

    return NextResponse.json(
      { error: "Erro interno ao gerar imagem." },
      { status: 500 }
    );
  }
}