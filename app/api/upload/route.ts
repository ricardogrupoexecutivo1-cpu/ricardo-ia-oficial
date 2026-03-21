import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;
const bucketName = "campaign-assets";

function sanitizeFileName(fileName: string) {
  return fileName
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[^a-zA-Z0-9.\-_]/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "")
    .toLowerCase();
}

export async function POST(request: NextRequest) {
  try {
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

    const formData = await request.formData();
    const maybeFile = formData.get("file");

    if (!maybeFile || typeof maybeFile === "string") {
      return NextResponse.json(
        { error: "Nenhum arquivo válido foi enviado no campo 'file'." },
        { status: 400 }
      );
    }

    const file = maybeFile as File;

    const allowedTypes = ["image/png", "image/jpeg", "image/jpg", "image/webp"];
    if (!allowedTypes.includes(file.type)) {
      return NextResponse.json(
        { error: "Formato inválido. Use PNG, JPG ou WEBP." },
        { status: 400 }
      );
    }

    const maxSizeInBytes = 10 * 1024 * 1024;
    if (file.size > maxSizeInBytes) {
      return NextResponse.json(
        { error: "Arquivo muito grande. Limite de 10MB." },
        { status: 400 }
      );
    }

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey);

    const safeOriginalName = sanitizeFileName(file.name || "imagem");
    const extension = safeOriginalName.includes(".")
      ? safeOriginalName.split(".").pop()?.toLowerCase() || "png"
      : "png";

    const filePath = `uploads/${Date.now()}-${crypto.randomUUID()}.${extension}`;

    const { error: uploadError } = await supabase.storage
      .from(bucketName)
      .upload(filePath, buffer, {
        contentType: file.type,
        upsert: false,
      });

    if (uploadError) {
      return NextResponse.json(
        { error: `Erro no upload: ${uploadError.message}` },
        { status: 500 }
      );
    }

    const { data } = supabase.storage.from(bucketName).getPublicUrl(filePath);

    return NextResponse.json({
      success: true,
      publicUrl: data.publicUrl,
      path: filePath,
      fileName: file.name,
      contentType: file.type,
      size: file.size,
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno no upload.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}