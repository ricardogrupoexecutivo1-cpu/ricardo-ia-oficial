import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export async function GET() {
  return NextResponse.json(
    {
      ok: true,
      initialized: false,
      message:
        "Init temporariamente indisponível durante estabilização da plataforma.",
    },
    { status: 200 }
  );
}

export async function POST() {
  return NextResponse.json(
    {
      ok: false,
      message:
        "Rota init temporariamente desativada para estabilizar o deploy.",
    },
    { status: 503 }
  );
}