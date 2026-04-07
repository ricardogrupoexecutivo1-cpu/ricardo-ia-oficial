import { NextResponse } from "next/server";

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

export async function GET() {
  return jsonNoStore({
    ok: true,
    items: [],
    message:
      "Conversations temporariamente em modo de estabilização nesta branch de teste.",
  });
}

export async function POST() {
  return jsonNoStore(
    {
      ok: false,
      message:
        "Conversations temporariamente desativada nesta branch de teste para estabilizar o preview.",
    },
    { status: 503 }
  );
}