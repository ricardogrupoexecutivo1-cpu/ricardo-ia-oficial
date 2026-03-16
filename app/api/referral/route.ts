import { NextRequest, NextResponse } from "next/server";
import { SITE_URL } from "@/lib/site";
import { getSupabaseAdmin } from "@/lib/supabase-admin";

function makeReferralCode(email: string) {
  const base = email
    .toLowerCase()
    .replace(/[^a-z0-9]/g, "")
    .slice(0, 16);

  const suffix = Math.floor(1000 + Math.random() * 9000).toString();

  return `${base}${suffix}`.slice(0, 24);
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const email = String(body?.email || "")
      .trim()
      .toLowerCase();

    if (!email) {
      return NextResponse.json(
        { error: "E-mail não informado." },
        { status: 400 }
      );
    }

    const supabase = getSupabaseAdmin();

    const { data: existingProfile, error: existingProfileError } = await supabase
      .from("profiles")
      .select("id, email, referral_code, referred_by, bonus_images")
      .eq("email", email)
      .maybeSingle();

    if (existingProfileError) {
      return NextResponse.json(
        { error: existingProfileError.message },
        { status: 500 }
      );
    }

    let referralCode = existingProfile?.referral_code || null;

    if (!referralCode) {
      referralCode = makeReferralCode(email);

      const { error: upsertError } = await supabase.from("profiles").upsert(
        {
          email,
          referral_code: referralCode,
        },
        { onConflict: "email" }
      );

      if (upsertError) {
        return NextResponse.json(
          { error: upsertError.message },
          { status: 500 }
        );
      }
    }

    return NextResponse.json({
      referralCode,
      referralLink: `${SITE_URL}/?ref=${referralCode}`,
      referredBy: existingProfile?.referred_by || null,
      bonusImages: Number(existingProfile?.bonus_images || 0),
    });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "Erro ao buscar referral.";

    return NextResponse.json({ error: message }, { status: 500 });
  }
}