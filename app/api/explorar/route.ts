import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

export const dynamic = "force-dynamic";
export const revalidate = 0;
export const fetchCache = "force-no-store";
export const runtime = "nodejs";

type GalleryRow = {
  id: string;
  prompt: string | null;
  image_url: string | null;
  created_at: string | null;
  email?: string | null;
  user_email?: string | null;
  is_public?: boolean | null;
};

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

function getSupabaseAdmin() {
  const supabaseUrl =
    process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;

  const supabaseKey =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

  if (!supabaseUrl || !supabaseKey) {
    throw new Error("Variáveis do Supabase não configuradas.");
  }

  return createClient(supabaseUrl, supabaseKey, {
    auth: {
      persistSession: false,
      autoRefreshToken: false,
    },
  });
}

async function tryReadTable(
  tableName: string,
  limit: number
): Promise<GalleryRow[] | null> {
  const supabase = getSupabaseAdmin();

  const { data, error } = await supabase
    .from(tableName)
    .select("id,prompt,image_url,created_at,email,user_email,is_public")
    .or("is_public.is.null,is_public.eq.true")
    .order("created_at", { ascending: false })
    .limit(limit);

  if (error) {
    console.error(`Aurora IA: erro lendo tabela ${tableName}`, error.message);
    return null;
  }

  return (data || []) as GalleryRow[];
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);

    const rawLimit = Number(searchParams.get("limit") || "24");
    const limit = Number.isFinite(rawLimit)
      ? Math.min(Math.max(rawLimit, 1), 60)
      : 24;

    let rows = await tryReadTable("images", limit);

    if (!rows || rows.length === 0) {
      rows = await tryReadTable("aurora_images", limit);
    }

    const items = (rows || [])
      .filter((row) => row?.id && row?.image_url)
      .map((row) => ({
        id: row.id,
        prompt: row.prompt || "Imagem Aurora IA",
        image_url: row.image_url,
        created_at: row.created_at,
        email: row.email || row.user_email || null,
      }));

    return jsonNoStore({
      ok: true,
      items,
      total: items.length,
      generatedAt: new Date().toISOString(),
      source: rows && rows.length > 0 ? "supabase" : "empty",
    });
  } catch (error) {
    console.error("Aurora IA: erro em /api/explorar", error);

    return jsonNoStore(
      {
        ok: false,
        error:
          error instanceof Error
            ? error.message
            : "Erro interno ao carregar galeria.",
      },
      { status: 500 }
    );
  }
}