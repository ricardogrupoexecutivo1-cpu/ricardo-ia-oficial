import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { env, hasOpenAi } from "../../../lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;
export const maxDuration = 60;

function jsonNoStore(body: unknown, init?: ResponseInit) {
  const response = NextResponse.json(body, init);

  response.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  response.headers.set("Pragma", "no-cache");
  response.headers.set("Expires", "0");
  response.headers.set("Surrogate-Control", "no-store");
  response.headers.set("CDN-Cache-Control", "no-store");
  response.headers.set("Vercel-CDN-Cache-Control", "no-store");

  return response;
}

function getOpenAiClient() {
  if (!hasOpenAi()) {
    throw new Error("OPENAI_API_KEY não configurada.");
  }

  return new OpenAI({
    apiKey: env.openAiApiKey as string,
  });
}

function shouldGenerateImage(message: string) {
  const text = message.toLowerCase().trim();

  const strongTriggers = [
    "crie uma imagem",
    "gere uma imagem",
    "gerar imagem",
    "faça uma imagem",
    "faca uma imagem",
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
  const envBase = env.siteUrl || env.appUrl;

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

async function readJsonBody(req: NextRequest) {
  const raw = await req.text();

  if (!raw || !raw.trim()) {
    throw new Error("Body vazio na requisição.");
  }

  try {
    return JSON.parse(raw) as {
      message?: string;
      email?: string;
    };
  } catch {
    throw new Error("JSON inválido na requisição.");
  }
}

async function generateTextReply(message: string) {
  const openai = getOpenAiClient();

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

async function callImageApi(
  baseUrl: string,
  message: string,
  email: string | null
) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 60000);

  try {
    const imageResponse = await fetch(`${baseUrl}/api/image`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      cache: "no-store",
      signal: controller.signal,
      body: JSON.stringify({
        prompt: message,
        email,
      }),
    });

    const imageData = (await imageResponse.json()) as ImageApiResponse;

    return {
      ok: imageResponse.ok,
      status: imageResponse.status,
      data: imageData,
    };
  } finally {
    clearTimeout(timeout);
  }
}

export async function POST(req: NextRequest) {
  try {
    if (!hasOpenAi()) {
      return jsonNoStore(
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

    const body = await readJsonBody(req);
    const message = String(body?.message || "").trim();
    const email = String(body?.email || "").trim().toLowerCase() || null;

    if (!message) {
      return jsonNoStore(
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

      return jsonNoStore(
        {
          reply,
          imageUrl: null,
          imagePageUrl: null,
          imageSaved: false,
          imageSavedId: null,
          imageSaveError: null,
        },
        { status: 200 }
      );
    }

    const baseUrl = getBaseUrl(req);

    try {
      const imageResult = await callImageApi(baseUrl, message, email);
      const imageData = imageResult.data;

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

      return jsonNoStore(
        {
          reply,
          imageUrl,
          imagePageUrl,
          imageSaved: Boolean(imageData.savedToDatabase),
          imageSavedId: null,
          imageSaveError: imageData.databaseError || imageData.error || null,
        },
        {
          status: imageResult.ok ? 200 : 500,
        }
      );
    } catch (error) {
      const readableError =
        error instanceof Error && error.name === "AbortError"
          ? "Tempo excedido ao gerar imagem."
          : getReadableError(error);

      console.error("Aurora IA: erro ao chamar /api/image pelo chat:", error);

      return jsonNoStore(
        {
          reply: `Recebi seu pedido de imagem, mas não consegui gerar agora. Motivo: ${readableError}`,
          error: readableError,
          imageUrl: null,
          imagePageUrl: null,
          imageSaved: false,
          imageSavedId: null,
          imageSaveError: readableError,
        },
        { status: 500 }
      );
    }
  } catch (error) {
    const readableError = getReadableError(error);

    console.error("Aurora IA: erro em /api/chat:", error);

    return jsonNoStore(
      {
        reply: `Recebi sua mensagem, mas ocorreu um erro interno no chat. Motivo: ${readableError}`,
        error: readableError,
        imageUrl: null,
        imagePageUrl: null,
        imageSaved: false,
        imageSavedId: null,
        imageSaveError: readableError,
      },
      { status: 500 }
    );
  }
}