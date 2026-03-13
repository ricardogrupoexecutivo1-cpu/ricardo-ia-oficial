import { NextRequest, NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

type ReferralBody = {
  refCode?: string;
  planClicked?: "pro" | "influencer";
  visitorEmail?: string;
  sourceUrl?: string;
};

export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as ReferralBody;

    const refCode = String(body?.refCode || "").trim().toLowerCase();
    const planClicked = String(body?.planClicked || "").trim().toLowerCase();
    const visitorEmail = String(body?.visitorEmail || "").trim().toLowerCase();
    const sourceUrl = String(body?.sourceUrl || "").trim();

    if (!refCode) {
      return NextResponse.json(
        { error: "refCode não enviado." },
        { status: 400 }
      );
    }

    if (planClicked !== "pro" && planClicked !== "influencer") {
      return NextResponse.json(
        { error: "planClicked inválido." },
        { status: 400 }
      );
    }

    const SUPABASE_URL = process.env.SUPABASE_URL;
    const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (!SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      return NextResponse.json(
        { error: "Variáveis do Supabase não configuradas." },
        { status: 500 }
      );
    }

    const supabase = createClient(
      SUPABASE_URL,
      SUPABASE_SERVICE_ROLE_KEY,
      {
        auth: {
          autoRefreshToken: false,
          persistSession: false,
        },
      }
    );

    const userAgent = req.headers.get("user-agent") || "";

    const { error } = await supabase.from("aurora_referrals").insert({
      ref_code: refCode,
      plan_clicked: planClicked,
      visitor_email: visitorEmail || null,
      source_url: sourceUrl || null,
      user_agent: userAgent || null,
    });

    if (error) {
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      ok: true,
      refCode,
      planClicked,
    });
  } catch (error) {
    return NextResponse.json(
      {
        error: error instanceof Error ? error.message : "Erro interno.",
      },
      { status: 500 }
    );
  }
}