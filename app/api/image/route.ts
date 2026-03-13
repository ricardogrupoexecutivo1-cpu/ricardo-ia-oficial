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

    const rawText = await response.text();

    let data: any = null;

    try {
      data = rawText ? JSON.parse(rawText) : null;
    } catch {
      return NextResponse.json(
        {
          error: "Resposta inválida da API de imagem.",
          details: rawText || "Sem conteúdo retornado.",
        },
        { status: 500 }
      );
    }

    if (!response.ok) {
      console.error("OpenAI image error:", data);

      const apiMessage =
        data?.error?.message ||
        data?.message ||
        "Erro retornado pela API de imagem.";

      return NextResponse.json(
        {
          error: apiMessage,
          details: data,
        },
        { status: response.status || 500 }
      );
    }

    const imageBase64 = data?.data?.[0]?.b64_json;

    if (!imageBase64) {
      return NextResponse.json(
        {
          error: "A API respondeu, mas não retornou b64_json da imagem.",
          details: data,
        },
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
      {
        error: "Erro interno ao gerar imagem.",
        details: error instanceof Error ? error.message : String(error),
      },
      { status: 500 }
    );
  }
}