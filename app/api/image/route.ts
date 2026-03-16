import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";
import { createClient } from "@supabase/supabase-js";

type ImageRequestBody = {
  prompt?: string;
  email?: string;
};

type PlanLimits = {
  plan: string;
  imagesPerDay: number;
};

const IMAGES_TABLE = "images";
const DEFAULT_BUCKET = "aurora-images";

function getLimitsByPlan(plan: string | null): PlanLimits {
  const normalized = (plan || "free").toLowerCase();

  if (normalized === "pro") {
    return { plan: "pro", imagesPerDay: -1 };
  }

  if (normalized === "total") {
    return { plan: "total", imagesPerDay: -1 };
  }

  if (normalized === "developer") {
    return { plan: "developer", imagesPerDay: -1 };
  }

  if (normalized === "influencer") {
    return { plan: "influencer", imagesPerDay: 20 };
  }

  return { plan: "free", imagesPerDay: 3 };
}

function normalizeEmail(value: string) {
  return value.trim().toLowerCase();
}

function getTodayRange() {
  const now = new Date();

  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(now);
  end.setHours(23, 59, 59, 999);

  return {
    startIso: start.toISOString(),
    endIso: end.toISOString(),
  };
}

function slugify(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .toLowerCase();
}

function getFilePath(params: { email: string; prompt: string }) {
  const safeEmail = params.email
    ? params.email.replace(/[^a-zA-Z0-9]/g, "-").toLowerCase()
    : "guest";

  const safePrompt = slugify(params.prompt).slice(0, 60) || "imagem";
  const now = new Date();
  const yyyy = now.getFullYear();
  const mm = String(now.getMonth() + 1).padStart(2, "0");
  const dd = String(now.getDate()).padStart(2, "0");
  const ts = Date.now();

  return `${yyyy}-${mm}-${dd}/${safeEmail}/${ts}-${safePrompt}.png`;
}

function getSupabaseAdmin() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

  if (!supabaseUrl || !serviceRoleKey) {
    throw new Error("Variáveis do Supabase não configuradas.");
  }

  return createClient(supabaseUrl, serviceRoleKey);
}

function getBucketName() {
  return (
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    DEFAULT_BUCKET
  );
}

function getBaseUrl(req: NextRequest) {
  return (
    process.env.NEXT_PUBLIC_APP_URL ||
    process.env.NEXT_PUBLIC_SITE_URL ||
    req.headers.get("origin") ||
    "http://127.0.0.1:3000"
  );
}

async function uploadBase64ToStorage(params: {
  supabase: ReturnType<typeof createClient>;
  base64: string;
  email: string;
  prompt: string;
}) {
  const { supabase, base64, email, prompt } = params;
  const bucket = getBucketName();
  const filePath = getFilePath({ email, prompt });
  const buffer = Buffer.from(base64, "base64");

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: "image/png",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Erro no upload para storage: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error("Não foi possível gerar URL pública da imagem.");
  }

  return data.publicUrl;
}

async function downloadAndUploadUrlImage(params: {
  supabase: ReturnType<typeof createClient>;
  imageUrl: string;
  email: string;
  prompt: string;
}) {
  const { supabase, imageUrl, email, prompt } = params;
  const bucket = getBucketName();
  const filePath = getFilePath({ email, prompt });

  const response = await fetch(imageUrl);

  if (!response.ok) {
    throw new Error("Falha ao baixar imagem temporária para persistência.");
  }

  const arrayBuffer = await response.arrayBuffer();
  const buffer = Buffer.from(arrayBuffer);

  const { error: uploadError } = await supabase.storage
    .from(bucket)
    .upload(filePath, buffer, {
      contentType: response.headers.get("content-type") || "image/png",
      upsert: false,
    });

  if (uploadError) {
    throw new Error(`Erro no upload da URL para storage: ${uploadError.message}`);
  }

  const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);

  if (!data?.publicUrl) {
    throw new Error("Não foi possível gerar URL pública após upload.");
  }

  return data.publicUrl;
}

async function generateAndPersistImage(params: {
  openai: OpenAI;
  supabase: ReturnType<typeof createClient>;
  prompt: string;
  email: string;
}) {
  const { openai, supabase, prompt, email } = params;

  const result = await openai.images.generate({
    model: "gpt-image-1",
    prompt,
    size: "1024x1024",
  });

  const first = result?.data?.[0];

  if (!first) {
    throw new Error("A OpenAI não retornou dados da imagem.");
  }

  const directUrl =
    (first as { url?: string | null } | undefined)?.url || null;

  if (directUrl) {
    return await downloadAndUploadUrlImage({
      supabase,
      imageUrl: directUrl,
      email,
      prompt,
    });
  }

  const base64 =
    (first as { b64_json?: string | null } | undefined)?.b64_json || null;

  if (base64) {
    return await uploadBase64ToStorage({
      supabase,
      base64,
      email,
      prompt,
    });
  }

  throw new Error("A OpenAI não retornou URL nem base64 da imagem.");
}

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ImageRequestBody;
    const prompt = (body.prompt || "").trim();
    const userEmail = normalizeEmail(body.email || "");

    if (!prompt) {
      return NextResponse.json(
        { error: "Prompt da imagem não enviado." },
        { status: 400 }
      );
    }

    if (!userEmail) {
      return NextResponse.json(
        { error: "E-mail não informado para controle do plano." },
        { status: 400 }
      );
    }

    const openaiApiKey = process.env.OPENAI_API_KEY;

    if (!openaiApiKey) {
      return NextResponse.json(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    const supabase = getSupabaseAdmin();
    const openai = new OpenAI({ apiKey: openaiApiKey });

    let plan = "free";
    let bonusImages = 0;

    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("plan, bonus_images")
      .eq("email", userEmail)
      .maybeSingle();

    if (profileError) {
      console.error("Erro ao buscar profile:", profileError.message);
    }

    if (profile?.plan) {
      plan = String(profile.plan);
    }

    if (typeof profile?.bonus_images === "number") {
      bonusImages = Number(profile.bonus_images || 0);
    }

    const limits = getLimitsByPlan(plan);
    const { startIso, endIso } = getTodayRange();

    const { count, error: countError } = await supabase
      .from(IMAGES_TABLE)
      .select("*", { count: "exact", head: true })
      .eq("email", userEmail)
      .gte("created_at", startIso)
      .lte("created_at", endIso);

    if (countError) {
      console.error("Erro ao contar imagens do dia:", countError.message);
    }

    const imagesUsedToday = Number(count || 0);

    if (limits.imagesPerDay !== -1) {
      const totalAvailable = limits.imagesPerDay + bonusImages;

      if (imagesUsedToday >= totalAvailable) {
        return NextResponse.json(
          {
            error: "Limite diário de imagens atingido para o seu plano.",
            plan: limits.plan,
            imagesRemaining: 0,
          },
          { status: 403 }
        );
      }
    }

    const finalImageUrl = await generateAndPersistImage({
      openai,
      supabase,
      prompt,
      email: userEmail,
    });

    const insertPayload = {
      prompt,
      image_url: finalImageUrl,
      created_at: new Date().toISOString(),
      email: userEmail,
    };

    const { data: insertedImage, error: insertError } = await supabase
      .from(IMAGES_TABLE)
      .insert(insertPayload)
      .select("id, prompt, image_url, created_at, email")
      .single();

    if (insertError) {
      console.error("Erro ao salvar imagem no banco:", insertError.message);

      return NextResponse.json(
        { error: `Imagem gerada, mas não foi salva no banco: ${insertError.message}` },
        { status: 500 }
      );
    }

    let imagesRemaining: number | null = null;

    if (limits.imagesPerDay === -1) {
      imagesRemaining = -1;
    } else {
      const totalAvailable = limits.imagesPerDay + bonusImages;
      imagesRemaining = Math.max(0, totalAvailable - (imagesUsedToday + 1));
    }

    const baseUrl = getBaseUrl(req);
    const publicPageUrl = `${baseUrl}/i/${insertedImage.id}`;

    return NextResponse.json({
      success: true,
      imageId: insertedImage.id,
      imageUrl: insertedImage.image_url,
      imagePageUrl: publicPageUrl,
      prompt: insertedImage.prompt,
      createdAt: insertedImage.created_at,
      plan: limits.plan,
      imagesRemaining,
    });
  } catch (error) {
    console.error("Erro interno em /api/image:", error);

    const message =
      error instanceof Error
        ? error.message
        : "Erro interno ao gerar e salvar imagem.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}