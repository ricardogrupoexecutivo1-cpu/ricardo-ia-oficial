import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 60;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

function shouldGenerateImage(message: string) {
  const text = message.toLowerCase().trim();

  const strongTriggers = [
    "crie uma imagem",
    "gere uma imagem",
    "gerar imagem",
    "faça uma imagem",
    "me mostre uma imagem",
    "crie uma arte",
    "gere uma arte",
    "crie um banner",
    "gere um banner",
    "crie uma foto",
    "gere uma foto",
    "crie uma ilustração",
    "gere uma ilustração",
    "crie uma ilustracao",
    "gere uma ilustracao",
    "crie uma capa",
    "gere uma capa",
    "crie um post",
    "gere um post",
    "crie um criativo",
    "gere um criativo",
    "quero uma imagem",
    "preciso de uma imagem",
  ];

  if (strongTriggers.some((term) => text.includes(term))) {
    return true;
  }

  const genericImageWords = [
    "imagem",
    "foto",
    "arte",
    "banner",
    "ilustração",
    "ilustracao",
    "post",
    "criativo",
    "thumbnail",
    "capa",
    "logo",
    "cartaz",
    "story",
  ];

  return genericImageWords.some((term) => text.includes(term));
}

function getReadableError(error: unknown) {
  if (error instanceof Error) {
    return error.message;
  }

  if (typeof error === "string") {
    return error;
  }

  return "erro_desconhecido";
}

function getBaseUrl(req: NextRequest) {
  const envBase =
    process.env.NEXT_PUBLIC_SITE_URL?.trim() ||
    process.env.NEXT_PUBLIC_APP_URL?.trim();

  if (envBase) {
    return envBase.replace(/\/+$/, "");
  }

  const host = req.headers.get("host");
  const proto =
    req.headers.get("x-forwarded-proto") ||
    (host?.includes("localhost") ? "http" : "https");

  if (host) {
    return `${proto}://${host}`;
  }

  return "http://localhost:3000";
}

async function generateTextReply(message: string) {
  const completion = await openai.chat.completions.create({
    model: "gpt-5-mini",
    messages: [
      {
        role: "system",
        content:
          "Você é a Aurora IA, especialista em marketing, campanhas, vendas, copy, negócios e produtividade. Responda sempre em português do Brasil, de forma clara, útil, objetiva e comercial quando fizer sentido.",
      },
      {
        role: "user",
        content: message,
      },
    ],
  });

  const reply = completion.choices[0]?.message?.content?.trim();

  return reply || "Recebi sua mensagem e estou pronta para ajudar.";
}

type ImageApiResponse = {
  reply?: string | null;
  message?: string | null;
  imageUrl?: string | null;
  imagePageUrl?: string | null;
  publicPageUrl?: string | null;
  shareUrl?: string | null;
  savedToDatabase?: boolean | null;
  databaseError?: string | null;
  error?: string | null;
};

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        {
          reply: "A chave da OpenAI não está configurada.",
          error: "OPENAI_API_KEY não configurada.",
          imageUrl: null,
          imagePageUrl: null,
          imageSaved: false,
          imageSavedId: null,
          imageSaveError: "OPENAI_API_KEY não configurada.",
        },
        { status: 500 }
      );
    }

    const body = await req.json();
    const message = String(body?.message || "").trim();
    const email = String(body?.email || "").trim() || null;

    if (!message) {
      return NextResponse.json(
        {
          reply: "Digite uma mensagem para eu continuar.",
          error: "Mensagem não enviada.",
          imageUrl: null,
          imagePageUrl: null,
          imageSaved: false,
          imageSavedId: null,
          imageSaveError: "Mensagem não enviada.",
        },
        { status: 400 }
      );
    }

    const wantsImage = shouldGenerateImage(message);

    if (!wantsImage) {
      const reply = await generateTextReply(message);

      return NextResponse.json(
        {
          reply,
          imageUrl: null,
          imagePageUrl: null,
          imageSaved: false,
          imageSavedId: null,
          imageSaveError: null,
        },
        {
          status: 200,
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }

    const baseUrl = getBaseUrl(req);

    try {
      const imageResponse = await fetch(`${baseUrl}/api/image`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        cache: "no-store",
        body: JSON.stringify({
          prompt: message,
          email,
        }),
      });

      const imageData = (await imageResponse.json()) as ImageApiResponse;

      const imageUrl = imageData.imageUrl || null;
      const imagePageUrl =
        imageData.imagePageUrl ||
        imageData.publicPageUrl ||
        imageData.shareUrl ||
        imageUrl;

      const reply =
        imageData.reply?.trim() ||
        imageData.message?.trim() ||
        (imageUrl
          ? "Imagem gerada com sucesso. Exibindo no chat."
          : "Recebi seu pedido de imagem, mas não consegui gerar agora.");

      return NextResponse.json(
        {
          reply,
          imageUrl,
          imagePageUrl,
          imageSaved: Boolean(imageData.savedToDatabase),
          imageSavedId: null,
          imageSaveError: imageData.databaseError || imageData.error || null,
        },
        {
          status: imageResponse.ok ? 200 : 500,
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    } catch (error) {
      const readableError = getReadableError(error);

      console.error("Erro ao chamar /api/image pelo chat:", error);

      return NextResponse.json(
        {
          reply: `Recebi seu pedido de imagem, mas não consegui gerar agora. Motivo: ${readableError}`,
          error: readableError,
          imageUrl: null,
          imagePageUrl: null,
          imageSaved: false,
          imageSavedId: null,
          imageSaveError: readableError,
        },
        {
          status: 500,
          headers: {
            "Cache-Control": "no-store, max-age=0",
          },
        }
      );
    }
  } catch (error) {
    const readableError = getReadableError(error);

    console.error("ERRO /api/chat:", error);

    return NextResponse.json(
      {
        reply: `Recebi sua mensagem, mas ocorreu um erro interno no chat. Motivo: ${readableError}`,
        error: readableError,
        imageUrl: null,
        imagePageUrl: null,
        imageSaved: false,
        imageSavedId: null,
        imageSaveError: readableError,
      },
      {
        status: 500,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
  }
}