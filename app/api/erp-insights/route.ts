import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      items: [],
      message:
        "ERP Insights temporariamente indisponível durante estabilização da plataforma.",
    },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message:
        "Rota ERP Insights temporariamente desativada para estabilizar o deploy.",
    },
    { status: 503 }
  );
}