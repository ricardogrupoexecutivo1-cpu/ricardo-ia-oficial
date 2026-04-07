import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { env, hasOpenAi, hasServiceRole } from "../../../lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

function jsonNoStore(body: unknown, init?: ResponseInit) {
  const res = NextResponse.json(body, init);

  res.headers.set(
    "Cache-Control",
    "no-store, no-cache, must-revalidate, proxy-revalidate, max-age=0"
  );
  res.headers.set("Pragma", "no-cache");
  res.headers.set("Expires", "0");

  return res;
}

function getSupabaseAdmin() {
  if (!hasServiceRole()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey as string, {
    auth: { persistSession: false },
  });
}

function getBucket() {
  return (
    process.env.SUPABASE_STORAGE_BUCKET ||
    process.env.NEXT_PUBLIC_SUPABASE_STORAGE_BUCKET ||
    "aurora-images"
  );
}

function getSiteUrl() {
  return env.siteUrl || "http://localhost:3000";
}

function sanitize(value: string) {
  return value
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
}

async function readBody(req: NextRequest) {
  const text = await req.text();

  if (!text.trim()) {
    throw new Error("Body vazio.");
  }

  return JSON.parse(text);
}

async function downloadImage(url: string) {
  const res = await fetch(url);

  if (!res.ok) {
    throw new Error("Erro ao baixar imagem da OpenAI.");
  }

  const buffer = Buffer.from(await res.arrayBuffer());
  return buffer;
}

export async function POST(req: NextRequest) {
  try {
    const body = await readBody(req);

    const prompt = body?.prompt?.trim();
    const email = body?.email?.trim()?.toLowerCase() || "";

    if (!prompt) {
      return jsonNoStore({ error: "Prompt não enviado." }, { status: 400 });
    }

    if (!hasOpenAi()) {
      return jsonNoStore(
        { error: "OPENAI_API_KEY não configurada." },
        { status: 500 }
      );
    }

    // 🔥 chamada OpenAI
    const aiRes = await fetch(
      "https://api.openai.com/v1/images/generations",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${env.openAiApiKey}`,
        },
        body: JSON.stringify({
          model: "gpt-image-1",
          prompt,
          size: "1024x1024",
          quality: "high",
        }),
      }
    );

    const raw = await aiRes.text();

    let data: any;
    try {
      data = JSON.parse(raw);
    } catch {
      return jsonNoStore(
        { error: "Resposta inválida da OpenAI." },
        { status: 500 }
      );
    }

    if (!aiRes.ok) {
      return jsonNoStore(
        { error: data?.error?.message || "Erro na OpenAI." },
        { status: 500 }
      );
    }

    const item = data?.data?.[0];

    let buffer: Buffer | null = null;

    if (item?.b64_json) {
      buffer = Buffer.from(item.b64_json, "base64");
    } else if (item?.url) {
      buffer = await downloadImage(item.url);
    }

    if (!buffer) {
      return jsonNoStore(
        { error: "Imagem não retornada." },
        { status: 500 }
      );
    }

    // 🔥 upload supabase
    const supabase = getSupabaseAdmin();
    const bucket = getBucket();

    const fileName = `${sanitize(email || "anon")}/${Date.now()}-${sanitize(
      prompt
    )}-${crypto.randomUUID()}.png`;

    const upload = await supabase.storage
      .from(bucket)
      .upload(fileName, buffer, {
        contentType: "image/png",
        upsert: false,
      });

    if (upload.error) {
      return jsonNoStore(
        { error: upload.error.message },
        { status: 500 }
      );
    }

    const publicUrl = supabase.storage
      .from(bucket)
      .getPublicUrl(fileName).data.publicUrl;

    if (!publicUrl) {
      return jsonNoStore(
        { error: "Erro ao gerar URL." },
        { status: 500 }
      );
    }

    // 🔥 salvar no banco
    let imageId: string | null = null;

    try {
      const result = await supabase
        .from("images")
        .insert({
          prompt,
          image_url: publicUrl,
          email,
          is_public: true,
        })
        .select("id")
        .single();

      if (!result.error) {
        imageId = result.data?.id;
      }
    } catch {}

    const pageUrl = imageId
      ? `${getSiteUrl()}/i/${imageId}`
      : publicUrl;

    return jsonNoStore({
      reply: "Imagem gerada com sucesso.",
      message: "Imagem gerada com sucesso.",
      imageUrl: publicUrl,
      imagePageUrl: pageUrl,
      shareUrl: pageUrl,
      savedToDatabase: Boolean(imageId),
    });
  } catch (err) {
    console.error("ERRO IMAGE API:", err);

    return jsonNoStore(
      {
        error:
          err instanceof Error
            ? err.message
            : "Erro interno ao gerar imagem.",
      },
      { status: 500 }
    );
  }
}