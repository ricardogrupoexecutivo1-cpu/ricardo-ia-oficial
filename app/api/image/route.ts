import { NextRequest, NextResponse } from "next/server";

type OpenAIImageResponse = {
  created?: number;
  data?: Array<{
    url?: string;
    b64_json?: string;
  }>;
};

export async function POST(req: NextRequest) {
  try {
    console.log("API IMAGE CHAMADA");

    const body = await req.json();
    const prompt =
      typeof body?.prompt === "string" ? body.prompt.trim() : "";

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt não enviado." },
        { status: 400 }
      );
    }

    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const response = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt,
          size: "1024x1024",
          quality: "high",
        }),
      }
    );

    const data = (await response.json()) as OpenAIImageResponse & {
      error?: { message?: string };
    };

    console.log("RESPOSTA IMAGE API:", {
      ok: response.ok,
      status: response.status,
      hasUrl: Boolean(data?.data?.[0]?.url),
      hasB64: Boolean(data?.data?.[0]?.b64_json),
    });

    if (!response.ok) {
      return NextResponse.json(
        { error: data?.error?.message || "Erro ao gerar imagem." },
        { status: 500 }
      );
    }

    const url = data?.data?.[0]?.url;
    const b64 = data?.data?.[0]?.b64_json;

    let imageUrl: string | null = null;

    if (typeof url === "string" && url.trim()) {
      imageUrl = url;
    } else if (typeof b64 === "string" && b64.trim()) {
      imageUrl = `data:image/png;base64,${b64}`;
    }

    if (!imageUrl) {
      return NextResponse.json(
        { error: "Imagem não retornada pela API." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      message: "Imagem gerada.",
      imageUrl,
    });
  } catch (error) {
    console.log("ERRO IMAGE API:", error);

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