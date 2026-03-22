import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const maxDuration = 30;

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

const supabase =
  supabaseUrl && supabaseServiceRoleKey
    ? createClient(supabaseUrl, supabaseServiceRoleKey, {
        auth: {
          persistSession: false,
          autoRefreshToken: false,
        },
      })
    : null;

type SaveGeneratedImageResult =
  | {
      saved: true;
      id: string | null;
    }
  | {
      saved: false;
      reason: "supabase_not_configured" | "insert_failed";
      error?: string;
    };

function buildPrompt(message: string) {
  return [
    "Crie uma imagem ultra realista, cinematográfica e de alta qualidade.",
    "Visual premium, composição forte, iluminação profissional, textura realista.",
    "Sem texto escrito na imagem, a menos que o usuário peça explicitamente.",
    `Pedido do usuário: ${message}`,
  ].join(" ");
}

async function saveGeneratedImage(params: {
  prompt: string;
  reply: string;
  imageUrl: string;
  email?: string | null;
}): Promise<SaveGeneratedImageResult> {
  if (!supabase) {
    return {
      saved: false,
      reason: "supabase_not_configured",
    };
  }

  const { data, error } = await supabase
    .from("generated_images")
    .insert({
      prompt: params.prompt,
      response_text: params.reply,
      image_url: params.imageUrl,
      image_page_url: params.imageUrl,
      user_email: params.email || null,
      source: "api/chat",
      created_at: new Date().toISOString(),
    })
    .select("id")
    .single();

  if (error) {
    console.error("Erro ao salvar imagem no Supabase:", error);

    return {
      saved: false,
      reason: "insert_failed",
      error: error.message,
    };
  }

  return {
    saved: true,
    id: data?.id ?? null,
  };
}

async function generateImageWithTimeout(prompt: string) {
  const imagePromise = openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "512x512",
  });

  const timeoutPromise = new Promise<never>((_, reject) => {
    setTimeout(() => {
      reject(new Error("timeout_imagem"));
    }, 20000);
  });

  return Promise.race([imagePromise, timeoutPromise]);
}

function resolveImageSrc(
  imageResponse: Awaited<ReturnType<typeof generateImageWithTimeout>>
) {
  const item = imageResponse?.data?.[0];

  if (!item) {
    return null;
  }

  if ("url" in item && item.url) {
    return item.url;
  }

  if ("b64_json" in item && item.b64_json) {
    return `data:image/png;base64,${item.b64_json}`;
  }

  return null;
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

    let reply = "Estou preparando sua imagem agora.";
    let imageUrl: string | null = null;
    let imageSaved = false;
    let imageSavedId: string | null = null;
    let imageSaveError: string | null = null;

    try {
      const imageResponse = await generateImageWithTimeout(buildPrompt(message));
      imageUrl = resolveImageSrc(imageResponse);

      if (imageUrl) {
        reply = "Imagem gerada com sucesso.";

        if (imageUrl.startsWith("data:image/")) {
          imageSaved = false;
          imageSavedId = null;
          imageSaveError = "imagem_em_base64_nao_salva_no_banco";
          reply = "Imagem gerada com sucesso. Exibindo no chat.";
        } else {
          const saveResult = await saveGeneratedImage({
            prompt: message,
            reply,
            imageUrl,
            email,
          });

          imageSaved = saveResult.saved;

          if (saveResult.saved) {
            imageSavedId = saveResult.id ?? null;
          } else if (saveResult.error) {
            imageSaveError = saveResult.error;
            reply = `Imagem gerada, mas não consegui salvar no banco: ${saveResult.error}`;
          } else {
            const reason = saveResult.reason || "insert_failed";
            imageSaveError = reason;
            reply = `Imagem gerada, mas não consegui salvar no banco: ${reason}`;
          }
        }
      } else {
        imageSaveError = "imagem_sem_url_ou_b64";
        reply =
          "Recebi sua mensagem, mas a OpenAI não retornou URL nem base64 da imagem.";
      }
    } catch (error) {
      const readableError = getReadableError(error);

      console.error("Erro ao gerar imagem:", error);

      imageUrl = null;
      imageSaved = false;
      imageSavedId = null;
      imageSaveError = readableError;
      reply = `Recebi sua mensagem, mas não consegui gerar a imagem agora. Motivo: ${readableError}`;
    }

    return NextResponse.json(
      {
        reply,
        imageUrl,
        imagePageUrl: imageUrl,
        imageSaved,
        imageSavedId,
        imageSaveError,
      },
      {
        status: 200,
        headers: {
          "Cache-Control": "no-store, max-age=0",
        },
      }
    );
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