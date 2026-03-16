import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const IMAGES_TABLE = "images";

export async function GET() {
  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!supabaseUrl || !serviceRoleKey) {
      return NextResponse.json(
        { error: "Variáveis do Supabase não configuradas." },
        { status: 500 }
      );
    }

    const supabase = createClient(supabaseUrl, serviceRoleKey);

    const { data, error } = await supabase
      .from(IMAGES_TABLE)
      .select("id, prompt, image_url, created_at, email")
      .not("image_url", "is", null)
      .order("created_at", { ascending: false })
      .limit(100);

    if (error) {
      return NextResponse.json(
        { error: error.message || "Erro ao buscar imagens." },
        { status: 500 }
      );
    }

    return NextResponse.json({
      images: data || [],
    });
  } catch (error) {
    console.error("Erro em /api/explorar:", error);

    return NextResponse.json(
      { error: "Erro interno ao carregar a galeria." },
      { status: 500 }
    );
  }
}