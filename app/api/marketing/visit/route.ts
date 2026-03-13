import { NextResponse } from "next/server";

export async function POST(req: Request) {
  try {
    const userAgent = req.headers.get("user-agent") || "unknown";
    const forwardedFor = req.headers.get("x-forwarded-for") || "unknown";
    const ip = forwardedFor.split(",")[0].trim();

    console.log("[VISIT]", {
      at: new Date().toISOString(),
      ip,
      userAgent,
    });

    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("Erro ao registrar visita:", error);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}