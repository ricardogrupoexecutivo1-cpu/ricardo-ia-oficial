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
        model: "gpt-image-1-mini",
        prompt,
        size: "1024x1024",
        quality: "medium",
        output_format: "png",
      }),
      cache: "no-store",
    });

    const rawText = await response.text();

    if (!response.ok) {
      return NextResponse.json(
        {
          error: rawText || "A API de imagem retornou erro sem texto.",
          statusCode: response.status,
        },
        { status: response.status || 500 }
      );
    }

    let data: any = null;

    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      return NextResponse.json(
        {
          error: "Resposta da API não veio em JSON.",
          rawText,
        },
        { status: 500 }
      );
    }

    const imageBase64 = data?.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json(
        {
          error: "A API respondeu, mas não retornou b64_json.",
          rawText,
        },
        { status: 500 }
      );
    }

    return NextResponse.json({
      imageBase64,
      mimeType: "image/png",
    });
  } catch (error) {
    return NextResponse.json(
      {
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao gerar imagem.",
      },
      { status: 500 }
    );
  }
}