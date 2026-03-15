import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ImageRequestBody = {
  prompt?: string;
  email?: string;
  plan?: string | null;
};

const STORAGE_BUCKET = "aurora-images";
const IMAGES_TABLE = "images";
const USAGE_TABLE = "image_usage";

function normalizeEmail(value: string | null | undefined) {
  return (value || "").trim().toLowerCase();
}

function slugifyEmail(email: string) {
  return email.replace(/[^a-z0-9]/gi, "-").toLowerCase();
}

function getTodayKey() {
  const now = new Date();
  const year = now.getUTCFullYear();
  const month = String(now.getUTCMonth() + 1).padStart(2, "0");
  const day = String(now.getUTCDate()).padStart(2, "0");
  return `${year}-${month}-${day}`;
}

function normalizePlan(plan: string | null | undefined) {
  const normalized = (plan || "free").trim().toLowerCase();

  if (
    normalized === "pro" ||
    normalized === "total" ||
    normalized === "premium" ||
    normalized === "admin"
  ) {
    return "pro";
  }

  if (normalized === "influencer") {
    return "influencer";
  }

  return "free";
}

function getLimitsByPlan(plan: string | null | undefined) {
  const normalized = normalizePlan(plan);

  if (normalized === "pro") {
    return {
      plan: "pro",
      imagesPerDay: -1,
    };
  }

  if (normalized === "influencer") {
    return {
      plan: "influencer",
      imagesPerDay: 20,
    };
  }

  return {
    plan: "free",
    imagesPerDay: 3,
  };
}

function normalizePrompt(prompt: string) {
  return prompt.replace(/\s+/g, " ").trim();
}

async function generateImageBase64(prompt: string, apiKey: string) {
  const optimizedPrompt = normalizePrompt(prompt);

  const response = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: "gpt-image-1",
      prompt: optimizedPrompt,
      size: "1024x1024",
      quality: "low",
      output_format: "jpeg",
    }),
    cache: "no-store",
  });

  const data = await response.json();

  if (!response.ok) {
    const message =
      data?.error?.message || "Falha ao gerar imagem na OpenAI.";
    throw new Error(message);
  }

  const b64 = data?.data?.[0]?.b64_json;

  if (!b64) {
    throw new Error("A OpenAI não retornou o base64 da imagem.");
  }

  return b64 as string;
}

async function registerUsage(params: {
  supabase: ReturnType<typeof createClient>;
  email: string;
  prompt: string;
  imageUrl: string;
  dayKey: string;
  plan: string;
}) {
  const { supabase, email, prompt, imageUrl, dayKey, plan } = params;

  const { error: usageError } = await supabase.from(USAGE_TABLE).insert({
    email,
    prompt,
    image_url: imageUrl,
    day_key: dayKey,
    plan,
  });

  if (usageError) {
    throw new Error(
      `Imagem salva, mas falhou ao registrar uso diário: ${usageError.message}`
    );
  }
}

async function getImagesRemaining(params: {
  supabase: ReturnType<typeof createClient>;
  email: string;
  dayKey: string;
  imagesPerDay: number;
}) {
  const { supabase, email, dayKey, imagesPerDay } = params;

  if (imagesPerDay === -1) {
    return null;
  }

  const { count } = await supabase
    .from(USAGE_TABLE)
    .select("*", { count: "exact", head: true })
    .eq("email", email)
    .eq("day_key", dayKey);

  return Math.max(0, imagesPerDay - (count || 0));
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ImageRequestBody;

    const prompt = normalizePrompt(body.prompt || "");
    const email = normalizeEmail(body.email);

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt da imagem não enviado." },
        { status: 400 }
      );
    }

    if (!email) {
      return NextResponse.json(
        { error: "E-mail do usuário não enviado." },
        { status: 400 }
      );
    }

    const openAiApiKey = process.env.OPENAI_API_KEY;
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!openAiApiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    if (!supabaseUrl) {
      return NextResponse.json(
        { error: "NEXT_PUBLIC_SUPABASE_URL não configurada." },
        { status: 500 }
      );
    }

    if (!supabaseServiceRoleKey) {
      return NextResponse.json(
        { error: "SUPABASE_SERVICE_ROLE_KEY não configurada." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    });

    let finalPlan = normalizePlan(body.plan);

    if (email === "ricardogrupoexecutivo1@gmail.com") {
      finalPlan = "pro";
    } else {
      try {
        const { data: profile } = await supabase
          .from("profiles")
          .select("plan")
          .eq("email", email)
          .maybeSingle();

        if (profile?.plan) {
          finalPlan = normalizePlan(String(profile.plan));
        }
      } catch {
        finalPlan = normalizePlan(body.plan);
      }
    }

    const limits = getLimitsByPlan(finalPlan);
    const todayKey = getTodayKey();

    if (limits.imagesPerDay !== -1) {
      const { count, error: countError } = await supabase
        .from(USAGE_TABLE)
        .select("*", { count: "exact", head: true })
        .eq("email", email)
        .eq("day_key", todayKey);

      if (countError) {
        return NextResponse.json(
          {
            error:
              "Erro ao verificar limite diário. Verifique a tabela image_usage.",
            details: countError.message,
          },
          { status: 500 }
        );
      }

      const usedToday = count || 0;

      if (usedToday >= limits.imagesPerDay) {
        return NextResponse.json(
          {
            error: `Limite diário de imagens atingido para o plano ${limits.plan}.`,
            plan: limits.plan,
            imagesRemaining: 0,
          },
          { status: 403 }
        );
      }
    }

    const { data: cachedImages, error: cacheError } = await supabase
      .from(IMAGES_TABLE)
      .select("id, image_url, prompt")
      .eq("prompt", prompt)
      .eq("is_public", true)
      .limit(1);

    if (cacheError) {
      console.error("CACHE IMAGE WARNING:", cacheError.message);
    }

    const cachedImage =
      Array.isArray(cachedImages) && cachedImages.length > 0
        ? cachedImages[0]
        : null;

    if (cachedImage?.image_url) {
      await registerUsage({
        supabase,
        email,
        prompt,
        imageUrl: cachedImage.image_url,
        dayKey: todayKey,
        plan: limits.plan,
      });

      const imagesRemaining = await getImagesRemaining({
        supabase,
        email,
        dayKey: todayKey,
        imagesPerDay: limits.imagesPerDay,
      });

      return NextResponse.json({
        success: true,
        imageId: cachedImage.id || null,
        imageUrl: cachedImage.image_url,
        saved: true,
        cached: true,
        plan: limits.plan,
        unlimited: limits.imagesPerDay === -1,
        imagesRemaining,
        quality: "low",
        format: "jpeg",
        size: "1024x1024",
      });
    }

    const imageBase64 = await generateImageBase64(prompt, openAiApiKey);
    const imageBuffer = Buffer.from(imageBase64, "base64");

    const safeEmail = slugifyEmail(email);
    const fileName = `${Date.now()}-${Math.random()
      .toString(36)
      .slice(2)}.jpg`;
    const storagePath = `${todayKey}/${safeEmail}/${fileName}`;

    const { error: uploadError } = await supabase.storage
      .from(STORAGE_BUCKET)
      .upload(storagePath, imageBuffer, {
        contentType: "image/jpeg",
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        {
          error: "Imagem gerada, mas falhou ao salvar no Storage.",
          details: uploadError.message,
        },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(STORAGE_BUCKET).getPublicUrl(storagePath);

    const { data: insertedImage, error: saveImageError } = await supabase
      .from(IMAGES_TABLE)
      .insert({
        email,
        prompt,
        image_url: publicUrl,
        storage_path: storagePath,
        is_public: true,
        plan: limits.plan,
      })
      .select("id, image_url")
      .single();

    if (saveImageError) {
      return NextResponse.json(
        {
          error: "Imagem salva no Storage, mas falhou ao gravar no banco.",
          details: saveImageError.message,
          imageUrl: publicUrl,
        },
        { status: 500 }
      );
    }

    await registerUsage({
      supabase,
      email,
      prompt,
      imageUrl: publicUrl,
      dayKey: todayKey,
      plan: limits.plan,
    });

    const imagesRemaining = await getImagesRemaining({
      supabase,
      email,
      dayKey: todayKey,
      imagesPerDay: limits.imagesPerDay,
    });

    return NextResponse.json({
      success: true,
      imageId: insertedImage?.id || null,
      imageUrl: insertedImage?.image_url || publicUrl,
      saved: true,
      cached: false,
      plan: limits.plan,
      unlimited: limits.imagesPerDay === -1,
      imagesRemaining,
      quality: "low",
      format: "jpeg",
      size: "1024x1024",
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno desconhecido.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}