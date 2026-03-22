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
}) {
  if (!supabase) {
    console.warn("Supabase não configurado para salvar imagens.");
    return {
      saved: false,
      reason: "supabase_not_configured" as const,
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
      reason: "insert_failed" as const,
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

function resolveImageSrc(imageResponse: Awaited<ReturnType<typeof generateImageWithTimeout>>) {
  const item = imageResponse?.data?.[0];

  if (!item) return null;

  if ("url" in item && item.url) {
    return item.url;
  }

  if ("b64_json" in item && item.b64_json) {
    return `data:image/png;base64,${item.b64_json}`;
  }

  return null;
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

        const saveResult = await saveGeneratedImage({
          prompt: message,
          reply,
          imageUrl,
          email,
        });

        imageSaved = saveResult.saved;

        if ("id" in saveResult) {
          imageSavedId = saveResult.id ?? null;
        }

        if ("error" in saveResult && saveResult.error) {
          imageSaveError = saveResult.error;
          reply = "Imagem gerada, mas não consegui salvar no banco.";
        }
      } else {
        reply = "Recebi sua mensagem, mas a imagem não retornou corretamente.";
        imageSaveError = "imagem_sem_url_ou_b64";
      }
    } catch (error) {
      console.error("Erro ao gerar imagem:", error);

      reply =
        error instanceof Error && error.message === "timeout_imagem"
          ? "Recebi sua mensagem, mas a geração da imagem demorou além do limite. Tente novamente com um pedido mais curto."
          : "Recebi sua mensagem, mas não consegui gerar a imagem agora.";

      imageUrl = null;
      imageSaved = false;
      imageSavedId = null;
      imageSaveError =
        error instanceof Error ? error.message : "erro_geracao_imagem";
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
    console.error("ERRO /api/chat:", error);

    return NextResponse.json(
      {
        reply: "Recebi sua mensagem, mas ocorreu um erro interno no chat.",
        error: error instanceof Error ? error.message : "Erro interno no chat.",
        imageUrl: null,
        imagePageUrl: null,
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