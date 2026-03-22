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

function shouldGenerateImage(message: string) {
  const text = message.toLowerCase();

  return (
    text.includes("imagem") ||
    text.includes("foto") ||
    text.includes("arte") ||
    text.includes("banner") ||
    text.includes("story") ||
    text.includes("post") ||
    text.includes("anúncio") ||
    text.includes("anuncio") ||
    text.includes("criativo") ||
    text.includes("desenhe") ||
    text.includes("gere ") ||
    text.includes("crie ")
  );
}

function buildPrompt(message: string) {
  return [
    "Crie uma imagem de alta qualidade, visual profissional e impacto comercial.",
    "Estilo premium, bem iluminado, composição forte, estética moderna.",
    "Responder ao pedido do usuário com riqueza visual.",
    "Não colocar texto escrito na imagem, a menos que o usuário peça explicitamente.",
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
    console.warn(
      "Supabase não configurado para salvar imagens. Verifique NEXT_PUBLIC_SUPABASE_URL e SUPABASE_SERVICE_ROLE_KEY."
    );

    return {
      saved: false,
      reason: "supabase_not_configured",
    };
  }

  const payload = {
    prompt: params.prompt,
    response_text: params.reply,
    image_url: params.imageUrl,
    image_page_url: params.imageUrl,
    user_email: params.email || null,
    source: "api/chat",
    created_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from("generated_images")
    .insert(payload)
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
    }, 15000);
  });

  return Promise.race([imagePromise, timeoutPromise]);
}

export async function POST(req: NextRequest) {
  try {
    if (!process.env.OPENAI_API_KEY) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const body = await req.json();
    const message = String(body?.message || "").trim();
    const email = String(body?.email || "").trim() || null;

    if (!message) {
      return NextResponse.json(
        { error: "Mensagem não enviada." },
        { status: 400 }
      );
    }

    const completion = await openai.chat.completions.create({
      model: "gpt-5-mini",
      messages: [
        {
          role: "system",
          content:
            "Você é a Aurora IA, especialista em marketing, campanhas, vendas, copy e criação visual. Sempre responda em português do Brasil de forma prática, comercial e útil.",
        },
        {
          role: "user",
          content: message,
        },
      ],
    });

    const reply =
      completion.choices[0]?.message?.content?.trim() ||
      "Não consegui responder agora.";

    let imageUrl: string | null = null;
    let imageSaved = false;
    let imageSavedId: string | null = null;
    let imageSaveError: string | null = null;

    if (shouldGenerateImage(message)) {
      try {
        const imageResponse = await generateImageWithTimeout(
          buildPrompt(message)
        );

        imageUrl = imageResponse.data?.[0]?.url || null;
        console.log("IMAGE URL:", imageUrl);

        if (imageUrl) {
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
          } else {
            imageSaveError = saveResult.reason;
          }
        } else {
          imageSaveError = "imagem_nao_retorno_url";
        }
      } catch (error) {
        console.error("Erro na geração da imagem:", error);

        imageUrl = null;
        imageSaved = false;
        imageSavedId = null;
        imageSaveError =
          error instanceof Error ? error.message : "erro_geracao_imagem";
      }
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
        error:
          error instanceof Error ? error.message : "Erro interno no chat.",
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