import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";
import crypto from "node:crypto";
import { env, hasServiceRole } from "../../../lib/env";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";
export const revalidate = 0;

const bucketName = "campaign-assets";
const maxSizeInBytes = 10 * 1024 * 1024;

const allowedMimeTypes = new Set([
  "image/png",
  "image/jpeg",
  "image/jpg",
  "image/webp",
  "image/heic",
  "image/heif",
]);

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

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

function getExtensionFromFile(file: File, safeOriginalName: string) {
  const fromName = safeOriginalName.includes(".")
    ? safeOriginalName.split(".").pop()?.toLowerCase()
    : "";

  if (fromName) {
    return fromName;
  }

  const mimeToExtension: Record<string, string> = {
    "image/png": "png",
    "image/jpeg": "jpg",
    "image/jpg": "jpg",
    "image/webp": "webp",
    "image/heic": "heic",
    "image/heif": "heif",
  };

  return mimeToExtension[file.type] || "png";
}

function buildSupabaseAdmin() {
  if (!hasServiceRole()) {
    throw new Error("SUPABASE_SERVICE_ROLE_KEY não configurada.");
  }

  return createClient(env.supabaseUrl, env.supabaseServiceRoleKey as string, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";

    if (!contentType.toLowerCase().includes("multipart/form-data")) {
      return jsonNoStore(
        {
          ok: false,
          error: "Envie o arquivo como multipart/form-data.",
        },
        { status: 400 }
      );
    }

    const formData = await request.formData();
    const maybeFile = formData.get("file");

    if (!maybeFile || typeof maybeFile === "string") {
      return jsonNoStore(
        {
          ok: false,
          error: "Nenhum arquivo válido foi enviado no campo 'file'.",
        },
        { status: 400 }
      );
    }

    const file = maybeFile as File;

    if (!file.name?.trim()) {
      return jsonNoStore(
        {
          ok: false,
          error: "O arquivo enviado não possui nome válido.",
        },
        { status: 400 }
      );
    }

    if (!file.type || !allowedMimeTypes.has(file.type.toLowerCase())) {
      return jsonNoStore(
        {
          ok: false,
          error:
            "Formato inválido. Envie PNG, JPG, JPEG, WEBP, HEIC ou HEIF.",
        },
        { status: 400 }
      );
    }

    if (file.size <= 0) {
      return jsonNoStore(
        {
          ok: false,
          error: "O arquivo enviado está vazio.",
        },
        { status: 400 }
      );
    }

    if (file.size > maxSizeInBytes) {
      return jsonNoStore(
        {
          ok: false,
          error: "Arquivo muito grande. Limite de 10MB.",
        },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    if (!buffer.length) {
      return jsonNoStore(
        {
          ok: false,
          error: "Não foi possível ler o conteúdo do arquivo.",
        },
        { status: 400 }
      );
    }

    const supabase = buildSupabaseAdmin();

    const safeOriginalName = sanitizeFileName(file.name || "imagem");
    const extension = getExtensionFromFile(file, safeOriginalName);
    const filePath = `uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type || "application/octet-stream",
        upsert: false,
      });

    if (uploadError) {
      console.error("Aurora IA: erro no upload para storage.", uploadError);

      return jsonNoStore(
        {
          ok: false,
          error: `Erro no upload: ${uploadError.message}`,
        },
        { status: 500 }
      );
    }

    const {
      data: { publicUrl },
    } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    if (!publicUrl) {
      return jsonNoStore(
        {
          ok: false,
          error: "Upload concluído, mas a URL pública não foi gerada.",
        },
        { status: 500 }
      );
    }

    return jsonNoStore(
      {
        ok: true,
        success: true,
        url: publicUrl,
        publicUrl,
        path: filePath,
        fileName: file.name || safeOriginalName,
        contentType: file.type,
        size: file.size,
      },
      { status: 200 }
    );
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno no upload.";

    console.error("Aurora IA: erro inesperado em /api/upload", error);

    return jsonNoStore(
      {
        ok: false,
        error: message,
      },
      { status: 500 }
    );
  }
}