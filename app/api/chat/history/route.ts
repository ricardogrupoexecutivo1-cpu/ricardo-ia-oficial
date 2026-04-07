import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      items: [],
      message:
        "Histórico temporariamente indisponível durante estabilização da plataforma.",
    },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message:
        "Rota temporariamente desativada para estabilização do deploy.",
    },
    { status: 503 }
  );
}