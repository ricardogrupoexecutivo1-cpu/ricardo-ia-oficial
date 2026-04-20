import { NextResponse } from "next/server"
import { createClient } from "@supabase/supabase-js"

export const runtime = "nodejs"
export const dynamic = "force-dynamic"

export async function GET() {
  try {
    const supabaseUrl = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL
    const supabaseServiceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

    if (!supabaseUrl) {
      return NextResponse.json(
        {
          success: false,
          error: "SUPABASE_URL não definida.",
        },
        { status: 500 }
      )
    }

    if (!supabaseServiceRoleKey) {
      return NextResponse.json(
        {
          success: false,
          error: "SUPABASE_SERVICE_ROLE_KEY não definida.",
        },
        { status: 500 }
      )
    }

    const supabase = createClient(supabaseUrl, supabaseServiceRoleKey)

    const { data, error, count } = await supabase
      .from("sl_companies")
      .select("*", { count: "exact" })
      .limit(50)

    if (error) {
      return NextResponse.json(
        {
          success: false,
          error: error.message,
        },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      total: count ?? data?.length ?? 0,
      data: data ?? [],
    })
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro interno ao ler sl_companies."

    return NextResponse.json(
      {
        success: false,
        error: message,
      },
      { status: 500 }
    )
  }
}